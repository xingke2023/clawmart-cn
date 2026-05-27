'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { clawStyles } from "@/components/claw-layout";
import { Loader2 } from 'lucide-react';

export function AuthCard({ defaultTab }: { defaultTab: 'login' | 'register' }) {
  const router = useRouter();
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);

  // Login state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [regUsername, setRegUsername] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      await login({ username: loginUsername, password: loginPassword });
      router.push('/');
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : '登录失败，请检查用户名和密码');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegLoading(true);
    try {
      await register({
        username: regUsername,
        name: regName || undefined,
        email: regEmail || undefined,
        password: regPassword,
        password_confirmation: regPassword,
      });
      router.push('/');
    } catch (err) {
      setRegError(err instanceof Error ? err.message : '注册失败，请稍后重试');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <>
      <style>{clawStyles}</style>
      <style>{`
        .auth-tab {
          flex: 1;
          padding: 12px 0;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Manrope', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #9e8074;
          border-bottom: 2px solid transparent;
          transition: color 0.18s, border-color 0.18s;
        }
        .auth-tab.active {
          color: #E65C46;
          border-bottom-color: #E65C46;
        }
        .auth-tab:hover:not(.active) {
          color: #2A1F19;
        }
      `}</style>
      <div className="claw-page" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top bar */}
        <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(42,31,25,0.08)' }}>
          <Link href="/" style={{
            fontFamily: "'Bricolage Grotesque', 'Manrope', sans-serif",
            fontSize: 18, fontWeight: 700, color: '#2A1F19', textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ width: 28, height: 28, background: '#E65C46', borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, fontWeight: 800 }}>C</span>
            CLAW MART
          </Link>
        </div>

        {/* Card */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
          <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 18, border: '1px solid rgba(42,31,25,0.08)', boxShadow: '0 4px 32px rgba(42,31,25,0.07)', overflow: 'hidden' }}>
            {/* Tab switcher */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(42,31,25,0.09)', padding: '0 32px' }}>
              <button className={`auth-tab${tab === 'login' ? ' active' : ''}`} onClick={() => setTab('login')}>
                登录
              </button>
              <button className={`auth-tab${tab === 'register' ? ' active' : ''}`} onClick={() => setTab('register')}>
                注册
              </button>
            </div>

            <div style={{ padding: '32px 32px 36px' }}>
              {tab === 'login' ? (
                <>
                  <div style={{ marginBottom: 24 }}>
                    <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 26, fontWeight: 800, color: '#2A1F19', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                      欢迎回来
                    </h1>
                    <p style={{ fontSize: 14, color: '#6B5549', margin: 0 }}>登录您的 Claw Mart 账号</p>
                  </div>

                  {loginError && (
                    <div style={{ background: 'rgba(230,92,70,0.1)', border: '1px solid rgba(230,92,70,0.3)', borderRadius: 8, padding: '11px 14px', fontSize: 13, color: '#bf3f30', marginBottom: 18 }}>
                      {loginError}
                    </div>
                  )}

                  <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label className="claw-form-label">用户名</label>
                      <input type="text" placeholder="输入用户名" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} required className="claw-input" autoComplete="username" />
                    </div>
                    <div>
                      <label className="claw-form-label">密码</label>
                      <input type="password" placeholder="••••••••" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required className="claw-input" />
                    </div>
                    <button type="submit" disabled={loginLoading} className="claw-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 15, fontWeight: 700, marginTop: 4 }}>
                      {loginLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : '登录'}
                    </button>
                  </form>

                  <div style={{ marginTop: 20, padding: '13px 14px', background: 'rgba(42,31,25,0.04)', borderRadius: 10 }}>
                    <p style={{ fontSize: 12, color: '#9e8074', margin: '0 0 6px', fontWeight: 600 }}>演示账号：</p>
                    <p style={{ fontSize: 13, color: '#6B5549', margin: 0 }}>👤 demo &nbsp; 🔑 password</p>
                  </div>

                  <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6B5549' }}>
                    还没有账号？{' '}
                    <button onClick={() => setTab('register')} style={{ background: 'none', border: 'none', color: '#E65C46', fontWeight: 600, cursor: 'pointer', fontSize: 13, padding: 0 }}>
                      免费注册
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: 24 }}>
                    <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 26, fontWeight: 800, color: '#2A1F19', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                      创建账号
                    </h1>
                    <p style={{ fontSize: 14, color: '#6B5549', margin: 0 }}>加入 Claw Mart，发现优质 AI 技能</p>
                  </div>

                  {regError && (
                    <div style={{ background: 'rgba(230,92,70,0.1)', border: '1px solid rgba(230,92,70,0.3)', borderRadius: 8, padding: '11px 14px', fontSize: 13, color: '#bf3f30', marginBottom: 18 }}>
                      {regError}
                    </div>
                  )}

                  <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label className="claw-form-label">用户名 *</label>
                      <input type="text" placeholder="字母、数字或中文，唯一" value={regUsername} onChange={e => setRegUsername(e.target.value)} required className="claw-input" autoComplete="username" />
                    </div>
                    <div>
                      <label className="claw-form-label">昵称（可选）</label>
                      <input type="text" placeholder="显示名称，如不填则使用用户名" value={regName} onChange={e => setRegName(e.target.value)} className="claw-input" />
                    </div>
                    <div>
                      <label className="claw-form-label">邮箱（可选）</label>
                      <input type="email" placeholder="your@email.com" value={regEmail} onChange={e => setRegEmail(e.target.value)} className="claw-input" />
                    </div>
                    <div>
                      <label className="claw-form-label">密码 *</label>
                      <input type="password" placeholder="至少 8 位字符" value={regPassword} onChange={e => setRegPassword(e.target.value)} required minLength={8} className="claw-input" />
                    </div>
                    <button type="submit" disabled={regLoading} className="claw-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 15, fontWeight: 700, marginTop: 4 }}>
                      {regLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : '免费注册'}
                    </button>
                  </form>

                  <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6B5549' }}>
                    已有账号？{' '}
                    <button onClick={() => setTab('login')} style={{ background: 'none', border: 'none', color: '#E65C46', fontWeight: 600, cursor: 'pointer', fontSize: 13, padding: 0 }}>
                      立即登录
                    </button>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return <AuthCard defaultTab="login" />;
}
