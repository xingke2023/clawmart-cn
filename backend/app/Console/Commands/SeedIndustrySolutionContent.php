<?php

namespace App\Console\Commands;

use App\Models\IndustrySolution;
use App\Models\Listing;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class SeedIndustrySolutionContent extends Command
{
    protected $signature = 'industries:seed-content
                            {--key= : 只处理指定 industry_key}
                            {--force : 覆盖已完成的行业}';

    protected $description = '根据行业元数据生成标准格式的 description + demo_messages，无需 API Key，立即可用';

    public function handle(): int
    {
        $query = IndustrySolution::query();

        if ($key = $this->option('key')) {
            $query->where('industry_key', $key);
        } elseif (! $this->option('force')) {
            $query->where('status', '!=', 'done');
        }

        $solutions = $query->get();

        if ($solutions->isEmpty()) {
            $this->info('没有需要处理的行业方案（使用 --force 覆盖已完成项）。');

            return self::SUCCESS;
        }

        $this->info("共 {$solutions->count()} 个行业方案需要生成内容...\n");

        foreach ($solutions as $solution) {
            $this->line("⏳ {$solution->emoji} {$solution->name}");

            $description  = $this->buildDescription($solution);
            $demoMessages = $this->buildDemoMessages($solution);

            $def   = $this->getIndustryDef($solution->industry_key);
            $slug  = $def['listing_slug'] ?? Str::slug($solution->name.'-ai-solution');
            $price = $def['price'] ?? 299.00;

            $listing = $this->upsertListing($solution, $slug, $price, $description, $demoMessages);

            $solution->update([
                'listing_id'       => $listing->id,
                'status'           => 'done',
                'generated_at'     => now(),
                'generation_error' => null,
            ]);

            $this->info("  ✅ 已生成 → listing #{$listing->id} (slug: {$slug})");
        }

        $this->info("\n🎉 完成！");

        return self::SUCCESS;
    }

    /**
     * 根据行业元数据生成规范格式的 description
     */
    private function buildDescription(IndustrySolution $s): string
    {
        $moduleCount = count($s->modules);
        $moduleList  = collect($s->modules)
            ->map(fn ($m, $i) => $this->circledNumber($i + 1).' '.$m)
            ->implode("\n");
        $targetUsers = implode('、', $s->target_users);
        $painPoint1  = $s->pain_points[0] ?? '效率低下';
        $painPoint2  = $s->pain_points[1] ?? '数据分散';

        $numText = $moduleCount <= 9
            ? ['一','二','三','四','五','六','七','八','九'][$moduleCount - 1].'大'
            : "{$moduleCount}大";

        return "{$s->tagline}。核心理念：「人工碎片化输入 + AI 结构化处理 + AI 智能决策」，".
            "彻底解决{$s->name}行业「{$painPoint1}」「{$painPoint2}」等核心痛点。\n\n".
            "涵盖{$numText}功能模块：\n{$moduleList}\n\n".
            "适用场景：{$targetUsers}。";
    }

    /**
     * 根据行业元数据生成4条标准示范对话（覆盖前两个模块）
     *
     * @return array<int, array{type: string, text: string}>
     */
    private function buildDemoMessages(IndustrySolution $s): array
    {
        $modules = $s->modules;
        $m0 = $modules[0] ?? '日常操作';
        $m1 = $modules[1] ?? '数据分析';
        $m2 = $modules[2] ?? '智能建议';
        $m3 = $modules[min(3, count($modules) - 1)] ?? $m0;

        return [
            [
                'type' => 'user',
                'text' => "今天{$s->name}的".mb_substr($m0, 0, 8)."情况，帮我处理一下",
            ],
            [
                'type' => 'ai',
                'text' => "✅ 已收到【".mb_substr($m0, 0, 10)."】相关指令\n\n".
                    "📊 数据分析：\n".
                    "根据近期记录，{$m0}运转正常，但与{$m1}数据对比后发现可优化空间约15-20%。\n".
                    "当前效率处于中等水平，建议结合{$m1}做精准调整。\n\n".
                    "💡 建议：\n".
                    "① 优化{$m0}的日常执行节奏\n".
                    "② 启用{$m1}的自动化功能减少人工干预\n".
                    "是否需要生成详细执行方案？",
            ],
            [
                'type' => 'user',
                'text' => '好，按建议执行',
            ],
            [
                'type' => 'ai',
                'text' => "✅ 方案已执行，{$m0}配置已更新\n".
                    "📋 同步更新了{$m2}相关设置\n\n".
                    "另：{$m3}模块检测到异常数据，建议本周内跟进处理，".
                    "已自动加入待办清单。\n\n".
                    "💡 预计本周内可看到整体效率提升，需要查看实时数据看板吗？",
            ],
        ];
    }

    private function upsertListing(
        IndustrySolution $solution,
        string $slug,
        float $price,
        string $description,
        array $demoMessages
    ): Listing {
        $existing = Listing::where('slug', $slug)->first();

        if ($existing) {
            $existing->update([
                'description'   => $description,
                'demo_messages' => $demoMessages,
                'status'        => 'available',
            ]);

            return $existing;
        }

        return Listing::create([
            'name'          => $solution->emoji.' '.$solution->name.' AI 解决方案',
            'slug'          => $slug,
            'price'         => $price,
            'description'   => $description,
            'image_url'     => null,
            'status'        => 'available',
            'category'      => '行业方案',
            'demo_messages' => $demoMessages,
        ]);
    }

    /**
     * 带圈数字 ①②③...
     */
    private function circledNumber(int $n): string
    {
        $circles = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫'];

        return $circles[$n - 1] ?? "({$n})";
    }

    /**
     * 行业 slug + price 对应表
     *
     * @return array<string, mixed>
     */
    private function getIndustryDef(string $key): array
    {
        $defs = [
            'fresh_market'        => ['listing_slug' => 'fresh-market-ai-manager',     'price' => 299.00],
            'restaurant_chain'    => ['listing_slug' => 'restaurant-chain-ai-manager', 'price' => 299.00],
            'retail_clothing'     => ['listing_slug' => 'clothing-retail-ai-manager',  'price' => 199.00],
            'education_center'    => ['listing_slug' => 'education-center-ai-manager', 'price' => 199.00],
            'beauty_salon'        => ['listing_slug' => 'beauty-salon-ai-manager',     'price' => 199.00],
            'clinic'              => ['listing_slug' => 'clinic-ai-manager',            'price' => 299.00],
            'gym'                 => ['listing_slug' => 'gym-ai-manager',               'price' => 199.00],
            'property_management' => ['listing_slug' => 'property-management-ai',      'price' => 299.00],
            'logistics_warehouse' => ['listing_slug' => 'logistics-warehouse-ai',      'price' => 299.00],
            'hotel'               => ['listing_slug' => 'hotel-ai-manager',            'price' => 199.00],
            'auto_repair'         => ['listing_slug' => 'auto-repair-ai-manager',      'price' => 299.00],
            'ecommerce_ops'       => ['listing_slug' => 'ecommerce-ops-ai',            'price' => 199.00],
            'kindergarten'        => ['listing_slug' => 'kindergarten-ai-manager',     'price' => 199.00],
            'real_estate_agency'  => ['listing_slug' => 'real-estate-agency-ai',       'price' => 199.00],
            'law_firm'            => ['listing_slug' => 'law-firm-ai-assistant',       'price' => 299.00],
            'accounting_firm'     => ['listing_slug' => 'accounting-firm-ai',          'price' => 299.00],
            'pet_store'           => ['listing_slug' => 'pet-store-ai-manager',        'price' => 199.00],
            'construction_team'   => ['listing_slug' => 'construction-team-ai',        'price' => 299.00],
            'hr_agency'           => ['listing_slug' => 'hr-agency-ai',                'price' => 199.00],
            'pharmacy'            => ['listing_slug' => 'pharmacy-ai-manager',         'price' => 299.00],
        ];

        return $defs[$key] ?? [];
    }
}
