<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Throwable;

class OnboardingValidatorService
{
    private const FUNCTION_OPTIONS = ['AI客服', '进销存', '营销推广', '数据分析', '全部功能'];

    public function __construct(private IndustryGeneratorService $llm) {}

    /**
     * @return array{valid: bool, reason: string, data: array|null}
     */
    public function validate(string $step, string $text): array
    {
        $text = trim($text);
        if ($text === '') {
            return $this->fallback('empty input');
        }

        if (empty(config('services.deepseek.api_key'))) {
            return $this->fallback('no api key');
        }

        try {
            return match ($step) {
                'name'       => $this->validateName($text),
                'functions'  => $this->validateFunctions($text),
                'hasAccount' => $this->validateHasAccount($text),
                default      => $this->fallback('unknown step: '.$step),
            };
        } catch (Throwable $e) {
            Log::warning('OnboardingValidator failed', [
                'step'  => $step,
                'text'  => $text,
                'error' => $e->getMessage(),
            ]);

            return $this->fallback($e->getMessage());
        }
    }

    private function validateName(string $text): array
    {
        $prompt = <<<PROMPT
判断这段文本是不是合理的店铺/品牌名称。

有效示例：牛魔王烧烤、老王家民宿、喵喵宠物店、ABC咖啡、123茶舍、星巴克、小李水果店
无效示例：哈哈、abc、12345、a、你是谁、我不告诉你、今天天气好、问下别的、你好啊

判断要点：
- 长度过短无意义字符（"a"、"1"、"abc"）→ 无效
- 闲聊/反问/调侃/问候语 → 无效
- 否则尽量宽松，允许变体名、英文、数字、emoji、方言

输出（只输出一行 JSON，不加 markdown 包裹）：
{"valid": true, "reason": "一句话原因"}

输入：{$text}
PROMPT;

        $raw = $this->llm->callDeepSeek($prompt);
        $data = $this->parseJson($raw);

        return [
            'valid'  => (bool) ($data['valid'] ?? false),
            'reason' => mb_substr((string) ($data['reason'] ?? ''), 0, 200),
            'data'   => null,
        ];
    }

    private function validateFunctions(string $text): array
    {
        $opts = implode('、', self::FUNCTION_OPTIONS);
        $prompt = <<<PROMPT
平台支持 5 类功能：{$opts}。
请从用户描述里提取他想要的功能集合。

规则：
- valid=false：用户没在讨论功能（如闲聊、问候、反问、跑题）
- valid=true 且 matched 为空：用户在表达但没说清，按"全部功能"处理
- matched 只能从以下值里挑：AI客服、进销存、营销推广、数据分析、全部功能

输出（只输出一行 JSON，不加 markdown）：
{"valid": true, "matched": ["AI客服"], "reason": "..."}

示例：
- "我要客服和数据" → {"valid":true, "matched":["AI客服","数据分析"], "reason":"..."}
- "全部都要" → {"valid":true, "matched":["全部功能"], "reason":"..."}
- "今天天气好" → {"valid":false, "matched":[], "reason":"..."}

输入：{$text}
PROMPT;

        $raw = $this->llm->callDeepSeek($prompt);
        $data = $this->parseJson($raw);

        $matchedRaw = $data['matched'] ?? [];
        $matched = is_array($matchedRaw)
            ? array_values(array_intersect(self::FUNCTION_OPTIONS, $matchedRaw))
            : [];

        return [
            'valid'  => (bool) ($data['valid'] ?? false),
            'reason' => mb_substr((string) ($data['reason'] ?? ''), 0, 200),
            'data'   => ['matched' => $matched],
        ];
    }

    private function validateHasAccount(string $text): array
    {
        $prompt = <<<PROMPT
用户回答"您已经有 ClawMart 账号了吗？"。判断回答的语义意图。

规则：
- 表达"有账号" → valid:true, has_account:true
- 表达"没账号" → valid:true, has_account:false
- 答非所问/闲聊/反问 → valid:false

示例：
- "有"、"已有"、"我有账号"、"老用户" → valid:true, has_account:true
- "没有"、"还没"、"新用户"、"我要注册" → valid:true, has_account:false
- "你好"、"今天天气真好"、"你是谁" → valid:false, has_account:false

输出（只输出一行 JSON，不加 markdown）：
{"valid": true, "has_account": true, "reason": "..."}

输入：{$text}
PROMPT;

        $raw = $this->llm->callDeepSeek($prompt);
        $data = $this->parseJson($raw);

        return [
            'valid'  => (bool) ($data['valid'] ?? false),
            'reason' => mb_substr((string) ($data['reason'] ?? ''), 0, 200),
            'data'   => ['has_account' => (bool) ($data['has_account'] ?? false)],
        ];
    }

    /**
     * 清理 markdown 包裹、提取第一个 JSON 对象、解析。
     */
    private function parseJson(string $raw): array
    {
        $s = trim($raw);
        $s = preg_replace('/^```(?:json)?\s*/m', '', $s);
        $s = preg_replace('/```\s*$/m', '', $s);

        if (preg_match('/\{.*\}/s', $s, $m)) {
            $s = $m[0];
        }

        $data = json_decode($s, true);
        if (! is_array($data)) {
            throw new \RuntimeException('JSON parse failed: '.json_last_error_msg());
        }

        return $data;
    }

    /**
     * @return array{valid: bool, reason: string, data: null}
     */
    private function fallback(string $reason): array
    {
        return [
            'valid'  => false,
            'reason' => 'fallback: '.$reason,
            'data'   => null,
        ];
    }
}
