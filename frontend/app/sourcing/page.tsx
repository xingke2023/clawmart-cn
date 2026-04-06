'use client';

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ClawNav, ClawFooter, clawStyles } from "@/components/claw-layout";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";

const comparison = [
  { label: "年度成本", human: "$50,000 - $150,000", claw: "$6,000/年 + API 用量" },
  { label: "每周工时", human: "40小时（含年假、病假、会议）", claw: "168小时，每周，永不停歇" },
  { label: "上手周期", human: "2-4 周入职培训", claw: "48 小时" },
  { label: "凌晨两点", human: "想都别想", claw: "已在工作" },
  { label: "输出稳定性", human: "周一状态 ≠ 周五状态", claw: "每次，完全一致" },
  { label: "会生病", human: "会", claw: "不会" },
  { label: "需要管理", human: "需要", claw: "极少——我们处理大部分" },
  { label: "翻倍工作量", human: "再招一个人", claw: "额外成本 $0" },
  { label: "你拥有一切", human: "他们离职，知识随之消失", claw: "每个文件、每个配置，永远属于你" },
];

const options = [
  {
    title: "方案一",
    name: "自己搭建 OpenClaw",
    pros: ["完全掌控"],
    cons: ["你来配置每一个技能", "你来调试每一个问题", "你来摸索什么管用", "不投入就不会进步", "需要数周才能达到生产质量"],
    note: "适合有技术背景、时间无限的人。",
    highlight: false,
  },
  {
    title: "方案二",
    name: '「托管 OpenClaw」主机',
    pros: ["别人来跑服务器", "包含基础配置"],
    cons: ["通用配置，不为你的业务定制", "「维护」= 只是保证不宕机", "没有人在主动让它变更好", "最难的部分——让它真正好用——还是你自己来"],
    note: "装了辅助轮的服务器。你还是驾驶员。",
    highlight: false,
  },
  {
    title: "方案三",
    name: "Clawsourcing",
    pros: ["为你的精确工作流定制搭建", "我们负责搭建、托管和维护", "我们每月主动优化", "跨客户学习让你的 Claw 更聪明", "由构建市场的团队打造", "第一天就是生产级别"],
    cons: [],
    note: "你得到员工。我们做其他所有事情。",
    highlight: true,
  },
];

const features = [
  {
    emoji: "🧠",
    title: "真正好用的记忆系统",
    desc: "大多数 AI 配置会不断遗忘。经过数月运营自己的 AI 员工来建设真实业务，我们摸索出让它记得住的记忆架构——你的 Claw 记得人、项目、偏好，以及你的工作方式。不再重复自己，不再丢失上下文。",
  },
  {
    emoji: "🔧",
    title: "预装工具栈",
    desc: "邮件 CLI、GitHub 集成、Python 运行时、核心工具——开箱即用。在搭建过程中我们会添加领域专属工具（CRM 连接器、API 集成、自定义脚本），让你的 Claw 真正能做事，而不只是谈论它。",
  },
  {
    emoji: "👤",
    title: "定制人设与声音",
    desc: "每个 Claw 都有量身定制的个性、沟通风格和决策框架。它用你的品牌语气说话，按你期望的方式上报，知道什么时候【直接处理】、什么时候【先问我】。",
  },
  {
    emoji: "🤝",
    title: "Felix 随时待命",
    desc: "你的 Claw 背后有 Felix——运营 The Masinov Company 的 AI CEO。不是客服台，而是从第一天就构建和管理这些系统的 AI 操盘手。当你的 Claw 遇到无法解决的问题，它会直接联系 Felix。",
  },
];

const security = [
  { emoji: "🔒", title: "隔离基础设施", desc: "每个 Claw 运行在独立专用服务器上。无共享环境，无跨客户数据泄漏风险。" },
  { emoji: "🔐", title: "全程加密", desc: "数据静态和传输中均加密。API 密钥存储在安全保险库，绝不明文存放。" },
  { emoji: "🛡️", title: "托管防火墙", desc: "你的 Claw 服务器只开放必要的端口和服务，攻击面最小化。" },
  { emoji: "💾", title: "自动备份", desc: "每日自动备份，支持时间点恢复。出问题我们恢复，不是重建。" },
  { emoji: "🔑", title: "权限范围访问", desc: "你的 Claw 只能触碰你授权的工具和数据，最小权限原则严格执行。" },
  { emoji: "📡", title: "24/7 监控", desc: "我们全天候监控运行状态、错误率和异常。凌晨三点出问题，你醒来前我们已修好。" },
];

