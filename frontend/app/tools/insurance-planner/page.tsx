'use client';
import { ClawNav, ClawFooter, clawStyles } from "@/components/claw-layout";
import { useState, useRef, useCallback, useEffect } from "react";

type Msg = { type: 'user' | 'ai'; text: string };

const FEATURES = [
  { icon: "📄", title: "一键生成计划书", desc: "输入客户基本信息与需求，AI 自动匹配公司产品，生成专业排版的保险计划书，支持 PDF 导出。" },
  { icon: "💬", title: "计划书深度问答", desc: "上传客户计划书全文，针对任意条款、保障范围、费率说明进行智能问答，秒级给出精准解释。" },
  { icon: "🙋", title: "客户问题快速回复", desc: "遇到客户提问，直接粘贴问题，AI 结合公司产品资料与门户宣传页，生成专业、合规的回复话术。" },
  { icon: "📚", title: "多源知识库驱动", desc: "知识库涵盖公司文档资源、官网产品宣传页、历史计划书全文，回答有据可查，质量持续优化。" },
  { icon: "🔒", title: "合规与准确性保障", desc: "回答内容严格基于公司官方资料，拒绝主观发挥，重要结论附带原始文档引用，可溯源验证。" },
  { icon: "🚀", title: "新人快速上手", desc: "专为对产品尚不熟悉的新晋代理人设计，无需背诵条款，AI 随时充当你身边的产品专家。" },
];

const HOW_STEPS = [
  { num: "01", title: "上传资料", desc: "将公司产品手册、计划书 PDF、官网链接导入知识库，一次配置，长期生效。" },
  { num: "02", title: "填写需求", desc: "输入客户年龄、预算、保障偏好，或直接粘贴客户的提问文字。" },
  { num: "03", title: "AI 智能处理", desc: "系统检索知识库，结合产品规则与行业最佳实践，生成结构化回复或完整计划书。" },
  { num: "04", title: "一键输出", desc: "复制回复话术，或导出排版精美的 PDF 计划书，直接发给客户。" },
];

const S0: Msg[] = [
  { type: 'user', text: '客户问我返还型重疾险和定期寿险有什么区别，我不知道怎么回答' },
  { type: 'ai',   text: '✅ 已检索产品手册（P.12 & P.38）\n\n📊 核心区别：\n• 返还型重疾险：保重疾+身故，到期返还保费或保额，兼具保障与储蓄，保费较高\n• 定期寿险：只保身故/全残，不返还，保费极低，杠杆高，纯保障工具\n\n💡 建议话术：\n「两者不是竞争关系——预算充足可配返还重疾，预算有限先用定寿做足身故保障。您现在的首要需求是哪个？」' },
  { type: 'user', text: '客户还问了，如果重疾险买了没生病，那钱不就白花了吗？' },
  { type: 'ai',   text: '✅ 已匹配异议话术库（价值感知类 #03）\n\n💡 推荐话术：\n「买保险不生病，是人生最好的结局。就像花钱装了消防喷淋，家没着火——你不会觉得冤枉，反而庆幸。\n\n另外，如果您选的是返还型，合同期满保费原路返回，保障期间完全是免费的。您觉得这样合不合算？」' },
  { type: 'user', text: '明白了，帮我整理一下这两个回答，我待会要发给客户' },
  { type: 'ai',   text: '✅ 已生成客户版话术（微信友好格式）\n\n📋 可直接复制发送：\n\n【关于两种保险的区别】\n返还型重疾险：生病赔钱、身故赔钱，满期返保费，兼顾保障和储蓄。\n定期寿险：专注身故保障，保费低杠杆高，适合家庭顶梁柱。\n\n【关于没生病钱白花了】\n不生病是最好的事！选返还型满期还能拿回保费；选定期寿险，保障期间您和家人一直有人兜底，这份安心是真实的。' },
];

