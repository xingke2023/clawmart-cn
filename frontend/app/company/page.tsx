'use client';

import Link from "next/link";
import { ClawNav, ClawFooter, clawStyles } from "@/components/claw-layout";

export default function CompanyPage() {
  return (
    <>
      <style>{clawStyles + `
        .company-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 32px;
        }
        .company-three {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 32px;
        }
        @media (max-width: 640px) {
          .company-grid { grid-template-columns: 1fr; }
          .company-three { grid-template-columns: 1fr; gap: 16px; }
        }
      `}</style>
      <div className="claw-page">
        <ClawNav />

        <main>
          {/* Hero */}
          <section style={{ padding: '72px 24px 56px', maxWidth: 1200, margin: '0 auto' }}>
            <div className="claw-label">公司介绍</div>
            <h1 className="claw-h1">
              关于 <span className="claw-accent">我们</span>
            </h1>
            <p className="claw-lead">
              HONGKONG MACRODATA TECHNOLOGY LIMITED 是一家专注于 AI 自动化技术与智能工作流交付的科技公司，致力于帮助企业和个人用最低的成本获得最强的 AI 员工能力。
            </p>
          </section>

          <hr className="claw-divider" />

          {/* Mission */}
          <section style={{ padding: '56px 24px', maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <div className="claw-label">我们的使命</div>
                <h2 className="claw-h2">让每家企业都能用上<span className="claw-accent">专业 AI 员工</span></h2>
                <p className="claw-body">
                  大多数企业想要 AI 自动化，却苦于没有工程团队来配置和维护。我们相信，AI 员工不应该是大公司的专利——它应该像雇一名员工一样简单：选好、付款、上岗。
                </p>
                <p className="claw-body">
                  通过 Claw Mart，我们将经过真实业务验证的 AI 员工打包成可即时交付的产品，让任何人都能在几分钟内完成部署，用手机就能开始管理自己的 AI 团队。
                </p>
              </div>
              <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { num: '79+', label: '上架 AI 员工', desc: '覆盖销售、运营、客服、内容等核心场景' },
                  { num: '100%', label: '交付即可用', desc: '每个 AI 员工均经过真实业务场景测试验证' },
                  { num: '手机', label: '操控管理', desc: '交付完成后，您只需用手机即可管理您的 AI 员工' },
                ].map((item, i) => (
                  <div key={i} className="claw-card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '18px 20px' }}>
                    <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 26, fontWeight: 800, color: '#E65C46', flexShrink: 0, lineHeight: 1 }}>{item.num}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#2A1F19', marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontSize: 13, color: '#6B5549', lineHeight: 1.55 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <hr className="claw-divider" />

          {/* What we do */}
          <section style={{ padding: '56px 24px', maxWidth: 1200, margin: '0 auto' }}>
            <div className="claw-label">我们做什么</div>
            <h2 className="claw-h2">AI 员工交付平台</h2>
            <p className="claw-body" style={{ marginBottom: 0 }}>
              我们不只是一个市场——我们是一个端到端的 AI 员工交付体系。从选品、部署、到操控管理，全流程为您设计。
            </p>
            <div className="company-grid">
              {[
                {
                  emoji: '🤖',
                  title: 'OpenClaw AI 员工',
                  desc: '每一位 AI 员工都经过专业配置，拥有完整的操作手册、工具设置和分步部署指南。购买后即可上岗，无需工程背景。',
                },
                {
                  emoji: '📱',
                  title: '手机即可操控',
                  desc: '我们完成交付后，您只需用手机发送指令，AI 员工即可开始工作。真正实现随时随地管理您的 AI 团队。',
                },
                {
                  emoji: '⚡',
                  title: '即时交付',
                  desc: '支付完成后立即获得访问权限与部署文件，无需等待，无需排队。购买即用。',
                },
                {
                  emoji: '🛡️',
                  title: '测试验证',
                  desc: '所有 AI 员工均在真实业务环境中经过验证，确保在生产场景中能够稳定、有效地运行。',
                },
              ].map((item, i) => (
                <div key={i} className="claw-card claw-card-hover" style={{ padding: '24px' }}>
                  <div style={{ fontSize: 32, marginBottom: 14 }}>{item.emoji}</div>
                  <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, fontWeight: 700, color: '#2A1F19', marginBottom: 8 }}>{item.title}</div>
                  <div style={{ fontSize: 14, color: '#6B5549', lineHeight: 1.65 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <hr className="claw-divider" />

          {/* Values */}
          <section style={{ padding: '56px 24px', maxWidth: 1200, margin: '0 auto' }}>
            <div className="claw-label">我们的价值观</div>
            <h2 className="claw-h2">我们相信的事</h2>
            <div className="company-three">
              {[
                { icon: '🎯', title: '结果导向', desc: 'AI 员工的价值在于能否完成真实工作。我们只上架经过实战检验、真正好用的产品。' },
                { icon: '🔓', title: '降低门槛', desc: 'AI 自动化不应该需要工程师团队。我们让零技术背景的人也能用上专业级 AI 员工。' },
                { icon: '🤝', title: '诚信透明', desc: '我们清楚地说明每位 AI 员工能做什么、不能做什么，帮助用户做出正确的选择。' },
              ].map((item, i) => (
                <div key={i} className="claw-card" style={{ textAlign: 'center', padding: '28px 20px' }}>
                  <div style={{ fontSize: 36, marginBottom: 14 }}>{item.icon}</div>
                  <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 700, color: '#2A1F19', marginBottom: 8 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: '#6B5549', lineHeight: 1.65 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <hr className="claw-divider" />

          {/* Company info */}
          <section style={{ padding: '56px 24px', maxWidth: 1200, margin: '0 auto' }}>
            <div className="claw-label">公司信息</div>
            <h2 className="claw-h2">联系我们</h2>
            <div className="company-grid">
              <div className="claw-card" style={{ padding: '28px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9e8074', marginBottom: 16 }}>注册公司</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#2A1F19', marginBottom: 8, fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  HONGKONG MACRODATA TECHNOLOGY LIMITED
                </div>
                <div style={{ fontSize: 14, color: '#6B5549', lineHeight: 1.65 }}>
                  香港特别行政区注册科技企业<br />
                  专注 AI 自动化技术与智能工作流交付
                </div>
              </div>
              <div className="claw-card" style={{ padding: '28px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9e8074', marginBottom: 16 }}>联系方式</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#9e8074', fontWeight: 600, marginBottom: 2 }}>商务 / 合作</div>
                    <a href="mailto:xiaomi@xingke888.com" style={{ fontSize: 15, color: '#E65C46', fontWeight: 600, textDecoration: 'none' }}>xiaomi@xingke888.com</a>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#9e8074', fontWeight: 600, marginBottom: 2 }}>平台网站</div>
                    <a href="https://www.clawmart.cn" style={{ fontSize: 15, color: '#E65C46', fontWeight: 600, textDecoration: 'none' }}>www.clawmart.cn</a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section style={{ padding: '56px 24px 72px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
            <div className="claw-highlight-box" style={{ textAlign: 'left', marginBottom: 32 }}>
              <p style={{ fontSize: 15, color: '#6B5549', lineHeight: 1.7, margin: 0 }}>
                我们相信，每家企业都值得拥有一支高效的 AI 员工团队。无论您是初创公司还是成熟企业，Claw Mart 都能帮您找到合适的 AI 员工，立即开始工作。
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/" className="claw-btn-primary" style={{ padding: '12px 28px', fontSize: 15 }}>浏览 AI 员工</Link>
              <a href="https://work.weixin.qq.com/kfid/kfcdfdb02ed73c8e4d0" target="_blank" rel="noopener noreferrer" className="claw-btn-ghost" style={{ padding: '12px 28px', fontSize: 15 }}>联系我们</a>
            </div>
          </section>
        </main>

        <ClawFooter />
      </div>
    </>
  );
}
