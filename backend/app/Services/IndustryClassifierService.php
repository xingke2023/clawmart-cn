<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Throwable;

class IndustryClassifierService
{
    private const ALLOWED = [
        '餐饮/生鲜',
        '酒店/宾馆',
        '电商/零售',
        '服务/咨询',
        '制造/工厂',
        '其他',
        'unknown',
    ];

    public function __construct(private IndustryGeneratorService $llm) {}

    /**
     * @return array{industry: string, confidence: float, reason: string}
     */
    public function classify(string $text): array
    {
        $text = trim($text);
        if ($text === '') {
            return $this->fallback('empty input');
        }

        if (empty(config('services.deepseek.api_key'))) {
            return $this->fallback('no api key');
        }

        try {
            $raw = $this->llm->callDeepSeek($this->buildPrompt($text));
            $data = $this->parseJson($raw);

            $industry = $data['industry'] ?? null;
            $confidence = isset($data['confidence']) ? (float) $data['confidence'] : 0.0;
            $reason = isset($data['reason']) ? (string) $data['reason'] : '';

            if (! in_array($industry, self::ALLOWED, true)) {
                return $this->fallback('out-of-enum: '.json_encode($industry));
            }

            return [
                'industry'   => $industry,
                'confidence' => max(0.0, min(1.0, $confidence)),
                'reason'     => mb_substr($reason, 0, 200),
            ];
        } catch (Throwable $e) {
            Log::warning('IndustryClassifier failed', [
                'text'  => $text,
                'error' => $e->getMessage(),
            ]);

            return $this->fallback($e->getMessage());
        }
    }

    private function buildPrompt(string $text): string
    {
        return <<<PROMPT
你是 ClawMart 平台的行业分类器。
我会给你一段用户对「您的业务属于哪个行业？」的回答，
你必须把它归类到以下枚举值之一并只输出 JSON：

枚举值：
- "餐饮/生鲜"  （餐厅、饭店、外卖、菜场、水果、蔬菜、肉铺、烧烤、奶茶、咖啡）
- "酒店/宾馆"  （酒店、民宿、客栈、旅馆、住宿）
- "电商/零售"  （网店、淘宝、便利店、超市、服装店、卖货、零售）
- "服务/咨询"  （理发、美容、咨询、培训、家政、维修、律师、会计、设计）
- "制造/工厂"  （工厂、制造、加工、车间、生产）
- "其他"      （是某种商业经营但不属于以上 5 类）
- "unknown"   （根本不是在描述行业，例如闲聊、反问、调侃、空话、问候语）

判断要点：
- 用户若只是说"今天天气真好"、"你是谁"、"哈哈"等与开店无关的话 → unknown
- 用户描述了某种生意但分类不明 → 其他
- confidence 表示判断把握，范围 0.0~1.0

输出格式（只输出一行 JSON，不要 markdown 代码块，不要任何额外文字）：
{"industry": "...", "confidence": 0.85, "reason": "一句话原因"}

用户输入：{$text}
PROMPT;
    }

    /**
     * 清理 markdown 包裹、提取第一个 JSON 对象、解析。
     */
    private function parseJson(string $raw): array
    {
        $s = trim($raw);
        $s = preg_replace('/^```(?:json)?\s*/m', '', $s);
        $s = preg_replace('/```\s*$/m', '', $s);

        if (preg_match('/\{[^{}]*\}/s', $s, $m)) {
            $s = $m[0];
        }

        $data = json_decode($s, true);
        if (! is_array($data)) {
            throw new \RuntimeException('JSON parse failed: '.json_last_error_msg());
        }

        return $data;
    }

    /**
     * @return array{industry: string, confidence: float, reason: string}
     */
    private function fallback(string $reason): array
    {
        return [
            'industry'   => 'unknown',
            'confidence' => 0.0,
            'reason'     => 'fallback: '.$reason,
        ];
    }
}
