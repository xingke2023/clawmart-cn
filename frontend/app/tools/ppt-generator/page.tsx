'use client';
import { ClawNav, ClawFooter, clawStyles } from "@/components/claw-layout";

const FEATURES = [
  { icon: "💬", title: "对话驱动，无需模板", desc: "用自然语言描述你的主题、受众和目标，AI 自动规划章节结构，无需从空白模板开始。" },
  { icon: "🔄", title: "实时修改，所见即所得", desc: "对任意页面说「把第三页改成数据图表」「标题字体加大」，AI 立即响应，无需手动拖拽。" },
  { icon: "🎨", title: "风格一键统一", desc: "输入品牌色、字体偏好，全文风格自动统一，告别页面之间设计不一致的问题。" },
  { icon: "📊", title: "数据自动可视化", desc: "粘贴表格或数字，AI 自动判断最合适的图表类型并生成，支持柱状图、折线图、饼图等。" },
  { icon: "📝", title: "内容智能精简", desc: "上传文档或粘贴长文，AI 自动提炼关键信息填充幻灯片，每页控制在最佳信息密度。" },
  { icon: "📤", title: "导出即用", desc: "支持导出为标准 .pptx 格式，在 PowerPoint 或 Keynote 中可直接编辑，不锁定平台。" },
];

const STEPS = [
  { num: "01", title: "描述你的主题", desc: "告诉 AI：这个 PPT 是干什么的、给谁看、大概需要几页。" },
  { num: "02", title: "确认大纲结构", desc: "AI 生成章节大纲，你可以直接确认或用对话调整，确保结构符合预期。" },
  { num: "03", title: "对话填充内容", desc: "逐页对话补充内容，或上传已有资料让 AI 自动填充，随时可以修改任意细节。" },
  { num: "04", title: "导出完稿", desc: "满意后一键导出 .pptx，保留所有排版与样式，直接用于演示。" },
];

