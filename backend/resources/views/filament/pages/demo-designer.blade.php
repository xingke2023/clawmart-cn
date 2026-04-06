<x-filament-panels::page>

    <div style="display:grid; grid-template-columns: 360px 1fr; gap: 24px; align-items: start;">

        {{-- ── 左侧：配置面板 ── --}}
        <div style="display:flex; flex-direction:column; gap:16px;">

            @php $hasKey = app(\App\Services\IndustryGeneratorService::class)->hasApiKey(); @endphp
            <div style="
                padding:10px 14px; border-radius:8px; font-size:13px; font-weight:600;
                background:{{ $hasKey ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)' }};
                border:1px solid {{ $hasKey ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)' }};
                color:{{ $hasKey ? '#15803d' : '#92400e' }};
            ">
                {{ $hasKey ? '✅ Claude API Key 已配置' : '⚠️ 未配置 ANTHROPIC_API_KEY，将生成模拟内容' }}
            </div>

            <div style="background:white; border:1px solid #e5e7eb; border-radius:12px; padding:20px;">
                <h3 style="font-size:15px; font-weight:700; color:#111827; margin:0 0 16px;">配置演示参数</h3>
                <form wire:submit.prevent="generate">
                    {{ $this->form }}
                    <div style="margin-top:20px; display:flex; flex-direction:column; gap:10px;">
                        <button type="submit" wire:loading.attr="disabled" style="padding:11px 0; border-radius:8px; background:#6366f1; color:white; border:none; cursor:pointer; font-size:14px; font-weight:700; width:100%;">
                            <span wire:loading.remove wire:target="generate">✨ AI 生成演示对话</span>
                            <span wire:loading wire:target="generate">⏳ 生成中，请稍候...</span>
                        </button>
                        @if(count($generatedMsgs) > 0)
                        <button type="button" wire:click="saveToListing" style="padding:11px 0; border-radius:8px; background:#16a34a; color:white; border:none; cursor:pointer; font-size:14px; font-weight:700; width:100%;">
                            💾 保存到方案 Listing
                        </button>
                        @endif
                    </div>
                </form>
            </div>

            @if(count($generatedMsgs) > 0)
            <div style="background:white; border:1px solid #e5e7eb; border-radius:12px; padding:16px;">
                <div style="font-size:12px; color:#9ca3af; margin-bottom:10px; text-transform:uppercase; letter-spacing:0.05em; font-weight:600;">演示统计</div>
                <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; text-align:center;">
                    <div style="padding:10px; background:#f9fafb; border-radius:8px;">
                        <div style="font-size:20px; font-weight:800; color:#6366f1;">{{ count($generatedMsgs) }}</div>
                        <div style="font-size:11px; color:#9ca3af;">总条数</div>
                    </div>
                    <div style="padding:10px; background:#f9fafb; border-radius:8px;">
                        <div style="font-size:20px; font-weight:800; color:#16a34a;">{{ collect($generatedMsgs)->where('type','ai')->count() }}</div>
                        <div style="font-size:11px; color:#9ca3af;">AI 回复</div>
                    </div>
                    <div style="padding:10px; background:#f9fafb; border-radius:8px;">
                        <div style="font-size:20px; font-weight:800; color:#f59e0b;">{{ collect($generatedMsgs)->where('type','user')->count() }}</div>
                        <div style="font-size:11px; color:#9ca3af;">员工消息</div>
                    </div>
                </div>
            </div>
            @endif

        </div>

        {{-- ── 右侧：预览面板 ── --}}
        <div style="background:white; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden; min-height:500px;">

            <div style="padding:14px 20px; border-bottom:1px solid #f3f4f6; display:flex; align-items:center; justify-content:space-between;">
                <div>
                    <h3 style="font-size:15px; font-weight:700; color:#111827; margin:0;">
                        {{ $solutionName ?: '演示预览' }}
                    </h3>
                    @if(count($generatedMsgs) > 0)
                    <p style="font-size:12px; color:#9ca3af; margin:2px 0 0;">{{ count($generatedMsgs) }} 条 · 点击消息可编辑文本</p>
                    @endif
                </div>
                @if(count($generatedMsgs) > 0)
                    @if($loadedFromListing)
                    <span style="font-size:11px; background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; padding:3px 10px; border-radius:100px; font-weight:600;">📂 已有内容</span>
                    @else
                    <span style="font-size:11px; background:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0; padding:3px 10px; border-radius:100px; font-weight:600;">✨ 新生成</span>
                    @endif
                @endif
            </div>

            <div style="padding:20px; max-height:660px; overflow-y:auto;" id="chat-preview">

                @if($errorMsg)
                    <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:8px; padding:14px; color:#dc2626; font-size:13px;">❌ {{ $errorMsg }}</div>

                @elseif(count($generatedMsgs) === 0)
                    <div style="text-align:center; padding:60px 20px; color:#9ca3af;">
                        <div style="font-size:48px; margin-bottom:12px;">💬</div>
                        @if($solution_id)
                            <p style="font-size:15px; font-weight:600; color:#6b7280; margin:0 0 6px;">该方案暂无演示对话</p>
                            <p style="font-size:13px; margin:0;">点击「AI 生成演示对话」创建</p>
                        @else
                            <p style="font-size:15px; font-weight:600; color:#6b7280; margin:0 0 6px;">选择行业方案</p>
                            <p style="font-size:13px; margin:0;">已有对话将自动加载，也可重新生成</p>
                        @endif
                    </div>

                @else
                    <div style="display:flex; flex-direction:column; gap:14px;">
                        @foreach($generatedMsgs as $i => $msg)
                        <div style="display:flex; flex-direction:column; align-items:{{ $msg['type'] === 'user' ? 'flex-end' : 'flex-start' }};"
                             x-data="{ editing: false, text: {{ json_encode($msg['text']) }} }">

                            <div style="font-size:10px; font-weight:700; color:#9ca3af; margin-bottom:4px; padding:0 4px; text-transform:uppercase; letter-spacing:0.05em;">
                                {{ $msg['type'] === 'user' ? '👤 员工/用户' : '🤖 AI 助手' }}
                            </div>

                            <div style="
                                max-width:78%; position:relative;
                                background:{{ $msg['type'] === 'user' ? '#6366f1' : '#f9fafb' }};
                                color:{{ $msg['type'] === 'user' ? 'white' : '#1f2937' }};
                                border:{{ $msg['type'] === 'ai' ? '1px solid #e5e7eb' : 'none' }};
                                border-radius:{{ $msg['type'] === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px' }};
                                padding:10px 14px; font-size:13px; line-height:1.65;
                                box-shadow:0 1px 4px rgba(0,0,0,0.06);
                            ">
                                <template x-if="!editing">
                                    <div style="white-space:pre-line;" x-text="text.replace(/\\n/g, '\n')"></div>
                                </template>
                                <template x-if="editing">
                                    <textarea x-model="text"
                                        style="width:100%; min-height:80px; background:transparent; border:none; outline:none; font-size:13px; line-height:1.65; color:inherit; resize:vertical; font-family:inherit;"
                                    ></textarea>
                                </template>
                            </div>

                            <div style="display:flex; gap:8px; margin-top:4px; padding:0 2px;">
                                <button x-show="!editing" x-on:click="editing=true"
                                    style="font-size:11px; color:#9ca3af; background:none; border:none; cursor:pointer;">✏️ 编辑</button>
                                <button x-show="editing" x-on:click="editing=false; $wire.updateMessage({{ $i }}, text)"
                                    style="font-size:11px; color:#16a34a; background:none; border:none; cursor:pointer; font-weight:600;">✅ 保存</button>
                                <button x-show="editing" x-on:click="editing=false; text={{ json_encode($msg['text']) }}"
                                    style="font-size:11px; color:#9ca3af; background:none; border:none; cursor:pointer;">取消</button>
                                <button wire:click="removeMessage({{ $i }})" wire:confirm="确定删除这条消息？"
                                    style="font-size:11px; color:#ef4444; background:none; border:none; cursor:pointer;">🗑️</button>
                            </div>
                        </div>
                        @endforeach
                    </div>
                @endif

            </div>

            @if(count($generatedMsgs) > 0)
            <div style="padding:12px 20px; border-top:1px solid #f3f4f6; display:flex; align-items:center; justify-content:space-between; background:#f9fafb;">
                <span style="font-size:12px; color:#9ca3af;">共 {{ count($generatedMsgs) }} 条 · 可编辑后保存</span>
                <button wire:click="saveToListing" style="padding:8px 20px; border-radius:8px; background:#16a34a; color:white; border:none; cursor:pointer; font-size:13px; font-weight:700;">
                    💾 保存到方案 Listing
                </button>
            </div>
            @endif

        </div>
    </div>

</x-filament-panels::page>
