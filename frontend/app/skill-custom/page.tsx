'use client';

import { useState, useRef, useEffect, useCallback } from "react";
import { ClawNav, ClawFooter, clawStyles } from "@/components/claw-layout";
import { Zap, ChevronDown, ChevronUp } from "lucide-react";

// ─── Demo messages ────────────────────────────────────────────────
const DEMO_CASES = [
  {
    label: "电商比价爬取",
    avatar: "🛒",
    bg: "#b6e3f4",
    messages: [
      { type: "user", text: "帮我爬取京东上 iPhone 16 Pro 256G 最近7天的价格变动" },
      { type: "ai",   text: "好的，正在登录京东并抓取商品历史价格……" },
      { type: "ai",   text: "✅ 完成！\n\n**京东 · iPhone 16 Pro 256G**\n最低价：¥8,499（3天前）\n当前价：¥8,799\n7日均价：¥8,632\n\n📉 建议：价格处于近期高位，可等待下跌后下单。已为您设置价格预警，低于 ¥8,550 时自动通知。" },
    ],
  },
  {
    label: "内网系统自动录入",
    avatar: "🏢",
    bg: "#c0aede",
    messages: [
      { type: "user", text: "把今天的销售报表数据录入到我们公司的 ERP 系统里" },
      { type: "ai",   text: "收到，正在登录公司内网 ERP，地址：erp.yourcompany.cn……" },
      { type: "ai",   text: "✅ 录入完成！\n\n共处理 **47 条** 销售记录：\n- 新增订单：32 条\n- 更新订单：15 条\n- 跳过重复：0 条\n\n已生成录入报告并发送至您的邮箱。" },
    ],
  },
  {
    label: "竞品监控预警",
    avatar: "📡",
    bg: "#d1d4f9",
    messages: [
      { type: "user", text: "每天早上9点监控竞争对手官网的产品更新和定价变化" },
      { type: "ai",   text: "✅ 已设置定时任务，每日 09:00 执行。\n\n**今日监控报告（刚刚完成）：**\n\n🔴 发现 2 处变动：\n1. A竞品 新增产品「专业版 Pro」定价 ¥299/月\n2. B竞品 将基础版从 ¥99 调整为 ¥129\n\n📊 详细对比表格已推送到您的飞书群。" },
    ],
  },
];

type DemoMsg = { type: string; text: string };