const S1: Msg[] = [
  { type: 'user', text: '客户问计划书第12条除外责任，他看不懂，问我能不能解释' },
  { type: 'ai',   text: '✅ 已定位：计划书第 12 条 除外责任（P.18）\n\n📊 该条款核心含义：\n以下情况发生时，保险公司不负赔付责任：\n① 被保险人故意自伤或自杀（合同生效满2年后除外）\n② 参与违法犯罪活动导致的伤亡\n③ 核爆炸、战争、军事行动等不可抗力\n④ 投保时故意隐瞒健康状况\n\n💡 话术建议：\n「这是行业通用条款，正常生活中几乎不会触碰。日常生病、意外受伤完全不受影响，您无需担心。」' },
  { type: 'user', text: '他还问，等待期内得了重疾能赔吗？' },
  { type: 'ai',   text: '✅ 已检索：等待期条款（P.6）\n\n📊 等待期规则：\n• 本产品等待期为 90 天（自合同生效日起）\n• 等待期内确诊重疾：退还已缴保费，合同终止，不予赔付\n• 等待期内因意外导致的重疾：不受等待期限制，正常赔付\n\n💡 话术建议：\n「等待期是所有重疾险的标准设计，主要防止带病投保。意外引发的情况不受影响。」' },
  { type: 'user', text: '好的，他还问保费是怎么算的，跟年龄有关系吗' },
  { type: 'ai',   text: '✅ 已检索：费率表（P.31–34）\n\n📊 保费计算逻辑：\n• 保费 = 保额 × 费率系数\n• 费率随投保年龄增长递增，年龄越小越合算\n• 性别也影响费率（女性重疾险通常低于男性）\n\n📋 举例（保额50万 / 缴费20年）：\n25岁男性 ≈ 月缴 480 元\n35岁男性 ≈ 月缴 720 元\n45岁男性 ≈ 月缴 1280 元\n\n💡 「越早买越省，这是真的。您客户目前多大年纪？我帮您查一下精准报价。」' },
];

const S2: Msg[] = [
  { type: 'user', text: '帮我出一份计划书：35岁男性，月预算800，需要重疾+住院医疗' },
  { type: 'ai',   text: '✅ 正在匹配最优方案（35岁男 / 月预算800元）…\n\n📋 推荐组合（月保费 ≈ 792 元）：\n\n① 【XX 康享重疾险】 月缴 510 元\n保额 50 万 · 缴费 30 年\n✓ 120种重疾 + 30种轻症确诊即赔\n✓ 60岁前出险豁免后续保费\n\n② 【XX 百万医疗险】 月缴 282 元\n600万额度 · 1万免赔\n✓ 住院+手术+特效药全覆盖\n✓ 含海外就医，无社保限制\n\n💡 组合优势：重疾确诊赔50万可覆盖收入损失，医疗险兜底实际医疗费用。' },
  { type: 'user', text: '客户问为什么推荐30年缴费，不选20年或者一次性？' },
  { type: 'ai',   text: '✅ 已匹配缴费期对比逻辑\n\n📊 三种缴费方式对比（35岁男，保额50万）：\n\n缴费方式  月保费  总保费  适合人群\n20年缴    840元  20.2万  收入稳定、提前还清\n30年缴    510元  18.4万  现金流为先\n趸缴       —    9.8万   一次性资金充裕\n\n💡 推荐30年缴的理由：\n① 月缴最低，减轻现金流压力\n② 总缴保费反而最少\n③ 若60岁前出险，后续保费全部豁免\n\n「交的少、保的久、出险还免交——首选30年。」' },
  { type: 'user', text: '好的，帮我把计划书生成好，我要发给客户' },
  { type: 'ai',   text: '✅ 计划书已生成（PDF格式）\n\n📄 文件信息：\n• 文件名：XX客户_重疾医疗组合方案_20240426.pdf\n• 页数：8页（含产品详情、保障对比、费率说明、理赔流程）\n• 已附：客户专属费率计算 & 同类产品横向对比\n\n📲 发送建议：\n可直接微信发送PDF，附上一句话说明：\n「XX先生，这是根据您的需求定制的保障方案，两款产品加起来每天不到27元，有任何疑问随时告诉我～」' },
];

const S3: Msg[] = [
  { type: 'user', text: '客户说：我觉得保险都是骗人的，理赔的时候各种拒赔' },
  { type: 'ai',   text: '✅ 已匹配异议处理话术库（信任重建类 #07）\n\n📊 客户这句话背后的真实顾虑：\n• 曾经或听说过理赔被拒的经历\n• 对条款不透明、被误导投保有担忧\n• 对代理人本身的信任感不足\n\n💡 推荐话术（三段式）：\n「您的顾虑我完全理解，我自己接触这行前也这么想。\n\n行业里确实有拒赔，但90%是因为投保时没如实告知健康情况，或出险原因刚好在除外责任里。只要投保诚实、条款搞清楚，理赔其实是最好走的流程之一。\n\n我帮您把这份方案的除外责任逐条过一遍，您买的明白，我也安心。」' },
  { type: 'user', text: '他说他朋友买了，生病了保险公司说不在保障范围，赔了很少' },
  { type: 'ai',   text: '✅ 已匹配：具体理赔争议应对话术\n\n💡 推荐话术：\n「您朋友碰到的情况我听了也觉得挺遗憾的。通常出现这种问题有两种可能：\n\n① 买的是医疗险但以为是重疾险——两者赔付逻辑完全不同，很多人买的时候没搞清楚\n② 确实超出了保障范围，但销售时没讲清楚\n\n所以今天我会逐条跟您讲清楚：保什么、不保什么、怎么赔、赔多少。」\n\n📌 本产品已在监管平台备案，条款白纸黑字，可直接查询。' },
  { type: 'user', text: '他说等等再说，不急，让我改天联系他' },
  { type: 'ai',   text: '✅ 已匹配：跟进时机话术（客户拖延类 #12）\n\n💡 当下回复话术：\n「好的，完全理解，这种事不用赶。不过越年轻越健康的时候买，保费越低、核保越容易。\n\n我把方案先发给您，等您有空的时候随时翻看，有问题直接问我就行～」\n\n📅 3天后跟进话术：\n「XX先生，上次发的方案看了吗？这两天有个优惠活动，多了一项轻症保障不加钱，如果有兴趣可以聊5分钟。」\n\n⏰ 建议跟进时间：发送方案后第3天上午10点。' },
];