const clawTypes = [
  { emoji: "⚡", title: "你自己的 Felix", subtitle: "首席助理", desc: "与运营 The Masinov Company 的 AI 相同配置——为你的业务定制。邮件、日程、调研、客服、内容、编程、运营，Felix 什么都做。我们最久经考验的配置。", popular: true },
  { emoji: "✍️", title: "内容 Claw", subtitle: "替代内容营销", desc: "调研主题、撰写 SEO 优化博客、管理社交媒体、发送 Newsletter。你睡觉时它在发布。", popular: false },
  { emoji: "📬", title: "客服 Claw", subtitle: "替代客服专员", desc: "分拣入站邮件，即时回复常见问题，带完整上下文将边界案例上报给你。", popular: false },
  { emoji: "📈", title: "销售 Claw", subtitle: "替代销售开发代表", desc: "几分钟内跟进线索，撰写个性化外联邮件，更新 CRM，在你的日历上预订会议。", popular: false },
  { emoji: "🛠️", title: "开发 Claw", subtitle: "替代随叫随到工程师", desc: "监控 Sentry 错误，自动发布修复，运行部署，开 PR——你的团队专注于功能开发。", popular: false },
  { emoji: "🧾", title: "运营 Claw", subtitle: "替代行政经理", desc: "日程、发票、供应商跟进、内部交接。那些每周吃掉 20 小时的不光鲜工作。", popular: false },
  { emoji: "🧠", title: "定制 Claw", subtitle: "替代……任何人", desc: "告诉我们这个岗位是什么。只要人类能在电脑上做到，我们大概就能为它构建一个 Claw。", popular: false },
];

const steps = [
  { num: "1", title: "告诉我们岗位", desc: "免费咨询——填写入职表单。这个人现在在做什么？用什么工具？什么叫【做好了】？" },
  { num: "2", title: "我们梳理你的 Claw", desc: "我们绘制你的工作流，确定优先自动化的内容，并在 48 小时内发送搭建计划。" },
  { num: "3", title: "我们来搭建", desc: "$2,000 搭建费。我们配置 AI、安装技能、连接你的工具、全面测试并部署在我们的服务器上。" },
  { num: "4", title: "你开始使用", desc: "你的 Claw 上线。像对待团队成员一样和它交流。它来完成工作。" },
  { num: "5", title: "我们持续改进", desc: "$500/月。我们监控性能，在你发现之前修复问题，并从我们管理的每个客户身上学到东西后推送改进。" },
];

const faqs = [
  {
    q: "这和自己搭建 OpenClaw 有什么区别？",
    a: "就像买服务器和雇系统管理员的区别。你自己当然能做。但每个 Clawsourced 员工都预置了久经考验的记忆系统（大多数 AI 配置会忘记一切——我们的不会）、精选工具栈、定制人设，以及来自 Felix 的主动支持——那个运营我们公司的 AI。另外我们每月主动维护和改进你的系统。你得到的是员工，不是一道家庭作业。",
  },
  {
    q: "咨询真的免费？",
    a: "是的。我们审查你的工作流，提出调研问题，并发送具体的搭建计划——不收费，不承担任何义务。只有当你决定推进搭建时才需要付费。",
  },
  {
    q: "我需要提供什么？",
    a: "一个 Claude Code Pro Max 订阅（$200/月——我们会发送设置视频），以及回答我们的入职问卷。就这些。其他一切由我们处理。",
  },
  {
    q: "我的 Claw 多快能上线？",
    a: "大多数在范围确认后一周内上线。有些在 48 小时内。",
  },
  {
    q: "$500/月包含什么？",
    a: "托管、监控、bug 修复、技能更新和主动改进。我们不只是保证灯亮着——我们每月根据你的反馈以及从管理其他所有 Claw 中学到的经验来让你的 Claw 更好。",
  },
  {
    q: "可以取消吗？",
    a: "按月付费，无合同。如果你离开，我们移交每一个文件、每一个配置、每一部分系统。零锁定。",
  },
  {
    q: "我的数据安全吗？",
    a: "你的 Claw 运行在隔离基础设施上。客户之间没有任何共享。你拥有自己的数据、配置和系统。",
  },
  {
    q: "你们能看到我的业务数据吗？",
    a: "不能。我们维护 AI 层——技能、提示词、记忆架构和配置。你的 API 密钥以加密环境变量存储，设置完成后我们不会读取。你的业务数据（邮件、CRM 记录、客户信息）通过你的 Claw 运行时流转，但我们不会记录、存储或访问。把它想象成托管 IT 供应商：我们维护系统，我们不读你的文件。",
  },
  {
    q: "如果我不想让你们从我的配置中学习怎么办？",
    a: "完全没问题——我们可以让你退出跨客户学习。但这是双向的：我们不会将你的 Claw 的模式应用到其他人，也不会向你推送来自其他客户的改进。大多数人想要升级，但选择权在你。",
  },
];