export default function PptGeneratorPage() {
  return (
    <>
      <style>{clawStyles + pageStyles}</style>
      <div className="claw-page">
        <ClawNav />

        {/* ── Hero ── */}
        <section className="pp-hero">
          <div className="pp-hero-eyebrow">
            <span className="pp-tag">保险人AI工具系列</span>
            <span className="pp-tag">即将上线</span>
          </div>
          <h1 className="claw-h1 pp-h1">
            用对话，<span className="claw-accent">生成 PPT</span>
          </h1>
          <p className="claw-lead pp-lead">
            不再对着空白幻灯片发呆。告诉 AI 你想讲什么，它帮你想结构、写内容、统一风格——
            整个过程像和同事聊天一样自然。
          </p>
          <div className="pp-hero-btns">
            <a href="https://demo1.xingke888.com/presentation" target="_blank" rel="noopener noreferrer" className="claw-btn-primary pp-btn">点击体验</a>
            <a href="#features" className="claw-btn-ghost pp-btn">了解功能</a>
          </div>
          {/* Visual placeholder */}
          <div className="pp-preview">
            <div className="pp-preview-chrome">
              <div className="pp-chrome-dots">
                <span style={{ background: "#FF5F56" }} />
                <span style={{ background: "#FFBD2E" }} />
                <span style={{ background: "#27C93F" }} />
              </div>
              <div className="pp-chrome-title">PPT AI 助手</div>
            </div>
            <div className="pp-preview-body">
              <div className="pp-chat-side">
                <div className="pp-bubble user">帮我做一个季度汇报 PPT，给管理层看，大概 10 页左右</div>
                <div className="pp-bubble ai">✅ 已生成大纲（共 10 页）<br /><br />① 封面 — 季度业绩总览<br />② 核心数据亮点（3 个指标）<br />③ 业务进展与里程碑<br />④ 问题与挑战分析<br />⑤ Q3 行动计划<br />…<br /><br />确认大纲，还是要调整？</div>
                <div className="pp-bubble user">第 4 页改成「竞争格局分析」</div>
                <div className="pp-bubble ai">✅ 已更新：第 4 页 → 竞争格局分析<br />已自动生成竞品对比表格框架，需要我填入具体内容吗？</div>
              </div>
              <div className="pp-slide-side">
                <div className="pp-slide">
                  <div className="pp-slide-title">Q2 业绩总览</div>
                  <div className="pp-slide-bars">
                    {[65, 80, 55, 90].map((h, i) => (
                      <div key={i} className="pp-bar-wrap">
                        <div className="pp-bar" style={{ height: h * 0.6 + 'px' }} />
                        <div className="pp-bar-label">{['Q4', 'Q1', 'Q2', 'Q3'][i]}</div>
                      </div>
                    ))}
                  </div>
                  <div className="pp-slide-badge">AI 自动生成图表</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="claw-divider" />

        {/* ── Features ── */}
        <section id="features" className="pp-sec">
          <div className="pp-sec-hd">
            <div className="claw-label">核心功能</div>
            <h2 className="claw-h2" style={{ marginTop: 12 }}>你说需求，AI 搞定细节</h2>
          </div>
          <div className="pp-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="claw-card claw-card-hover" style={{ padding: "26px 24px" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#2A1F19", marginBottom: 7, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{f.title}</div>
                <p className="claw-body" style={{ margin: 0, lineHeight: 1.7, fontSize: 14 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="claw-divider" />

        {/* ── How it works ── */}
        <section className="pp-sec-muted">
          <div className="pp-sec-inner">
            <div className="pp-sec-hd">
              <div className="claw-label">使用流程</div>
              <h2 className="claw-h2" style={{ marginTop: 12 }}>四步，从零到完稿</h2>
            </div>
            <div className="pp-steps">
              {STEPS.map((s, i) => (
                <div key={s.num} className="pp-step">
                  <div className="pp-step-num">{s.num}</div>
                  {i < STEPS.length - 1 && <div className="pp-step-line" />}
                  <div className="pp-step-content">
                    <div className="pp-step-title">{s.title}</div>
                    <p className="claw-body" style={{ margin: 0, lineHeight: 1.7, fontSize: 14 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="claw-divider" />

        {/* ── Use cases ── */}
        <section className="pp-sec">
          <div className="pp-sec-hd">
            <div className="claw-label">适用场景</div>
            <h2 className="claw-h2" style={{ marginTop: 12 }}>哪些人最需要这个工具？</h2>
          </div>
          <div className="pp-cases">
            {[
              { emoji: "📈", title: "职场汇报", desc: "周报、月报、季度复盘、年终总结，快速整理数据并生成管理层风格的幻灯片。" },
              { emoji: "🎓", title: "教育培训", desc: "课程讲义、培训材料、学术演讲，把文档内容自动转化为清晰的教学幻灯片。" },
              { emoji: "🤝", title: "商务提案", desc: "项目方案、客户提案、融资路演，用专业排版快速呈现核心价值主张。" },
              { emoji: "🚀", title: "产品介绍", desc: "新产品发布、功能演示、用户故事，把产品亮点用可视化方式讲清楚。" },
            ].map(c => (
              <div key={c.title} className="claw-card claw-card-hover pp-case-card">
                <div style={{ fontSize: 32, marginBottom: 12 }}>{c.emoji}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#2A1F19", marginBottom: 8, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{c.title}</div>
                <p className="claw-body" style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="claw-divider" />

        {/* ── CTA ── */}
        <section className="pp-cta">
          <div style={{ maxWidth: 580, margin: "0 auto" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🎯</div>
            <h2 className="claw-h2" style={{ marginBottom: 14 }}>
              早鸟内测，<span className="claw-accent">免费使用</span>
            </h2>
            <p className="claw-lead" style={{ marginBottom: 32, fontSize: 16 }}>
              产品即将上线，内测名额有限。留下联系方式，第一时间获得体验资格。
            </p>
            <div className="pp-cta-btns">
              <a href="https://demo1.xingke888.com/presentation" target="_blank" rel="noopener noreferrer" className="claw-btn-primary" style={{ padding: "14px 36px", fontSize: 15 }}>点击体验</a>
              <a href="/tools/insurance-planner" className="claw-btn-ghost" style={{ padding: "14px 36px", fontSize: 15 }}>查看保险 AI 助手 →</a>
            </div>
          </div>
        </section>

        <ClawFooter />
      </div>
    </>
  );
}

const pageStyles = `
  /* Hero */
  .pp-hero { padding: 80px 24px 56px; max-width: 1200px; margin: 0 auto; text-align: center; }
  .pp-hero-eyebrow { display: flex; gap: 8px; justify-content: center; margin-bottom: 20px; }
  .pp-tag {
    font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 999px;
    background: rgba(230,92,70,0.1); color: #E65C46;
    border: 1px solid rgba(230,92,70,0.2);
  }
  .pp-h1 { margin: 0 auto 20px; max-width: 700px; }
  .pp-lead { max-width: 600px; margin: 0 auto 32px; line-height: 1.8; }
  .pp-hero-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 52px; }
  .pp-btn { padding: 13px 30px !important; font-size: 15px !important; }

  /* Preview window */
  .pp-preview {
    max-width: 860px; margin: 0 auto;
    background: #fff; border-radius: 16px;
    border: 1px solid rgba(42,31,25,0.08);
    box-shadow: 0 8px 48px rgba(42,31,25,0.10);
    overflow: hidden;
  }
  .pp-preview-chrome {
    background: #F0E8E1; padding: 10px 18px;
    border-bottom: 1px solid rgba(42,31,25,0.07);
    display: flex; align-items: center; gap: 12px;
  }
  .pp-chrome-dots { display: flex; gap: 6px; }
  .pp-chrome-dots span { width: 11px; height: 11px; border-radius: 50%; display: block; }
  .pp-chrome-title { font-size: 12.5px; font-weight: 600; color: #9e8074; flex: 1; text-align: center; }
  .pp-preview-body { display: grid; grid-template-columns: 1fr 1fr; min-height: 300px; }

  /* Chat side */
  .pp-chat-side {
    padding: 20px 18px; border-right: 1px solid rgba(42,31,25,0.07);
    display: flex; flex-direction: column; gap: 10px; background: #F8F2ED;
  }
  .pp-bubble {
    padding: 10px 13px; border-radius: 14px;
    font-size: 12.5px; line-height: 1.6; font-family: 'Manrope', sans-serif;
  }
  .pp-bubble.user {
    background: #E65C46; color: #fff;
    border-bottom-right-radius: 3px; align-self: flex-end; max-width: 85%;
  }
  .pp-bubble.ai {
    background: #fff; color: #2A1F19;
    border-bottom-left-radius: 3px; align-self: flex-start; max-width: 92%;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }

  /* Slide side */
  .pp-slide-side {
    padding: 20px 18px; display: flex; align-items: center; justify-content: center;
    background: #fff;
  }
  .pp-slide {
    width: 100%; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border-radius: 10px; padding: 20px 18px; position: relative; overflow: hidden;
  }
  .pp-slide::before {
    content: ''; position: absolute; top: -20px; right: -20px;
    width: 80px; height: 80px; background: rgba(230,92,70,0.15); border-radius: 50%;
  }
  .pp-slide-title { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 16px; font-family: 'Bricolage Grotesque', sans-serif; }
  .pp-slide-bars { display: flex; gap: 8px; align-items: flex-end; height: 60px; margin-bottom: 10px; }
  .pp-bar-wrap { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; }
  .pp-bar { width: 100%; background: linear-gradient(to top, #E65C46, #ff8a75); border-radius: 3px 3px 0 0; transition: height 0.3s; }
  .pp-bar-label { font-size: 10px; color: rgba(255,255,255,0.5); font-family: 'Manrope', sans-serif; }
  .pp-slide-badge {
    font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.5);
    text-align: right; font-family: 'Manrope', sans-serif;
  }

  /* Sections */
  .pp-sec { padding: 64px 20px; max-width: 1200px; margin: 0 auto; }
  .pp-sec-muted { padding: 64px 20px; background: rgba(240,232,225,0.45); }
  .pp-sec-inner { max-width: 1200px; margin: 0 auto; }
  .pp-sec-hd { text-align: center; margin-bottom: 40px; }
  .pp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }

  /* Steps */
  .pp-steps { display: flex; flex-direction: column; gap: 0; max-width: 680px; margin: 0 auto; }
  .pp-step { display: flex; gap: 20px; align-items: flex-start; position: relative; padding-bottom: 28px; }
  .pp-step:last-child { padding-bottom: 0; }
  .pp-step-num {
    width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
    background: #E65C46; color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 14px; font-family: 'Bricolage Grotesque', sans-serif;
    position: relative; z-index: 1;
  }
  .pp-step-line {
    position: absolute; left: 21px; top: 44px; width: 2px;
    height: calc(100% - 44px); background: rgba(230,92,70,0.2);
  }
  .pp-step-content { padding-top: 10px; }
  .pp-step-title { font-size: 15px; font-weight: 700; color: #2A1F19; margin-bottom: 6px; font-family: 'Bricolage Grotesque', sans-serif; }

  /* Use cases */
  .pp-cases { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
  .pp-case-card { padding: 24px 20px; }

  /* CTA */
  .pp-cta { padding: 72px 24px; text-align: center; background: linear-gradient(135deg, rgba(230,92,70,0.08) 0%, rgba(240,232,225,0.6) 100%); }
  .pp-cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

  /* ── Mobile ── */
  @media (max-width: 640px) {
    .pp-hero { padding: 52px 16px 40px; }
    .pp-h1 { font-size: 32px !important; line-height: 1.2 !important; }
    .pp-lead { font-size: 14px; margin-bottom: 24px; }
    .pp-preview-body { grid-template-columns: 1fr; }
    .pp-slide-side { display: none; }
    .pp-chat-side { border-right: none; }
    .pp-sec { padding: 48px 16px; }
    .pp-sec-muted { padding: 48px 16px; }
    .pp-cta { padding: 56px 16px; }
    .pp-cta-btns a { width: 100%; text-align: center; }
    .pp-grid { grid-template-columns: 1fr; }
    .pp-cases { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 380px) {
    .pp-cases { grid-template-columns: 1fr; }
  }
`;