const S4: Msg[] = [
  { type: 'user', text: '客户想比较保诚信守明天和宏利宏传承，都是5年期10万美金，哪个更好？' },
  { type: 'ai',   text: '✅ 已检索：保诚 Secure Wealth Plus · 宏利 Vantage Series（5年缴 / USD 100,000 保额）\n\n📊 核心数据对比（40岁男性，非吸烟）：\n\n【保费】\n• 保诚信守明天：约 USD 4,820 / 年 → 5年总缴 USD 24,100\n• 宏利宏传承：约 USD 5,160 / 年 → 5年总缴 USD 25,800\n保诚年缴低约 USD 340，5年节省 ~USD 1,700\n\n【第10年退保价值（保证部分）】\n• 保诚：USD 52,300（约52.3%）\n• 宏利：USD 56,800（约56.8%）\n宏利保证现金价值高出约 USD 4,500' },
  { type: 'user', text: '那非保证部分呢？哪个预期收益更高？' },
  { type: 'ai',   text: '✅ 已检索：两款产品演示利率（5.5%预期）\n\n📊 预期总价值对比（含非保证红利）：\n\n年份   保诚信守明天    宏利宏传承\n第10年  USD 71,400    USD 73,200\n第15年  USD 97,600    USD 99,800\n第20年  USD 133,000   USD 136,500\n第25年  USD 181,000   USD 186,200\n\n📌 关键差异：\n• 宏利长期演示值平均高出 2–3%\n• 保诚红利分配更稳定，历史实现率较高\n• 两款产品均含可选附加险（危疾、医疗）\n\n💡 结论：短期持有（<15年）保诚更优；长期持有（>20年）宏利演示值略高，但需参考各公司历史红利实现率。' },
  { type: 'user', text: '客户比较看重保证回本年期，哪款更快？' },
  { type: 'ai',   text: '✅ 已检索：保证回本年期条款\n\n📊 保证回本对比：\n• 保诚信守明天：保证第 8 年回本（保证现金价值 ≥ 已缴总保费）\n• 宏利宏传承：保证第 7 年回本\n\n宏利保证回本快 1 年\n\n💡 推荐话术：\n「如果客户保守、最看重本金安全，宏利回本年期更短，确定性更强；如果客户能接受稍长持有并追求长期增值，两款都不错，看他更信任哪家公司品牌。」\n\n📋 已生成对比摘要卡，可直接发给客户：\n保诚 vs 宏利·5年缴·USD10万对比.pdf' },
];

const SCENARIOS: { tag: string; desc: string; msgs: Msg[] }[] = [
  { tag: '新人答疑',  desc: '刚入职的代理人面对客户的产品比较问题，AI 秒速定位条款并给出可直接使用的话术。', msgs: S0 },
  { tag: '计划书答疑', desc: '客户手握计划书追问条款细节，AI 精准定位原文并给出通俗解释，代理人无需翻文件。', msgs: S1 },
  { tag: '快速出单',  desc: '输入客户信息，AI 立刻给出最优产品组合与推荐理由，计划书一键生成。', msgs: S2 },
  { tag: '话术生成',  desc: '客户提出各种异议，AI 即时生成有温度、有逻辑的专业回复话术，直接复制发送。', msgs: S3 },
  { tag: '产品对比',  desc: '保诚信守明天 vs 宏利宏传承，5年期10万美金，AI 秒出保费、保证回本、长期收益全方位对比。', msgs: S4 },
];

