<?php

namespace App\Services;

use App\Models\IndustrySolution;
use App\Models\Listing;
use Illuminate\Support\Facades\Http;

class IndustryGeneratorService
{
    public function hasApiKey(string $provider = 'anthropic'): bool
    {
        return ! empty(config("services.{$provider}.api_key"));
    }

    /**
     * 生成行业方案：description + demo_messages（一次调用）
     * 无 API Key 时返回 mock 数据
     *
     * @return array{description: string, demo_messages: array}
     */
    public function generateSolution(IndustrySolution $solution): array
    {
        if (! $this->hasApiKey()) {
            return $this->mockSolution($solution);
        }

        $prompt = $this->buildSolutionPrompt($solution);

        return $this->parseResult($this->callClaude($prompt));
    }

    /**
     * 仅生成 demo_messages
     *
     * @return array<int, array{type: string, text: string}>
     */
    public function generateDemo(IndustrySolution $solution, array $options = []): array
    {
        $provider = $options['provider'] ?? 'anthropic';

        if (! $this->hasApiKey($provider)) {
            return $this->mockDemo($solution, $options);
        }

        $prompt = $this->buildDemoPrompt($solution, $options);
        $raw    = $provider === 'deepseek'
            ? $this->callDeepSeek($prompt)
            : $this->callClaude($prompt);

        // demo prompt 只输出 JSON array
        $json = preg_replace('/^```json\s*/m', '', $raw);
        $json = preg_replace('/^```\s*/m', '', $json);
        $json = trim($json);

        // 提取 [ ... ] 范围
        $start = strpos($json, '[');
        $end   = strrpos($json, ']');
        if ($start !== false && $end !== false) {
            $json = substr($json, $start, $end - $start + 1);
        }

        $data = json_decode($json, true);

        // 失败则用状态机转义字符串内的控制字符
        if (json_last_error() !== JSON_ERROR_NONE) {
            $out    = '';
            $inStr  = false;
            $escape = false;
            $len    = strlen($json);
            for ($i = 0; $i < $len; $i++) {
                $c = $json[$i];
                if ($escape) { $out .= $c; $escape = false; continue; }
                if ($c === '\\') { $out .= $c; $escape = true; continue; }
                if ($c === '"') { $inStr = ! $inStr; $out .= $c; continue; }
                if ($inStr) {
                    if ($c === "\n") { $out .= '\\n'; continue; }
                    if ($c === "\r") { $out .= '\\r'; continue; }
                    if ($c === "\t") { $out .= '\\t'; continue; }
                    if (ord($c) < 0x20) { continue; }
                }
                $out .= $c;
            }
            $data = json_decode($out, true);
        }

        if (json_last_error() !== JSON_ERROR_NONE || ! is_array($data)) {
            throw new \RuntimeException('演示对话 JSON 解析失败: '.json_last_error_msg());
        }

        return $data;
    }

    /**
     * 创建或更新 Listing，并绑定到 IndustrySolution
     */
    public function upsertListing(IndustrySolution $solution, array $generated, array $def = []): Listing
    {
        $slug = $def['listing_slug'] ?? \Illuminate\Support\Str::slug($solution->name.'-ai');
        $price = $def['price'] ?? 299.00;

        $existing = Listing::where('slug', $slug)->first();

        if ($existing) {
            $existing->update([
                'description'   => $generated['description'],
                'demo_messages' => $generated['demo_messages'] ?? null,
                'status'        => 'available',
            ]);

            return $existing;
        }

        return Listing::create([
            'name'          => $solution->emoji.' '.$solution->name.' AI 解决方案',
            'slug'          => $slug,
            'price'         => $price,
            'description'   => $generated['description'],
            'image_url'     => null,
            'status'        => 'available',
            'category'      => '行业方案',
            'demo_messages' => $generated['demo_messages'] ?? null,
        ]);
    }

    // ─────────────────────────────────────────────
    // Prompt builders
    // ─────────────────────────────────────────────