function PhoneDemo({ msgs, avatar, bg, name }: { msgs: DemoMsg[]; avatar: string; bg: string; name: string }) {
  const [visibleMsgs, setVisibleMsgs] = useState<number[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const msgsRef = useRef<HTMLDivElement>(null);

  const play = useCallback(() => {
    setVisibleMsgs([]);
    setShowTyping(false);
    timers.current.forEach(clearTimeout);
    timers.current = [];
    let delay = 300;
    msgs.forEach((msg, i) => {
      if (i > 0) {
        const t1 = setTimeout(() => setShowTyping(true), delay);
        timers.current.push(t1);
        delay += msg.type === 'ai' ? 1200 : 600;
      }
      const t2 = setTimeout(() => {
        setShowTyping(false);
        setVisibleMsgs(prev => [...prev, i]);
      }, delay);
      timers.current.push(t2);
      delay += msg.type === 'ai' ? 2000 : 900;
    });
  }, [msgs]);

  useEffect(() => { play(); return () => timers.current.forEach(clearTimeout); }, [play]);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [visibleMsgs, showTyping]);

  return (
    <div className="sc-phone">
      <div className="sc-phone-inner">
        {/* status bar */}
        <div style={{ background: '#000', padding: '10px 18px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: '-apple-system,sans-serif', letterSpacing: -0.3 }}>9:41</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="17" height="12" viewBox="0 0 17 12" fill="white"><rect x="0" y="7" width="3" height="5" rx="1"/><rect x="4.5" y="5" width="3" height="7" rx="1"/><rect x="9" y="2.5" width="3" height="9.5" rx="1"/><rect x="13.5" y="0" width="3" height="12" rx="1"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="white"><path d="M8 2.5C10.5 2.5 12.7 3.5 14.3 5.1L15.5 3.9C13.6 2 11 1 8 1S2.4 2 .5 3.9L1.7 5.1C3.3 3.5 5.5 2.5 8 2.5Z" opacity=".4"/><path d="M8 5C9.7 5 11.2 5.7 12.3 6.8L13.5 5.6C12.1 4.2 10.1 3.3 8 3.3S3.9 4.2 2.5 5.6L3.7 6.8C4.8 5.7 6.3 5 8 5Z" opacity=".7"/><circle cx="8" cy="10" r="1.5"/></svg>
            <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <div style={{ width: 22, height: 11, border: '1.5px solid rgba(255,255,255,0.7)', borderRadius: 2.5, padding: 1.5 }}>
                <div style={{ background: '#fff', borderRadius: 1, height: '100%', width: '75%' }} />
              </div>
              <div style={{ width: 2, height: 5, background: 'rgba(255,255,255,0.5)', borderRadius: '0 1px 1px 0' }} />
            </div>
          </div>
        </div>
        {/* dynamic island */}
        <div style={{ width: 100, height: 28, background: '#000', borderRadius: 20, margin: '0 auto 6px', flexShrink: 0 }} />
        {/* screen */}
        <div style={{ background: '#F8F2ED', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRadius: '0 0 34px 34px' }}>
          <div style={{ background: '#fff', padding: '10px 14px', borderBottom: '1px solid rgba(42,31,25,0.08)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
              {avatar}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#2A1F19', fontFamily: "'Manrope', sans-serif" }}>{name}</div>
              <div style={{ fontSize: 11, color: '#22c55e', fontFamily: "'Manrope', sans-serif", display: 'flex', alignItems: 'center', gap: 3 }}>
                <span style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%', display: 'inline-block' }} />
                运行中
              </div>
            </div>
          </div>
          <div ref={msgsRef} style={{ flex: 1, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', scrollBehavior: 'smooth' }}>
            {msgs.map((msg, i) => (
              visibleMsgs.includes(i) && (
                <div key={i} className={`sc-msg ${msg.type}`} style={{ whiteSpace: 'pre-line' }}>
                  {msg.text}
                </div>
              )
            ))}
            {showTyping && (
              <div className="sc-typing"><span /><span /><span /></div>
            )}
          </div>
          <div style={{ padding: '8px 12px 14px', flexShrink: 0 }}>
            <button onClick={play} style={{ width: '100%', background: 'rgba(230,92,70,0.1)', border: 'none', borderRadius: 8, padding: 8, fontSize: 12, fontWeight: 700, color: '#E65C46', cursor: 'pointer', fontFamily: "'Manrope', sans-serif" }}>
              ▶ 重播演示
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Cases ────────────────────────────────────────────────────────
const CASES = [
  {
    emoji: "🛍️",
    client: "跨境电商卖家",
    title: "多平台商品价格监控",
    desc: "定制了一个每小时自动爬取亚马逊、速卖通、1688 上指定关键词商品价格的技能，汇总成报表推送到钉钉群，帮助采购团队实时掌握市场行情。",
    tag: "网页爬取",
    result: "节省 3 人/天的手工比价工时",
  },
  {
    emoji: "🏗️",
    client: "工程项目公司",
    title: "OA系统自动填报",
    desc: "每天下班前将现场打卡数据、材料入库记录自动整理并登录公司内网 OA 系统完成日报填写，替代了项目经理每天2小时的重复性录入工作。",
    tag: "系统登录操作",
    result: "项目经理每天多出 2 小时",
  },
  {
    emoji: "📰",
    client: "投资研究机构",
    title: "行业动态自动摘要",
    desc: "每天定时抓取指定行业媒体、公告平台、雪球等网站的最新内容，用 AI 提炼关键信息，生成每日简报自动发送给研究员。",
    tag: "定时爬取 + 摘要",
    result: "研究员每日节省 1.5 小时",
  },
  {
    emoji: "🏪",
    client: "连锁餐饮品牌",
    title: "门店数据汇总上报",
    desc: "对接各门店的 POS 系统数据接口，每晚自动汇总营业额、客单价、出品数量，登录总部管理后台完成日销售数据上报，并生成异常门店预警。",
    tag: "多系统工作流",
    result: "运营总部数据实时可视",
  },
];

// ─── Pricing ──────────────────────────────────────────────────────
const PRICING = [
  {
    name: "轻量技能",
    price: "¥499",
    unit: "起",
    highlight: false,
    desc: "适合单一、明确的自动化需求",
    features: [
      "1个目标网站爬取 / 数据抓取",
      "结果导出为表格或推送消息",
      "基础定时任务（每日/每周）",
      "1次免费调整",
      "7天交付",
    ],
    cta: "咨询定制",
  },
  {
    name: "专业技能",
    price: "¥1,999",
    unit: "起",
    highlight: true,
    desc: "适合需要登录系统、多步骤工作流",
    features: [
      "支持登录内网/私有系统操作",
      "多步骤工作流（爬取→处理→录入）",
      "对接企微/钉钉/飞书推送",
      "异常检测与自动重试",
      "3次免费调整",
      "10天交付",
    ],
    cta: "咨询定制",
  },
  {
    name: "企业定制",
    price: "面议",
    unit: "",
    highlight: false,
    desc: "适合复杂业务系统、多端集成",
    features: [
      "复杂多系统集成与对接",
      "私有化部署可选",
      "专属工程师全程跟进",
      "无限次调整至验收满意",
      "交付后30天免费维护",
      "按需排期",
    ],
    cta: "预约沟通",
  },
];

const FAQS = [
  {
    q: "我们公司系统不对外，能爬/操作吗？",
    a: "可以。对于内网系统，我们通过企业提供的 VPN 接入，或在您的内网服务器上部署技能脚本，无需暴露系统到公网。",
  },
  {
    q: "爬取内容合法吗？",
    a: "我们只为合规场景定制，不支持恶意爬取或绕过反爬机制进行大规模攻击。爬取公开信息、操作您自己有账号的系统均为合理使用。",
  },
  {
    q: "交付的是什么形式？",
    a: "交付完整的技能包（可导入 OpenClaw 直接运行），包含源码、使用文档、部署说明。技能归您所有，永久可用。",
  },
  {
    q: "目标网站改版了怎么办？",
    a: "免费调整期内（轻量1次、专业3次）遇到目标网站改版，我们免费适配。期满后按小时收费维护，费率为 ¥150/小时。",
  },
  {
    q: "多久能交付？",
    a: "轻量技能 5–7 天，专业技能 7–10 天。确认需求文档后开始计时，期间我们会同步进度。",
  },
];

export default function SkillCustomPage() {
  const [activeDemo, setActiveDemo] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", contact: "", desc: "", budget: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <style>{clawStyles}</style>
      <style>{`
        .sc-phone {
          width: 300px;
          background: linear-gradient(160deg, #2a2a2e 0%, #1a1a1e 100%);
          border-radius: 48px;
          padding: 14px;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.08),
            0 32px 80px rgba(0,0,0,0.55),
            inset 0 1px 0 rgba(255,255,255,0.12);
          position: relative;
          flex-shrink: 0;
        }
        .sc-phone::before {
          content: '';
          position: absolute;
          left: -3px; top: 90px;
          width: 3px; height: 34px;
          background: #333; border-radius: 3px 0 0 3px;
          box-shadow: 0 44px 0 #333;
        }
        .sc-phone::after {
          content: '';
          position: absolute;
          right: -3px; top: 110px;
          width: 3px; height: 54px;
          background: #333; border-radius: 0 3px 3px 0;
        }
        .sc-phone-inner {
          background: #000;
          border-radius: 36px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 560px;
        }
        .sc-msg {
          max-width: 82%;
          padding: 9px 13px;
          border-radius: 16px;
          font-size: 12px;
          line-height: 1.55;
          font-family: 'Manrope', sans-serif;
          animation: scMsgIn 0.35s ease;
        }
        @keyframes scMsgIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sc-msg.ai {
          background: #fff; color: #2A1F19;
          border-bottom-left-radius: 4px; align-self: flex-start;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }
        .sc-msg.user {
          background: #E65C46; color: #fff;
          border-bottom-right-radius: 4px; align-self: flex-end;
        }
        .sc-typing {
          display: flex; gap: 4px; align-items: center;
          padding: 10px 14px;
          background: #fff; border-radius: 16px; border-bottom-left-radius: 4px;
          width: fit-content; box-shadow: 0 1px 4px rgba(0,0,0,0.08);
          animation: scMsgIn 0.2s ease;
        }
        .sc-typing span {
          width: 6px; height: 6px; background: #9e8074; border-radius: 50%;
          animation: scDot 1.2s infinite;
        }
        .sc-typing span:nth-child(2) { animation-delay: 0.2s; }
        .sc-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes scDot { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }

        .sc-demo-tab {
          padding: 6px 16px; border-radius: 100px; font-size: 13px;
          font-weight: 600; cursor: pointer; border: 1.5px solid rgba(42,31,25,0.15);
          background: white; color: #6B5549;
          font-family: 'Manrope', sans-serif; transition: all 0.15s;
        }
        .sc-demo-tab.active { background: #2A1F19; color: white; border-color: #2A1F19; }

        .sc-cases-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;
        }
        .sc-pricing-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; align-items: start;
        }
        .sc-price-card {
          background: white; border: 1px solid rgba(42,31,25,0.08);
          border-radius: 16px; padding: 28px 24px; position: relative;
        }
        .sc-price-card.hi {
          border: 2px solid #E65C46;
          box-shadow: 0 8px 32px rgba(230,92,70,0.15);
        }
        .sc-feat {
          display: flex; align-items: flex-start; gap: 8px;
          font-size: 13px; color: #6B5549; line-height: 1.55;
          padding: 6px 0; border-bottom: 1px solid rgba(42,31,25,0.05);
        }
        .sc-feat:last-child { border-bottom: none; }
        .sc-check {
          width: 16px; height: 16px; border-radius: 50%;
          background: rgba(74,158,107,0.12); color: #2a7a4a;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 900; flex-shrink: 0; margin-top: 1px;
        }
        .sc-demo-layout {
          display: flex; gap: 56px; align-items: flex-start;
        }
        .sc-demo-text { flex: 1; min-width: 0; }
        @media (max-width: 860px) {
          .sc-demo-layout { flex-direction: column; align-items: center; }
          .sc-demo-text { width: 100%; }
          .sc-phone { width: 270px; }
          .sc-phone-inner { height: 510px; }
          .sc-cases-grid { grid-template-columns: 1fr; }
          .sc-pricing-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="claw-page">
        <ClawNav />

        {/* Hero */}
        <section style={{ padding: '72px 24px 56px', maxWidth: 1200, margin: '0 auto' }}>
          <h1 className="claw-h1" style={{ whiteSpace: 'nowrap' }}>
            您提需求，我们为您<span className="claw-accent">定制专属 AI 技能</span>
          </h1>
          <p className="claw-lead" style={{ maxWidth: 600, marginBottom: 8 }}>
            你只需告诉我们岗位是什么。我们搭建整个系统，完成部署。
          </p>
          <p className="claw-lead" style={{ maxWidth: 600 }}>
            例如：爬取特定网站、操作专有系统、自动化复杂工作流——任何重复性的数字工作，都可以变成一个 AI 技能，永久为你运行。
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
            <a href="https://work.weixin.qq.com/kfid/kfcdfdb02ed73c8e4d0" target="_blank" rel="noopener noreferrer" className="claw-btn-primary" style={{ fontSize: 15, padding: '12px 28px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Zap size={16} />
              立即提交需求
            </a>
            <button className="claw-btn-ghost" style={{ fontSize: 15, padding: '12px 28px' }}
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>
              查看演示
            </button>
          </div>
        </section>

        <hr className="claw-divider" />

        {/* Phone Demo */}
        <section id="demo" style={{ padding: '56px 24px', maxWidth: 1200, margin: '0 auto' }}>
          <div className="claw-label">实际效果演示</div>
          <div className="sc-demo-layout">
            <div className="sc-demo-text">
              <h2 className="claw-h2">看技能如何真正工作</h2>
              <p className="claw-lead">选择一个场景，看 AI 技能如何接收指令、执行任务、反馈结果。</p>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
                {DEMO_CASES.map((c, i) => (
                  <button key={i} className={`sc-demo-tab${activeDemo === i ? ' active' : ''}`}
                    onClick={() => setActiveDemo(i)}>
                    {c.avatar} {c.label}
                  </button>
                ))}
              </div>

              <div className="claw-highlight-box">
                <div style={{ fontWeight: 700, color: '#2A1F19', fontSize: 15, marginBottom: 6 }}>
                  📌 这是真实工作场景
                </div>
                <div style={{ fontSize: 13, color: '#6B5549', lineHeight: 1.7 }}>
                  技能安装到 OpenClaw 后，你只需用自然语言下达指令。技能自动登录目标系统/网站，完成操作，将结果结构化返回——无需你全程盯守。
                </div>
              </div>
            </div>

            <PhoneDemo
              key={activeDemo}
              msgs={DEMO_CASES[activeDemo].messages}
              avatar={DEMO_CASES[activeDemo].avatar}
              bg={DEMO_CASES[activeDemo].bg}
              name={DEMO_CASES[activeDemo].label}
            />
          </div>
        </section>

        <hr className="claw-divider" />

        {/* What we can do */}
        <section style={{ padding: '56px 24px', background: 'rgba(240,232,225,0.5)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="claw-label">能做什么</div>
            <h2 className="claw-h2">三类最常见的定制需求</h2>
            <p className="claw-lead">只要是人在电脑上能做的重复性操作，技能都能替代。</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginTop: 8 }}>
              {[
                {
                  icon: "🕷️",
                  title: "特定网站爬取",
                  color: "rgba(101,179,255,0.1)",
                  examples: [
                    "竞品价格监控（京东/淘宝/亚马逊）",
                    "行业新闻/公告每日自动抓取",
                    "招聘网站简历/职位数据采集",
                    "政府政策/招标信息定时获取",
                  ],
                },
                {
                  icon: "🔐",
                  title: "登录专有系统操作",
                  color: "rgba(230,92,70,0.07)",
                  examples: [
                    "公司内网 OA/ERP 自动填报",
                    "多门店后台数据汇总上报",
                    "CRM 系统批量录入/更新",
                    "财务系统凭证自动生成",
                  ],
                },
                {
                  icon: "⚙️",
                  title: "特定工作流自动化",
                  color: "rgba(134,239,172,0.1)",
                  examples: [
                    "数据采集 → 清洗 → 导入一键完成",
                    "每日报表生成并推送到企微/钉钉",
                    "合同/文件批量处理与归档",
                    "多平台数据同步与对账",
                  ],
                },
              ].map((item, i) => (
                <div key={i} style={{ background: item.color, border: '1px solid rgba(42,31,25,0.08)', borderRadius: 16, padding: 28 }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
                  <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 700, color: '#2A1F19', marginBottom: 16 }}>
                    {item.title}
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {item.examples.map((ex, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#6B5549' }}>
                        <span style={{ color: '#E65C46', fontWeight: 700, flexShrink: 0 }}>›</span>
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="claw-divider" />

        {/* Cases */}
        <section style={{ padding: '56px 24px', background: 'rgba(240,232,225,0.5)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="claw-label">客户案例</div>
            <h2 className="claw-h2">他们已经在用了</h2>
            <p className="claw-lead">真实定制技能，解决真实业务痛点。</p>

            <div className="sc-cases-grid">
              {CASES.map((c, i) => (
                <div key={i} className="claw-card" style={{ padding: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{ fontSize: 28 }}>{c.emoji}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#9e8074', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{c.client}</div>
                      <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 700, color: '#2A1F19', marginTop: 2 }}>{c.title}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#6B5549', lineHeight: 1.65, margin: '0 0 16px' }}>{c.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid rgba(42,31,25,0.07)' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(230,92,70,0.1)', color: '#bf3f30', padding: '3px 10px', borderRadius: 100 }}>
                      {c.tag}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#2a7a4a' }}>
                      ✓ {c.result}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="claw-divider" />

        {/* Pricing */}
        <section style={{ padding: '56px 24px', maxWidth: 1200, margin: '0 auto' }}>
          <div className="claw-label">定制价格</div>
          <h2 className="claw-h2">透明定价，按需选择</h2>
          <p className="claw-lead">一次性定制费，技能永久归您所有，无月费。</p>

          <div className="sc-pricing-grid">
            {PRICING.map((plan, i) => (
              <div key={i} className={`sc-price-card${plan.highlight ? ' hi' : ''}`}>
                {plan.highlight && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#E65C46', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 14px', borderRadius: 100, whiteSpace: 'nowrap' }}>
                    最受欢迎
                  </div>
                )}
                <div style={{ fontSize: 13, fontWeight: 600, color: '#9e8074', marginBottom: 4, fontFamily: "'Manrope', sans-serif" }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: plan.price === '面议' ? 28 : 36, fontWeight: 800, color: plan.highlight ? '#E65C46' : '#2A1F19', letterSpacing: '-0.02em' }}>
                    {plan.price}
                  </span>
                  {plan.unit && <span style={{ fontSize: 14, color: '#9e8074' }}>{plan.unit}</span>}
                </div>
                <div style={{ fontSize: 13, color: '#6B5549', marginBottom: 20, lineHeight: 1.5 }}>{plan.desc}</div>
                <div style={{ marginBottom: 24 }}>
                  {plan.features.map((f, j) => (
                    <div key={j} className="sc-feat">
                      <div className="sc-check">✓</div>
                      {f}
                    </div>
                  ))}
                </div>
                <button
                  className={plan.highlight ? "claw-btn-primary" : "claw-btn-ghost"}
                  style={{ width: '100%', justifyContent: 'center', padding: '11px 0', fontSize: 14 }}
                  onClick={() => document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 20, fontSize: 13, color: '#9e8074', textAlign: 'center' }}>
            价格为起步价，实际报价根据需求复杂度确定。提交需求后 24 小时内提供详细方案和最终报价。
          </p>
        </section>

        <hr className="claw-divider" />

        {/* Order form */}
        <section id="order-form" style={{ padding: '56px 24px', background: 'rgba(240,232,225,0.5)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="claw-label">提交需求</div>
            <h2 className="claw-h2">告诉我们你想自动化什么</h2>
            <p className="claw-lead" style={{ fontSize: 15 }}>24小时内回复，免费提供方案和报价。</p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '48px 0', background: 'white', borderRadius: 16, border: '1px solid rgba(42,31,25,0.08)' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 700, color: '#2A1F19', marginBottom: 8 }}>需求已收到！</h3>
                <p style={{ fontSize: 14, color: '#6B5549' }}>我们会在 24 小时内通过您留下的联系方式回复，并发送详细方案。</p>
                <button className="claw-btn-ghost" style={{ marginTop: 20 }} onClick={() => setSubmitted(false)}>再提交一条</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(42,31,25,0.08)', padding: 32, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label htmlFor="name" className="claw-form-label">您的姓名</label>
                    <input id="name" required className="claw-input" value={formData.name} onChange={handleChange} placeholder="张三" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label htmlFor="contact" className="claw-form-label">微信 / 手机 / 邮箱</label>
                    <input id="contact" required className="claw-input" value={formData.contact} onChange={handleChange} placeholder="方便联系的方式" />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label htmlFor="desc" className="claw-form-label">描述您的需求</label>
                  <textarea id="desc" required rows={5} className="claw-textarea" value={formData.desc} onChange={handleChange}
                    placeholder="例如：我需要每天自动登录我们公司的 ERP 系统，把前一天的销售数据导出来，整理成表格发到我的微信。目前是手工操作，每天要花 1 小时……" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label htmlFor="budget" className="claw-form-label">预算范围（选填）</label>
                  <select id="budget" className="claw-input" value={formData.budget} onChange={handleChange} style={{ cursor: 'pointer' }}>
                    <option value="">不确定，先了解报价</option>
                    <option value="500以内">¥500 以内</option>
                    <option value="500-2000">¥500 – ¥2,000</option>
                    <option value="2000-5000">¥2,000 – ¥5,000</option>
                    <option value="5000以上">¥5,000 以上</option>
                  </select>
                </div>
                <button type="submit" className="claw-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px 0', fontSize: 15, fontWeight: 700 }}>
                  <Zap size={16} />
                  提交需求，免费获取方案
                </button>
                <p style={{ textAlign: 'center', fontSize: 12, color: '#9e8074', margin: 0 }}>
                  无需付款 · 24小时内回复 · 不满意无需签单
                </p>
              </form>
            )}
          </div>
        </section>

        <hr className="claw-divider" />

        {/* FAQ */}
        <section style={{ padding: '56px 24px', maxWidth: 1200, margin: '0 auto' }}>
          <div className="claw-label">常见问题</div>
          <h2 className="claw-h2">你可能想问</h2>
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FAQS.map((faq, i) => (
              <div key={i} className="claw-accordion">
                <button className="claw-accordion-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  {openFaq === i
                    ? <ChevronUp size={16} style={{ flexShrink: 0, marginLeft: 8 }} />
                    : <ChevronDown size={16} style={{ flexShrink: 0, marginLeft: 8 }} />
                  }
                </button>
                {openFaq === i && (
                  <div className="claw-accordion-body">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        <ClawFooter />
      </div>
    </>
  );
}