export default function InsurancePlannerPage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [visibleMsgs, setVisibleMsgs] = useState<number[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const msgsRef = useRef<HTMLDivElement>(null);

  const play = useCallback((msgs: Msg[]) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setVisibleMsgs([]);
    setShowTyping(false);

    let delay = 350;
    msgs.forEach((msg, i) => {
      if (i > 0) {
        const t1 = setTimeout(() => setShowTyping(true), delay);
        timers.current.push(t1);
        delay += msg.type === 'ai' ? 1300 : 600;
      }
      const t2 = setTimeout(() => {
        setShowTyping(false);
        setVisibleMsgs(prev => [...prev, i]);
      }, delay);
      timers.current.push(t2);
      delay += msg.type === 'ai' ? 2000 : 900;
    });
  }, []);

  const skip = useCallback(() => {
    timers.current.forEach(clearTimeout);
    setShowTyping(false);
    setVisibleMsgs(SCENARIOS[activeIdx].msgs.map((_, i) => i));
  }, [activeIdx]);

  useEffect(() => {
    play(SCENARIOS[activeIdx].msgs);
    return () => { timers.current.forEach(clearTimeout); };
  }, [activeIdx, play]);

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [visibleMsgs, showTyping]);

  const msgs = SCENARIOS[activeIdx].msgs;

  return (
    <>
      <style>{clawStyles + phoneStyles}</style>
      <div className="claw-page">
        <ClawNav />

        {/* ── Hero ── */}
        <section className="ip-hero">
          <h1 className="claw-h1 ip-hero-h1">
            保险代理人的
            <span className="claw-accent"> AI 助手</span>
          </h1>
          <p className="claw-lead ip-hero-lead">
            一键生成专业计划书，秒级回答客户疑问。无需背诵条款，让 AI 成为你随身携带的产品专家。
            答案来源：公司官方文档 × 门户宣传页 × 计划书全文。
          </p>
          <div className="ip-hero-btns">
            <a href="#demo" className="claw-btn-primary" style={{ padding: "14px 32px", fontSize: 16 }}>查看演示</a>
            <a href="#features" className="claw-btn-ghost" style={{ padding: "14px 32px", fontSize: 16 }}>了解功能</a>
          </div>
          <div className="ip-stats">
            {[["30 秒", "生成一份计划书"], ["< 5 秒", "客户问题回复"], ["100%", "基于官方资料"], ["0 背诵", "新人友好设计"]].map(([val, label]) => (
              <div key={label} className="ip-stat-pill">
                <div className="ip-stat-val">{val}</div>
                <div className="ip-stat-label">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <hr className="claw-divider" />

        {/* ── Features ── */}
        <section id="features" className="ip-sec">
          <div className="ip-sec-hd">
            <div className="claw-label">核心功能</div>
            <h2 className="claw-h2" style={{ marginTop: 12 }}>六大能力，覆盖代理人全场景</h2>
          </div>
          <div className="ip-grid-3">
            {FEATURES.map(f => (
              <div key={f.title} className="claw-card claw-card-hover" style={{ padding: "28px 28px 24px" }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#2A1F19", marginBottom: 8, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{f.title}</div>
                <p className="claw-body" style={{ margin: 0, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="claw-divider" />

        {/* ── How it works ── */}
        <section className="ip-sec-muted">
          <div className="ip-sec-inner">
            <div className="ip-sec-hd">
              <div className="claw-label">使用流程</div>
              <h2 className="claw-h2" style={{ marginTop: 12 }}>四步上手，开始使用</h2>
            </div>
            <div className="ip-grid-4">
              {HOW_STEPS.map(s => (
                <div key={s.num} className="claw-card" style={{ padding: "28px 24px" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#E65C46", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, marginBottom: 16, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{s.num}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#2A1F19", marginBottom: 8, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{s.title}</div>
                  <p className="claw-body" style={{ margin: 0, lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="claw-divider" />

        {/* ── Demo ── */}
        <section id="demo" className="ip-sec">
          <div className="ip-sec-hd" style={{ marginBottom: 48 }}>
            <div className="claw-label">交互演示</div>
            <h2 className="claw-h2" style={{ marginTop: 12 }}>
              真实场景，<span className="claw-accent">AI 是怎么回答的</span>
            </h2>
            <p className="claw-lead" style={{ maxWidth: 520, margin: "12px auto 0" }}>
              选择场景，看 AI 如何根据公司资料给出专业、可直接使用的回复。
            </p>
          </div>

          {/* Mobile: horizontal chip bar */}
          <div className="ip-scenario-chips">
            {SCENARIOS.map((s, i) => (
              <button
                key={s.tag}
                onClick={() => setActiveIdx(i)}
                className={`ip-chip${activeIdx === i ? ' active' : ''}`}
              >
                {s.tag}
              </button>
            ))}
          </div>

          <div className="ip-demo-layout">
            {/* Left: vertical selector (desktop) */}
            <div className="ip-demo-left">
              <div className="ip-scenario-label">选择场景</div>
              <div className="ip-scenario-list">
                {SCENARIOS.map((s, i) => (
                  <button
                    key={s.tag}
                    onClick={() => setActiveIdx(i)}
                    className={`ip-scenario-btn${activeIdx === i ? ' active' : ''}`}
                  >
                    <div className="ip-scenario-tag">{s.tag}</div>
                    <div className="ip-scenario-desc">{s.desc}</div>
                  </button>
                ))}
              </div>
              <div className="ip-kb-note">
                <strong style={{ color: "#E65C46" }}>知识库来源：</strong><br />
                产品手册 v2024.11 · 官网产品页 · 公司内部培训文档 · 历史计划书
              </div>
            </div>

            {/* Right: phone */}
            <div className="ip-demo-right">
              <div className="ip-phone">
                <div className="ip-phone-left-btn" />
                <div className="ip-phone-right-btn" />
                <div className="ip-phone-inner">
                  <div className="ip-statusbar">
                    <div className="ip-time">9:41</div>
                    <div className="ip-icons">
                      <div className="ip-signal"><span /><span /><span /><span /></div>
                      <div className="ip-wifi">▲</div>
                      <div className="ip-battery">
                        <div className="ip-battery-body"><div className="ip-battery-fill" /></div>
                        <div className="ip-battery-tip" />
                      </div>
                    </div>
                  </div>
                  <div className="ip-island" />
                  <div className="ip-screen">
                    <div className="ip-topbar">
                      <div className="ip-avatar">🤖</div>
                      <div>
                        <div className="ip-agent-name">保险 AI 助手</div>
                        <div className="ip-agent-status">在线</div>
                      </div>
                    </div>
                    <div className="ip-msgs" ref={msgsRef}>
                      {msgs.map((msg, i) => (
                        visibleMsgs.includes(i) && (
                          <div key={i} className={`ip-msg ${msg.type} visible`} style={{ whiteSpace: "pre-line" }}>
                            {msg.text}
                          </div>
                        )
                      ))}
                      {showTyping && (
                        <div className="ip-typing visible">
                          <span /><span /><span />
                        </div>
                      )}
                    </div>
                    <div className="ip-bottom">
                      <span className="ip-count">{visibleMsgs.length} / {msgs.length} 条</span>
                      <div style={{ display: "flex", gap: 7 }}>
                        {visibleMsgs.length < msgs.length ? (
                          <button className="ip-btn-skip" onClick={skip}>⚡ 快进</button>
                        ) : (
                          <button className="ip-btn-skip" onClick={() => play(msgs)}>↺ 重播</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="claw-divider" />

        {/* ── Knowledge sources ── */}
        <section className="ip-sec-muted">
          <div className="ip-sec-inner">
            <div className="ip-sec-hd">
              <div className="claw-label">知识库构成</div>
              <h2 className="claw-h2" style={{ marginTop: 12 }}>回答质量，源于<span className="claw-accent">三大权威来源</span></h2>
            </div>
            <div className="ip-grid-3">
              {[
                { icon: "🗂️", title: "公司文档资源", desc: "产品条款手册、培训资料、核保规则、理赔指引等内部文件，支持 PDF / Word / Excel 批量导入。", badge: "权重最高" },
                { icon: "🌐", title: "门户网站宣传页", desc: "自动抓取并索引公司官网的产品宣传页面，确保 AI 掌握最新产品亮点与营销口径。", badge: "实时同步" },
                { icon: "📑", title: "计划书全文", desc: "支持上传历史计划书 PDF，针对具体计划书内容进行深度问答，客户每份方案都能精准解答。", badge: "按需上传" },
              ].map(src => (
                <div key={src.title} className="claw-card" style={{ padding: "28px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <span style={{ fontSize: 32 }}>{src.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, background: "rgba(230,92,70,0.1)", color: "#E65C46", padding: "3px 10px", borderRadius: 999 }}>{src.badge}</span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#2A1F19", marginBottom: 8, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{src.title}</div>
                  <p className="claw-body" style={{ margin: 0, lineHeight: 1.7 }}>{src.desc}</p>
                </div>
              ))}
            </div>
            <div className="claw-highlight-box" style={{ maxWidth: 680, margin: "32px auto 0", padding: "16px 20px", fontSize: 14 }}>
              <strong>安全合规说明：</strong>所有知识库数据存储在公司私有环境，不会用于模型训练，AI 生成内容严格基于上传文档，不做主观推测，关键回答自动标注原始来源。
            </div>
          </div>
        </section>

        <hr className="claw-divider" />

        {/* ── Target users ── */}
        <section className="ip-sec">
          <div className="ip-sec-hd">
            <div className="claw-label">适用人群</div>
            <h2 className="claw-h2" style={{ marginTop: 12 }}>谁最适合使用这个工具？</h2>
          </div>
          <div className="ip-grid-4">
            {[
              { emoji: "🆕", title: "新晋代理人", desc: "入职不足 1 年，产品还没吃透，客户问问题经常答不上来。" },
              { emoji: "📈", title: "多产品代理人", desc: "同时代理多家公司产品，条款繁多，无法做到每款产品都精通。" },
              { emoji: "⏱️", title: "效率优先的老代理", desc: "每天面对大量客户，手动出计划书、查条款耗时太长，想解放双手。" },
              { emoji: "🏢", title: "团队管理者", desc: "想统一团队的话术口径与计划书质量，降低新人犯错风险。" },
            ].map(u => (
              <div key={u.title} className="claw-card claw-card-hover" style={{ padding: "24px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{u.emoji}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#2A1F19", marginBottom: 8, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{u.title}</div>
                <p className="claw-body" style={{ margin: 0, lineHeight: 1.6, fontSize: 14 }}>{u.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="claw-divider" />

        {/* ── CTA ── */}
        <section className="ip-cta">
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🤝</div>
            <h2 className="claw-h2" style={{ marginBottom: 16, fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              让每位代理人都有<span className="claw-accent">专属产品专家</span>
            </h2>
            <p className="claw-lead" style={{ marginBottom: 36 }}>
              现已开放内测申请，填写表单后 24 小时内联系您完成部署与知识库配置。
            </p>
            <div className="ip-cta-btns">
              <a href="#" className="claw-btn-primary" style={{ padding: "15px 36px", fontSize: 16 }}>申请内测资格</a>
              <a href="#" className="claw-btn-ghost" style={{ padding: "15px 36px", fontSize: 16 }}>预约产品演示</a>
            </div>
          </div>
        </section>

        <ClawFooter />
      </div>
    </>
  );
}

const phoneStyles = `
  /* ── Layout helpers ── */
  .ip-hero {
    padding: 88px 24px 64px;
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
  }
  .ip-hero-h1 { margin: 20px auto 20px; max-width: 760px; }
  .ip-hero-lead { max-width: 640px; margin: 0 auto 32px; line-height: 1.8; }
  .ip-hero-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
  .ip-stats { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-top: 44px; }
  .ip-stat-pill {
    background: #fff; border: 1px solid rgba(42,31,25,0.1);
    border-radius: 12px; padding: 14px 24px; min-width: 120px; text-align: center;
  }
  .ip-stat-val { font-size: 26px; font-weight: 800; color: #E65C46; font-family: 'Bricolage Grotesque', sans-serif; }
  .ip-stat-label { font-size: 12px; color: #6B5549; margin-top: 4px; }

  .ip-sec { padding: 64px 20px; max-width: 1200px; margin: 0 auto; }
  .ip-sec-muted { padding: 64px 20px; background: rgba(240,232,225,0.45); }
  .ip-sec-inner { max-width: 1200px; margin: 0 auto; }
  .ip-sec-hd { text-align: center; margin-bottom: 40px; }

  .ip-grid-3 { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
  .ip-grid-4 { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }

  .ip-cta {
    padding: 72px 24px;
    text-align: center;
    background: linear-gradient(135deg, rgba(230,92,70,0.08) 0%, rgba(240,232,225,0.6) 100%);
  }
  .ip-cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

  /* ── Demo layout ── */
  .ip-scenario-chips { display: none; }   /* hidden on desktop */
  .ip-demo-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 48px;
    align-items: center;
  }
  .ip-demo-left { display: flex; flex-direction: column; }
  .ip-demo-right { display: flex; justify-content: center; }

  .ip-scenario-label {
    font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: #9e8074; margin-bottom: 12px;
  }
  .ip-scenario-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
  .ip-scenario-btn {
    text-align: left; padding: 13px 16px; border-radius: 12px;
    border: 1.5px solid rgba(42,31,25,0.12); background: #fff;
    cursor: pointer; transition: all 0.18s;
  }
  .ip-scenario-btn.active { border-color: #E65C46; background: rgba(230,92,70,0.06); }
  .ip-scenario-tag { font-size: 13px; font-weight: 700; color: #2A1F19; margin-bottom: 3px; }
  .ip-scenario-btn.active .ip-scenario-tag { color: #E65C46; }
  .ip-scenario-desc { font-size: 12px; color: #9e8074; line-height: 1.5; }
  .ip-kb-note {
    padding: 12px 14px; background: rgba(230,92,70,0.06);
    border: 1px solid rgba(230,92,70,0.18); border-radius: 10px;
    font-size: 12px; color: #6B5549; line-height: 1.6;
  }

  /* Mobile chip bar */
  .ip-chip {
    padding: 8px 18px; border-radius: 999px; font-size: 13px; font-weight: 600;
    border: 1.5px solid rgba(42,31,25,0.15); background: #fff; color: #6B5549;
    cursor: pointer; white-space: nowrap; transition: all 0.18s; flex-shrink: 0;
  }
  .ip-chip.active { border-color: #E65C46; background: #E65C46; color: #fff; }

  /* ── Phone shell ── */
  .ip-phone {
    width: 300px;
    background: linear-gradient(160deg, #2a2a2e 0%, #1a1a1e 100%);
    border-radius: 46px;
    padding: 13px;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 40px 100px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12);
    position: relative;
    animation: slideUp 0.4s cubic-bezier(.22,1,.36,1);
  }
  .ip-phone-left-btn {
    position: absolute; left: -3px; top: 90px;
    width: 3px; height: 32px; background: #333; border-radius: 3px 0 0 3px;
    box-shadow: 0 42px 0 #333;
  }
  .ip-phone-right-btn {
    position: absolute; right: -3px; top: 108px;
    width: 3px; height: 52px; background: #333; border-radius: 0 3px 3px 0;
  }
  @keyframes slideUp { from { transform: translateY(32px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .ip-phone-inner {
    background: #000; border-radius: 34px; overflow: hidden;
    display: flex; flex-direction: column; height: 580px;
  }

  /* Status bar */
  .ip-statusbar {
    background: #000; padding: 10px 18px 4px;
    display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
  }
  .ip-time { font-size: 13px; font-weight: 700; color: #fff; font-family: -apple-system, sans-serif; letter-spacing: -0.3px; }
  .ip-icons { display: flex; align-items: center; gap: 5px; }
  .ip-signal { display: flex; align-items: flex-end; gap: 1.5px; height: 11px; }
  .ip-signal span { display: block; width: 3px; background: #fff; border-radius: 1px; }
  .ip-signal span:nth-child(1) { height: 3px; }
  .ip-signal span:nth-child(2) { height: 5px; }
  .ip-signal span:nth-child(3) { height: 7px; }
  .ip-signal span:nth-child(4) { height: 11px; }
  .ip-wifi { font-size: 11px; color: #fff; }
  .ip-battery { display: flex; align-items: center; gap: 1px; }
  .ip-battery-body { width: 22px; height: 11px; border: 1.5px solid rgba(255,255,255,0.7); border-radius: 2.5px; padding: 1.5px; }
  .ip-battery-fill { background: #fff; border-radius: 1px; height: 100%; width: 75%; }
  .ip-battery-tip { width: 2px; height: 5px; background: rgba(255,255,255,0.5); border-radius: 0 1px 1px 0; }

  /* Dynamic island */
  .ip-island {
    width: 96px; height: 28px; background: #000; border-radius: 20px;
    margin: 0 auto 6px; z-index: 2; flex-shrink: 0;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.06);
  }

  /* Screen */
  .ip-screen {
    background: #F8F2ED; flex: 1; overflow: hidden;
    display: flex; flex-direction: column; border-radius: 0 0 32px 32px;
  }
  .ip-topbar {
    background: #fff; padding: 10px 14px;
    border-bottom: 1px solid rgba(42,31,25,0.08);
    display: flex; align-items: center; gap: 10px; flex-shrink: 0;
  }
  .ip-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, #E65C46, #ff8a75);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(230,92,70,0.25);
  }
  .ip-agent-name { font-size: 13px; font-weight: 700; color: #2A1F19; font-family: 'Manrope', sans-serif; }
  .ip-agent-status { font-size: 11px; color: #22c55e; font-family: 'Manrope', sans-serif; display: flex; align-items: center; gap: 3px; }
  .ip-agent-status::before { content: ''; width: 6px; height: 6px; background: #22c55e; border-radius: 50%; display: inline-block; }

  /* Messages */
  .ip-msgs {
    flex: 1; padding: 14px 12px;
    display: flex; flex-direction: column; gap: 9px;
    overflow-y: auto; scroll-behavior: smooth;
  }
  .ip-msg {
    max-width: 82%; padding: 9px 13px; border-radius: 16px;
    font-size: 12.5px; line-height: 1.55; font-family: 'Manrope', sans-serif;
    opacity: 0; transform: translateY(7px);
    transition: opacity 0.38s ease, transform 0.38s ease;
  }
  .ip-msg.visible { opacity: 1; transform: translateY(0); }
  .ip-msg.ai { background: #fff; color: #2A1F19; border-bottom-left-radius: 3px; align-self: flex-start; box-shadow: 0 1px 4px rgba(0,0,0,0.07); }
  .ip-msg.user { background: #E65C46; color: #fff; border-bottom-right-radius: 3px; align-self: flex-end; }

  /* Typing */
  .ip-typing {
    display: flex; gap: 4px; align-items: center; padding: 9px 13px;
    background: #fff; border-radius: 16px; border-bottom-left-radius: 3px;
    width: fit-content; box-shadow: 0 1px 4px rgba(0,0,0,0.07);
    opacity: 0; transition: opacity 0.25s;
  }
  .ip-typing.visible { opacity: 1; }
  .ip-typing span { width: 6px; height: 6px; background: #9e8074; border-radius: 50%; animation: bounce 1.2s infinite; }
  .ip-typing span:nth-child(2) { animation-delay: 0.2s; }
  .ip-typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-5px); } }

  /* Bottom bar */
  .ip-bottom {
    padding: 7px 12px;
    border-top: 1px solid rgba(42,31,25,0.08);
    display: flex; align-items: center; justify-content: space-between;
    background: #fff; flex-shrink: 0;
  }
  .ip-count { font-size: 10.5px; color: #9e8074; font-family: 'Manrope', sans-serif; }
  .ip-btn-skip {
    font-size: 11px; font-weight: 700; color: #E65C46;
    background: rgba(230,92,70,0.08); border: 1px solid rgba(230,92,70,0.25);
    border-radius: 100px; padding: 3px 10px; cursor: pointer;
    font-family: 'Manrope', sans-serif; transition: background 0.15s;
  }
  .ip-btn-skip:hover { background: rgba(230,92,70,0.16); }

  /* ── Responsive: tablet ── */
  @media (max-width: 860px) {
    .ip-demo-layout { grid-template-columns: 1fr; gap: 32px; }
    .ip-demo-left { display: none; }   /* hide desktop selector, chips shown instead */
    .ip-demo-right { order: 0; }
    .ip-scenario-chips {
      display: flex; gap: 10px; overflow-x: auto;
      padding-bottom: 4px; margin-bottom: 28px;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .ip-scenario-chips::-webkit-scrollbar { display: none; }
  }

  /* ── Responsive: mobile ── */
  @media (max-width: 640px) {
    .ip-hero { padding: 56px 16px 48px; }
    .ip-hero-h1 { font-size: 32px !important; line-height: 1.2 !important; }
    .ip-hero-lead { font-size: 15px; margin-bottom: 24px; }
    .ip-hero-btns { gap: 10px; }
    .ip-hero-btns a { padding: 12px 22px !important; font-size: 14px !important; }

    .ip-stats { gap: 10px; margin-top: 32px; }
    .ip-stat-pill { padding: 12px 16px; min-width: 0; flex: 1 1 calc(50% - 5px); max-width: calc(50% - 5px); }
    .ip-stat-val { font-size: 22px; }
    .ip-stat-label { font-size: 11px; }

    .ip-sec { padding: 48px 16px; }
    .ip-sec-muted { padding: 48px 16px; }
    .ip-sec-hd { margin-bottom: 28px; }
    .ip-cta { padding: 56px 16px; }
    .ip-cta-btns a { width: 100%; text-align: center; padding: 13px 20px !important; }

    .ip-grid-3 { grid-template-columns: 1fr; }
    .ip-grid-4 { grid-template-columns: repeat(2, 1fr); }

    .ip-phone { width: 272px; padding: 11px; border-radius: 40px; }
    .ip-phone-inner { height: 520px; border-radius: 30px; }
    .ip-screen { border-radius: 0 0 28px 28px; }
    .ip-island { width: 84px; height: 24px; }
    .ip-msgs { padding: 10px 9px; gap: 7px; }
    .ip-msg { font-size: 11.5px; padding: 8px 11px; }
  }

  /* ── Responsive: very small ── */
  @media (max-width: 380px) {
    .ip-grid-4 { grid-template-columns: 1fr; }
    .ip-phone { width: 248px; }
    .ip-phone-inner { height: 480px; }
  }
`;

