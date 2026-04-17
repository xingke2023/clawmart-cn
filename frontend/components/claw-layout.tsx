'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { LayoutDashboard, ShoppingBag, Settings, LogOut, Store, ChevronDown, Search, Menu, X } from "lucide-react";

const NAV_LINKS: { label: string; href: string; accent?: boolean }[] = [
  { label: "AI门店", href: "/" },
  { label: "技能库", href: "/skills" },
  { label: "一站式龙虾", href: "/assemble" },
  { label: "✨ AI 创作", href: "/skill-creator", accent: true },
];

export function ClawNav() {
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navSearch, setNavSearch] = useState("");
  const dropRef = useRef<HTMLDivElement>(null);

  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      router.push(`/?search=${encodeURIComponent(navSearch.trim())}`);
      setMobileOpen(false);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const avatarLetter = user?.name?.[0]?.toUpperCase() || '?';

  return (
    <>
      <style>{`
        .claw-nav-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: white;
          border: 1px solid rgba(42,31,25,0.1);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(42,31,25,0.12);
          min-width: 200px;
          z-index: 100;
          overflow: hidden;
          animation: dropIn 0.12s ease;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .claw-nav-drop-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 16px;
          font-size: 14px;
          font-weight: 500;
          color: #2A1F19;
          text-decoration: none;
          cursor: pointer;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
          font-family: 'Manrope', sans-serif;
          transition: background 0.12s;
        }
        .claw-nav-drop-item:hover { background: rgba(240,232,225,0.7); }
        .claw-nav-drop-item.danger { color: #bf3f30; }
        .claw-nav-drop-divider { border: none; border-top: 1px solid rgba(42,31,25,0.08); margin: 4px 0; }
        .claw-nav-drop-header {
          padding: 12px 16px 8px;
          border-bottom: 1px solid rgba(42,31,25,0.08);
          margin-bottom: 4px;
        }
        .claw-nav-search-form {
          display: flex;
          align-items: center;
          background: rgba(42, 31, 25, 0.07);
          border-radius: 8px;
          padding: 0 10px;
          gap: 6px;
          height: 36px;
          width: 160px;
          transition: background 0.15s, width 0.2s;
        }
        .claw-nav-search-form:focus-within {
          background: white;
          box-shadow: 0 0 0 1.5px #E65C46;
          width: 220px;
        }
        .claw-nav-search-input {
          border: none;
          background: transparent;
          font-family: 'Manrope', sans-serif;
          font-size: 13px;
          color: #2A1F19;
          outline: none;
          flex: 1;
          width: 100%;
        }
        .claw-nav-search-input::placeholder { color: #9e8074; }
        .claw-nav-avatar-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: white;
          color: #2A1F19;
          font-size: 14px;
          font-weight: 600;
          padding: 6px 12px 6px 6px;
          borderRadius: 8px;
          border: 1.5px solid rgba(42, 31, 25, 0.15);
          cursor: pointer;
          font-family: 'Manrope', sans-serif;
          transition: border-color 0.15s;
        }
        .claw-nav-avatar-btn:hover { border-color: rgba(42,31,25,0.3); }

        /* Mobile nav */
        .claw-nav-desktop { display: flex; align-items: center; gap: 20px; }
        .claw-nav-hamburger { display: none; background: none; border: none; cursor: pointer; padding: 6px; color: #2A1F19; }
        .claw-mobile-menu {
          display: none;
          position: fixed;
          top: 60px;
          left: 0; right: 0;
          background: rgba(248,242,237,0.98);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(42,31,25,0.1);
          z-index: 49;
          padding: 16px 20px 24px;
          flex-direction: column;
          gap: 4px;
          box-shadow: 0 8px 24px rgba(42,31,25,0.1);
        }
        .claw-mobile-menu.open { display: flex; }
        .claw-mobile-nav-link {
          display: block;
          padding: 12px 4px;
          font-size: 16px;
          font-weight: 600;
          color: #2A1F19;
          text-decoration: none;
          font-family: 'Manrope', sans-serif;
          border-bottom: 1px solid rgba(42,31,25,0.07);
        }
        .claw-mobile-nav-link:last-of-type { border-bottom: none; }
        .claw-mobile-search {
          display: flex;
          align-items: center;
          background: rgba(42,31,25,0.07);
          border-radius: 8px;
          padding: 0 12px;
          gap: 8px;
          height: 42px;
          margin-top: 8px;
          margin-bottom: 4px;
        }
        .claw-mobile-search:focus-within { background: white; box-shadow: 0 0 0 1.5px #E65C46; }
        .claw-mobile-search input {
          border: none; background: transparent;
          font-family: 'Manrope', sans-serif;
          font-size: 14px; color: #2A1F19; outline: none; flex: 1;
        }
        .claw-mobile-search input::placeholder { color: #9e8074; }
        @media (max-width: 768px) {
          .claw-nav-desktop { display: none; }
          .claw-nav-hamburger { display: flex; align-items: center; justify-content: center; }
        }
      `}</style>

      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(248, 242, 237, 0.88)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(42, 31, 25, 0.08)',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 20px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Link href="/" style={{
            fontFamily: "'Bricolage Grotesque', 'Manrope', sans-serif",
            fontSize: 24,
            fontWeight: 400,
            color: '#2A1F19',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <img src="/logo.png" alt="OpenClaw" style={{ width: 36, height: 36, objectFit: 'contain' }} />
            CLAWMART 龙虾中国
          </Link>

          {/* Desktop nav */}
          <div className="claw-nav-desktop">
            {NAV_LINKS.map(link => (
              link.accent ? (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#6B5549',
                    textDecoration: 'none',
                    fontFamily: "'Manrope', sans-serif",
                    whiteSpace: 'nowrap',
                  }}
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: pathname === link.href ? '#2A1F19' : '#6B5549',
                    textDecoration: 'none',
                    fontFamily: "'Manrope', sans-serif",
                  }}
                >
                  {link.label}
                </Link>
              )
            ))}

            {/* GitHub 链接 */}
            <a
              href="https://github.com/xingke2023/clawmart"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                color: '#6B5549', fontSize: 13, fontWeight: 500,
                fontFamily: "'Manrope', sans-serif", padding: '4px 2px',
                textDecoration: 'none',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              GitHub
            </a>

            {isAuthenticated ? (
              <div ref={dropRef} style={{ position: 'relative' }}>
                <button
                  className="claw-nav-avatar-btn"
                  onClick={() => setOpen(v => !v)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'white',
                    color: '#2A1F19',
                    fontSize: 14,
                    fontWeight: 600,
                    padding: '6px 12px 6px 6px',
                    borderRadius: 8,
                    border: '1.5px solid rgba(42, 31, 25, 0.15)',
                    cursor: 'pointer',
                    fontFamily: "'Manrope', sans-serif",
                  }}
                >
                  <span style={{
                    width: 28, height: 28,
                    borderRadius: '50%',
                    background: user?.avatar_url ? 'transparent' : '#E65C46',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}>
                    {user?.avatar_url
                      ? <img src={user.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ color: 'white', fontSize: 13, fontWeight: 700 }}>{avatarLetter}</span>
                    }
                  </span>
                  <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</span>
                  <ChevronDown size={14} style={{ color: '#9e8074', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                </button>

                {open && (
                  <div className="claw-nav-dropdown">
                    <div className="claw-nav-drop-header">
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#2A1F19' }}>{user?.name}</div>
                      <div style={{ fontSize: 12, color: '#9e8074', marginTop: 2 }}>{user?.email}</div>
                    </div>
                    <Link href="/dashboard" className="claw-nav-drop-item" onClick={() => setOpen(false)}>
                      <LayoutDashboard size={15} style={{ color: '#6B5549' }} />
                      Dashboard
                    </Link>
                    <Link href="/dashboard?tab=purchases" className="claw-nav-drop-item" onClick={() => setOpen(false)}>
                      <ShoppingBag size={15} style={{ color: '#6B5549' }} />
                      我的购买
                    </Link>
                    <Link href="/dashboard?tab=settings" className="claw-nav-drop-item" onClick={() => setOpen(false)}>
                      <Settings size={15} style={{ color: '#6B5549' }} />
                      我的设置
                    </Link>
                    {!user?.is_seller && (
                      <>
                        <hr className="claw-nav-drop-divider" />
                        <Link href="/dashboard?tab=sell" className="claw-nav-drop-item" onClick={() => setOpen(false)}>
                          <Store size={15} style={{ color: '#E65C46' }} />
                          <span style={{ color: '#E65C46' }}>Start Selling</span>
                        </Link>
                      </>
                    )}
                    <hr className="claw-nav-drop-divider" />
                    <button className="claw-nav-drop-item danger" onClick={() => { setOpen(false); logout(); }}>
                      <LogOut size={15} />
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: '#E65C46',
                color: 'white',
                fontSize: 14,
                fontWeight: 600,
                padding: '8px 18px',
                borderRadius: 8,
                textDecoration: 'none',
                fontFamily: "'Manrope', sans-serif",
              }}>
                登录 / 注册
              </Link>
            )}
          </div>

          {/* Hamburger (mobile only) */}
          <button className="claw-nav-hamburger" onClick={() => setMobileOpen(v => !v)} aria-label="菜单">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`claw-mobile-menu${mobileOpen ? ' open' : ''}`}>
        <form onSubmit={handleNavSearch} className="claw-mobile-search">
          <Search size={15} style={{ color: '#9e8074', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="搜索技能..."
            value={navSearch}
            onChange={e => setNavSearch(e.target.value)}
          />
        </form>
        {NAV_LINKS.map(link => (
          link.accent ? (
            <Link key={link.href} href={link.href} className="claw-mobile-nav-link" onClick={() => setMobileOpen(false)}
              style={{ color: '#E65C46' }}>
              {link.label}
            </Link>
          ) : (
            <Link key={link.href} href={link.href} className="claw-mobile-nav-link" onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          )
        ))}
        <div style={{ marginTop: 12, borderTop: '1px solid rgba(42,31,25,0.08)', paddingTop: 12 }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Link href="/dashboard" className="claw-mobile-nav-link" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <Link href="/dashboard?tab=purchases" className="claw-mobile-nav-link" onClick={() => setMobileOpen(false)}>我的购买</Link>
              <Link href="/dashboard?tab=settings" className="claw-mobile-nav-link" onClick={() => setMobileOpen(false)}>我的设置</Link>
              <button
                onClick={() => { setMobileOpen(false); logout(); }}
                style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px 4px', fontSize: 16, fontWeight: 600, color: '#bf3f30', fontFamily: "'Manrope', sans-serif", cursor: 'pointer' }}
              >
                退出登录
              </button>
            </div>
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)} style={{
              display: 'block', textAlign: 'center',
              background: '#E65C46', color: 'white',
              padding: '12px 24px', borderRadius: 8,
              fontWeight: 600, fontSize: 15, textDecoration: 'none',
              fontFamily: "'Manrope', sans-serif",
            }}>
              登录 / 注册
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export function ClawFooter() {
  return (
    <>
    <footer style={{
      borderTop: '1px solid rgba(42, 31, 25, 0.1)',
      marginTop: 64,
      background: '#F0E8E1',
      fontFamily: "'Manrope', sans-serif",
    }}>
      <style>{`
        .claw-footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 40px;
        }
        .claw-footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          border-top: 1px solid rgba(42,31,25,0.1);
          font-size: 13px;
          color: #9e8074;
          font-weight: 500;
        }
        @media (max-width: 768px) {
          .claw-footer-grid { grid-template-columns: 1fr 1fr; gap: 28px; }
          .claw-footer-bottom { flex-direction: column; gap: 12px; text-align: center; }
        }
        @media (max-width: 480px) {
          .claw-footer-grid { grid-template-columns: 1fr; gap: 20px; }
        }
      `}</style>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px 28px' }}>
        <div className="claw-footer-grid">
          <div>
            <div style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 18,
              fontWeight: 700,
              color: '#2A1F19',
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <img src="/logo.png" alt="OpenClaw" style={{ width: 32, height: 32, objectFit: 'contain' }} />
              CLAW MART
            </div>
            <p style={{ fontSize: 14, color: '#6B5549', lineHeight: 1.65, margin: 0 }}>
              您的专业 AI 智能体和机器人资产分发市场。通过专家调优的角色和技能，帮助您自动化并扩展业务。
            </p>
          </div>
          {[
            { title: '平台', links: [{ label: '浏览智能体', href: '/' }, { label: '定制众包', href: '/sourcing' }, { label: '技术博客', href: '/blog' }] },
            { title: '关于', links: [{ label: '关于我们', href: '/company' }, { label: '创作者计划', href: '#' }, { label: '帮助中心', href: '/help' }] },
            { title: '法律', links: [{ label: '使用条款', href: '/terms' }, { label: '隐私政策', href: '/privacy' }] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9e8074', marginBottom: 16 }}>
                {col.title}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href} style={{ fontSize: 14, color: '#6B5549', textDecoration: 'none', fontWeight: 500 }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="claw-footer-bottom">
          <span>© 2026 CLAW MART · An OpenClaw Project</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Twitter', 'Discord', 'GitHub'].map(s => (
              <a key={s} href="#" style={{ color: '#9e8074', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}

export const clawStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Manrope:wght@400;500;600;700&display=swap');

  .claw-page {
    font-family: 'Manrope', 'Bricolage Grotesque', sans-serif;
    background-color: #F8F2ED;
    color: #2A1F19;
    min-height: 100vh;
  }
  .claw-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  .claw-section {
    padding: 56px 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .claw-section-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: #2A1F19;
    margin: 0 0 6px;
    letter-spacing: -0.01em;
  }
  .claw-section-sub {
    font-size: 14px;
    color: #6B5549;
    font-style: italic;
    margin: 0 0 28px;
  }
  .claw-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(230, 92, 70, 0.12);
    color: #bf3f30;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    padding: 4px 12px;
    border-radius: 100px;
    margin-bottom: 20px;
  }
  .claw-h1 {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 48px;
    font-weight: 800;
    line-height: 1.1;
    color: #2A1F19;
    letter-spacing: -0.02em;
    margin: 0 0 20px;
  }
  .claw-h2 {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 32px;
    font-weight: 700;
    color: #2A1F19;
    letter-spacing: -0.015em;
    margin: 0 0 12px;
  }
  .claw-lead {
    font-size: 17px;
    color: #6B5549;
    line-height: 1.65;
    margin: 0 0 28px;
  }
  .claw-body {
    font-size: 15px;
    color: #6B5549;
    line-height: 1.7;
    margin: 0 0 16px;
  }
  .claw-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #E65C46;
    color: white;
    font-size: 14px;
    font-weight: 600;
    padding: 10px 22px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    font-family: 'Manrope', sans-serif;
    transition: background 0.15s, transform 0.1s;
  }
  .claw-btn-primary:hover { background: #d14f3a; transform: translateY(-1px); }
  .claw-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: white;
    color: #2A1F19;
    font-size: 14px;
    font-weight: 600;
    padding: 10px 22px;
    border-radius: 8px;
    border: 1.5px solid rgba(42, 31, 25, 0.15);
    cursor: pointer;
    text-decoration: none;
    font-family: 'Manrope', sans-serif;
    transition: border-color 0.15s, transform 0.1s;
  }
  .claw-btn-ghost:hover { border-color: rgba(42, 31, 25, 0.35); transform: translateY(-1px); }
  .claw-card {
    background: white;
    border-radius: 14px;
    border: 1px solid rgba(42, 31, 25, 0.07);
    box-shadow: 0 2px 8px rgba(42, 31, 25, 0.05);
    padding: 24px;
  }
  .claw-card-hover {
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .claw-card-hover:hover {
    box-shadow: 0 8px 28px rgba(42, 31, 25, 0.12);
    transform: translateY(-2px);
  }
  .claw-divider {
    border: none;
    border-top: 1px solid rgba(42, 31, 25, 0.1);
    margin: 0;
  }
  .claw-muted-section {
    background: rgba(240, 232, 225, 0.5);
  }
  .claw-accent { color: #E65C46; }
  .claw-step-num {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #E65C46;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
    flex-shrink: 0;
  }
  .claw-input {
    width: 100%;
    padding: 10px 14px;
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    color: #2A1F19;
    background: #F8F2ED;
    border: 1.5px solid rgba(42, 31, 25, 0.15);
    border-radius: 8px;
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }
  .claw-input:focus {
    border-color: #E65C46;
    background: white;
  }
  .claw-input::placeholder { color: #9e8074; }
  .claw-textarea {
    width: 100%;
    padding: 10px 14px;
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    color: #2A1F19;
    background: #F8F2ED;
    border: 1.5px solid rgba(42, 31, 25, 0.15);
    border-radius: 8px;
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
    resize: vertical;
  }
  .claw-textarea:focus {
    border-color: #E65C46;
    background: white;
  }
  .claw-form-label {
    font-size: 13px;
    font-weight: 600;
    color: #2A1F19;
    display: block;
    margin-bottom: 6px;
  }
  .claw-chip {
    display: inline-flex;
    align-items: center;
    padding: 5px 14px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 600;
    border: 1.5px solid rgba(42, 31, 25, 0.15);
    background: white;
    color: #6B5549;
    cursor: pointer;
    font-family: 'Manrope', sans-serif;
    transition: all 0.15s;
  }
  .claw-chip.active {
    background: #2A1F19;
    color: white;
    border-color: #2A1F19;
  }
  .claw-chip:hover:not(.active) {
    border-color: #E65C46;
    color: #E65C46;
  }
  .claw-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }
  .claw-table th {
    text-align: left;
    padding: 12px 16px;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #9e8074;
    border-bottom: 1.5px solid rgba(42, 31, 25, 0.1);
    background: rgba(240, 232, 225, 0.4);
  }
  .claw-table td {
    padding: 12px 16px;
    border-bottom: 1px solid rgba(42, 31, 25, 0.07);
    color: #2A1F19;
    vertical-align: top;
  }
  .claw-table tr:last-child td { border-bottom: none; }
  .claw-accordion {
    border: 1px solid rgba(42, 31, 25, 0.1);
    border-radius: 12px;
    overflow: hidden;
    background: white;
  }
  .claw-accordion-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #2A1F19;
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background 0.15s;
  }
  .claw-accordion-btn:hover { background: rgba(240, 232, 225, 0.5); }
  .claw-accordion-body {
    padding: 0 20px 16px;
    font-size: 14px;
    color: #6B5549;
    line-height: 1.7;
    border-top: 1px solid rgba(42, 31, 25, 0.07);
    padding-top: 14px;
  }
  .claw-highlight-box {
    background: rgba(230, 92, 70, 0.06);
    border-left: 3px solid #E65C46;
    border-radius: 0 10px 10px 0;
    padding: 16px 20px;
  }
  .claw-skeleton {
    background: linear-gradient(90deg, rgba(42,31,25,0.06) 25%, rgba(42,31,25,0.10) 50%, rgba(42,31,25,0.06) 75%);
    background-size: 200% 100%;
    animation: claw-shimmer 1.5s infinite;
    border-radius: 8px;
  }
  @keyframes claw-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* Global responsive */
  @media (max-width: 768px) {
    .claw-h1 { font-size: 32px; }
    .claw-h2 { font-size: 24px; }
    .claw-lead { font-size: 15px; }
    .claw-section { padding: 40px 16px; }
    .claw-section-title { font-size: 22px; }
  }
  @media (max-width: 480px) {
    .claw-h1 { font-size: 26px; }
    .claw-h2 { font-size: 20px; }
    .claw-section { padding: 32px 16px; }
  }
`;
