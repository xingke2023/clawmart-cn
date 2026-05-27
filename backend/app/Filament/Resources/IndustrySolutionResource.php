<?php

namespace App\Filament\Resources;

use App\Filament\Resources\IndustrySolutionResource\Pages;
use App\Models\IndustrySolution;
use App\Models\Listing;
use App\Services\IndustryGeneratorService;
use Filament\Actions\Action;
use Filament\Actions\BulkAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class IndustrySolutionResource extends Resource
{
    protected static ?string $model = IndustrySolution::class;
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-building-storefront';
    protected static ?string $navigationLabel = '行业方案';
    protected static string|\UnitEnum|null $navigationGroup = 'AI 内容工具';
    protected static ?int $navigationSort = 1;
    protected static ?string $modelLabel = '行业方案';
    protected static ?string $pluralModelLabel = '行业方案';

    public static function form(Schema $form): Schema
    {
        return $form->schema([
            Forms\Components\Section::make('基础信息')->columns(2)->schema([
                Forms\Components\TextInput::make('industry_key')->label('行业标识')->required()->maxLength(100),
                Forms\Components\TextInput::make('name')->label('行业名称')->required()->maxLength(100),
                Forms\Components\TextInput::make('emoji')->label('Emoji')->required()->maxLength(10),
                Forms\Components\Select::make('status')->label('状态')->options([
                    'pending' => '待生成', 'generating' => '生成中', 'done' => '已完成', 'failed' => '失败',
                ])->required(),
                Forms\Components\TextInput::make('tagline')->label('一句话定位')->columnSpanFull()->required(),
            ]),
            Forms\Components\Section::make('方案内容')->schema([
                Forms\Components\TagsInput::make('pain_points')->label('核心痛点')->splitKeys(['Tab','Enter']),
                Forms\Components\TagsInput::make('target_users')->label('目标用户')->splitKeys(['Tab','Enter']),
                Forms\Components\TagsInput::make('modules')->label('功能模块')->splitKeys(['Tab','Enter']),
                Forms\Components\TagsInput::make('keywords')->label('关键词')->splitKeys(['Tab','Enter']),
            ]),
            Forms\Components\Section::make('关联 Listing')->schema([
                Forms\Components\Select::make('listing_id')->label('绑定 Listing')
                    ->relationship('listing', 'name')->searchable()->nullable(),
                Forms\Components\Textarea::make('generation_error')->label('错误信息')->disabled()->nullable()->rows(2),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('emoji')->label('')->width(40),
                Tables\Columns\TextColumn::make('name')->label('行业名称')->searchable()->sortable()->weight('bold'),
                Tables\Columns\TextColumn::make('tagline')->label('定位')->limit(35)->tooltip(fn($record) => $record->tagline),
                Tables\Columns\BadgeColumn::make('status')->label('状态')
                    ->colors(['warning'=>'pending','primary'=>'generating','success'=>'done','danger'=>'failed'])
                    ->formatStateUsing(fn($state) => match($state) {
                        'pending'=>'待生成','generating'=>'生成中','done'=>'已完成','failed'=>'失败',default=>$state
                    }),
                Tables\Columns\TextColumn::make('listing.name')->label('绑定Listing')->placeholder('—')->limit(25),
                Tables\Columns\TextColumn::make('generated_at')->label('生成时间')
                    ->formatStateUsing(fn($state) => $state ? \Carbon\Carbon::parse($state)->format('m/d H:i') : '—'),
            ])
            ->defaultSort('id','asc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')->label('状态')->options([
                    'pending'=>'待生成','done'=>'已完成','failed'=>'失败',
                ]),
            ])
            ->actions([
                Action::make('generate_solution')
                    ->label('生成方案')
                    ->icon('heroicon-o-sparkles')
                    ->color('primary')
                    ->requiresConfirmation()
                    ->modalHeading(fn($record) => "生成「{$record->name}」方案")
                    ->modalDescription('调用 Claude AI 生成方案描述和演示对话，创建对应 Listing。')
                    ->action(function($record): void {
                        $svc = app(IndustryGeneratorService::class);
                        if (!$svc->hasApiKey()) {
                            Notification::make()->title('⚠️ 未配置 API Key，使用模拟内容')->warning()->send();
                        }
                        try {
                            $record->update(['status'=>'generating']);
                            $generated = $svc->generateSolution($record);
                            $slug = \Illuminate\Support\Str::slug($record->name.'-ai-solution');
                            $listing = $svc->upsertListing($record, $generated, ['listing_slug'=>$slug,'price'=>299]);
                            $record->update(['listing_id'=>$listing->id,'status'=>'done','generated_at'=>now()]);
                            Notification::make()->title('✅ 方案生成成功')->body("Listing「{$listing->name}」已创建。")->success()->send();
                        } catch(\Throwable $e) {
                            $record->update(['status'=>'failed','generation_error'=>$e->getMessage()]);
                            Notification::make()->title('❌ 生成失败')->body($e->getMessage())->danger()->send();
                        }
                    }),

                Action::make('generate_demo')
                    ->label('设计演示')
                    ->icon('heroicon-o-chat-bubble-left-right')
                    ->color('success')
                    ->visible(fn($record) => $record->listing_id !== null)
                    ->form(fn($record) => [
                        Forms\Components\CheckboxList::make('modules')
                            ->label('覆盖功能模块')->columns(2)
                            ->options(collect($record->modules)->mapWithKeys(fn($m)=>[$m=>$m])->toArray())
                            ->default($record->modules),
                        Forms\Components\Select::make('style')->label('演示风格')->options([
                            '完整功能巡览'=>'完整功能巡览','真实日常场景'=>'真实日常场景','紧急异常处理'=>'紧急异常处理',
                        ])->default('完整功能巡览'),
                        Forms\Components\Select::make('count')->label('对话条数')->options([
                            8=>'8 条',16=>'16 条',24=>'24 条（推荐）',
                        ])->default(24),
                    ])
                    ->action(function($record, array $data): void {
                        $svc = app(IndustryGeneratorService::class);
                        if (!$svc->hasApiKey()) {
                            Notification::make()->title('⚠️ 未配置 API Key，使用模拟内容')->warning()->send();
                        }
                        try {
                            $msgs = $svc->generateDemo($record, [
                                'modules'=>$data['modules'],'style'=>$data['style'],'count'=>(int)$data['count'],
                            ]);
                            Listing::find($record->listing_id)?->update(['demo_messages'=>$msgs]);
                            $record->update(['generated_at'=>now()]);
                            Notification::make()->title('✅ 演示对话已生成')->body('共'.count($msgs).'条，已保存。')->success()->send();
                        } catch(\Throwable $e) {
                            Notification::make()->title('❌ 演示生成失败')->body($e->getMessage())->danger()->send();
                        }
                    }),

                EditAction::make()->label('编辑'),
            ])
            ->headerActions([
                Action::make('expand_industries')
                    ->label('✨ 扩展行业库')
                    ->icon('heroicon-o-plus-circle')
                    ->color('warning')
                    ->form([
                        Forms\Components\Select::make('count')
                            ->label('新增行业数量')
                            ->options([5 => '5 个', 10 => '10 个', 15 => '15 个', 20 => '20 个'])
                            ->default(10)
                            ->required(),
                        Forms\Components\Select::make('direction')
                            ->label('扩展方向')
                            ->options([
                                'all'          => '🌐 各行各业（全面覆盖）',
                                'retail'       => '🛍️ 零售与消费',
                                'service'      => '🤝 服务业',
                                'b2b'          => '🏭 B2B 与制造业',
                                'professional' => '💼 专业服务',
                                'healthcare'   => '🏥 医疗健康',
                                'education'    => '📚 教育与培训',
                            ])
                            ->default('all')
                            ->required(),
                        Forms\Components\Toggle::make('auto_generate_content')
                            ->label('同时生成 listing 内容（调用 AI）')
                            ->default(false)
                            ->helperText('关闭则只写入行业元数据，稍后可手动点「生成方案」'),
                    ])
                    ->action(function (array $data): void {
                        $svc = app(IndustryGeneratorService::class);

                        // 取现有行业名称，避免重复
                        $existingNames = IndustrySolution::pluck('name')->map(fn ($n) => mb_strtolower($n))->toArray();
                        $existingKeys  = IndustrySolution::pluck('industry_key')->toArray();

                        $prompt = self::buildExpandPrompt((int) $data['count'], $data['direction'], $existingNames);

                        try {
                            $raw      = $svc->callClaude($prompt);
                            $newItems = self::parseExpandResult($raw);
                        } catch (\Throwable $e) {
                            Notification::make()->title('❌ AI 生成失败')->body($e->getMessage())->danger()->send();

                            return;
                        }

                        $created = 0;
                        $skipped = 0;

                        foreach ($newItems as $item) {
                            $key = $item['industry_key'] ?? Str::snake($item['name'] ?? '');
                            if (! $key || in_array($key, $existingKeys, true)) {
                                $skipped++;
                                continue;
                            }
                            if (in_array(mb_strtolower($item['name'] ?? ''), $existingNames, true)) {
                                $skipped++;
                                continue;
                            }

                            $solution = IndustrySolution::create([
                                'industry_key' => $key,
                                'name'         => $item['name'],
                                'emoji'        => $item['emoji'] ?? '🏢',
                                'tagline'      => $item['tagline'] ?? "{$item['name']} AI 解决方案",
                                'pain_points'  => $item['pain_points'] ?? [],
                                'target_users' => $item['target_users'] ?? [],
                                'modules'      => $item['modules'] ?? [],
                                'keywords'     => $item['keywords'] ?? [],
                                'status'       => 'pending',
                            ]);

                            // 若勾选了自动生成内容
                            if ($data['auto_generate_content'] && $svc->hasApiKey()) {
                                try {
                                    $solution->update(['status' => 'generating']);
                                    $generated = $svc->generateSolution($solution);
                                    $slug      = Str::slug($solution->name.'-ai-solution');
                                    $listing   = $svc->upsertListing($solution, $generated, ['listing_slug' => $slug, 'price' => 299]);
                                    $solution->update(['listing_id' => $listing->id, 'status' => 'done', 'generated_at' => now()]);
                                    sleep(2);
                                } catch (\Throwable $e) {
                                    $solution->update(['status' => 'failed', 'generation_error' => $e->getMessage()]);
                                }
                            }

                            $created++;
                            $existingKeys[]  = $key;
                            $existingNames[] = mb_strtolower($item['name']);
                        }

                        Notification::make()
                            ->title("✅ 行业库已扩展：新增 {$created} 个" . ($skipped ? "，跳过 {$skipped} 个（已存在）" : ''))
                            ->success()
                            ->send();
                    }),
            ])
            ->bulkActions([
                BulkAction::make('bulk_generate')
                    ->label('批量生成方案')->icon('heroicon-o-sparkles')->requiresConfirmation()
                    ->action(function($records): void {
                        $svc = app(IndustryGeneratorService::class);
                        $ok = $fail = 0;
                        foreach($records as $r) {
                            try {
                                $r->update(['status'=>'generating']);
                                $g = $svc->generateSolution($r);
                                $slug = \Illuminate\Support\Str::slug($r->name.'-ai-solution');
                                $l = $svc->upsertListing($r, $g, ['listing_slug'=>$slug,'price'=>299]);
                                $r->update(['listing_id'=>$l->id,'status'=>'done','generated_at'=>now()]);
                                $ok++; sleep(2);
                            } catch(\Throwable $e) {
                                $r->update(['status'=>'failed','generation_error'=>$e->getMessage()]); $fail++;
                            }
                        }
                        Notification::make()->title("批量完成：成功{$ok}，失败{$fail}")->success()->send();
                    }),
                DeleteBulkAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListIndustrySolutions::route('/'),
            'create' => Pages\CreateIndustrySolution::route('/create'),
            'edit'   => Pages\EditIndustrySolution::route('/{record}/edit'),
        ];
    }

    /**
     * 构建「扩展行业库」的 AI Prompt
     *
     * @param  string[]  $existingNames
     */
    private static function buildExpandPrompt(int $count, string $direction, array $existingNames): string
    {
        $existing = implode('、', array_slice($existingNames, 0, 30));

        $directionHint = match ($direction) {
            'retail'       => '重点覆盖零售、消费、快消、商超、便利店等方向',
            'service'      => '重点覆盖生活服务、家政、餐饮周边、本地服务等方向',
            'b2b'          => '重点覆盖制造业、供应链、工厂、原材料、B2B 销售等方向',
            'professional' => '重点覆盖法律、财务、咨询、投资、广告、公关等专业服务',
            'healthcare'   => '重点覆盖医疗、健康管理、养老、心理咨询、康复等方向',
            'education'    => '重点覆盖学校、在线教育、职业培训、语言学习等方向',
            default        => '涵盖各行各业，尽量多样化，覆盖不同规模和类型的企业',
        };

        return <<<PROMPT
你是 AI 行业解决方案产品专家。请为「AI 技能市集」平台设计 {$count} 个全新的行业解决方案。

## 已有行业（不要重复）
{$existing}

## 扩展方向
{$directionHint}

## 参考示例（生鲜门店）
```json
{
  "industry_key": "fresh_market",
  "name": "生鲜门店",
  "emoji": "🥦",
  "tagline": "专为生鲜连锁门店打造的全链路 AI 经营系统",
  "pain_points": ["规格混乱，整进零出难以对账", "损耗高，临期处理不及时"],
  "target_users": ["生鲜连锁门店店长", "生鲜超市运营总监"],
  "modules": ["AI 店长助手（语音/拍照上报）", "商品库与实时库存系统", "AI 智能下单预测"],
  "keywords": ["生鲜", "门店", "库存", "损耗"]
}
```

## 输出要求
- 只输出一个 JSON array，包含 {$count} 个对象
- industry_key：英文下划线格式，唯一
- name：2-6个中文字，简洁行业名
- emoji：1个最贴切的 emoji
- tagline：15-30字，一句话定位
- pain_points：3-4个核心痛点
- target_users：2-4个目标用户类型
- modules：6-9个功能模块名称
- keywords：4-8个关键词
- 文本中不要有真实换行，只输出合法 JSON
- 第一个字符必须是 [，最后一个字符必须是 ]
PROMPT;
    }

    /**
     * 解析 AI 返回的行业列表 JSON
     *
     * @return array<int, array<string, mixed>>
     */
    private static function parseExpandResult(string $raw): array
    {
        $json = preg_replace('/^```json\s*/m', '', $raw);
        $json = preg_replace('/^```\s*/m', '', $json);
        $json = trim($json);

        // 提取第一个 JSON array
        if (preg_match('/\[.*\]/s', $json, $m)) {
            $json = $m[0];
        }

        $data = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE || ! is_array($data)) {
            // 尝试修复控制字符
            $out    = '';
            $inStr  = false;
            $escape = false;

            for ($i = 0, $len = strlen($json); $i < $len; $i++) {
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
            throw new \RuntimeException('行业列表 JSON 解析失败: '.json_last_error_msg()."\n原始前200字: ".mb_substr($raw, 0, 200));
        }

        return $data;
    }
}
