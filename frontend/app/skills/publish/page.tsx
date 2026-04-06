'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { listingsApi } from "@/lib/api";
import { ClawNav, ClawFooter, clawStyles } from "@/components/claw-layout";
import { Loader2, CheckCircle2 } from "lucide-react";

const CATEGORIES = ['营销', '工程', '设计', '其他', 'AI 角色', '行业方案'];

export default function PublishSkillPage() {
  const { isAuthenticated, loading, token } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    price: '0',
    category: '其他',
    description: '',
    image_url: '',
    status: 'available' as 'available' | 'draft',
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login?redirect=/skills/publish');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <>
        <style>{clawStyles}</style>
        <div className="claw-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <Loader2 size={28} style={{ color: '#E65C46', animation: 'spin 1s linear infinite' }} />
        </div>
      </>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('请填写技能名称'); return; }
    setError('');
    setSubmitting(true);
    try {
      await listingsApi.createListing({
        name: form.name.trim(),
        price: parseFloat(form.price) || 0,
        category: form.category,
        description: form.description.trim(),
        image_url: form.image_url.trim() || undefined,
        status: form.status,
      }, token!);
      setDone(true);
    } catch (err: any) {
      setError(err?.message || '发布失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{clawStyles}</style>
      <div className="claw-page">
        <ClawNav />
        <main>
          <section style={{ padding: '56px 24px 80px', maxWidth: 680, margin: '0 auto' }}>

            {done ? (
              <div style={{ textAlign: 'center', padding: '64px 0' }}>
                <CheckCircle2 size={56} style={{ color: '#4a9e6b', marginBottom: 20 }} />
                <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 28, fontWeight: 800, color: '#2A1F19', margin: '0 0 12px' }}>
                  技能已发布！
                </h2>
                <p style={{ fontSize: 15, color: '#6B5549', margin: '0 0 32px' }}>
                  你的技能已成功提交，现在可以在技能库中浏览。
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => { setDone(false); setForm({ name: '', price: '0', category: '其他', description: '', image_url: '', status: 'available' }); }}
                    className="claw-btn-ghost"
                    style={{ padding: '10px 24px', fontSize: 14 }}
                  >
                    再发布一个
                  </button>
                  <button
                    onClick={() => router.push('/skills')}
                    className="claw-btn-primary"
                    style={{ padding: '10px 24px', fontSize: 14, border: 'none', cursor: 'pointer' }}
                  >
                    浏览技能库
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 36 }}>
                  <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 34, fontWeight: 800, color: '#2A1F19', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                    发布技能
                  </h1>
                  <p style={{ fontSize: 15, color: '#6B5549', margin: 0 }}>
                    将你的 AI 技能包分享给更多人使用。
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                  {/* 名称 */}
                  <div>
                    <label className="claw-form-label">技能名称 *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="例：小红书爆款文案生成器"
                      className="claw-input"
                      style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* 分类 + 价格 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label className="claw-form-label">分类</label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="claw-input"
                        style={{ width: '100%', boxSizing: 'border-box' }}
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="claw-form-label">价格（¥，0 为免费）</label>
                      <input
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={handleChange}
                        className="claw-input"
                        style={{ width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  {/* 描述 */}
                  <div>
                    <label className="claw-form-label">功能描述</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={5}
                      placeholder="介绍这个技能能做什么，适合哪些场景……"
                      className="claw-textarea"
                      style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* 封面图 */}
                  <div>
                    <label className="claw-form-label">封面图 URL（选填）</label>
                    <input
                      name="image_url"
                      value={form.image_url}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="claw-input"
                      style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* 状态 */}
                  <div style={{ display: 'flex', gap: 12 }}>
                    {(['available', 'draft'] as const).map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, status: s }))}
                        style={{
                          flex: 1, padding: '10px 0', borderRadius: 10, cursor: 'pointer',
                          fontFamily: "'Manrope', sans-serif", fontSize: 14, fontWeight: 600,
                          border: '1.5px solid',
                          borderColor: form.status === s ? '#2A1F19' : 'rgba(42,31,25,0.15)',
                          background: form.status === s ? '#2A1F19' : '#fff',
                          color: form.status === s ? '#fff' : '#6B5549',
                          transition: 'all 0.15s',
                        }}
                      >
                        {s === 'available' ? '✓ 立即发布' : '草稿保存'}
                      </button>
                    ))}
                  </div>

                  {error && (
                    <p style={{ fontSize: 13, color: '#E65C46', margin: 0 }}>{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="claw-btn-primary"
                    style={{ padding: '13px 0', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    {submitting ? <><Loader2 size={16} /> 发布中…</> : '发布技能'}
                  </button>
                </form>
              </>
            )}
          </section>
        </main>
        <ClawFooter />
      </div>
    </>
  );
}