    public function buildSolutionPrompt(IndustrySolution $solution): string
    {
        $painPoints  = implode("\n- ", $solution->pain_points);
        $targetUsers = implode('、', $solution->target_users);
        $modules     = collect($solution->modules)
            ->map(fn ($m, $i) => '  ① '.($i + 1).'. '.$m)
            ->implode("\n");
        $keywords = implode('、', $solution->keywords);

        return <<<PROMPT
你是一个 AI 技能市集的产品文案专家。请为以下行业生成完整的「行业解决方案」listing 内容。

## 行业信息
- 行业名称：{$solution->name}
- 一句话定位：{$solution->tagline}
- 目标用户：{$targetUsers}
- 核心痛点：
  - {$painPoints}
- 功能模块：
{$modules}
- 关键词：{$keywords}

## 参考模版（生鲜门店 AI 店长助手）
description 示例格式：
```
专为生鲜连锁门店打造的全链路 AI 经营系统。核心理念：「人工碎片化输入 + AI 结构化处理 + AI 智能决策」，彻底解决生鲜行业规格混乱、信息录入难、损耗高的三大痛点。

涵盖X大功能模块：
① AI 店长助手（语音/拍照上报，企业微信集成）
② 商品库与实时库存系统
...

适用场景：香港/内地生鲜连锁门店、生鲜超市。
```

## 输出要求
只输出一个合法的 JSON 对象，不要任何 markdown、代码块、注释或多余文字。
文本中的换行用 \n 转义，不要直接使用真实换行符。

{"description":"...","demo_messages":[{"type":"user","text":"..."},{"type":"ai","text":"..."},{"type":"user","text":"..."},{"type":"ai","text":"..."},...]}

要求：
1. description：300-500字，参考模版结构，换行用 \n 表示
2. demo_messages：16-24条，覆盖所有功能模块，user口语化输入，AI回复含✅确认+📊分析+💡建议，换行用 \n 表示
3. 只输出 JSON 对象本身，第一个字符必须是 {，最后一个字符必须是 }
PROMPT;
    }

    public function buildDemoPrompt(IndustrySolution $solution, array $options = []): string
    {
        $modules    = $options['modules'] ?? $solution->modules;
        $style      = $options['style'] ?? '完整功能巡览';
        $count      = $options['count'] ?? 20;
        $moduleList = collect($modules)->map(fn ($m, $i) => ($i + 1).'. '.$m)->implode("\n");

        return <<<PROMPT
你是 AI 产品演示对话设计专家。请为「{$solution->name} AI 解决方案」设计一组完整的演示对话。

## 方案信息
- 行业：{$solution->name}
- 定位：{$solution->tagline}
- 目标用户：{$solution->target_users[0]}（主要使用者）

## 需要覆盖的功能模块
{$moduleList}

## 演示风格
{$style}

## 输出要求
- 生成约 {$count} 条对话（user/ai 交替）
- user 消息：模拟真实员工的口语化、碎片化输入（不超过30字）
- ai 消息：结构化回复，含 ✅确认记录 + 📊数据分析 + 💡行动建议 三段，换行用 \n 表示
- 每个功能模块至少体现1-2次完整交互
- 只输出 JSON array，第一个字符必须是 [，最后一个字符必须是 ]，文本中换行用 \n 转义

[{"type":"user","text":"..."},{"type":"ai","text":"..."},...]
PROMPT;
    }

    // ─────────────────────────────────────────────
    // Claude API
    // ─────────────────────────────────────────────

    public function callClaude(string $prompt): string
    {
        $apiKey  = config('services.anthropic.api_key');
        $model   = config('services.anthropic.model', 'claude-haiku-4-5-20251001');
        $baseUrl = rtrim(config('services.anthropic.base_url', 'https://api.anthropic.com'), '/');

        $response = Http::withHeaders([
            'x-api-key'         => $apiKey,
            'anthropic-version' => '2023-06-01',
            'content-type'      => 'application/json',
        ])->timeout(120)->post("{$baseUrl}/v1/messages", [
            'model'      => $model,
            'max_tokens' => 4096,
            'messages'   => [
                ['role' => 'user', 'content' => $prompt],
            ],
        ]);

        if (! $response->successful()) {
            throw new \RuntimeException('Claude API 错误 '.$response->status().': '.$response->body());
        }

        return $response->json('content.0.text', '');
    }

