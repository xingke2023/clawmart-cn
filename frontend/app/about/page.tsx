'use client';

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ClawNav, ClawFooter, clawStyles } from "@/components/claw-layout";

export default function AboutPage() {
  return (
    <>
      <style>{clawStyles + `
        .about-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 32px; }
        .about-three-col { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin: 32px 0; }
        @media (max-width: 640px) {
          .about-two-col { grid-template-columns: 1fr; }
          .about-three-col { grid-template-columns: 1fr; gap: 16px; }
        }
      `}</style>
      <div className="claw-page">
        <ClawNav />

        <main>
          {/* Hero */}
          <section style={{ padding: '72px 24px 56px', maxWidth: 1200, margin: '0 auto' }}>
            <div className="claw-label">关于 CLAW MART</div>
            <h1 className="claw-h1">OpenClaw<br /><span className="claw-accent">机器人员工交付中心</span></h1>
            <p className="claw-lead">
              大多数人把 AI 助手配置好之后就再也不碰了。结果是：千篇一律的回答、没有记忆、与工作流毫无整合。AI 能做到的事，和大多数人实际让它做到的事，之间存在巨大鸿沟。
            </p>
            <p className="claw-body">
              Claw Mart 正是为了填平这道鸿沟而生。我们是一个由每天在生产环境中运行 AI 助手的人所创建的、预构建人设与技能的市场。购买一个配置，几分钟内完成安装，你的 AI 就会像他们的一样工作。
            </p>
          </section>

          <hr className="claw-divider" />

          {/* For creators */}
          <section style={{ padding: '56px 24px', maxWidth: 1200, margin: '0 auto' }}>
            <h2 className="claw-h2">面向创作者</h2>
            <p className="claw-body">
              如果你构建了一套真正有效的 AI 工作流——一个处理邮件的人设、一个自动化部署的技能、一个实际能规模化的记忆系统——你可以把它打包，在 Claw Mart 上出售。
            </p>
            <div className="about-three-col">
              {[
                { stat: '90%', desc: '收益归你所有，扣除支付处理费' },
                { stat: 'API 优先', desc: '从终端发布，或让你的 AI 来做' },
                { stat: '即时上架', desc: '商品立即上线，无需审核排队' },
              ].map((item, i) => (
                <div key={i} className="claw-card" style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 28, fontWeight: 800, color: '#E65C46', marginBottom: 8 }}>{item.stat}</div>
                  <div style={{ fontSize: 13, color: '#6B5549' }}>{item.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href="#" className="claw-btn-primary">开始销售 →</a>
              <a href="#" className="claw-btn-ghost">创作者条款</a>
            </div>
          </section>

          <hr className="claw-divider" />

          {/* Two product types */}
          <section style={{ padding: '56px 24px', maxWidth: 1200, margin: '0 auto' }}>
            <h2 className="claw-h2">两种产品类型</h2>
            <div className="about-two-col">
              {[
                {
                  emoji: '🧑‍💼',
                  title: '人设（Personas）',
                  desc: '完整的 AI 助手配置——个性、记忆系统、决策框架和工具设置。就像雇用了一位专家，而他从第一天起就清楚地知道该怎么工作。',
                  note: '包含：SOUL.md、MEMORY.md、工具配置、安装指南',
                },
                {
                  emoji: '⚡',
                  title: '技能（Skills）',
                  desc: '即插即用的能力扩展包，让你现有的 AI 掌握新技能。记忆管理、邮件安全、社交媒体自动化、代码监控——安装一个文件，你的助手就获得了一项新超能力。',
                  note: '包含：带说明的 SKILL.md、脚本及参考配置',
                },
              ].map((item, i) => (
                <div key={i} className="claw-card">
                  <div style={{ fontSize: 36, marginBottom: 16 }}>{item.emoji}</div>
                  <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 700, color: '#2A1F19', margin: '0 0 10px' }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: '#6B5549', lineHeight: 1.65, marginBottom: 16 }}>{item.desc}</p>
                  <p style={{ fontSize: 12, color: '#9e8074', borderTop: '1px solid rgba(42,31,25,0.08)', paddingTop: 14, margin: 0 }}>{item.note}</p>
                </div>
              ))}
            </div>
          </section>

          <hr className="claw-divider" />

          {/* How it works */}
          <section style={{ padding: '56px 24px', maxWidth: 1200, margin: '0 auto' }} className="claw-muted-section">
            <h2 className="claw-h2">使用流程</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginTop: 32 }}>
              {[
                { num: '1', title: '浏览并购买', desc: '找到与你工作流匹配的人设或技能。按分类筛选，按使用场景搜索。每个商品页清楚展示你会得到什么——能力、所需工具，以及包含的内容。' },
                { num: '2', title: '下载并安装', desc: '购买后下载安装包，将文件放入你的 OpenClaw 工作区。每个包都附带分步安装指南。大多数安装只需五分钟以内。' },
                { num: '3', title: '开始交付真实工作', desc: '你的 AI 已配置完毕，随时可用。立即开始委派任务。当创作者推送更新时，你会自动获得。' },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 16 }}>
                  <div className="claw-step-num">{step.num}</div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: 16, color: '#2A1F19', margin: '0 0 6px' }}>{step.title}</h3>
                    <p style={{ fontSize: 14, color: '#6B5549', lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="claw-divider" />

          {/* Why this exists */}
          <section style={{ padding: '56px 24px', maxWidth: 1200, margin: '0 auto' }} className="claw-muted-section">
            <h2 className="claw-h2">为什么我们存在</h2>
            <p className="claw-body">
              AI 助手的好坏，完全取决于它的配置。一个泛泛而谈的聊天机器人和一个真正的效率倍增器之间的差距，在于搭建它所投入的提示词工程、记忆架构、工具集成和工作流设计。
            </p>
            <p className="claw-body">
              这项工作需要数周的反复迭代。大多数人没有时间，也没有专业知识。但那些已经做到的人——那些运营着能管理邮件、编写代码、处理营销的 AI 助手的人——他们已经解决了这些难题。
            </p>
            <div className="claw-highlight-box">
              <p style={{ fontSize: 16, fontWeight: 700, color: '#2A1F19', margin: 0 }}>
                Claw Mart 让这些操盘手把他们构建的东西打包，分享给所有人。你几分钟内就能获得一套经过生产验证的配置。
              </p>
            </div>
          </section>
        </main>

        <ClawFooter />
      </div>
    </>
  );
}
