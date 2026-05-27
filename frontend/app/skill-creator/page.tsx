'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ClawNav, ClawFooter, clawStyles } from "@/components/claw-layout";
import { Sparkles, Loader2, Copy, Check, ArrowRight, Lightbulb, Users, Zap } from "lucide-react";

interface GeneratedSkill {
  name: string;
  category: string;
  price: number;
  description: string;
  demo_messages: { type: string; text: string }[];
}

const CATEGORIES = ['AI 角色', '营销', '工程', '设计', '行业方案', '其他'];

export default function SkillCreatorPage() {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();

  const [idea, setIdea] = useState('');
  const [audience, setAudience] = useState('');
  const [features, setFeatures] = useState('');
  const [generating, setGenerating] = useState(false);
  const [streamText, setStreamText] = useState('');
  const [result, setResult] = useState<GeneratedSkill | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishDone, setPublishDone] = useState(false);

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    setGenerating(true);
    setStreamText('');
    setResult(null);
    setError('');
    setPublishDone(false);

    try {
      const res = await fetch('/api/generate-skill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, audience, features }),
      });

      if (!res.ok) {
        setError('生成失败，请稍后重试');
        setGenerating(false);
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(Boolean);
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            accumulated += parsed.text;
            setStreamText(accumulated);
          } catch {}
        }
      }

      // Parse JSON from streamed text
      const jsonMatch = accumulated.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setResult(parsed);
      } else {
        setError('生成内容格式有误，请重试');
      }
    } catch {
      setError('网络错误，请重试');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePublish = async () => {
    if (!result || !isAuthenticated) {
      if (!isAuthenticated) router.push('/login');
      return;
    }
    setPublishing(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: result.name,
          category: result.category,
          price: result.price,
          description: result.description,
          status: 'draft',
        }),
      });
      if (res.ok) {
        setPublishDone(true);
      } else {
        const data = await res.json();
        setError(data.message || '发布失败，请在控制台手动创建');
      }
    } catch {
      setError('网络错误，请重试');
    } finally {
      setPublishing(false);
    }
  };

  const examples = [
    { icon: '🎯', label: '销售话术教练', desc: '帮销售人员准备谈判策略和应对客户异议' },
    { icon: '📊', label: '数据报告助手', desc: '自动分析 Excel 数据并生成可视化报告' },
    { icon: '✍️', label: '小红书爆款写手', desc: '生成符合平台调性的种草笔记和标题' },
  ];

  return (
    <>
      <style>{clawStyles}</style>
      <div className="claw-page">
        <ClawNav />
        <main>
          {/* Hero */}
          <section style={{ padding: '72px 24px 48px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <div className="claw-label" style={{ display: 'inline-block', marginBottom: 16 }}>AI 辅助创作</div>
            <h1 className="claw-h1" style={{ marginBottom: 16 }}>
              技能 <span className="claw-accent">创作助手</span>
            </h1>
            <p className="claw-lead" style={{ marginBottom: 0 }}>
              描述你的 AI 技能想法，Claude 帮你生成完整的 listing 内容
            </p>
          </section>

          <hr className="claw-divider" />

          {/* Form */}
          <section style={{ padding: '48px 24px', maxWidth: 720, margin: '0 auto' }}>
            <div className="claw-card" style={{ padding: 32 }}>
              <div style={{ marginBottom: 24 }}>
                <label className="claw-form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Lightbulb size={15} style={{ color: '#E65C46' }} />
                  核心想法 <span style={{ color: '#E65C46' }}>*</span>
                </label>
                <textarea
                  className="claw-textarea"
                  rows={3}
                  placeholder="例如：帮餐厅老板每天自动整理营业数据、分析哪些菜品卖得好，并给出进货建议"
                  value={idea}
                  onChange={e => setIdea(e.target.value)}
                  style={{ marginTop: 8 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div>
                  <label className="claw-form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Users size={14} style={{ color: '#6B5549' }} />
                    目标用户（可选）
                  </label>
                  <input
                    className="claw-input"
                    placeholder="例如：餐厅老板、电商运营"
                    value={audience}
                    onChange={e => setAudience(e.target.value)}
                    style={{ marginTop: 8 }}
                  />
                </div>
                <div>
                  <label className="claw-form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Zap size={14} style={{ color: '#6B5549' }} />
                    核心功能（可选）
                  </label>
                  <input
                    className="claw-input"
                    placeholder="例如：日报生成、库存预警"
                    value={features}
                    onChange={e => setFeatures(e.target.value)}
                    style={{ marginTop: 8 }}
                  />
                </div>
              </div>

              <button
                className="claw-btn-primary"
                onClick={handleGenerate}
                disabled={generating || !idea.trim()}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 15, padding: '13px 0', opacity: generating || !idea.trim() ? 0.6 : 1 }}
              >
                {generating ? (
                  <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> AI 生成中...</>
                ) : (
                  <><Sparkles size={16} /> 生成技能 Listing</>
                )}
              </button>

              {/* Examples */}
              <div style={{ marginTop: 20, borderTop: '1px solid rgba(42,31,25,0.07)', paddingTop: 20 }}>
                <p style={{ fontSize: 12, color: '#9e8074', marginBottom: 10 }}>试试这些例子：</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {examples.map(ex => (
                    <button
                      key={ex.label}
                      onClick={() => { setIdea(ex.desc); }}
                      style={{ fontSize: 12, padding: '5px 12px', borderRadius: 20, border: '1px solid rgba(42,31,25,0.12)', background: '#fff', color: '#6B5549', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      {ex.icon} {ex.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Streaming output */}
          {generating && streamText && (
            <section style={{ padding: '0 24px 48px', maxWidth: 720, margin: '0 auto' }}>
              <div className="claw-card" style={{ padding: 24 }}>
                <p style={{ fontSize: 12, color: '#9e8074', marginBottom: 12 }}>正在生成...</p>
                <pre style={{ fontSize: 13, color: '#6B5549', whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: 300, overflowY: 'auto', margin: 0 }}>
                  {streamText}
                </pre>
              </div>
            </section>
          )}

          {/* Error */}
          {error && (
            <section style={{ padding: '0 24px 48px', maxWidth: 720, margin: '0 auto' }}>
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: 16, color: '#B91C1C', fontSize: 14 }}>
                {error}
              </div>
            </section>
          )}

          {/* Result */}
          {result && !generating && (
            <section style={{ padding: '0 24px 64px', maxWidth: 720, margin: '0 auto' }}>
              <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 className="claw-h2" style={{ margin: 0 }}>生成结果</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={handleCopy}
                    style={{ fontSize: 13, padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(42,31,25,0.12)', background: '#fff', color: '#6B5549', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
                  >
                    {copied ? <><Check size={13} /> 已复制</> : <><Copy size={13} /> 复制 JSON</>}
                  </button>
                </div>
              </div>

              <div className="claw-card" style={{ padding: 28, marginBottom: 16 }}>
                {/* Name & Meta */}
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: '#2A1F19', margin: '0 0 8px', fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                    {result.name}
                  </h3>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <span className="claw-chip" style={{ background: 'rgba(230,92,70,0.08)', color: '#E65C46', border: '1px solid rgba(230,92,70,0.2)', padding: '3px 10px', borderRadius: 20, fontSize: 12 }}>
                      {result.category}
                    </span>
                    <span style={{ fontSize: 13, color: '#2A1F19', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                      {result.price === 0 ? '免费' : `¥${result.price}`}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: 12, color: '#9e8074', marginBottom: 8, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>技能描述</p>
                  <p style={{ fontSize: 14, color: '#6B5549', lineHeight: 1.75, whiteSpace: 'pre-wrap', margin: 0 }}>{result.description}</p>
                </div>

                {/* Demo messages */}
                {result.demo_messages?.length > 0 && (
                  <div>
                    <p style={{ fontSize: 12, color: '#9e8074', marginBottom: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>对话演示</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {result.demo_messages.map((msg, i) => (
                        <div key={i} style={{
                          display: 'flex',
                          justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                        }}>
                          <div style={{
                            maxWidth: '80%',
                            padding: '10px 14px',
                            borderRadius: msg.type === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                            background: msg.type === 'user' ? '#E65C46' : 'rgba(240,232,225,0.8)',
                            color: msg.type === 'user' ? '#fff' : '#2A1F19',
                            fontSize: 13,
                            lineHeight: 1.6,
                            whiteSpace: 'pre-wrap',
                          }}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  className="claw-btn-primary"
                  onClick={handlePublish}
                  disabled={publishing || publishDone}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: publishing || publishDone ? 0.7 : 1 }}
                >
                  {publishing ? (
                    <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> 发布中...</>
                  ) : publishDone ? (
                    <><Check size={15} /> 已保存为草稿</>
                  ) : (
                    <>保存到控制台 <ArrowRight size={15} /></>
                  )}
                </button>
                <button
                  className="claw-btn-ghost"
                  onClick={() => { setResult(null); setStreamText(''); setIdea(''); setAudience(''); setFeatures(''); }}
                  style={{ flex: 1 }}
                >
                  重新生成
                </button>
              </div>
              {publishDone && (
                <p style={{ fontSize: 13, color: '#6B5549', textAlign: 'center', marginTop: 12 }}>
                  已保存为草稿，前往{' '}
                  <a href="/dashboard?tab=my-listings" style={{ color: '#E65C46' }}>控制台 → 我的销售</a>
                  {' '}查看和编辑
                </p>
              )}
            </section>
          )}

          {/* How it works */}
          {!result && !generating && (
            <>
              <hr className="claw-divider" />
              <section style={{ padding: '56px 24px', maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                  <div className="claw-label" style={{ display: 'inline-block', marginBottom: 12 }}>工作流程</div>
                  <h2 className="claw-h2">三步创建专业 Listing</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                  {[
                    { step: '01', title: '描述想法', desc: '用一两句话说清楚你的 AI 技能能做什么、帮谁解决什么问题' },
                    { step: '02', title: 'AI 自动生成', desc: 'Claude 帮你写出专业的标题、描述、定价建议和真实对话演示' },
                    { step: '03', title: '发布上架', desc: '一键保存到你的卖家后台，微调后即可上架销售' },
                  ].map(item => (
                    <div key={item.step} className="claw-card" style={{ padding: 28, textAlign: 'center' }}>
                      <div className="claw-step-num" style={{ margin: '0 auto 16px' }}>{item.step}</div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#2A1F19', margin: '0 0 10px', fontFamily: "'Bricolage Grotesque', sans-serif" }}>{item.title}</h3>
                      <p className="claw-body" style={{ margin: 0 }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </main>
        <ClawFooter />
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
