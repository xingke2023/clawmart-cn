<?php

namespace App\Filament\Pages;

use App\Models\IndustrySolution;
use App\Models\Listing;
use App\Services\IndustryGeneratorService;
use Filament\Actions\Action;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\Select;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Schemas\Schema;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class DemoDesigner extends Page implements HasForms
{
    use InteractsWithForms;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-chat-bubble-left-right';
    protected static ?string $navigationLabel = '演示对话设计器';
    protected static string|\UnitEnum|null $navigationGroup = 'AI 内容工具';
    protected static ?int $navigationSort = 2;
    protected string $view = 'filament.pages.demo-designer';

    // 表单状态
    public ?int $solution_id = null;
    public array $modules = [];
    public string $style = '完整功能巡览';
    public int $count = 24;
    public string $provider = 'anthropic';

    // 结果状态
    public array $generatedMsgs = [];
    public bool $generating = false;
    public ?string $errorMsg = null;
    public bool $loadedFromListing = false;

    // 当前选中方案的数据
    public array $availableModules = [];
    public string $solutionName = '';

    public function mount(): void
    {
        $this->form->fill();
    }

    public function form(Schema $form): Schema
    {
        return $form->schema([
            Select::make('solution_id')
                ->label('选择行业方案')
                ->options(
                    IndustrySolution::where('status', 'done')
                        ->whereNotNull('listing_id')
                        ->get()
                        ->mapWithKeys(fn($s) => [$s->id => $s->emoji.' '.$s->name])
                        ->toArray()
                )
                ->searchable()
                ->reactive()
                ->afterStateUpdated(function ($state): void {
                    $this->errorMsg = null;
                    if ($state) {
                        $s = IndustrySolution::find($state);
                        $this->availableModules = $s?->modules ?? [];
                        $this->modules          = $s?->modules ?? [];
                        $this->solutionName     = $s ? $s->emoji.' '.$s->name : '';

                        // 自动加载已有的 demo_messages
                        $listing = $s?->listing_id ? Listing::find($s->listing_id) : null;
                        $this->generatedMsgs = $listing?->demo_messages ?? [];
                        $this->loadedFromListing = ! empty($this->generatedMsgs);
                    } else {
                        $this->availableModules  = [];
                        $this->modules           = [];
                        $this->solutionName      = '';
                        $this->generatedMsgs     = [];
                        $this->loadedFromListing = false;
                    }
                })
                ->placeholder('请选择一个已完成的行业方案'),

            CheckboxList::make('modules')
                ->label('覆盖功能模块')
                ->options(fn() => collect($this->availableModules)->mapWithKeys(fn($m) => [$m => $m])->toArray())
                ->default([])
                ->columns(2)
                ->visible(fn() => count($this->availableModules) > 0),

            Select::make('style')
                ->label('演示风格')
                ->options([
                    '完整功能巡览' => '🔍 完整功能巡览（推荐，覆盖所有模块）',
                    '真实日常场景' => '📅 真实日常场景（模拟普通工作日）',
                    '紧急异常处理' => '🚨 紧急异常处理（展示 AI 干预能力）',
                ])
                ->default('完整功能巡览'),

            Select::make('count')
                ->label('对话条数')
                ->options([
                    8  => '8 条（快速体验）',
                    16 => '16 条（标准演示）',
                    24 => '24 条（完整展示，推荐）',
                ])
                ->default(24),

            Select::make('provider')
                ->label('AI 线路')
                ->options([
                    'anthropic' => '🤖 Claude（xingke888 代理）',
                    'deepseek'  => '🔵 DeepSeek',
                ])
                ->default('anthropic'),
        ])->statePath('');
    }

    public function generate(): void
    {
        if (! $this->solution_id) {
            Notification::make()->title('请先选择一个行业方案')->warning()->send();
            return;
        }

        $solution = IndustrySolution::find($this->solution_id);
        if (! $solution) {
            return;
        }

        $svc = app(IndustryGeneratorService::class);

        if (! $svc->hasApiKey()) {
            Notification::make()
                ->title('⚠️ 未配置 ANTHROPIC_API_KEY')
                ->body('将生成模拟演示内容，配置真实 Key 后可获得高质量对话。')
                ->warning()
                ->send();
        }

        $this->generating        = true;
        $this->errorMsg          = null;
        $this->loadedFromListing = false;

        try {
            $this->generatedMsgs = $svc->generateDemo($solution, [
                'modules'  => empty($this->modules) ? $solution->modules : $this->modules,
                'style'    => $this->style,
                'count'    => $this->count,
                'provider' => $this->provider,
            ]);
        } catch (\Throwable $e) {
            $this->errorMsg = $e->getMessage();
            Notification::make()->title('❌ 生成失败')->body($e->getMessage())->danger()->send();
        } finally {
            $this->generating = false;
        }
    }

    public function saveToListing(): void
    {
        if (empty($this->generatedMsgs) || ! $this->solution_id) {
            return;
        }

        $solution = IndustrySolution::find($this->solution_id);
        if (! $solution?->listing_id) {
            Notification::make()->title('该方案没有绑定 Listing')->warning()->send();
            return;
        }

        Listing::find($solution->listing_id)?->update(['demo_messages' => $this->generatedMsgs]);
        $solution->update(['generated_at' => now()]);

        Notification::make()
            ->title('✅ 已保存到 Listing')
            ->body('共 '.count($this->generatedMsgs).' 条演示对话已更新，前端「查看演示」即可查看。')
            ->success()
            ->send();
    }

    public function updateMessage(int $index, string $text): void
    {
        if (isset($this->generatedMsgs[$index])) {
            $this->generatedMsgs[$index]['text'] = $text;
        }
    }

    public function removeMessage(int $index): void
    {
        array_splice($this->generatedMsgs, $index, 1);
        $this->generatedMsgs = array_values($this->generatedMsgs);
    }

    protected function getHeaderActions(): array
    {
        return [];
    }
}