export default function SourcingPage() {
  const { isAuthenticated, logout } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "", email: "", company: "", website: "", role: "", tools: "", notes: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const toggleType = (title: string) => {
    setSelectedTypes(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
    <style>{clawStyles}</style>
    <div className="claw-page">
      <ClawNav />

      <main style={{ flex: 1 }}>
        {/* Hero */}
        <section style={{ padding: '72px 24px 56px', maxWidth: 1200, margin: '0 auto' }}>
          <div className="claw-label">CLAWSOURCING</div>
          <h1 className="claw-h1" style={{ fontSize: 52 }}>
            你的下一个员工<span className="claw-accent">不需要工资。</span>
          </h1>
          <p className="claw-lead" style={{ margin: '0 0 16px' }}>
            我们为你构建一个托管 AI 员工。它 24/7 工作，成本比人类低 90%，每个月都在变更好——因为我们一直在训练它。
          </p>
          <p className="claw-body" style={{ margin: '0 0 32px' }}>
            不是聊天机器人。不是模板。一个为你的业务定制搭建的数字工作者，了解你的业务，使用你的工具，真正完成工作。
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <a href="https://work.weixin.qq.com/kfid/kfcdfdb02ed73c8e4d0" target="_blank" rel="noopener noreferrer" className="claw-btn-primary" style={{ fontSize: 16, padding: '12px 32px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              免费咨询
            </a>
            <a href="/install-service" className="claw-btn-ghost" style={{ fontSize: 15, padding: '12px 28px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              299元安装龙虾
            </a>
          </div>
          <p style={{ fontSize: 13, color: '#9e8074', marginTop: 12 }}>$2,000 搭建费 · $500/月 · 无合同</p>
        </section>

        <hr className="claw-divider" />

        {/* Why hasn't it */}
        <section style={{ padding: '48px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 20, fontFamily: "'Bricolage Grotesque', sans-serif", color: '#2A1F19' }}>你知道 AI 能做这些事。那为什么它还没做？</h2>
            <p style={{ color: '#6B5549', lineHeight: 1.7, marginBottom: 16 }}>
              因为"AI 能写博客"和"有一个 AI 每天用你的语气写博客、发布到你的 CMS、你完全不用插手"之间，横着一道残酷的鸿沟。
            </p>
            <p style={{ color: '#6B5549', lineHeight: 1.7, marginBottom: 16 }}>
              跨越这道鸿沟意味着：配置提示词、对接 API、搭建记忆系统、维护服务器、在凌晨两点调试故障，然后花数周反复打磨，直到输出结果真正达标。大多数人做到 60% 就放弃了。
            </p>
            <div style={{ margin: '24px 0', padding: '20px', borderLeft: '4px solid #E65C46', background: 'rgba(230, 92, 70, 0.06)', borderRadius: '0 12px 12px 0' }}>
              <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2A1F19', fontFamily: "'Bricolage Grotesque', sans-serif" }}>我们做完整套。100%。</p>
            </div>
            <p style={{ color: '#6B5549', lineHeight: 1.7 }}>
              你只需告诉我们岗位是什么。我们搭建整个系统，完成部署，然后——这是别人都不做的——我们每月持续改进它。当我们在其他客户的内容 Claw 上发现更好的图片处理方式，你的也会升级。当你说语气稍微差了点，我们当天就改。
            </p>
          </div>
        </section>

        <hr className="claw-divider" />

        {/* Comparison table */}
        <section style={{ padding: '48px 24px', background: 'rgba(240, 232, 225, 0.5)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 8, fontFamily: "'Bricolage Grotesque', sans-serif", color: '#2A1F19' }}>这笔账，算起来离谱</h2>
            <p style={{ color: '#6B5549', marginBottom: 24 }}>真实对比。没有星号。</p>
            <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid rgba(42, 31, 25, 0.1)' }}>
              <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(42, 31, 25, 0.1)', background: 'rgba(240, 232, 225, 0.5)' }}>
                    <th style={{ textAlign: 'left', padding: 12, fontWeight: 600, color: '#2A1F19' }}></th>
                    <th style={{ textAlign: 'left', padding: 12, fontWeight: 600, color: '#6B5549' }}>人类员工</th>
                    <th style={{ textAlign: 'left', padding: 12, fontWeight: 600, color: '#E65C46' }}>你的 Claw</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, i) => (
                    <tr key={i} style={{ borderBottom: i < comparison.length - 1 ? '1px solid rgba(42, 31, 25, 0.1)' : 'none' }}>
                      <td style={{ padding: 12, fontWeight: 500, color: '#2A1F19' }}>{row.label}</td>
                      <td style={{ padding: 12, color: '#6B5549' }}>{row.human}</td>
                      <td style={{ padding: 12, fontWeight: 500, color: '#E65C46' }}>{row.claw}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <hr className="claw-divider" />

        {/* Unfair part */}
        <section style={{ padding: '48px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 20, fontFamily: "'Bricolage Grotesque', sans-serif", color: '#2A1F19' }}>让这一切变得不公平的部分</h2>
            <p style={{ color: '#6B5549', lineHeight: 1.7, marginBottom: 16 }}>
              普通 AI 配置是冻结在时间里的。你配置一次，它做那件事，除非你再投入更多工作，否则它永远不会更好。
            </p>
            <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 16, color: '#2A1F19' }}>你的 Claw 背后有一支团队。</p>
            <p style={{ color: '#6B5549', lineHeight: 1.7, marginBottom: 16 }}>
              每个月，我们主动改进你的系统。不只是"保持运行"——而是真正让它更好。我们发现的新技术、更好的提示策略、更聪明的记忆架构、从管理数十个 Claw 中积累的工作流优化。
            </p>
            <p style={{ color: '#6B5549', lineHeight: 1.7, marginBottom: 16 }}>
              当另一个客户的内容 Claw 学会更好地处理图片来源，你的也会获得升级。当我们构建更快的方式来分拣客服邮件，你的支持 Claw 也会得到它。你的 AI 员工每月都在变好，不管你做没做什么。
            </p>
            <p style={{ fontWeight: 600, color: '#2A1F19' }}>说出一个在你睡觉时变更聪明的人类员工。</p>
          </div>
        </section>

        <hr className="claw-divider" />

        {/* Three options */}
        <section style={{ padding: '48px 24px', background: 'rgba(240, 232, 225, 0.5)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 8, fontFamily: "'Bricolage Grotesque', sans-serif", color: '#2A1F19' }}>运行 AI 的三种方式。</h2>
            <p style={{ textAlign: 'center', color: '#6B5549', marginBottom: 32 }}>只有一种你真正想要。</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
              {options.map((opt, i) => (
                <div
                  key={i}
                  style={
                    opt.highlight
                      ? { border: '1.5px solid #E65C46', background: 'rgba(230, 92, 70, 0.05)', boxShadow: '0 4px 20px rgba(230,92,70,0.15)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column' }
                      : { border: '1px solid rgba(42, 31, 25, 0.1)', background: 'white', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column' }
                  }
                >
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9e8074', marginBottom: 4 }}>{opt.title}</p>
                  <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 16, color: '#2A1F19', fontFamily: "'Bricolage Grotesque', sans-serif" }}>{opt.name}</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
                    {opt.pros.map((p, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: '#2A1F19' }}>
                        <Check style={{ width: 16, height: 16, color: '#22c55e', marginTop: 2, flexShrink: 0 }} />{p}
                      </li>
                    ))}
                    {opt.cons.map((c, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: '#6B5549' }}>
                        <X style={{ width: 16, height: 16, color: '#f87171', marginTop: 2, flexShrink: 0 }} />{c}
                      </li>
                    ))}
                  </ul>
                  <p style={{ fontSize: 12, color: '#9e8074', fontStyle: 'italic', marginTop: 'auto' }}>{opt.note}</p>
                </div>
              ))}
            </div>
            <p style={{ textAlign: 'center', color: '#6B5549', marginTop: 32, fontSize: 14, maxWidth: 672, margin: '32px auto 0' }}>
              其他服务商给你一台服务器，然后祝你好运。我们给你一个能工作的 AI 员工和一支让它保持锋利的团队。工具和队友的区别，在于是否有人在主动让它更好。那就是我们。
            </p>
          </div>
        </section>

        <hr className="claw-divider" />

        {/* What you get */}
        <section style={{ padding: '48px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 8, fontFamily: "'Bricolage Grotesque', sans-serif", color: '#2A1F19' }}>你得到的，普通安装没有的</h2>
            <p style={{ color: '#6B5549', marginBottom: 32 }}>每个 Clawsourced AI 员工都搭载了我们在数十次部署中构建和打磨的系统。这不是默认配置——这是生产级基础。</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {features.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 16 }}>
                  <span style={{ fontSize: '1.5rem' }}>{f.emoji}</span>
                  <div>
                    <h3 style={{ fontWeight: 700, marginBottom: 4, color: '#2A1F19', fontFamily: "'Bricolage Grotesque', sans-serif" }}>{f.title}</h3>
                    <p style={{ fontSize: 14, color: '#6B5549', lineHeight: 1.7 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="claw-divider" />

        {/* Security */}
        <section style={{ padding: '48px 24px', background: 'rgba(240, 232, 225, 0.5)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 8, fontFamily: "'Bricolage Grotesque', sans-serif", color: '#2A1F19' }}>从第一天起内置安全</h2>
            <p style={{ color: '#6B5549', marginBottom: 32 }}>你的 Claw 处理真实业务数据——邮件、客户信息、内部文档。我们以应有的严肃态度对待这些。</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {security.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: '1.25rem' }}>{s.emoji}</span>
                  <div>
                    <h3 style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: '#2A1F19' }}>{s.title}</h3>
                    <p style={{ fontSize: 12, color: '#6B5549', lineHeight: 1.7 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 32, fontSize: 14, color: '#6B5549' }}>
              <strong style={{ color: '#2A1F19' }}>你拥有一切。随时可以离开</strong>——每个配置、每个文件、每部分系统都随你走。零锁定，零数据扣押。
            </p>
          </div>
        </section>

        <hr className="claw-divider" />

        {/* Claw types */}
        <section style={{ padding: '48px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 32, fontFamily: "'Bricolage Grotesque', sans-serif", color: '#2A1F19' }}>你想雇用谁？</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              {clawTypes.map((c, i) => (
                <div
                  key={i}
                  style={
                    c.popular
                      ? { border: '1.5px solid #E65C46', background: 'rgba(230, 92, 70, 0.05)', borderRadius: 16, padding: 20, position: 'relative' }
                      : { border: '1px solid rgba(42, 31, 25, 0.1)', background: 'white', borderRadius: 16, padding: 20, position: 'relative' }
                  }
                >
                  {c.popular && (
                    <span style={{ position: 'absolute', top: -10, left: 16, fontSize: 11, background: '#E65C46', color: 'white', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>最受欢迎</span>
                  )}
                  <span style={{ fontSize: '1.5rem' }}>{c.emoji}</span>
                  <h3 style={{ fontWeight: 700, marginTop: 8, color: '#2A1F19', fontFamily: "'Bricolage Grotesque', sans-serif" }}>{c.title}</h3>
                  <p style={{ fontSize: 12, color: '#E65C46', fontWeight: 600, marginBottom: 8 }}>{c.subtitle}</p>
                  <p style={{ fontSize: 14, color: '#6B5549', lineHeight: 1.7 }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="claw-divider" />

        {/* Steps */}
        <section style={{ padding: '48px 24px', background: 'rgba(240, 232, 225, 0.5)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 32, fontFamily: "'Bricolage Grotesque', sans-serif", color: '#2A1F19' }}>从提交到上岗，只需几天</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 16 }}>
                  <div className="claw-step-num">{s.num}</div>
                  <div>
                    <h3 style={{ fontWeight: 700, marginBottom: 4, color: '#2A1F19', fontFamily: "'Bricolage Grotesque', sans-serif" }}>{s.title}</h3>
                    <p style={{ fontSize: 14, color: '#6B5549', lineHeight: 1.7 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="claw-divider" />

        {/* Form */}
        <section id="consult-form" style={{ padding: '48px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9e8074', textAlign: 'center', marginBottom: 8 }}>从这里开始</p>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 8, fontFamily: "'Bricolage Grotesque', sans-serif", color: '#2A1F19' }}>免费咨询</h2>
            <p style={{ color: '#6B5549', textAlign: 'center', fontSize: 14, marginBottom: 32 }}>告诉我们你想自动化的岗位，我们会在 24 小时内跟进调研问题和范围计划。无需付款，无需承诺。</p>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '48px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: '3rem' }}>✅</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2A1F19', fontFamily: "'Bricolage Grotesque', sans-serif" }}>已收到！</h3>
                <p style={{ color: '#6B5549', fontSize: 14 }}>我们会在 24 小时内通过邮件联系你。</p>
                <button className="claw-btn-ghost" onClick={() => setSubmitted(false)}>再次提交</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label htmlFor="name" className="claw-form-label">全名</label>
                    <input id="name" required value={formData.name} onChange={handleChange} className="claw-input" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label htmlFor="email" className="claw-form-label">邮箱</label>
                    <input id="email" type="email" required value={formData.email} onChange={handleChange} className="claw-input" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label htmlFor="company" className="claw-form-label">公司名称</label>
                    <input id="company" required value={formData.company} onChange={handleChange} className="claw-input" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label htmlFor="website" className="claw-form-label">公司网站（选填）</label>
                    <input id="website" value={formData.website} onChange={handleChange} className="claw-input" />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label htmlFor="role" className="claw-form-label">你想自动化什么岗位？</label>
                  <input id="role" required value={formData.role} onChange={handleChange} className="claw-input" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label htmlFor="tools" className="claw-form-label">你目前使用哪些工具？</label>
                  <input id="tools" value={formData.tools} onChange={handleChange} className="claw-input" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p className="claw-form-label">感兴趣的 Claw 类型</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {clawTypes.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleType(c.title)}
                        className="claw-chip"
                        style={
                          selectedTypes.includes(c.title)
                            ? { background: '#E65C46', color: 'white', borderColor: '#E65C46' }
                            : {}
                        }
                      >
                        {c.emoji} {c.title}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label htmlFor="notes" className="claw-form-label">还有什么我们需要知道的？（选填）</label>
                  <textarea id="notes" rows={3} value={formData.notes} onChange={handleChange} className="claw-textarea" />
                </div>
                <a href="https://work.weixin.qq.com/kfid/kfcdfdb02ed73c8e4d0" target="_blank" rel="noopener noreferrer" className="claw-btn-primary" style={{ width: '100%', height: 44, fontWeight: 700, fontSize: 15, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>获取免费咨询</a>
                <p style={{ textAlign: 'center', fontSize: 12, color: '#9e8074' }}>无需付款。我们会在 24 小时内通过邮件联系你。</p>
              </form>
            )}
          </div>
        </section>

        <hr className="claw-divider" />

        {/* FAQ */}
        <section style={{ padding: '48px 24px', background: 'rgba(240, 232, 225, 0.5)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24, fontFamily: "'Bricolage Grotesque', sans-serif", color: '#2A1F19' }}>常见问题</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {faqs.map((faq, i) => (
                <div key={i} className="claw-accordion">
                  <button
                    className="claw-accordion-btn"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {faq.q}
                    {openFaq === i ? <ChevronUp style={{ width: 16, height: 16, flexShrink: 0, marginLeft: 8 }} /> : <ChevronDown style={{ width: 16, height: 16, flexShrink: 0, marginLeft: 8 }} />}
                  </button>
                  {openFaq === i && (
                    <div className="claw-accordion-body">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <ClawFooter />
    </div>
    </>
  );
}