    public function callDeepSeek(string $prompt): string
    {
        $apiKey  = config('services.deepseek.api_key');
        $model   = config('services.deepseek.model', 'deepseek-chat');
        $baseUrl = rtrim(config('services.deepseek.base_url', 'https://api.deepseek.com'), '/');

        $response = Http::withHeaders([
            'Authorization' => 'Bearer '.$apiKey,
            'content-type'  => 'application/json',
        ])->timeout(120)->post("{$baseUrl}/chat/completions", [
            'model'    => $model,
            'messages' => [
                ['role' => 'user', 'content' => $prompt],
            ],
            'max_tokens' => 4096,
        ]);

        if (! $response->successful()) {
            throw new \RuntimeException('DeepSeek API 错误 '.$response->status().': '.$response->body());
        }

        return $response->json('choices.0.message.content', '');
    }

    public function parseResult(string $raw): array
    {
        // 清理 markdown 代码块包装
        $json = preg_replace('/^```json\s*/m', '', $raw);
        $json = preg_replace('/^```\s*/m', '', $json);
        $json = trim($json);

        // 提取第一个完整 JSON 对象
        if (preg_match('/\{.*\}/s', $json, $m)) {
            $json = $m[0];
        }

        // 先尝试直接解析
        $data = json_decode($json, true);

        // 失败则把字符串内的真实换行转义后再解析
        if (json_last_error() !== JSON_ERROR_NONE) {
            // 状态机：逐字符扫描，在字符串内部替换真实换行
            $out    = '';
            $inStr  = false;
            $escape = false;
            $len    = strlen($json);
            for ($i = 0; $i < $len; $i++) {
                $c = $json[$i];
                if ($escape) {
                    $out   .= $c;
                    $escape = false;
                    continue;
                }
                if ($c === '\\') {
                    $out   .= $c;
                    $escape = true;
                    continue;
                }
                if ($c === '"') {
                    $inStr = ! $inStr;
                    $out  .= $c;
                    continue;
                }
                if ($inStr) {
                    if ($c === "\n") { $out .= '\\n'; continue; }
                    if ($c === "\r") { $out .= '\\r'; continue; }
                    if ($c === "\t") { $out .= '\\t'; continue; }
                    // 其他控制字符直接去除
                    if (ord($c) < 0x20) { continue; }
                }
                $out .= $c;
            }
            $data = json_decode($out, true);
        }

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \RuntimeException('JSON 解析失败: '.json_last_error_msg()."\n原始内容前300字: ".mb_substr($raw, 0, 300));
        }
        if (empty($data['description'])) {
            throw new \RuntimeException('生成内容缺少 description 字段');
        }

        return $data;
    }

    // ─────────────────────────────────────────────
    // Mock（无 API Key 时）
    // ─────────────────────────────────────────────

    private function mockSolution(IndustrySolution $solution): array
    {
        $moduleList = collect($solution->modules)
            ->map(fn ($m, $i) => '① '.($i + 1).'. '.$m)
            ->implode("\n");

        $description = "【模拟内容 · 请配置 ANTHROPIC_API_KEY 获取真实生成】\n\n".
            "专为{$solution->name}打造的全链路 AI 管理系统。核心理念：「人工碎片化输入 + AI 结构化处理 + AI 智能决策」。\n\n".
            "涵盖".count($solution->modules)."大功能模块：\n{$moduleList}\n\n".
            "适用场景：".implode('、', $solution->target_users)."。";

        return [
            'description'   => $description,
            'demo_messages' => $this->mockDemo($solution),
        ];
    }

    private function mockDemo(IndustrySolution $solution, array $options = []): array
    {
        $modules = $options['modules'] ?? $solution->modules;
        $msgs    = [];

        foreach (array_slice($modules, 0, 6) as $i => $module) {
            $msgs[] = ['type' => 'user', 'text' => "【模拟】{$module}相关操作示例 ".($i + 1)];
            $msgs[] = ['type' => 'ai',   'text' => "✅ 已收到{$module}指令\n\n📊 分析：这是模拟内容，请配置 ANTHROPIC_API_KEY 获取真实演示对话。\n\n💡 建议：在 .env 中设置 ANTHROPIC_API_KEY=sk-ant-xxx 后重新生成。"];
        }

        return $msgs;
    }
}
