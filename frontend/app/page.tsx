'use client';

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { listingsApi, storeApi, Listing, ListingParams, DemoMessage, DemoPersona, StoreProduct, StoreBooking } from "@/lib/api";
import { Star, Download, Loader2 } from "lucide-react";
import { ClawNav, ClawFooter } from "@/components/claw-layout";
import { useAuth } from "@/lib/auth-context";

// 行业分类体系
interface Industry {
  value: string;
  label: string;
  emoji: string;
  desc: string;
  categories: string[];
  keywords: string[];
  roles: string[];
}

const INDUSTRIES: Industry[] = [
  {
    value: "all",
    label: "全部",
    emoji: "",
    desc: "",
    categories: [],
    keywords: [],
    roles: [],
  },
  {
    value: "ecommerce",
    label: "电商运营",
    emoji: "🛒",
    desc: "覆盖选品、上架、客服、直播到复购的全链路 AI 技能",
    categories: ["营销", "其他"],
    keywords: ["电商", "选品", "竞品", "直播", "客服", "运营", "增长"],
    roles: ["电商运营专员", "直播运营", "客服主管", "选品经理"],
  },
  {
    value: "content",
    label: "内容创作",
    emoji: "✍️",
    desc: "从策划到发布，覆盖全平台内容生产的 AI 助手",
    categories: ["营销"],
    keywords: ["小红书", "公众号", "抖音", "视频", "播客", "知乎", "B站", "文案", "脚本"],
    roles: ["内容运营", "新媒体编辑", "短视频导演", "品牌文案"],
  },
  {
    value: "engineering",
    label: "产品工程",
    emoji: "💻",
    desc: "加速开发效率的工程师专属 AI 技能包",
    categories: ["工程"],
    keywords: ["代码", "开发", "工程", "API", "数据库", "部署", "框架", "自动化"],
    roles: ["前端工程师", "后端工程师", "全栈开发", "DevOps", "AI工程师"],
  },
  {
    value: "marketing",
    label: "市场营销",
    emoji: "📊",
    desc: "从获客到留存，覆盖全渠道营销的 AI 技能",
    categories: ["营销"],
    keywords: ["SEO", "邮件", "LinkedIn", "品牌", "营销", "外联", "CRM", "舆情"],
    roles: ["市场经理", "增长黑客", "品牌专员", "SEO 专员"],
  },
  {
    value: "design",
    label: "设计创意",
    emoji: "🎨",
    desc: "UI/UX、品牌视觉到用户调研的设计师 AI 助手",
    categories: ["设计"],
    keywords: ["设计", "UI", "UX", "Figma", "品牌", "视觉", "调研"],
    roles: ["UI 设计师", "品牌设计师", "UX 研究员", "视觉总监"],
  },
  {
    value: "management",
    label: "企业管理",
    emoji: "🏢",
    desc: "HR、财务、法务、项目管理的企业级 AI 技能",
    categories: ["其他"],
    keywords: ["HR", "财务", "法律", "审计", "项目", "管理", "招聘", "合规", "Jira", "Airtable"],
    roles: ["HR 经理", "财务分析师", "法务专员", "项目经理", "运营总监"],
  },
  {
    value: "AI 角色",
    label: "AI 员工",
    emoji: "🤖",
    desc: "直接上岗的完整 AI 角色，替代真实岗位员工",
    categories: ["AI 角色"],
    keywords: [],
    roles: [],
  },
  {
    value: "industry",
    label: "行业方案",
    emoji: "🏭",
    desc: "针对特定行业的完整 AI 解决方案套件，开箱即用",
    categories: ["行业方案"],
    keywords: ["生鲜", "门店", "连锁", "零售", "餐饮", "医疗"],
    roles: ["生鲜零售", "连锁门店", "餐饮管理", "线下零售"],
  },
];

const SORT_OPTIONS = [
  { label: "最热门", value: "popular" },
  { label: "最新发布", value: "newest" },
  { label: "价格：从低到高", value: "price_asc" },
  { label: "价格：从高到低", value: "price_desc" },
];

const BANK_PRODUCT_MSGS = [
  { from: 'user', text: '新客户李女士，45岁，500万资产，想稳健一点，但希望跑赢通胀，怎么给她推？' },
  { from: 'ai',   text: '✅ 已建立李女士临时档案\n• 年龄：45岁  资产：¥500万  风格：稳健型\n\n📊 KYC 智能评估：\n建议风险等级定为 R2-R3（稳健偏积极）\n\n💡 推荐组合（合规通过）：\n① 50% — 国债逆回购 + 大额存单（保本打底）\n② 30% — 固收+混合基金（年化目标5-7%）\n③ 20% — 沪深红利低波ETF（跑赢通胀锚）\n\n是否生成完整产品说明书和面谈话术？' },
  { from: 'user', text: '生成话术，另外她问过理财亏损怎么解释' },
  { from: 'ai',   text: '✅ 完整面谈话术已生成（含开场白、产品介绍、异议处理）\n\n📌 关于"理财亏损"的合规应对话术：\n"市场短期波动在所难免，我们选择的产品历史最大回撤控制在5%以内，长期持有3年以上胜率达92%……"\n\n⚠️ 合规提示：请勿承诺保本或固定收益。' },
  { from: 'user', text: '她还在纠结要不要把房子卖了全投进来' },
  { from: 'ai',   text: '⚠️ 重要提示：切勿建议客户变卖主要资产全仓投入。\n\n💡 合规建议话术：\n"李女士，房产是家庭主要资产，不建议轻易变现。我们先从您现有的流动资金开始规划，做好了再逐步加仓……"\n\n✅ 本建议已通过合规审核，可直接引用。' },
  { from: 'user', text: '好的，她问第一笔最低门槛是多少' },
  { from: 'ai',   text: '📋 各产品最低申购门槛：\n• 国债逆回购：¥10万起\n• 大额存单：¥20万起（3年期，4.1%）\n• 固收+基金：¥1,000起\n• 红利ETF：¥1,000起\n\n💡 建议首次配置方案（¥100万起步）：\n① ¥50万 — 大额存单（安全底仓）\n② ¥30万 — 固收+基金\n③ ¥20万 — 红利ETF\n\n风险分散，体验感好，后续容易加仓。' },
  { from: 'user', text: '她同意了，要开始办手续' },
  { from: 'ai',   text: '✅ 已为李女士生成开户流程指引：\n\n第一步：风险承受能力测评（约5分钟）\n第二步：签署产品认购协议\n第三步：资金划转，建议分3笔转入\n\n📎 所需材料：身份证原件、银行卡、手机号\n⏱ 预计全流程约45分钟\n\n是否预约今天下午3点办理？' },
  { from: 'user', text: '预约3点，她老公也想了解，下次带老公一起来' },
  { from: 'ai',   text: '✅ 已预约：今天下午3:00 李女士开户办理\n✅ CRM已备注：下次拜访须邀请其配偶同席\n\n📝 已为李女士配偶预建联系人档案\n💡 下次见面可推介家庭资产配置方案，转化概率更高。\n\n今天15:00前我会提醒您准备相关材料 📂' },
  { from: 'user', text: '太好了，今天还有几个客户要跟进，帮我排个优先级' },
  { from: 'ai',   text: '📊 今日待跟进客户优先级排序：\n\n🔴 高优先（今日必联）\n① 张先生 — 定期存款明天到期，需续期或转投\n② 刘总 — 上周承诺的产品方案今天要给回复\n\n🟡 中优先（本周跟进）\n③ 赵女士 — 近期有购房需求变化\n④ 孙先生 — 风险测评快到期，需重新评估\n\n🟢 常规维护\n⑤ 其余6位客户 — 本月例行问候即可' },
];

function BankProductChat() {
  const [visibleCount, setVisibleCount] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visibleCount >= BANK_PRODUCT_MSGS.length) return;
    const msg = BANK_PRODUCT_MSGS[visibleCount];
    const typingDelay = msg.from === 'ai' ? 1400 : 800;
    const readDelay = msg.from === 'ai' ? 2200 : 1200;
    const t1 = setTimeout(() => setIsTyping(true), readDelay);
    const t2 = setTimeout(() => {
      setIsTyping(false);
      setVisibleCount(v => v + 1);
    }, readDelay + typingDelay);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [visibleCount]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [visibleCount, isTyping]);

  return (
    <div className="bank-chat-card">
      <div className="bank-chat-header">
        <div className="bank-chat-avatar" style={{ background: 'rgba(42,31,25,0.06)', fontSize: 20 }}>📋</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#2A1F19' }}>智能产品匹配 & 风险评估</div>
          <div style={{ fontSize: 12, color: '#9e8074' }}>KYC 分析 / 合规推荐 / 话术辅助</div>
        </div>
        <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
      </div>
      <div className="bank-chat-body" ref={bodyRef} style={{ overflowY: 'auto', maxHeight: 420 }}>
        {BANK_PRODUCT_MSGS.slice(0, visibleCount).map((msg, i) => (
          <div key={i} className={`bank-msg ${msg.from}`} style={{ animation: 'bankMsgIn 0.3s ease' }}>
            <div className="bank-msg-avatar" style={msg.from === 'user' ? { background: '#E65C46', color: 'white' } : { background: '#F8F2ED' }}>
              {msg.from === 'user' ? '经' : '🤖'}
            </div>
            <div className="bank-msg-bubble" style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
          </div>
        ))}
        {isTyping && (
          <div className="bank-msg ai">
            <div className="bank-msg-avatar" style={{ background: '#F8F2ED' }}>🤖</div>
            <div className="bank-msg-bubble" style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '10px 16px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9e8074', animation: 'bankDot 1.2s infinite' }} />
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9e8074', animation: 'bankDot 1.2s infinite 0.2s' }} />
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9e8074', animation: 'bankDot 1.2s infinite 0.4s' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const BANK_SCROLL_MSGS = [
  { from: 'user', text: '王总这周六生日，帮我想想怎么维护一下，他最近持仓好像也有点问题' },
  { from: 'ai',   text: '✅ 已查询王总档案：\n• 生日：本周六（3天后）\n• 资产规模：¥1,280万，钻石客户\n• 近期持仓：沪深300 ETF -6.2%，债基+1.1%\n\n📊 当前关注点：\n权益仓位集中度偏高（72%），近30日浮亏约¥74,000，情绪指数偏低。\n\n💡 建议动作：\n① 生日前1天发送专属祝福短信\n② 预约周五下午电话，聊仓位优化\n③ 准备固收+配置报告随信附上\n\n是否立即生成祝福短信和配置报告？' },
  { from: 'user', text: '好，生成祝福短信，报告帮我重点突出固收+方向' },
  { from: 'ai',   text: '✅ 祝福短信已生成（140字，符合合规要求）\n✅ 固收+配置报告已生成：\n  • 固收+ A（近1年+8.3%，波动率低）\n  • 偏债混合型基金组合\n\n📤 是否立即发送短信至王总手机？' },
  { from: 'user', text: '发吧，他上次说对黄金有兴趣，要不要也加一块' },
  { from: 'ai',   text: '📊 黄金配置分析：\n当前现货金价 ¥618/克，近3月+4.2%\n\n💡 建议配置比例：5-8%（对冲通胀+尾部风险）\n工具选择：黄金ETF（T+0流动性好）\n\n✅ 黄金章节已插入报告第4页，是否一并发给王总？' },
  { from: 'user', text: '好的，一起发。他还有个朋友陈总，做生意的，可以介绍过来吗' },
  { from: 'ai',   text: '✅ 已为王总生成专属转介绍卡片（含二维码）\n\n📋 陈总画像预填：\n• 行业：制造业  预估资产：300-500万\n• 潜在需求：企业流动资金 + 个人财富配置\n\n是否为陈总预建初始档案，提前准备见面方案？' },
  { from: 'user', text: '先建档案，下周约好了见面' },
  { from: 'ai',   text: '✅ 陈总初始档案已创建\n📅 已标注：下周三下午2点，陈总初次见面\n\n📝 见面前准备清单：\n□ 打印产品对比一页纸\n□ 准备企业流动资金方案\n□ 确认陈总风险偏好问卷\n\n⏰ 见面前1天自动提醒并推送当日简报。' },
  { from: 'user', text: '王总短信有没有回应' },
  { from: 'ai',   text: '📤 短信已于14:32发出，状态：已送达\n\n💬 王总已回复（14:47）：\n"谢谢小李，改天聊！"\n\n✅ 已记录至CRM\n📅 建议周四10点致电跟进\n\n是否现在预约提醒？' },
  { from: 'user', text: '预约周四10点' },
  { from: 'ai',   text: '✅ 已设置提醒：周四10:00 致电王总\n\n📋 通话前简报（届时自动推送）：\n• 持仓最新净值\n• 固收+产品最新排名\n• 本周市场热点摘要\n\n本周王总跟进任务全部完成 ✨' },
];

function BankScrollChat() {
  const [visibleCount, setVisibleCount] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visibleCount >= BANK_SCROLL_MSGS.length) return;
    const msg = BANK_SCROLL_MSGS[visibleCount];
    const typingDelay = msg.from === 'ai' ? 1400 : 800;
    const readDelay = msg.from === 'ai' ? 2200 : 1200;
    const t1 = setTimeout(() => setIsTyping(true), readDelay);
    const t2 = setTimeout(() => {
      setIsTyping(false);
      setVisibleCount(v => v + 1);
    }, readDelay + typingDelay);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [visibleCount]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [visibleCount, isTyping]);

  return (
    <div className="bank-chat-card">
      <div className="bank-chat-header">
        <div className="bank-chat-avatar" style={{ background: 'rgba(230,92,70,0.1)', fontSize: 20 }}>💎</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#2A1F19' }}>高净值客户维护助理</div>
          <div style={{ fontSize: 12, color: '#9e8074' }}>客户生日 / 资产预警 / 关怀触达</div>
        </div>
        <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
      </div>
      <div className="bank-chat-body" ref={bodyRef} style={{ overflowY: 'auto', maxHeight: 420 }}>
        {BANK_SCROLL_MSGS.slice(0, visibleCount).map((msg, i) => (
          <div key={i} className={`bank-msg ${msg.from}`} style={{ animation: 'bankMsgIn 0.3s ease' }}>
            <div className="bank-msg-avatar" style={msg.from === 'user' ? { background: '#E65C46', color: 'white' } : { background: '#F8F2ED' }}>
              {msg.from === 'user' ? '经' : '🤖'}
            </div>
            <div className="bank-msg-bubble" style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
          </div>
        ))}
        {isTyping && (
          <div className="bank-msg ai">
            <div className="bank-msg-avatar" style={{ background: '#F8F2ED' }}>🤖</div>
            <div className="bank-msg-bubble" style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '10px 16px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9e8074', animation: 'bankDot 1.2s infinite' }} />
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9e8074', animation: 'bankDot 1.2s infinite 0.2s' }} />
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9e8074', animation: 'bankDot 1.2s infinite 0.4s' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ListingCard({ listing, onDemo, large }: { listing: Listing; onDemo?: (listing: Listing, avatarUrl: string) => void; large?: boolean }) {
  const hasDemo = !!(listing.demo_personas?.length || listing.demo_messages?.length);
  const avatarUrl = listing.category === 'AI 角色'
    ? `https://api.dicebear.com/9.x/open-peeps/svg?seed=${listing.id}&size=48&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
    : `https://api.dicebear.com/9.x/${['shapes','icons','identicon','rings','bottts','pixel-art','fun-emoji'][listing.id % 7]}/svg?seed=${listing.id}&size=48&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
  return (
    <Link href={`/listings/${listing.slug}`} className="claw-card">
      <div className="claw-card-body">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
          <img
            src={avatarUrl}
            alt=""
            width={48}
            height={48}
            style={{ borderRadius: 10, background: '#F0E8E1', flexShrink: 0 }}
          />
          {hasDemo && onDemo ? (
            <button
              onClick={e => { e.preventDefault(); e.stopPropagation(); onDemo(listing, avatarUrl); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '5px 14px', borderRadius: 999,
                background: '#E65C46', color: '#fff',
                border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 700,
                fontFamily: "'Manrope', sans-serif",
                boxShadow: '0 2px 8px rgba(230,92,70,0.35)',
                whiteSpace: 'nowrap', marginLeft: 'auto',
              }}
            >
              ▶ 查看演示
            </button>
          ) : null}
        </div>
        <div className="claw-card-title" style={large ? { fontSize: 20 } : undefined}>{listing.name}</div>
        <p className="claw-card-desc">{listing.description}</p>
        <div className="claw-card-footer">
          <div className="claw-card-stats">
            <span className="claw-card-stat">
              <Star size={11} fill="currentColor" style={{ color: '#f5a623' }} />
              {((listing.id * 137 + 23) % 200) + 20}
            </span>
            <span className="claw-card-stat">
              <Download size={11} />
              {((listing.id * 89 + 11) % 50) + 5}k
            </span>
            <span className="claw-card-badge" style={{ position: 'static', display: 'inline-block', flexShrink: 0 }}>{listing.category}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="claw-grid">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="claw-skeleton-card">
          <div style={{ padding: '16px' }}>
            <div className="claw-skeleton" style={{ height: 16, marginBottom: 12, width: '40%' }} />
            <div className="claw-skeleton" style={{ height: 20, marginBottom: 8, width: '70%' }} />
            <div className="claw-skeleton" style={{ height: 14, marginBottom: 6 }} />
            <div className="claw-skeleton" style={{ height: 14, width: '80%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Onboarding chat types ─────────────────────────────────────────────────
type OnboardingStep = 'industry' | 'name' | 'functions' | 'hasAccount' | 'register' | 'login' | 'manage' | 'newListing' | 'viewListings' | 'viewBookings';
interface OnboardingState { industry: string; name: string; functions: string[]; }
interface ChatMsg { from: 'ai' | 'user'; text: string; image?: string; audio?: string; }

const INDUSTRY_OPTIONS = [
  { label: "🍜 餐饮 / 生鲜", value: "餐饮/生鲜" },
  { label: "🏨 酒店 / 宾馆", value: "酒店/宾馆" },
  { label: "🛒 电商 / 零售", value: "电商/零售" },
  { label: "💼 服务 / 咨询", value: "服务/咨询" },
  { label: "🏭 制造 / 工厂", value: "制造/工厂" },
  { label: "✨ 其他行业",   value: "其他" },
];
const FUNCTION_OPTIONS = [
  { label: "🤖 AI 客服自动接单", value: "AI客服" },
  { label: "📦 智能进销存管理", value: "进销存" },
  { label: "📣 自动营销推广",   value: "营销推广" },
  { label: "📊 数据分析报表",   value: "数据分析" },
  { label: "👆 以上全部要！",   value: "全部功能" },
];
const LISTING_CATEGORIES = ['营销', '工程', '设计', 'AI 角色', '行业方案', '其他'];

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  border: '1.5px solid rgba(42,31,25,0.2)', outline: 'none',
  fontSize: 15, fontFamily: "'Manrope', sans-serif",
  color: '#2A1F19', background: '#FDF8F5', boxSizing: 'border-box',
};
const btnPrimary = (disabled = false): React.CSSProperties => ({
  width: '100%', padding: '12px', borderRadius: 10, border: 'none',
  background: disabled ? 'rgba(230,92,70,0.08)' : '#E65C46',
  color: disabled ? '#9e8074' : '#fff',
  fontWeight: 700, fontSize: 15,
  cursor: disabled ? 'default' : 'pointer',
  fontFamily: "'Manrope', sans-serif",
  opacity: 1, transition: 'opacity 0.15s',
});

function OnboardingChat({ onClose }: { onClose: () => void }) {
  const { register: doRegister, login: doLogin, user, token, loading: authLoading2, becomeSeller: doBecomeSeller } = useAuth() as {
    register: (c: { username: string; password: string; password_confirmation: string }) => Promise<void>;
    login: (c: { username: string; password: string }) => Promise<void>;
    user: { name: string; username?: string; is_seller: boolean } | null;
    token: string | null;
    loading: boolean;
    becomeSeller: () => Promise<void>;
  };
  const initialized = useRef(false);

  const [step, setStep] = useState<OnboardingStep>('industry');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [bizState, setBizState] = useState<OnboardingState>({ industry: '', name: '', functions: [] });
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [typing, setTyping] = useState(false);
  const [waitingUser, setWaitingUser] = useState(false);

  // onboarding inputs
  const [nameInput, setNameInput] = useState('');
  const [selectedFns, setSelectedFns] = useState<string[]>([]);

  // universal chat input
  const [chatInput, setChatInput] = useState('');

  // auth form
  const [regUsername, setRegUsername]     = useState('');
  const [regPass, setRegPass]             = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPass, setLoginPass]         = useState('');
  const [authError, setAuthError]         = useState('');
  const [authLoading, setAuthLoading]     = useState(false);

  // listing management
  const [myProducts, setMyProducts]         = useState<StoreProduct[]>([]);
  const [myBookings, setMyBookings]         = useState<StoreBooking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [editingStockId, setEditingStockId] = useState<number | null>(null);
  const [editingStockVal, setEditingStockVal] = useState('');
  const [listingsLoading, setListingsLoading] = useState(false);
  const [nlName, setNlName]                 = useState('');
  const [nlCategory, setNlCategory]         = useState('');
  const [nlPrice, setNlPrice]               = useState('0');
  const [nlDesc, setNlDesc]                 = useState('');
  const [nlSubmitting, setNlSubmitting]     = useState(false);
  const [nlError, setNlError]               = useState('');
  const [sellerLoading, setSellerLoading]   = useState(false);

  // file/image input
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<{ name: string; type: string; size: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showFileMenu, setShowFileMenu] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    if (isImage) {
      const reader = new FileReader();
      reader.onload = ev => { if (ev.target?.result) setPendingImage(ev.target.result as string); };
      reader.readAsDataURL(file);
      setPendingFile(null);
    } else {
      setPendingFile({ name: file.name, type: file.type, size: file.size });
      setPendingImage(null);
    }
    e.target.value = '';
    setShowFileMenu(false);
  };

  const fileTypeIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('excel') || type.includes('spreadsheet') || type.includes('csv')) return '📊';
    return '📎';
  };

  // audio/voice input
  const [isRecording, setIsRecording] = useState(false);
  const [pendingAudio, setPendingAudio] = useState<{ url: string; blob: Blob } | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mr.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setPendingAudio({ url, blob });
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setIsRecording(true);
    } catch {
      pushAI("无法访问麦克风，请检查浏览器权限。");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    setIsRecording(false);
  };

  const msgsRef = useRef<HTMLDivElement>(null);

  const scrollBottom = useCallback(() => {
    setTimeout(() => { if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight; }, 60);
  }, []);

  const pushAI = useCallback((text: string, delay = 900) => {
    setTyping(true);
    setWaitingUser(false);
    setTimeout(() => {
      setTyping(false);
      setMsgs(prev => [...prev, { from: 'ai', text }]);
      setWaitingUser(true);
      scrollBottom();
    }, delay);
  }, [scrollBottom]);

  // initial greeting — wait for auth state to resolve
  useEffect(() => {
    if (authLoading2) return;
    if (initialized.current) return;
    initialized.current = true;

    if (user) {
      const displayName = user.name || user.username || '您';
      setStep('manage');
      // push two messages with a natural delay
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMsgs([{ from: 'ai', text: `嗨，${displayName}！👋 欢迎回来～` }]);
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
          setMsgs(prev => [...prev, {
            from: 'ai',
            text: `我是您的专属店铺助手 🦞\n\n在这里您可以直接：\n📦 上架 / 管理商品\n📊 查看经营报表\n💡 了解使用说明\n\n有什么我可以帮您的？`,
          }]);
          setWaitingUser(true);
          scrollBottom();
        }, 1000);
      }, 700);
    } else {
      pushAI("您好！我是Clawmart开店助手 🦞\n欢迎来到 ClawMart！\n\n我来帮您快速开设专属 AI 店铺，整个过程只需 3 分钟 ⚡\n\n首先，您的业务属于哪个行业？", 600);
    }
  }, [authLoading2]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { scrollBottom(); }, [msgs, typing, scrollBottom]);

  // fetch store products when entering viewListings
  useEffect(() => {
    if (step === 'viewListings' && token) {
      setListingsLoading(true);
      storeApi.getMyProducts(token)
        .then(res => setMyProducts(res?.data || []))
        .catch(() => {})
        .finally(() => setListingsLoading(false));
    }
  }, [step, token]);

  // ── helpers ──────────────────────────────────────────────────────────────
  const enterManage = useCallback((username: string) => {
    setStep('manage');
    pushAI(`🎉 欢迎，${username}！\n\n您现在可以在这里直接管理店铺，请问想做什么？`, 700);
  }, [pushAI]);

  // ── onboarding handlers ──────────────────────────────────────────────────
  const handleIndustry = (value: string, label: string) => {
    if (!waitingUser) return;
    setWaitingUser(false);
    setMsgs(prev => [...prev, { from: 'user', text: label }]);
    setBizState(s => ({ ...s, industry: value }));
    setStep('name');
    pushAI(`好选择！${value} 行业在我们平台非常受欢迎 🔥\n\n您的店铺名称是什么？`);
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !waitingUser) return;
    const name = nameInput.trim();
    setWaitingUser(false);
    setNameInput('');
    setMsgs(prev => [...prev, { from: 'user', text: name }]);
    setTyping(true);

    const acceptName = () => {
      setBizState(s => ({ ...s, name }));
      setStep('functions');
      pushAI(`「${name}」——好名字！✨\n\n您最希望 AI 店铺帮您实现哪些功能？（可多选）`);
    };

    try {
      const r = await storeApi.validateOnboarding('name', name);
      setTyping(false);
      if (!r.valid) {
        pushAI(
          `「${name}」看起来不太像一个店铺名 😅\n\n` +
          `您可以试试更具体的，比如「老王家烧烤」、「喵喵宠物店」、「ABC 咖啡」～`
        );
        return;
      }
      acceptName();
    } catch {
      // 服务异常 → 静默降级，接受原文
      setTyping(false);
      acceptName();
    }
  };

  const handleFnConfirm = () => {
    if (!waitingUser || selectedFns.length === 0) return;
    setWaitingUser(false);
    const label = selectedFns.includes('全部功能') ? '以上全部功能' : selectedFns.join('、');
    setMsgs(prev => [...prev, { from: 'user', text: label }]);
    setBizState(s => ({ ...s, functions: selectedFns }));
    setStep('hasAccount');
    pushAI(`完美！AI 店铺方案已规划好：\n\n✅ 店铺名称：${bizState.name}\n✅ 行业：${bizState.industry}\n✅ 核心功能：${label}\n\n您已经有 ClawMart 账号了吗？`);
  };

  const handleHasAccount = (value: string, label: string) => {
    if (!waitingUser) return;
    setWaitingUser(false);
    setMsgs(prev => [...prev, { from: 'user', text: label }]);
    if (value === 'has') { setStep('login'); pushAI("好的！请填写您的登录信息 👇"); }
    else { setStep('register'); pushAI("好的！填写以下信息，马上开始 👇"); }
  };

  // ── auth handlers ────────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername.trim() || !regPass.trim()) return;
    setAuthError(''); setAuthLoading(true);
    try {
      await doRegister({ username: regUsername.trim(), password: regPass, password_confirmation: regPass });
      setMsgs(prev => [...prev, { from: 'user', text: regUsername }]);
      enterManage(regUsername);
    } catch (err: unknown) {
      setAuthError((err as { message?: string })?.message || '注册失败，请检查后重试');
    } finally { setAuthLoading(false); }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPass.trim()) return;
    setAuthError(''); setAuthLoading(true);
    try {
      await doLogin({ username: loginUsername.trim(), password: loginPass });
      setMsgs(prev => [...prev, { from: 'user', text: loginUsername }]);
      enterManage(loginUsername);
    } catch {
      setAuthError('用户名或密码不正确，请重试');
    } finally { setAuthLoading(false); }
  };

  // ── store management handlers ─────────────────────────────────────────────
  const handleBecomeSeller = async () => {
    setSellerLoading(true);
    try {
      await doBecomeSeller();
      pushAI("🎉 卖家权限已激活！请问想做什么？");
    } catch { pushAI("激活失败，请稍后重试。"); }
    finally { setSellerLoading(false); }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlName.trim() || !token) return;
    setNlSubmitting(true); setNlError('');
    try {
      await storeApi.createProduct({
        name: nlName.trim(),
        price: parseFloat(nlPrice) || 0,
        unit: nlCategory.trim() || undefined,
        description: nlDesc.trim() || undefined,
        is_active: true,
      }, token);
      const created = nlName.trim();
      setNlName(''); setNlCategory(''); setNlPrice('0'); setNlDesc('');
      setMsgs(prev => [...prev, { from: 'user', text: `上架：${created}` }]);
      setStep('manage');
      pushAI(`✅ 「${created}」已成功上架！\n\n还想做什么？`);
    } catch { setNlError('上架失败，请重试'); }
    finally { setNlSubmitting(false); }
  };

  const handleDeleteProduct = async (product: StoreProduct) => {
    if (!token) return;
    try {
      await storeApi.deleteProduct(product.id, token);
      setMyProducts(prev => prev.filter(p => p.id !== product.id));
      setMsgs(prev => [...prev, { from: 'ai', text: `🗑️ 已删除「${product.name}」` }]);
      scrollBottom();
    } catch {}
  };

  const handleUpdateStock = async (productId: number, stockVal: string) => {
    if (!token) return;
    const stock = parseInt(stockVal);
    if (isNaN(stock) || stock < 0) { setEditingStockId(null); return; }
    try {
      await storeApi.updateProduct(productId, { stock }, token);
      setMyProducts(prev => prev.map(p => p.id === productId ? { ...p, stock } : p));
    } catch {}
    setEditingStockId(null);
  };

  const backToManage = () => { setStep('manage'); pushAI("好的，还有什么可以帮您？"); };

  // ── smart fill: 语音/图片/文字 → AI 识别 → 自动填入表单 ─────────────────
  const handleSmartFill = async (hint: string, imageBase64: string | null, _file: null) => {
    setTyping(true);
    setWaitingUser(false);
    try {
      const messages: { role: 'user'; content: string }[] = [];
      if (imageBase64) {
        messages.push({
          role: 'user',
          content: `请从这张商品图片中识别商品信息${hint ? `，补充说明：${hint}` : ''}。返回 JSON：{"name":"商品名称","unit":"单位如斤盒个","price":0,"description":"简短描述"}，只返回JSON不要其他文字。图片base64：${imageBase64.slice(0, 200)}…（已截断）`,
        });
      } else {
        messages.push({
          role: 'user',
          content: `从以下描述中提取商品上架信息：「${hint}」\n返回 JSON：{"name":"商品名称","unit":"单位如斤盒个","price":数字,"description":"简短描述"}，只返回JSON不要其他文字。如果价格不明确填0。`,
        });
      }

      const res = await fetch('/api/store-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: '__smart_fill__', messages }),
      });

      if (!res.ok || !res.body) throw new Error('API error');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let raw = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.trim()) continue;
          try { raw += (JSON.parse(line).text || ''); } catch { /* skip */ }
        }
      }

      // 提取 JSON
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.name) setNlName(parsed.name);
        if (parsed.unit) setNlCategory(parsed.unit);
        if (parsed.price != null) setNlPrice(String(parsed.price));
        if (parsed.description) setNlDesc(parsed.description);
        setTyping(false);
        setWaitingUser(true);
        setMsgs(prev => [...prev, { from: 'ai', text: `✅ 已识别并填入表单，请确认后点击「确认上架」` }]);
        scrollBottom();
      } else {
        throw new Error('parse failed');
      }
    } catch {
      setTyping(false);
      setWaitingUser(true);
      setMsgs(prev => [...prev, { from: 'ai', text: '识别失败，请手动填写表单 🙏' }]);
      scrollBottom();
    }
  };

  const handleViewBookings = () => {
    setMsgs(prev => [...prev, { from: 'user', text: '📅 预定和订单' }]);
    setWaitingUser(false);
    setStep('viewBookings');
    setBookingsLoading(true);
    storeApi.getMyBookings(token!)
      .then(res => setMyBookings(res?.data || []))
      .catch(() => {})
      .finally(() => { setBookingsLoading(false); setWaitingUser(true); scrollBottom(); });
    pushAI("正在加载预定和订单…", 300);
  };

  const handleBookingStatus = async (id: number, status: 'confirmed' | 'cancelled' | 'completed') => {
    if (!token) return;
    try {
      await storeApi.updateBookingStatus(id, status, token);
      setMyBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      const label = status === 'confirmed' ? '已确认' : status === 'cancelled' ? '已取消' : '已完成';
      setMsgs(prev => [...prev, { from: 'ai', text: `✅ 订单 #${id} 状态已更新为「${label}」` }]);
      scrollBottom();
    } catch {
      setMsgs(prev => [...prev, { from: 'ai', text: '❌ 操作失败，请稍后重试' }]);
      scrollBottom();
    }
  };

  // ── universal text input handler ───────────────────────────────────────────
  const handleChatInput = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text && !pendingImage && !pendingAudio && !pendingFile) return;
    setChatInput('');
    const img = pendingImage;
    const aud = pendingAudio;
    const fil = pendingFile;
    setPendingImage(null);
    setPendingAudio(null);
    setPendingFile(null);

    // if audio
    if (aud) {
      setMsgs(prev => [...prev, { from: 'user', text: text || '🎤 语音消息', audio: aud.url }]);
      if (step === 'newListing') {
        handleSmartFill(text || '', null, null);
      } else {
        pushAI("✅ 已收到您的语音消息，正在处理…", 800);
      }
      return;
    }

    // if image
    if (img) {
      setMsgs(prev => [...prev, { from: 'user', text, image: img }]);
      if (step === 'newListing') {
        handleSmartFill(text || '', img, null);
      } else {
        pushAI("✅ 已收到您发送的图片，我来查看一下…", 800);
      }
      return;
    }

    // if file (pdf/excel etc.)
    if (fil) {
      const icon = fileTypeIcon(fil.type);
      const sizeStr = fil.size > 1024 * 1024 ? `${(fil.size / 1024 / 1024).toFixed(1)}MB` : `${(fil.size / 1024).toFixed(0)}KB`;
      setMsgs(prev => [...prev, { from: 'user', text: `${icon} ${fil.name}（${sizeStr}）` }]);
      if (step === 'newListing') {
        handleSmartFill(fil.name, null, null);
      } else {
        pushAI(`✅ 已收到文件「${fil.name}」，我来查看一下…`, 800);
      }
      return;
    }

    const t = text;
    const tl = t.toLowerCase();

    // plain text in newListing step → smart fill
    if (step === 'newListing' && t) {
      setMsgs(prev => [...prev, { from: 'user', text: t }]);
      handleSmartFill(t, null, null);
      return;
    }

    if (step === 'industry') {
      // ① 本地关键词命中即走，省一次 LLM 调用
      const match = INDUSTRY_OPTIONS.find(o =>
        o.label.includes(t) || o.value.includes(t) ||
        tl.includes(o.value.toLowerCase()) || tl.includes(o.label.toLowerCase())
      );
      if (match) { handleIndustry(match.value, match.label); return; }

      // ② 没命中 → 调 LLM 兜底分类
      if (!waitingUser) return;
      setWaitingUser(false);
      setMsgs(prev => [...prev, { from: 'user', text: t }]);
      setTyping(true);

      try {
        const { industry, confidence } = await storeApi.classifyIndustry(t);
        setTyping(false);

        // 跑题或低置信 → 礼貌复读，仍停在 industry 步骤
        if (industry === 'unknown' || confidence < 0.5) {
          pushAI(
            "抱歉，我没太理解您的意思 😅\n\n" +
            "您可以直接点下面的行业按钮，或简短描述一下您做什么生意，比如「我开烧烤店」、「我卖衣服」、「我做民宿」～"
          );
          return;
        }

        // 命中枚举 → 走标准 handleIndustry
        const matched = INDUSTRY_OPTIONS.find(o => o.value === industry);
        if (matched) {
          // handleIndustry 会再 push 一条 user msg；这里我们已 push 过，回退一下
          setMsgs(prev => prev.slice(0, -1));
          setWaitingUser(true);
          handleIndustry(matched.value, matched.label);
        } else {
          // 后端返回的 industry 不在枚举里（防御性）
          setBizState(s => ({ ...s, industry }));
          setStep('name');
          pushAI(`好的，${industry} 行业！您的店铺名称是什么？`);
        }
      } catch {
        // 网络/服务器异常 → 静默降级为原"接受原文"行为，不报错给用户
        setTyping(false);
        setBizState(s => ({ ...s, industry: t }));
        setStep('name');
        pushAI(`好的，${t} 行业！您的店铺名称是什么？`);
      }

    } else if (step === 'functions') {
      if (!waitingUser) return;
      setWaitingUser(false);
      setMsgs(prev => [...prev, { from: 'user', text: t }]);
      setTyping(true);

      try {
        const r = await storeApi.validateOnboarding('functions', t);
        setTyping(false);
        if (!r.valid) {
          pushAI(
            "我没太理解您想要的功能 😅\n\n" +
            "您可以直接勾选下面的功能选项，或简短描述，比如「我要 AI 客服和数据分析」、「全部都要」～"
          );
          return;
        }
        const matched = r.data?.matched?.length ? r.data.matched : ['全部功能'];
        setBizState(s => ({ ...s, functions: matched }));
        setStep('hasAccount');
        pushAI(`明白！功能需求已记录：${matched.join('、')}\n\n您已经有 ClawMart 账号了吗？`);
      } catch {
        setTyping(false);
        setBizState(s => ({ ...s, functions: [t] }));
        setStep('hasAccount');
        pushAI(`明白！功能需求已记录：${t}\n\n您已经有 ClawMart 账号了吗？`);
      }

    } else if (step === 'hasAccount') {
      if (!waitingUser) return;
      setWaitingUser(false);
      setMsgs(prev => [...prev, { from: 'user', text: t }]);
      setTyping(true);

      try {
        const r = await storeApi.validateOnboarding('hasAccount', t);
        setTyping(false);
        if (!r.valid) {
          pushAI("没听清楚 😅 您已经有 ClawMart 账号了吗？\n\n点击下面的「有」或「没有」，或直接告诉我。");
          return;
        }
        // handleHasAccount 自身会 push 一条 user msg；这里已 push 过，回退一条
        setMsgs(prev => prev.slice(0, -1));
        setWaitingUser(true);
        handleHasAccount(r.data?.has_account ? 'has' : 'no', t);
      } catch {
        setTyping(false);
        // 静默降级：旧正则
        const hasAcc = /有|登录|已有|有账号/.test(tl);
        setMsgs(prev => prev.slice(0, -1));
        setWaitingUser(true);
        handleHasAccount(hasAcc ? 'has' : 'no', t);
      }

    } else if (step === 'manage' || step === 'viewListings') {
      setMsgs(prev => [...prev, { from: 'user', text: t }]);
      setWaitingUser(false);
      if (/上架|新商品|添加|发布/.test(tl)) {
        setStep('newListing');
        pushAI("好的！请填写新商品信息 👇", 400);
      } else if (/商品|列表|查看|我的/.test(tl)) {
        setStep('viewListings');
        pushAI("正在加载您的商品列表…", 300);
      } else if (/报表|数据|统计|分析|销量/.test(tl)) {
        handleReport();
      } else if (/帮助|说明|怎么|如何|教|使用/.test(tl)) {
        handleHelp();
      } else if (/激活|卖家|开店/.test(tl)) {
        handleBecomeSeller();
      } else {
        pushAI(`您好！我理解您的意思 😊\n\n我目前可以帮您：\n📦 上架新商品\n📋 商品及库存\n📊 经营报表\n💡 使用说明\n\n请问您想做哪个？`);
      }
    }
  };

  // push multiple AI messages one after another (for help tips)
  const pushSequence = useCallback((messages: string[], onDone?: () => void) => {
    setWaitingUser(false);
    let delay = 0;
    messages.forEach((text, i) => {
      const isLast = i === messages.length - 1;
      delay += 400;
      const t1 = delay;
      setTimeout(() => setTyping(true), t1);
      delay += 900;
      const t2 = delay;
      setTimeout(() => {
        setTyping(false);
        setMsgs(prev => [...prev, { from: 'ai', text }]);
        if (isLast) { setWaitingUser(true); onDone?.(); }
        scrollBottom();
      }, t2);
    });
  }, [scrollBottom]);

  const handleHelp = () => {
    setMsgs(prev => [...prev, { from: 'user', text: '💡 使用说明' }]);
    setWaitingUser(false);
    pushSequence([
      "好的！让我来介绍一下怎么用这个对话框管理您的店铺 👇",
      "📦 上架商品\n点「上架新商品」，填写名称、分类、价格（0 = 免费）和描述，一键搞定！\n\n价格设为 0 代表免费获取，适合引流。",
      "📋 管理商品\n点「商品及库存」可以查看所有已上架的商品，随时删除不需要的。\n\n今后还会支持直接在这里编辑商品内容。",
      "📊 经营报表\n点「经营报表」可以看到商品数量、状态分布、免费/付费比例等数据，帮助您了解店铺现状。",
      "💬 小贴士\n\n✅ 所有操作都在这个对话框里完成，无需跳转页面\n✅ 随时点「←返回」可以回到主菜单\n✅ 遇到问题直接告诉我，我来帮您解决 🦞\n\n还有什么想了解的？",
    ]);
  };

  const handleReport = async () => {
    setMsgs(prev => [...prev, { from: 'user', text: '📊 经营报表' }]);
    setWaitingUser(false);
    if (!token) { pushAI("请先登录后再查看报表。"); return; }
    setTyping(true);
    try {
      const res = await storeApi.getMyProducts(token);
      const all = res?.data || [];
      const active = all.filter(p => p.is_active).length;
      const inactive = all.length - active;
      const free   = all.filter(p => parseFloat(p.price) === 0).length;
      const paid   = all.length - free;
      const report = [
        `📊 您的店铺经营报表`,
        `商品总数：${all.length} 个\n✅ 上架中：${active} 个\n⏸️ 已下架：${inactive} 个`,
        `💰 付费商品：${paid} 个\n🆓 免费商品：${free} 个`,
        all.length === 0
          ? "您还没有上架任何商品，点「上架新商品」开始吧！🚀"
          : `数据已更新 ✨\n\n还想做什么？`,
      ];
      setTyping(false);
      pushSequence(report);
    } catch {
      setTyping(false);
      pushAI("获取报表失败，请稍后重试。");
    }
  };

  // ── option button style helper ─────────────────────────────────────────────
  const optBtn = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    padding: '9px 14px', borderRadius: 10, fontSize: 14, fontWeight: 600,
    border: '1.5px solid rgba(42,31,25,0.15)', background: '#F8F2ED',
    cursor: 'pointer', color: '#2A1F19', fontFamily: "'Manrope', sans-serif",
    transition: 'border-color 0.15s, background 0.15s', textAlign: 'center' as const,
    ...extra,
  });

  const TypingDots = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#fff', border: '1.5px solid #E65C46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🦞</div>
      <div style={{ background: '#fff', borderRadius: 16, borderBottomLeftRadius: 4, padding: '10px 14px', display: 'flex', gap: 4, boxShadow: '0 2px 6px rgba(42,31,25,0.1)' }}>
        {[0, 0.2, 0.4].map((d, i) => (
          <span key={i} style={{ width: 6, height: 6, background: '#E65C46', borderRadius: '50%', display: 'inline-block', animation: `bounce 1.2s ${d}s infinite` }} />
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease', padding: 'clamp(6px, 2vw, 16px)' }} onClick={onClose}>
      <style>{`
        @media (max-width: 480px) {
          .claw-chat-modal {
            max-width: 100% !important;
            max-height: 100% !important;
            border-radius: 14px !important;
            height: 100%;
          }
        }
      `}</style>
      <div className="claw-chat-modal" style={{ width: '100%', maxWidth: 440, background: '#fff', borderRadius: 20, boxShadow: '0 24px 80px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', overflow: 'hidden', maxHeight: '92vh', animation: 'slideUp 0.3s cubic-bezier(.22,1,.36,1)' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #E65C46 0%, #c9402a 100%)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', border: '2px solid rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🦞</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Clawmart开店助手</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, background: '#7fff7f', borderRadius: '50%', display: 'inline-block' }} />
              {['manage', 'newListing', 'viewListings'].includes(step) && user
                ? `已登录：${user.name || user.username || ''}`
                : '在线 · 平均 3 分钟完成开店'}
            </div>
          </div>
          {/* Font size controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'rgba(0,0,0,0.15)', borderRadius: 8, padding: '3px 5px' }}>
            {(['sm', 'md', 'lg'] as const).map((s, i) => (
              <button key={s} onClick={() => setFontSize(s)} style={{
                background: fontSize === s ? 'rgba(255,255,255,0.3)' : 'transparent',
                border: 'none', cursor: 'pointer', color: '#fff',
                borderRadius: 5, padding: '2px 5px', lineHeight: 1,
                fontSize: [11, 13, 16][i], fontWeight: 700,
                fontFamily: "'Manrope', sans-serif",
                transition: 'background 0.15s',
              }}>A</button>
            ))}
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: '50%', color: '#fff', fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        {/* Messages */}
        <div ref={msgsRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 10, background: '#F8F2ED', minHeight: 0 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
              {m.from === 'ai' && <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#fff', border: '1.5px solid #E65C46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0, marginRight: 7, marginTop: 2 }}>🦞</div>}
              <div style={{
                maxWidth: '78%', padding: (m.image && !m.text) || (m.audio && !m.text) ? '6px' : '9px 13px', borderRadius: 15,
                fontSize: fontSize === 'sm' ? 12 : fontSize === 'lg' ? 16 : 14,
                lineHeight: 1.55, fontFamily: "'Manrope', sans-serif", whiteSpace: 'pre-line',
                ...(m.from === 'ai'
                  ? { background: '#fff', color: '#2A1F19', borderBottomLeftRadius: 4, boxShadow: '0 2px 6px rgba(230,92,70,0.1)' }
                  : { background: '#E65C46', color: '#fff', borderBottomRightRadius: 4 }),
              }}>
                {m.image && <img src={m.image} alt="" style={{ display: 'block', maxWidth: 200, maxHeight: 200, borderRadius: 8, marginBottom: m.text ? 6 : 0 }} />}
                {m.audio && (
                  <audio controls src={m.audio} style={{ display: 'block', maxWidth: 220, height: 36, marginBottom: m.text ? 6 : 0, borderRadius: 8 }} />
                )}
                {m.text && m.text !== '🎤 语音消息' ? m.text : (!m.audio ? m.text : null)}
              </div>
            </div>
          ))}
          {typing && <TypingDots />}
        </div>

        {/* ── Bottom panel ──────────────────────────────────────────────────── */}
        <div style={{ background: '#fff', padding: '12px 14px 14px', flexShrink: 0, borderTop: '1px solid rgba(42,31,25,0.1)', boxSizing: 'border-box', position: 'relative' }}>

          {/* industry */}
          {waitingUser && !typing && step === 'industry' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {INDUSTRY_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => handleIndustry(opt.value, opt.label)}
                  style={{ ...optBtn({ flex: '1 1 calc(33% - 7px)', whiteSpace: 'nowrap', fontSize: 13.5, padding: '8px 8px' }) }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#E65C46'; e.currentTarget.style.background = 'rgba(230,92,70,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,31,25,0.15)'; e.currentTarget.style.background = '#F8F2ED'; }}
                >{opt.label}</button>
              ))}
            </div>
          )}

          {/* shop name */}
          {waitingUser && !typing && step === 'name' && (
            <form onSubmit={handleNameSubmit} style={{ display: 'flex', gap: 8 }}>
              <input autoFocus value={nameInput} onChange={e => setNameInput(e.target.value)} placeholder="输入您的店铺名称…" style={{ ...inputStyle, flex: 1 }} />
              <button type="submit" disabled={!nameInput.trim()} style={{ ...btnPrimary(!nameInput.trim()), width: 'auto', padding: '10px 16px', flexShrink: 0 }}>发送</button>
            </form>
          )}

          {/* functions */}
          {waitingUser && !typing && step === 'functions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {FUNCTION_OPTIONS.map(opt => {
                  const sel = selectedFns.includes(opt.value);
                  return <button key={opt.value} onClick={() => {
                    if (opt.value === '全部功能') setSelectedFns(['全部功能']);
                    else setSelectedFns(prev => { const f = prev.filter(v => v !== '全部功能'); return sel ? f.filter(v => v !== opt.value) : [...f, opt.value]; });
                  }} style={{
                    padding: '7px 12px', borderRadius: 10, fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
                    border: `1.5px solid ${sel ? '#E65C46' : 'rgba(42,31,25,0.15)'}`,
                    background: sel ? 'rgba(230,92,70,0.08)' : '#F8F2ED',
                    color: sel ? '#E65C46' : '#2A1F19', fontFamily: "'Manrope', sans-serif", transition: 'all 0.15s',
                  }}>{opt.label}</button>;
                })}
              </div>
              <button onClick={handleFnConfirm} disabled={selectedFns.length === 0} style={btnPrimary(selectedFns.length === 0)}>确认选择 →</button>
            </div>
          )}

          {/* has account */}
          {waitingUser && !typing && step === 'hasAccount' && (
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ label: '已有账号，直接开店', value: 'has' }, { label: '还没有，帮我注册', value: 'no' }].map(opt => (
                <button key={opt.value} onClick={() => handleHasAccount(opt.value, opt.label)}
                  style={{ ...optBtn({ flex: 1 }) }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#E65C46'; e.currentTarget.style.background = 'rgba(230,92,70,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,31,25,0.15)'; e.currentTarget.style.background = '#F8F2ED'; }}
                >{opt.label}</button>
              ))}
            </div>
          )}

          {/* register */}
          {waitingUser && !typing && step === 'register' && (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <input autoFocus value={regUsername} onChange={e => setRegUsername(e.target.value)} placeholder="用户名（字母、数字、中文、_ -）" style={inputStyle} required />
              <input type="password" value={regPass} onChange={e => setRegPass(e.target.value)} placeholder="密码（至少 8 位）" style={inputStyle} required minLength={8} />
              {authError && <p style={{ margin: 0, fontSize: 12, color: '#D32F2F', fontFamily: "'Manrope', sans-serif" }}>{authError}</p>}
              <button type="submit" disabled={authLoading} style={{ ...btnPrimary(authLoading), opacity: authLoading ? 0.7 : 1 }}>
                {authLoading ? '注册中…' : '🎉 立即注册开店'}
              </button>
            </form>
          )}

          {/* login */}
          {waitingUser && !typing && step === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <input autoFocus value={loginUsername} onChange={e => setLoginUsername(e.target.value)} placeholder="用户名" style={inputStyle} required />
              <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="密码" style={inputStyle} required />
              {authError && <p style={{ margin: 0, fontSize: 12, color: '#D32F2F', fontFamily: "'Manrope', sans-serif" }}>{authError}</p>}
              <button type="submit" disabled={authLoading} style={{ ...btnPrimary(authLoading), opacity: authLoading ? 0.7 : 1 }}>
                {authLoading ? '登录中…' : '🚀 登录，立即开店'}
              </button>
            </form>
          )}

          {/* ── manage: main menu ─────────────────────────────────────────── */}
          {waitingUser && !typing && step === 'manage' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {!user?.is_seller ? (
                <>
                  <p style={{ margin: '0 0 4px', fontSize: 13, color: '#9e8074', fontFamily: "'Manrope', sans-serif" }}>
                    需要先激活卖家权限才能上架商品 👇
                  </p>
                  <button onClick={handleBecomeSeller} disabled={sellerLoading} style={btnPrimary(sellerLoading)}>
                    {sellerLoading ? '激活中…' : '🔓 激活卖家权限（免费）'}
                  </button>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button onClick={handleReport}
                      style={{ ...optBtn({ flex: 1, padding: '7px 10px', fontSize: 12 }) }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#E65C46'; e.currentTarget.style.background = 'rgba(230,92,70,0.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,31,25,0.15)'; e.currentTarget.style.background = '#F8F2ED'; }}
                    >📊 经营报表</button>
                    <button onClick={handleHelp}
                      style={{ ...optBtn({ flex: 1, padding: '7px 10px', fontSize: 12 }) }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#E65C46'; e.currentTarget.style.background = 'rgba(230,92,70,0.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,31,25,0.15)'; e.currentTarget.style.background = '#F8F2ED'; }}
                    >💡 使用说明</button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => { setMsgs(prev => [...prev, { from: 'user', text: '📦 上架新商品' }]); setStep('newListing'); setTyping(true); setTimeout(() => { setTyping(false); setMsgs(prev => [...prev, { from: 'ai', text: '好的！请填写商品信息 👇' }]); setWaitingUser(true); scrollBottom(); }, 400); }}
                      style={{ ...optBtn({ flex: 1, padding: '7px 10px', fontSize: 12 }) }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#E65C46'; e.currentTarget.style.background = 'rgba(230,92,70,0.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,31,25,0.15)'; e.currentTarget.style.background = '#F8F2ED'; }}
                    >📦 上架新商品</button>
                    <button onClick={() => { setMsgs(prev => [...prev, { from: 'user', text: '📋 商品及库存' }]); setStep('viewListings'); setTyping(true); setTimeout(() => { setTyping(false); setMsgs(prev => [...prev, { from: 'ai', text: '正在加载您的商品列表…' }]); scrollBottom(); }, 300); }}
                      style={{ ...optBtn({ flex: 1, padding: '7px 10px', fontSize: 12 }) }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#E65C46'; e.currentTarget.style.background = 'rgba(230,92,70,0.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,31,25,0.15)'; e.currentTarget.style.background = '#F8F2ED'; }}
                    >📋 商品及库存</button>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={handleReport}
                      style={{ ...optBtn({ flex: 1, padding: '7px 10px', fontSize: 12 }) }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#E65C46'; e.currentTarget.style.background = 'rgba(230,92,70,0.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,31,25,0.15)'; e.currentTarget.style.background = '#F8F2ED'; }}
                    >📊 经营报表</button>
                    <button onClick={handleHelp}
                      style={{ ...optBtn({ flex: 1, padding: '7px 10px', fontSize: 12 }) }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#E65C46'; e.currentTarget.style.background = 'rgba(230,92,70,0.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,31,25,0.15)'; e.currentTarget.style.background = '#F8F2ED'; }}
                    >💡 使用说明</button>
                    <button onClick={handleViewBookings}
                      style={{ ...optBtn({ flex: 1, padding: '7px 10px', fontSize: 12 }) }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#E65C46'; e.currentTarget.style.background = 'rgba(230,92,70,0.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,31,25,0.15)'; e.currentTarget.style.background = '#F8F2ED'; }}
                    >📅 预定和订单</button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── new listing form ──────────────────────────────────────────── */}
          {waitingUser && !typing && step === 'newListing' && (
            <form onSubmit={handleCreateListing} style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {/* 智能录入提示 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 10px', background: 'rgba(230,92,70,0.06)', borderRadius: 9, border: '1px solid rgba(230,92,70,0.18)' }}>
                <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>✨</span>
                <p style={{ margin: 0, fontSize: 12, color: '#6B5549', fontFamily: "'Manrope', sans-serif", lineHeight: 1.5 }}>
                  也可以用下方输入栏：<strong>🎤 语音描述</strong>、<strong>📷 拍照</strong> 或 <strong>📎 发送附件</strong>，AI 自动识别并填入表单
                </p>
              </div>
              <input autoFocus value={nlName} onChange={e => setNlName(e.target.value)} placeholder="商品名称" style={{ ...inputStyle, padding: '7px 10px', fontSize: 13 }} required />
              <div style={{ display: 'flex', gap: 6 }}>
                <input value={nlCategory} onChange={e => setNlCategory(e.target.value)} placeholder="单位（如：斤、盒、个）"
                  style={{ ...inputStyle, flex: 1, padding: '7px 10px', fontSize: 13 }} />
                <input type="number" value={nlPrice} onChange={e => setNlPrice(e.target.value)} placeholder="价格" min="0" step="0.01"
                  style={{ ...inputStyle, width: 80, flexShrink: 0, padding: '7px 10px', fontSize: 13 }} />
              </div>
              <textarea value={nlDesc} onChange={e => setNlDesc(e.target.value)} placeholder="商品描述（可选）"
                rows={2} style={{ ...inputStyle, resize: 'none' as const, padding: '7px 10px', fontSize: 13 }} />
              {nlError && <p style={{ margin: 0, fontSize: 11, color: '#D32F2F', fontFamily: "'Manrope', sans-serif" }}>{nlError}</p>}
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="button" onClick={backToManage} style={{ ...optBtn({ width: 'auto', padding: '7px 12px', fontSize: 12, flexShrink: 0 }) }}>← 返回</button>
                <button type="submit" disabled={nlSubmitting || !nlName.trim()} style={{ ...btnPrimary(nlSubmitting || !nlName.trim()), flex: 1, padding: '7px 0', fontSize: 13 }}>
                  {nlSubmitting ? '上架中…' : '✅ 确认上架'}
                </button>
              </div>
            </form>
          )}

          {/* ── view listings ─────────────────────────────────────────────── */}
          {waitingUser && !typing && step === 'viewListings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 260, overflowY: 'auto' }}>
              {/* 标题栏 + 关闭按钮 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2, flexShrink: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#2A1F19', fontFamily: "'Manrope', sans-serif" }}>商品及库存</span>
                <button onClick={backToManage} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9e8074', fontSize: 18, lineHeight: 1, padding: '0 2px', fontFamily: "'Manrope', sans-serif" }}>×</button>
              </div>
              {listingsLoading ? (
                <p style={{ margin: 0, fontSize: 14, color: '#9e8074', fontFamily: "'Manrope', sans-serif", textAlign: 'center', padding: '12px 0' }}>加载中…</p>
              ) : myProducts.length === 0 ? (
                <p style={{ margin: 0, fontSize: 14, color: '#9e8074', fontFamily: "'Manrope', sans-serif", textAlign: 'center', padding: '12px 0' }}>暂无商品，去上架第一个吧！</p>
              ) : myProducts.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#F8F2ED', borderRadius: 10, border: '1px solid rgba(42,31,25,0.1)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#2A1F19', fontFamily: "'Manrope', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: '#9e8074', fontFamily: "'Manrope', sans-serif" }}>
                        {p.unit ? `${p.unit} · ` : ''}{parseFloat(p.price) === 0 ? '免费' : `¥${p.price}`} · {p.is_active ? '上架中' : '已下架'}
                      </span>
                      {/* 库存可编辑 */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 12, color: '#9e8074', fontFamily: "'Manrope', sans-serif" }}>库存</span>
                        {editingStockId === p.id ? (
                          <input
                            autoFocus
                            type="number"
                            min="0"
                            value={editingStockVal}
                            onChange={e => setEditingStockVal(e.target.value)}
                            onBlur={() => handleUpdateStock(p.id, editingStockVal)}
                            onKeyDown={e => { if (e.key === 'Enter') handleUpdateStock(p.id, editingStockVal); if (e.key === 'Escape') setEditingStockId(null); }}
                            style={{ width: 52, padding: '1px 5px', fontSize: 12, borderRadius: 5, border: '1.5px solid #E65C46', outline: 'none', fontFamily: "'Manrope', sans-serif", color: '#2A1F19' }}
                          />
                        ) : (
                          <button
                            onClick={() => { setEditingStockId(p.id); setEditingStockVal(String(p.stock ?? 0)); }}
                            style={{ background: 'rgba(42,31,25,0.07)', border: 'none', borderRadius: 5, padding: '1px 7px', fontSize: 12, cursor: 'pointer', color: '#2A1F19', fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
                          >{p.stock ?? '—'}</button>
                        )}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteProduct(p)} style={{ flexShrink: 0, background: 'none', border: '1px solid rgba(230,92,70,0.35)', color: '#E65C46', borderRadius: 7, padding: '4px 10px', fontSize: 12, cursor: 'pointer', fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>删除</button>
                </div>
              ))}
              <button onClick={backToManage} style={{ ...optBtn({ marginTop: 2 }) }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#E65C46'; e.currentTarget.style.background = 'rgba(230,92,70,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,31,25,0.15)'; e.currentTarget.style.background = '#F8F2ED'; }}
              >← 返回</button>
            </div>
          )}

          {/* ── view bookings ─────────────────────────────────────────────── */}
          {waitingUser && !typing && step === 'viewBookings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 320, overflowY: 'auto' }}>
              {bookingsLoading ? (
                <p style={{ margin: 0, fontSize: 14, color: '#9e8074', fontFamily: "'Manrope', sans-serif", textAlign: 'center', padding: '12px 0' }}>加载中…</p>
              ) : myBookings.length === 0 ? (
                <p style={{ margin: 0, fontSize: 14, color: '#9e8074', fontFamily: "'Manrope', sans-serif", textAlign: 'center', padding: '12px 0' }}>暂无预定和订单</p>
              ) : myBookings.map(b => (
                <div key={b.id} style={{ padding: '10px 12px', background: '#F8F2ED', borderRadius: 10, border: '1px solid rgba(42,31,25,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#2A1F19', fontFamily: "'Manrope', sans-serif" }}>
                      {b.customer_name} · {b.customer_phone}
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 600, borderRadius: 6, padding: '2px 7px',
                      fontFamily: "'Manrope', sans-serif",
                      background: b.status === 'confirmed' ? 'rgba(34,197,94,0.12)' : b.status === 'cancelled' ? 'rgba(230,92,70,0.12)' : 'rgba(42,31,25,0.07)',
                      color: b.status === 'confirmed' ? '#16a34a' : b.status === 'cancelled' ? '#E65C46' : '#6B5549',
                    }}>
                      {b.status === 'pending' ? '待确认' : b.status === 'confirmed' ? '已确认' : b.status === 'in_progress' ? '进行中' : b.status === 'completed' ? '已完成' : '已取消'}
                    </span>
                  </div>
                  {b.booking_at && <div style={{ fontSize: 12, color: '#9e8074', fontFamily: "'Manrope', sans-serif" }}>🕐 {new Date(b.booking_at).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>}
                  {b.items && b.items.length > 0 && <div style={{ fontSize: 12, color: '#9e8074', fontFamily: "'Manrope', sans-serif", marginTop: 2 }}>📦 {b.items.map(i => `${i.name}×${i.qty}`).join('、')}</div>}
                  {b.customer_note && <div style={{ fontSize: 12, color: '#9e8074', fontFamily: "'Manrope', sans-serif", marginTop: 2 }}>💬 {b.customer_note}</div>}
                  {/* 操作按钮：根据状态显示可用操作 */}
                  {(b.status === 'pending' || b.status === 'confirmed' || b.status === 'in_progress') && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                      {b.status === 'pending' && (
                        <button
                          onClick={() => handleBookingStatus(b.id, 'confirmed')}
                          style={{ flex: 1, padding: '5px 0', fontSize: 12, fontWeight: 600, borderRadius: 7, border: 'none', background: '#16a34a', color: '#fff', cursor: 'pointer', fontFamily: "'Manrope', sans-serif" }}
                        >✅ 确认</button>
                      )}
                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => handleBookingStatus(b.id, 'completed')}
                          style={{ flex: 1, padding: '5px 0', fontSize: 12, fontWeight: 600, borderRadius: 7, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', fontFamily: "'Manrope', sans-serif" }}
                        >🏁 完成</button>
                      )}
                      {(b.status === 'pending' || b.status === 'confirmed') && (
                        <button
                          onClick={() => handleBookingStatus(b.id, 'cancelled')}
                          style={{ flex: 1, padding: '5px 0', fontSize: 12, fontWeight: 600, borderRadius: 7, border: '1px solid rgba(230,92,70,0.4)', background: 'none', color: '#E65C46', cursor: 'pointer', fontFamily: "'Manrope', sans-serif" }}
                        >✕ 取消</button>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <button onClick={backToManage} style={{ ...optBtn({ marginTop: 2 }) }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#E65C46'; e.currentTarget.style.background = 'rgba(230,92,70,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,31,25,0.15)'; e.currentTarget.style.background = '#F8F2ED'; }}
              >← 返回</button>
            </div>
          )}

          {/* ── Universal text input — shown only when AI has finished typing ── */}
          {waitingUser && !typing && !['register', 'login', 'newListing', 'name'].includes(step) && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(42,31,25,0.1)' }}>
              {/* 图片预览 */}
              {pendingImage && (
                <div style={{ marginBottom: 8, position: 'relative', display: 'inline-block' }}>
                  <img src={pendingImage} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1.5px solid rgba(42,31,25,0.15)', display: 'block' }} />
                  <button onClick={() => setPendingImage(null)} style={{
                    position: 'absolute', top: -6, right: -6, width: 18, height: 18,
                    borderRadius: '50%', background: '#E65C46', border: 'none', cursor: 'pointer',
                    color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
                  }}>×</button>
                </div>
              )}
              {/* 文件预览 */}
              {pendingFile && (
                <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, background: '#F8F2ED', borderRadius: 10, padding: '7px 10px', border: '1.5px solid rgba(42,31,25,0.12)' }}>
                  <span style={{ fontSize: 20 }}>{fileTypeIcon(pendingFile.type)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#2A1F19', fontFamily: "'Manrope', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pendingFile.name}</div>
                    <div style={{ fontSize: 11, color: '#9e8074', fontFamily: "'Manrope', sans-serif" }}>
                      {pendingFile.size > 1024 * 1024 ? `${(pendingFile.size / 1024 / 1024).toFixed(1)} MB` : `${(pendingFile.size / 1024).toFixed(0)} KB`}
                    </div>
                  </div>
                  <button onClick={() => setPendingFile(null)} style={{
                    width: 18, height: 18, borderRadius: '50%', background: '#E65C46', border: 'none', cursor: 'pointer',
                    color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>×</button>
                </div>
              )}
              {/* 录音预览 */}
              {pendingAudio && !isRecording && (
                <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, background: '#F8F2ED', borderRadius: 10, padding: '6px 10px', border: '1.5px solid rgba(42,31,25,0.12)' }}>
                  <audio controls src={pendingAudio.url} style={{ height: 32, flex: 1 }} />
                  <button onClick={() => setPendingAudio(null)} style={{
                    width: 18, height: 18, borderRadius: '50%', background: '#E65C46', border: 'none', cursor: 'pointer',
                    color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>×</button>
                </div>
              )}
              {/* 录音进行中提示 */}
              {isRecording && (
                <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(230,92,70,0.08)', borderRadius: 10, padding: '8px 12px', border: '1.5px solid rgba(230,92,70,0.3)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E65C46', display: 'inline-block', animation: 'bounce 1s infinite' }} />
                  <span style={{ fontSize: 13, color: '#E65C46', fontWeight: 600, fontFamily: "'Manrope', sans-serif" }}>正在录音…点击麦克风停止</span>
                </div>
              )}
              <form onSubmit={handleChatInput} style={{ display: 'flex', gap: 6, alignItems: 'center', width: '100%', minWidth: 0 }}>
                {/* 隐藏文件输入 */}
                <input ref={fileInputRef} type="file" accept="image/*,application/pdf,.xlsx,.xls,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={handleFileSelect} style={{ display: 'none' }} />
                {/* 文件/拍照按钮 + 菜单 */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <button type="button" onClick={() => setShowFileMenu(v => !v)} style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: showFileMenu ? 'rgba(230,92,70,0.08)' : '#fff', border: '1.5px solid #E65C46', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E65C46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </button>
                  {showFileMenu && (
                    <div style={{
                      position: 'absolute', bottom: 46, left: 0, zIndex: 9999,
                      background: '#fff', borderRadius: 12, boxShadow: '0 -4px 32px rgba(42,31,25,0.18)',
                      border: '1px solid rgba(42,31,25,0.1)', overflow: 'visible', minWidth: 150,
                    }}>
                      {[
                        { label: '📷 拍照', accept: 'image/*', capture: 'environment' },
                        { label: '🖼️ 选择图片', accept: 'image/*', capture: '' },
                        { label: '📄 PDF 文件', accept: 'application/pdf', capture: '' },
                        { label: '📊 Excel 文件', accept: '.xlsx,.xls,.csv', capture: '' },
                      ].map((item, idx) => (
                        <button key={idx} type="button" onClick={() => {
                          const inp = document.createElement('input');
                          inp.type = 'file';
                          inp.accept = item.accept;
                          if (item.capture) inp.setAttribute('capture', item.capture);
                          inp.onchange = handleFileSelect as unknown as (e: Event) => void;
                          inp.click();
                          setShowFileMenu(false);
                        }} style={{
                          display: 'block', width: '100%', padding: '10px 14px', background: 'none', border: 'none',
                          textAlign: 'left', fontSize: 13, fontWeight: 600, fontFamily: "'Manrope', sans-serif",
                          color: '#2A1F19', cursor: 'pointer', borderBottom: idx < 3 ? '1px solid rgba(42,31,25,0.07)' : 'none',
                        }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(230,92,70,0.06)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                        >{item.label}</button>
                      ))}
                    </div>
                  )}
                </div>
                {/* 语音按钮 */}
                <button type="button" onClick={isRecording ? stopRecording : startRecording} style={{
                  flexShrink: 0, width: 38, height: 38, borderRadius: 10,
                  background: isRecording ? '#E65C46' : '#fff',
                  border: '1.5px solid #E65C46', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isRecording ? '#fff' : '#E65C46'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="2" width="6" height="11" rx="3"/>
                    <path d="M5 10a7 7 0 0 0 14 0"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="9" y1="23" x2="15" y2="23"/>
                  </svg>
                </button>
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder={
                    step === 'manage' || step === 'viewListings'
                      ? '输入任何问题，例如"帮我上架商品"…'
                      : '或者直接输入您的回答…'
                  }
                  style={{
                    flex: 1, minWidth: 0, padding: '9px 10px', borderRadius: 10,
                    border: '1.5px solid rgba(42,31,25,0.15)', outline: 'none',
                    fontSize: 13, fontFamily: "'Manrope', sans-serif",
                    color: '#2A1F19', background: '#F8F2ED',
                  }}
                  disabled={typing}
                />
                <button type="submit" disabled={(!chatInput.trim() && !pendingImage && !pendingAudio && !pendingFile) || typing} style={{
                  flexShrink: 0, padding: '9px 12px', borderRadius: 10, border: 'none',
                  background: (chatInput.trim() || pendingImage || pendingAudio || pendingFile) && !typing ? '#E65C46' : 'rgba(230,92,70,0.08)',
                  color: (chatInput.trim() || pendingImage || pendingAudio || pendingFile) && !typing ? '#fff' : '#8A8886',
                  fontWeight: 700, fontSize: 13, cursor: (chatInput.trim() || pendingImage || pendingAudio || pendingFile) && !typing ? 'pointer' : 'default',
                  fontFamily: "'Manrope', sans-serif", transition: 'background 0.15s', whiteSpace: 'nowrap',
                }}>发送</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || "");
  const [industry, setIndustry] = useState("all");
  const [sort, setSort] = useState("popular");
  const [showDemo, setShowDemo] = useState(false);
  const [currentDemoMsgs, setCurrentDemoMsgs] = useState<DemoMessage[]>([]);
  const [currentDemoName, setCurrentDemoName] = useState('');
  const [currentDemoAvatar, setCurrentDemoAvatar] = useState('');
  const [currentPersonas, setCurrentPersonas] = useState<DemoPersona[]>([]);
  const [activePersonaIdx, setActivePersonaIdx] = useState(0);
  const [visibleMsgs, setVisibleMsgs] = useState<number[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const demoTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const msgsRef = useRef<HTMLDivElement>(null);

  // 固定慢速播放
  const DEMO_SPEED = { aiTyping: 1600, aiRead: 2400, userTyping: 900, userRead: 1500 };

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [visibleMsgs, showTyping]);

  const playDemo = useCallback((messages: DemoMessage[]) => {
    const { aiTyping, aiRead, userTyping, userRead } = DEMO_SPEED;
    demoTimers.current.forEach(clearTimeout);
    demoTimers.current = [];
    setVisibleMsgs([]);
    setShowTyping(false);
    let delay = 200;
    messages.forEach((msg, i) => {
      if (i > 0) {
        const t1 = setTimeout(() => setShowTyping(true), delay);
        demoTimers.current.push(t1);
        delay += msg.type === 'ai' ? aiTyping : userTyping;
      }
      const t2 = setTimeout(() => {
        setShowTyping(false);
        setVisibleMsgs(prev => [...prev, i]);
      }, delay);
      demoTimers.current.push(t2);
      delay += msg.type === 'ai' ? aiRead : userRead;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openDemo = useCallback((listing: Listing, avatarUrl: string) => {
    const personas = listing.demo_personas?.length
      ? listing.demo_personas
      : listing.demo_messages?.length
        ? [{ label: '演示', messages: listing.demo_messages }]
        : [];
    setCurrentPersonas(personas);
    setActivePersonaIdx(0);
    setCurrentDemoName(listing.name);
    setCurrentDemoAvatar(avatarUrl);
    setShowDemo(true);
    const msgs = personas[0]?.messages ?? [];
    setCurrentDemoMsgs(msgs);
    playDemo(msgs);
  }, [playDemo]);

  const openBankDemo = useCallback(() => {
    const bankPersonas: DemoPersona[] = [
      {
        label: '经营报表分析',
        messages: [
          { type: 'user', text: '帮我出一份本月的业绩报表' },
          { type: 'ai', text: '📊 本月业绩报表（截至今日）：\n\n💰 存款业务\n• 新增存款：¥4,380万\n• 到期续存率：87%（行内平均74%）\n• 大额存单销售：18笔，¥1,260万\n\n📈 理财业务\n• 新增AUM：¥2,340万\n• 基金销售：32笔，¥680万\n• 保险期缴：6件，¥28万/年\n\n👥 客户数据\n• 服务客户数：47人\n• 新增客户：6人\n• 客户满意度：98分\n\n🏆 综合排名：支行第2名\n\n是否生成可分享的图表版报表？' },
          { type: 'user', text: '生成图表版，另外帮我分析一下哪类产品卖得最好' },
          { type: 'ai', text: '📊 本月产品销售结构分析：\n\n🥇 大额存单（占比42%）\n→ 客户接受度最高，利率优势明显\n→ 建议：继续主推，重点攻克到期未续客户\n\n🥈 固收+基金（占比28%）\n→ 高净值客户配置首选\n→ 建议：搭配持仓诊断服务提升粘性\n\n🥉 货币基金（占比18%）\n→ 多为过渡性资金，转化空间大\n→ 建议：设置自动提醒，引导向定期迁移\n\n⚠️ 保险期缴（占比12%）\n→ 件数少但价值高，可加大推介力度\n\n💡 下月重点：把货币基金客户转化为大额存单，预计可提升AUM约¥300万。' },
          { type: 'user', text: '我的客户里哪些人资产增长最快，帮我列一下' },
          { type: 'ai', text: '📈 近3个月资产增长 TOP5 客户：\n\n① 陈总（+¥180万，+56%）\n→ 新开户，初始配置¥320万，快速追加\n→ 建议：升级为钻石客户，提供专属服务\n\n② 王总（+¥95万，+8%）\n→ 固收+收益兑现后复投\n→ 建议：推介私募/FOF产品，进一步提升AUM\n\n③ 何女士（+¥60万，+15%）\n→ 定期到期续存+新增资金\n→ 建议：引导家庭资产规划，邀请配偶面谈\n\n④ 刘总（+¥45万，+12%）\n→ 存款转理财，收益体验好\n\n⑤ 孙先生（+¥30万，+18%）\n→ 新客首次配置，满意度高\n\n✅ 以上5位均为本季度重点维护对象，已自动加入VIP跟进名单。' },
          { type: 'user', text: '帮我看看下个月哪些客户有资金到期，提前规划一下' },
          { type: 'ai', text: '📅 下月到期资金预警（5月）：\n\n🔴 金额较大（需提前2周联系）\n• 林总 — 结构性存款¥300万，5月8日到期\n• 赵总 — 大额存单¥200万，5月15日到期\n• 王总 — 定期理财¥150万，5月22日到期\n\n🟡 中等金额（提前1周联系）\n• 吴女士 — 定期存款¥80万，5月11日\n• 张先生 — 大额存单¥50万，5月19日\n\n💡 预估可挽留续存金额：¥780万+\n\n✅ 已自动创建提醒计划：\n每位客户到期前7天推送提醒+专属话术\n\n是否现在预生成5月到期客户的续存方案？' },
          { type: 'user', text: '生成，另外帮我汇总一下今年以来的完整业绩' },
          { type: 'ai', text: '📊 2026年度业绩汇总（1月—4月）：\n\n💰 存款累计新增：¥1.42亿\n• Q1：¥8,600万\n• Q2至今：¥5,600万\n\n📈 AUM净增：¥6,840万\n• 理财：¥3,200万\n• 基金：¥2,100万\n• 保险：¥1,540万\n\n👥 客户管理\n• 服务总人数：186人\n• 新增客户：24人\n• 流失客户：3人（流失率1.6%，行内最低）\n\n🏆 综合绩效得分：94.2分\n年度排名：支行第1名（升2位）\n预计全年完成率：113%\n\n✅ 完整版PDF报告已生成，可提交支行存档或分享给主管。' },
        ],
      },
      {
        label: '客户画像洞察',
        messages: [
          { type: 'user', text: '帮我分析一下我的客户群体，整体画像是什么样的' },
          { type: 'ai', text: '👥 客户群体画像分析（共186人）：\n\n📌 年龄分布\n• 45-60岁：占比52%（主力人群，稳健型）\n• 35-44岁：占比28%（成长型，配置需求旺盛）\n• 60岁+：占比20%（保守型，大额存单为主）\n\n💰 资产分布\n• ¥300万以上（VIP）：18人，占总AUM的64%\n• ¥50-300万（中产）：87人，占总AUM的30%\n• ¥50万以下（基础）：81人，占总AUM的6%\n\n🎯 风险偏好\n• R1-R2保守型：41%\n• R3平衡型：38%\n• R4-R5积极型：21%\n\n💡 核心洞察：\nVIP客户贡献了64%的AUM，但仅占客户数的10%。建议重点维护这18位客户，ROI最高。' },
          { type: 'user', text: '18位VIP客户里谁最容易流失，帮我排个风险' },
          { type: 'ai', text: '⚠️ VIP客户流失风险评估：\n\n🔴 高风险（需立即行动）\n① 林总（¥560万）\n→ 持仓浮亏-8.4%，71天未主动联系，情绪低落\n\n② 周先生（¥320万）\n→ 曾咨询其他行产品，62天未接触，信号不明\n\n🟡 中风险（本周内联系）\n③ 赵总（¥480万）\n→ 上次通话提到"可能换个行看看"\n④ 吴女士（¥180万）\n→ 定期到期未处理，被动流失风险\n\n🟢 低风险（正常维护）\n⑤-⑱ 其余14位VIP客户状态稳定\n\n✅ 已为林总和周先生生成紧急挽留方案，建议今日处理。' },
          { type: 'user', text: '好，再帮我看看哪些小客户有升级潜力' },
          { type: 'ai', text: '🌱 潜力客户升级雷达（¥50万以下 → 中产/VIP）：\n\n🔥 高升级潜力（近期有信号）\n① 孙先生（现¥38万）\n→ 刚入职某科技公司高管，月收入大幅提升\n→ 建议：主动询问年终奖规划，切入配置对话\n\n② 李小姐（现¥22万）\n→ 刚卖掉郊区房，预计有¥150万待配置\n→ 建议：本周联系，准备稳健型首配方案\n\n③ 陈先生（现¥45万）\n→ 上次透露父母有养老金配置需求\n→ 建议：推介家庭资产管理，捆绑拓展\n\n💡 若以上3人全部升级，预计新增AUM约¥280万。\n\n✅ 3份专属升级方案已预生成，是否发送至您的工作台？' },
          { type: 'user', text: '发送，另外帮我做一个下季度的目标规划' },
          { type: 'ai', text: '🎯 Q3目标规划建议（7-9月）：\n\n📌 基于当前业绩趋势（月均增速+12%）\n\n存款目标：¥5,200万\n→ 拆解：现有到期续存¥3,800万 + 新增¥1,400万\n→ 关键动作：6月底提前锁定到期客户\n\nAUM目标：¥2,800万\n→ 拆解：潜力客户升级¥280万 + VIP加仓¥1,200万 + 新客¥1,320万\n→ 关键动作：国庆前完成高净值客户年度回顾\n\n新增客户：8人\n→ 来源：现有客户转介绍4人 + 行内沙龙活动4人\n\n🏆 完成后预计年度排名：支行第1名（保持）\n\n✅ 目标已拆解为每月里程碑，是否导入到您的工作计划？' },
          { type: 'user', text: '导入，最后帮我生成一份给主管看的汇报材料' },
          { type: 'ai', text: '📋 主管汇报材料已生成（PPT版 + 摘要版）：\n\n📌 一页摘要（口头汇报用）：\n"本月服务客户47人，新增AUM ¥2,340万，综合排名支行第2，客户满意度98分。下月重点围绕5月到期¥780万续存和3位潜力客户升级，预计完成率110%以上。"\n\n📊 PPT版（6页）包含：\n① 本月业绩亮点数据\n② 客户结构与健康度分析\n③ 重点客户跟进进展\n④ 风险预警与应对措施\n⑤ 下月目标与行动计划\n⑥ 需支行支持事项\n\n✅ 文件已生成，可直接发送给主管或在周会上使用。' },
        ],
      },
      {
        label: '高净值客户维护',
        messages: [
          { type: 'user', text: '王总这周六生日，帮我想想怎么维护一下，他最近持仓好像也有点问题' },
          { type: 'ai', text: '✅ 已查询王总档案：\n• 生日：本周六（3天后）\n• 资产规模：¥1,280万，钻石客户\n• 近期持仓：沪深300 ETF -6.2%，债基+1.1%\n\n📊 当前关注点：\n权益仓位集中度偏高（72%），近30日浮亏约¥74,000，情绪指数偏低。\n\n💡 建议动作：\n① 生日前1天发送专属祝福短信（已起草，待确认）\n② 预约周五下午电话，重点聊仓位优化\n③ 准备固收+配置报告随信附上\n\n是否立即生成祝福短信和配置报告？' },
          { type: 'user', text: '好，生成祝福短信，报告帮我重点突出固收+方向' },
          { type: 'ai', text: '✅ 祝福短信已生成（140字，符合合规要求）\n✅ 固收+配置报告已生成，重点推荐：\n  • 固收+ A（近1年+8.3%，波动率低）\n  • 偏债混合型基金组合\n\n📤 是否立即发送短信至王总手机？' },
          { type: 'user', text: '发吧，另外他上次说对黄金有兴趣，要不要也加一块' },
          { type: 'ai', text: '📊 黄金配置分析：\n当前现货金价 ¥618/克，近3月+4.2%\n\n💡 建议将黄金纳入报告附页：\n• 配置比例建议：5-8%（对冲通胀 + 尾部风险）\n• 工具选择：黄金ETF（T+0流动性好）\n• 不建议实物金，流动性差\n\n✅ 已更新报告，黄金章节已插入第4页。\n是否一并发给王总？' },
          { type: 'user', text: '好的，一起发。他还有个朋友陈总，也是做生意的，可以介绍过来吗' },
          { type: 'ai', text: '✅ 已为王总生成专属转介绍卡片（含二维码）\n\n📋 陈总画像预填（来自王总备注）：\n• 行业：制造业  规模：中型企业\n• 预估资产：300-500万\n• 潜在需求：企业流动资金管理 + 个人财富配置\n\n💡 建议话术：\n"陈总您好，我是XX行王先生的私人顾问……"\n\n是否为陈总预建初始档案，提前准备见面方案？' },
          { type: 'user', text: '先建档案，下周约好了见面' },
          { type: 'ai', text: '✅ 陈总初始档案已创建\n📅 已在日历标注：下周三下午2点，陈总初次见面\n\n📝 见面前准备清单（自动生成）：\n□ 打印产品对比一页纸\n□ 准备企业流动资金方案\n□ 了解制造业近期政策利好\n□ 确认陈总风险偏好问卷\n\n⏰ 见面前1天我会自动提醒您并推送当日简报。' },
          { type: 'user', text: '王总那边短信发出去了吗，有没有回应' },
          { type: 'ai', text: '📤 短信已于今天14:32发出，状态：已送达\n\n💬 王总已回复（14:47）：\n"谢谢小李，改天聊！"\n\n✅ 已记录本次互动至CRM\n📅 建议周四上午10点拨打跟进电话\n\n是否现在预约提醒？' },
          { type: 'user', text: '预约提醒，周四10点' },
          { type: 'ai', text: '✅ 已设置提醒：周四上午10:00 致电王总\n\n📋 通话前简报（届时自动推送）：\n• 持仓最新净值\n• 固收+产品最新排名\n• 本周市场热点摘要\n\n本周王总跟进任务全部完成 ✨\n今日还有3位客户生日临近，是否批量处理？' },
        ],
      },
      {
        label: '新客产品匹配',
        messages: [
          { type: 'user', text: '新客户李女士，45岁，500万资产，说想稳健一点，但也希望跑赢通胀，怎么给她推？' },
          { type: 'ai', text: '✅ 已建立李女士临时档案\n• 年龄：45岁  资产：¥500万  风格：稳健型\n\n📊 KYC 智能评估：\n建议风险等级定为 R2-R3（稳健偏积极）\n\n💡 推荐组合（合规通过）：\n① 50% — 国债逆回购 + 大额存单（保本打底）\n② 30% — 固收+混合基金（年化目标5-7%）\n③ 20% — 沪深红利低波ETF（跑赢通胀锚）\n\n是否生成完整产品说明书和面谈话术？' },
          { type: 'user', text: '生成话术，另外她问过理财亏损怎么解释' },
          { type: 'ai', text: '✅ 完整面谈话术已生成（含开场白、产品介绍、异议处理）\n\n📌 关于"理财亏损"的合规应对话术：\n"市场短期波动在所难免，我们选择的产品历史最大回撤控制在5%以内，长期持有3年以上胜率达92%……"\n（已附3个真实案例数据支撑）\n\n⚠️ 合规提示：请勿承诺保本或固定收益。' },
          { type: 'user', text: '她还在纠结要不要把房子卖了全投进来，我怎么建议她' },
          { type: 'ai', text: '⚠️ 重要提示：切勿建议客户变卖主要资产全仓投入。\n\n💡 合规建议话术：\n"李女士，我们一般建议用可投资金融资产的比例来配置，您的房产是家庭主要资产，流动性和居住功能不建议轻易变现。我们可以先从您现有的流动资金开始规划……"\n\n✅ 本建议已通过合规审核，可直接引用。' },
          { type: 'user', text: '好的，她问第一笔可以先投多少，最低门槛是多少' },
          { type: 'ai', text: '📋 各产品最低申购门槛：\n• 国债逆回购：¥10万起\n• 大额存单：¥20万起（3年期，4.1%）\n• 固收+基金：¥1,000起\n• 红利ETF：¥1,000起\n\n💡 建议首次配置方案（¥100万起步）：\n① ¥50万 — 大额存单（安全底仓）\n② ¥30万 — 固收+基金\n③ ¥20万 — 红利ETF\n\n这样风险分散，体验感好，后续容易加仓。' },
          { type: 'user', text: '她同意了，要开始办手续，怎么走流程' },
          { type: 'ai', text: '✅ 已为李女士生成开户流程指引：\n\n第一步：风险承受能力测评（柜台或App，约5分钟）\n第二步：签署产品认购协议（合规必备）\n第三步：资金划转，建议分3笔在3天内转入\n\n📎 所需材料：\n• 身份证原件\n• 银行卡（本行）\n• 手机号码\n\n⏱ 预计全流程约45分钟。\n是否预约今天下午3点办理？' },
          { type: 'user', text: '预约3点，另外帮我记一下，她老公也想了解，下次带老公一起来' },
          { type: 'ai', text: '✅ 已预约：今天下午3:00 李女士开户办理\n✅ CRM已备注：下次拜访须邀请其配偶同席\n\n📝 已为李女士配偶预建联系人档案（待完善）\n💡 下次见面可同步推介家庭资产配置方案，转化概率更高。\n\n今天15:00前我会提醒您准备相关材料 📂' },
          { type: 'user', text: '太好了，今天还有几个客户要跟进，帮我排个优先级' },
          { type: 'ai', text: '📊 今日待跟进客户优先级排序：\n\n🔴 高优先（今日必联）\n① 张先生 — 定期存款明天到期，需续期或转投\n② 刘总 — 上周承诺的产品方案今天要给回复\n\n🟡 中优先（本周跟进）\n③ 赵女士 — 3个月前沟通过，近期有购房需求变化\n④ 孙先生 — 风险测评快到期，需重新评估\n\n🟢 常规维护\n⑤ 其余6位客户 — 本月例行问候即可\n\n是否现在生成今日跟进话术清单？' },
        ],
      },
      {
        label: '客户分级管理',
        messages: [
          { type: 'user', text: '帮我看看我手上哪些客户最近没联系了，有点担心流失' },
          { type: 'ai', text: '📊 客户活跃度预警报告：\n\n🔴 高流失风险（超60天未联系）\n① 周先生 — ¥320万，上次接触：62天前，曾询价私募产品\n② 吴女士 — ¥180万，上次接触：71天前，定期到期未续\n\n🟡 中风险（30-60天未联系）\n③ 林总 — ¥560万，持仓浮亏中，情绪敏感期\n\n💡 建议今日优先联系周先生和吴女士。\n是否为他们各生成一条唤醒话术？' },
          { type: 'user', text: '生成，重点是吴女士，她定期到期了' },
          { type: 'ai', text: '✅ 吴女士唤醒话术已生成：\n\n"吴女士您好，我是小李，注意到您上次的定期存款本月已到期，这次到账的资金有没有考虑好怎么安排？最近有一款3年期利率4.1%的大额存单，额度有限，想第一时间告诉您……"\n\n📎 附带：产品对比一页纸（大额存单 vs 货币基金）\n📅 建议今天上午10-11点拨打，接听率最高。' },
          { type: 'user', text: '好，发完吴女士，周先生那边是什么情况，他问过私募' },
          { type: 'ai', text: '📋 周先生档案摘要：\n• 资产：¥320万  风险等级：R4（积极型）\n• 上次需求：咨询私募股权类产品\n• 近期状态：无新动作，但浏览过2次理财页面\n\n💡 跟进建议：\n可主动推介近期募集中的FOF产品（R4合规），门槛50万，锁定1年。\n\n✅ 周先生话术已生成，主打"专属优先认购通道"角度切入。\n是否同步生成预约见面的短信？' },
          { type: 'user', text: '同步生成，另外帮我统计一下这个月我一共服务了多少客户' },
          { type: 'ai', text: '📊 本月服务数据摘要（截至今日）：\n\n• 累计跟进客户：47人\n• 新增意向客户：6人（转化率12.8%）\n• 成交客户：11人，累计AUM新增 ¥2,340万\n• 到期提醒处理：9笔（完成率100%）\n• 平均响应时长：23分钟\n\n🏆 本月排名：支行第2名（上月第4名）\n继续加油，距第1名差距：¥430万 AUM' },
          { type: 'user', text: '不错，林总那边持仓亏损，我怎么安抚他' },
          { type: 'ai', text: '📋 林总持仓现状：\n• 沪深300指数基金：-8.4%，浮亏约¥47万\n• 持有时间：11个月\n\n💡 安抚 + 挽留策略：\n① 不要主动提亏损数字，等他问\n② 引导关注长期数据："同类产品3年正收益概率84%"\n③ 提供"持仓诊断报告"作为服务体验，而非推销\n\n✅ 已生成《林总专属持仓诊断报告》（5页PDF）\n建议面谈送达，加强信任感。是否预约本周见面？' },
          { type: 'user', text: '预约周三下午，另外帮我把今天所有客户动作都记到日报里' },
          { type: 'ai', text: '✅ 今日工作日报已生成：\n\n📋 2026-04-27 客户经理日报\n• 联系客户：5人（吴女士、周先生、林总等）\n• 发送短信/话术：3条\n• 新建档案：1人（陈总）\n• 预约跟进：2人（林总周三、周先生周四）\n• 异常预警处理：2人\n\n已同步至CRM系统，支行主管可查阅 ✅' },
        ],
      },
      {
        label: '存款到期提醒',
        messages: [
          { type: 'user', text: '今天有没有存款快到期的客户，提前提醒我一下' },
          { type: 'ai', text: '📅 未来7天到期存款提醒：\n\n🔴 明日到期\n• 张先生 — 定期¥50万（1年期，利率3.5%）\n  建议：续存或转大额存单（+0.6%利差）\n\n🟡 3天内到期\n• 何女士 — 大额存单¥100万（3年期）\n  建议：趁现在锁定新一期，利率下行趋势明显\n\n🟢 本周内到期\n• 赵总 — 结构性存款¥200万\n  建议：到期前提前沟通，避免自动转活期\n\n是否现在为以上3位生成到期提醒短信？' },
          { type: 'user', text: '张先生那个先发，他之前说可能要取出来用' },
          { type: 'ai', text: '📋 张先生最新备注：\n"可能近期有资金需求，到期后再定"（3个月前记录）\n\n⚠️ 流失预警：取现概率中等偏高\n\n💡 挽留策略：\n不要直接推产品，先了解资金用途：\n- 若用于购房首付 → 推荐灵活申赎货基过渡\n- 若用于生意周转 → 推荐随存随取的活期理财\n- 若暂无明确用途 → 主推"灵活定期"，随时可取\n\n✅ 已生成分场景话术3套，已发至您的工作台。' },
          { type: 'user', text: '好，先问问他情况。何女士的大额存单快到了，她能接受锁3年吗' },
          { type: 'ai', text: '📋 何女士偏好分析：\n• 历史选择：上期主动选3年期（高利率优先）\n• 家庭状况备注：子女已独立，无近期大额支出\n• 风险等级：R1（保守型）\n\n📊 判断：接受锁3年概率高（约80%）\n\n💡 推荐话术：\n"何阿姨，您上次选3年期的眼光真好！现在利率在走下行通道，现在锁3年4.1%是最后窗口期，额度只剩少量了……"\n\n✅ 已生成完整话术和产品说明书。' },
          { type: 'user', text: '很好，下午打给何女士。赵总的结构性存款，他一般怎么操作' },
          { type: 'ai', text: '📋 赵总历史偏好：\n• 近3次到期：2次续存结构性存款，1次转权益基金\n• 偏好高预期收益，能接受部分浮动\n• 曾表达对股市有兴趣但"怕亏太多"\n\n💡 本次到期建议方案：\n① 70% — 续存结构性存款（稳定底仓）\n② 30% — 试水偏债混合基金（兼顾弹性）\n\n这个组合预期收益 > 纯续存，波动可控，符合赵总画像。\n\n✅ 方案PPT已自动生成，3页，适合5分钟讲完。' },
          { type: 'user', text: '完美，帮我安排一下今天下午的打电话顺序' },
          { type: 'ai', text: '📅 今天下午通话计划（已按优先级排序）：\n\n14:00 — 张先生（明日到期，先了解资金用途）\n14:30 — 何女士（锁3年大额存单，话术已就绪）\n15:00 — 赵总（结构性存款到期，推荐组合方案）\n15:30 — 预留：跟进上午有回复的客户\n\n⏰ 提醒已全部设置\n📎 每通电话前5分钟自动推送客户简报 + 当日话术\n\n祝谈单顺利 💪' },
        ],
      },
      {
        label: '异议处理话术',
        messages: [
          { type: 'user', text: '客户说"我再考虑考虑"，我怎么接' },
          { type: 'ai', text: '💡 "再考虑"通常有3种真实含义，先判断哪种：\n\n① 真的需要时间 → 给空间，约好下次联系时间\n② 对产品不放心 → 提供数据或案例消除顾虑\n③ 婉拒但不好意思说 → 换产品或换方向重新沟通\n\n✅ 万能过渡话术：\n"好的，不急！我把几个核心数据整理成一页纸发给您，您有空看一眼，有问题随时找我。请问我后天给您打个电话确认一下，方便吗？"\n\n这样既不施压，又锁住了下次跟进机会。' },
          { type: 'user', text: '他说利率太低了，觉得没意思' },
          { type: 'ai', text: '💡 应对"利率太低"的话术框架：\n\n先认同，再引导：\n"您说的对，现在的利率确实比2年前低了不少，这是整个市场的趋势，其实现在锁定4.1%已经是市场里难得的高点了，很多客户上个月才明白过来……"\n\n可补充的数据支撑：\n• 余额宝当前年化约1.8%\n• 一般银行理财约3.2%\n• 本款大额存单4.1%，高出市场均值约28%\n\n✅ 已生成完整对比数据表，可直接在手机上给客户看。' },
          { type: 'user', text: '他还说别的银行给的更高，我怎么办' },
          { type: 'ai', text: '💡 应对"竞争对手报价更高"话术：\n\n第一步：不要慌，先确认对方报价的产品类型\n"您方便说一下是哪家的什么产品吗？"\n\n第二步：根据类型回应\n• 若是非保本理财 → "那个风险等级和我们这款不同，本金保障是不一样的"\n• 若是正规存款产品 → "如果真的比我们高，我帮您核实一下，看能不能申请利率上浮"\n\n第三步：转移焦点\n"其实利率只是一个角度，我们行的存款保险、服务响应、理财经理专属服务……综合价值才是关键。"\n\n✅ 已准备竞品对比卡，一张图说清差异。' },
          { type: 'user', text: '好用！客户说"我钱都在股票里，没钱存"，怎么聊' },
          { type: 'ai', text: '💡 应对"钱都在股市"的破局话术：\n\n不要急着推产品，先聊心态：\n"最近大盘波动挺大的，您持仓感觉怎么样？"\n\n根据他的回答分路走：\n🔴 如果他说"还行/赚了" → 聊利润锁定概念\n"赚到的钱其实可以分一部分出来放稳健的，留住利润比全押进去重要……"\n\n🟡 如果他说"套住了/亏了" → 聊分散风险\n"我有些客户就是把一部分放在固收这边，心里更踏实，等股市回来再看机会……"\n\n✅ 两套话术已生成，可根据现场反应直接切换使用。' },
          { type: 'user', text: '再给我一个客户说"我老伴不同意"怎么处理' },
          { type: 'ai', text: '💡 应对"家人不同意"的话术：\n\n✅ 策略1：邀请一起来\n"没关系，理财是家庭大事，全家人都清楚才放心。要不下次您把老伴也带来，我给你们一起讲讲？"\n\n✅ 策略2：提供带回家的材料\n"我把产品的核心说明做成一页纸，您拿回去给老伴看看，要是有疑问我可以电话解答。"\n\n✅ 策略3：小额先做\n"要不先做个小金额体验一下？就5万，风险低，老伴看到收益就容易接受了。"\n\n✅ 三套方案已生成，请根据客户性格选择。' },
          { type: 'user', text: '还有一个客户电话一直不接怎么办' },
          { type: 'ai', text: '💡 客户不接电话的唤醒策略：\n\n第一步：换渠道触达\n✅ 发一条轻松短信（已生成）：\n"XX先生您好，我是小李，最近有款产品特别适合您，不打扰您接电话，有空微信我一下就好 😊"\n\n第二步：选对时间\n📅 最佳拨打窗口：\n• 工作日：19:30-20:30（晚饭后）\n• 周末：10:00-11:00\n• 避开：周一早上、午休时间\n\n第三步：若3次未接，可用支行座机尝试一次。\n\n第四步：触发第三方\n若该客户由他人转介绍，可请介绍人帮忙"打个招呼"。\n\n✅ 唤醒短信已生成，是否现在发送？' },
        ],
      },
      {
        label: '节假日营销话术',
        messages: [
          { type: 'user', text: '五一快到了，帮我想想节日营销怎么做' },
          { type: 'ai', text: '📅 五一节假日营销方案（4月28日—5月1日）：\n\n🎯 核心策略：节日情感 + 时间限定 + 专属服务\n\n📋 分三类客户差异化触达：\n\n① VIP/钻石客户（¥300万+）\n→ 手写祝福卡+专属配置礼包\n→ 话术重点：情感维系，不急推产品\n\n② 中等客户（¥50-300万）\n→ 节日专属理财产品短信\n→ 话术重点：限时优惠，制造紧迫感\n\n③ 低活跃客户\n→ 唤醒短信，重新建立联系\n→ 话术重点：轻松问候，降低压迫感\n\n是否现在按分类批量生成短信？' },
          { type: 'user', text: '先生成VIP那档的，王总、林总、陈总三人' },
          { type: 'ai', text: '✅ 已为3位VIP客户生成个性化节日短信：\n\n📩 王总版（钻石客户，含持仓关怀）：\n"王总五一快乐！这段时间市场波动，您的资产我一直在关注，节后有个配置机会想第一时间跟您分享，祝您和家人假期愉快！"\n\n📩 林总版（持仓浮亏，情感为主）：\n"林总节日快乐！市场短期有风浪，长期价值不变，我一直在，有任何想法随时找我。好好休息，节后聊！"\n\n📩 陈总版（新客待跟进）：\n"陈总五一假期快乐！上次聊得很开心，节后我把那份方案优化一下，约个时间细聊？"\n\n✅ 3条短信已进入发送队列，是否确认发出？' },
          { type: 'user', text: '确认发送，节后第一天重点跟进哪些客户' },
          { type: 'ai', text: '📅 节后第一天（5月6日）重点跟进清单：\n\n🔴 必打电话（3人）\n① 吴女士 — 定期5月5日到期，节后第一天是最佳续存窗口\n② 周先生 — 假期前表达过想了解私募，趁热打铁\n③ 张先生 — 上次约好节后回复，不能爽约\n\n🟡 发消息跟进（5人）\n• 节日期间有回复的客户，优先回应\n• 发过祝福未读的客户，电话确认收到\n\n💡 节后话术开场建议：\n"节过得怎么样？我假期整理了一份资料，有个适合您的机会想跟您说……"\n\n✅ 5月6日跟进日程已预排，届时自动提醒。' },
          { type: 'user', text: '好，年底还有没有什么好时机做营销' },
          { type: 'ai', text: '📅 全年营销黄金节点（剩余）：\n\n5月 — 母亲节（5/11）\n→ 适合推亲子/家庭配置方案\n\n6月 — 半年报、年中考核\n→ 银行冲存款旺季，利率上浮空间最大\n\n9月 — 开学季\n→ 教育金、定投话题切入\n\n10月 — 国庆+Q4开门红预热\n→ 高净值客户年度资产回顾约谈\n\n12月 — 年终奖预期\n→ "年终奖如何理财"是最高频客户提问\n\n✅ 已生成全年营销日历，可导出至您的日程系统。\n是否为每个节点预生成话术模板？' },
          { type: 'user', text: '好的，年中冲存款那段帮我多准备一些话术' },
          { type: 'ai', text: '💡 年中冲存款专项话术包（6月适用）：\n\n✅ 开场话术（老客户）：\n"XX先生，6月底前我们行有一批利率上浮的大额存单，这是年中最后机会，特意第一时间通知您……"\n\n✅ 加量话术（已有存款的客户）：\n"您现在这笔存款到期正好赶上，要不顺势多放一部分？利率比上次还高0.2%，这个时间节点真的难得。"\n\n✅ 拉新话术（介绍新客）：\n"您要是有朋友也有闲置资金，6月底前带来可以享受我们的优先服务通道，我帮您一起安排。"\n\n✅ 截止施压话术：\n"这批额度本周五截止，我今天先给您预留一个名额，您确认一下金额就好，不用马上到场。"\n\n已生成6月专项话术共12套，按场景分类，可随时调取 📂' },
        ],
      },
    ];
    setCurrentPersonas(bankPersonas);
    setActivePersonaIdx(0);
    setCurrentDemoName('银行客户经理 AI 助理');
    setCurrentDemoAvatar('https://api.dicebear.com/9.x/open-peeps/svg?seed=bank-rm&size=48&backgroundColor=b6e3f4');
    setShowDemo(true);
    setCurrentDemoMsgs(bankPersonas[0].messages);
    playDemo(bankPersonas[0].messages);
  }, [playDemo]);

  const switchPersona = useCallback((idx: number, personas: DemoPersona[]) => {
    setActivePersonaIdx(idx);
    const msgs = personas[idx]?.messages ?? [];
    setCurrentDemoMsgs(msgs);
    playDemo(msgs);
  }, [playDemo]);

  const closeDemo = useCallback(() => {
    setShowDemo(false);
    demoTimers.current.forEach(clearTimeout);
  }, []);

  // 快进：一次性展示全部消息
  const skipDemo = useCallback(() => {
    demoTimers.current.forEach(clearTimeout);
    setShowTyping(false);
    setVisibleMsgs(currentDemoMsgs.map((_, i) => i));
  }, [currentDemoMsgs]);

  const [showOnboarding, setShowOnboarding] = useState(false);

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [industryListings, setIndustryListings] = useState<Listing[]>([]);
  const [industryPage, setIndustryPage] = useState(1);
  const [industryHasMore, setIndustryHasMore] = useState(false);
  const [industryLoadingMore, setIndustryLoadingMore] = useState(false);

  const activeIndustry = INDUSTRIES.find(i => i.value === industry) || INDUSTRIES[0];

  const sortedIndustryListings = [...industryListings].sort((a, b) => {
    if (sort === 'price_asc') return parseFloat(a.price) - parseFloat(b.price);
    if (sort === 'price_desc') return parseFloat(b.price) - parseFloat(a.price);
    if (sort === 'newest') return b.id - a.id;
    // popular: insurance-ai-sales-assistant pinned first, then by pseudo click count
    if (a.slug === 'insurance-ai-sales-assistant') return -1;
    if (b.slug === 'insurance-ai-sales-assistant') return 1;
    const clicksA = ((a.id * 89 + 11) % 50) + 5;
    const clicksB = ((b.id * 89 + 11) % 50) + 5;
    return clicksB - clicksA;
  });

  const fetchListings = useCallback(async (isLoadMore = false, loadPage = 1) => {
    if (!isLoadMore) setLoading(true);
    try {
      let params: ListingParams = { page: loadPage, sort };

      if (search) {
        params.search = search;
      } else if (industry === 'AI 角色' || industry === 'industry') {
        params.category = activeIndustry.categories[0];
      }

      const res = await listingsApi.getListings(params);
      let data: Listing[] = res?.data || [];

      // 全部 tab 下排除行业方案，单独展示
      if (!search && industry === 'all') {
        data = data.filter(l => l.category !== '行业方案');
      }

      // Client-side industry filtering (keyword-based)
      if (!search && industry !== 'all' && industry !== 'AI 角色' && industry !== 'industry') {
        const ind = INDUSTRIES.find(ind2 => ind2.value === industry);
        if (ind) {
          data = data.filter(l => {
            if (!ind.categories.includes(l.category)) return false;
            if (ind.keywords.length > 0) {
              const text = (l.name + ' ' + (l.description || '')).toLowerCase();
              return ind.keywords.some(kw => text.includes(kw.toLowerCase()));
            }
            return true;
          });
        }
      }

      if (isLoadMore) {
        setListings(prev => [...prev, ...data]);
      } else {
        setListings(data);
      }
      setPage(res?.current_page || 1);
      setHasMore((res?.current_page || 1) < (res?.last_page || 1));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [industry, sort, search]);

  useEffect(() => {
    const q = searchParams.get('search') || "";
    setSearch(q);
  }, [searchParams]);

  useEffect(() => {
    fetchListings();
  }, [industry, sort, search]);

  // 预加载行业方案（全部页），供首页"全部"tab 直接展示
  useEffect(() => {
    const fetchAllIndustry = async () => {
      try {
        const first = await listingsApi.getListings({ category: '行业方案', page: 1 });
        let all = first?.data || [];
        const lastPage = first?.last_page || 1;
        for (let p = 2; p <= lastPage; p++) {
          const res = await listingsApi.getListings({ category: '行业方案', page: p });
          all = [...all, ...(res?.data || [])];
        }
        setIndustryListings(all);
        setIndustryPage(lastPage);
        setIndustryHasMore(false);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAllIndustry();
  }, []);

  const loadMoreIndustry = useCallback(async () => {
    setIndustryLoadingMore(true);
    try {
      const nextPage = industryPage + 1;
      const res = await listingsApi.getListings({ category: '行业方案', page: nextPage });
      setIndustryListings(prev => [...prev, ...(res?.data || [])]);
      setIndustryPage(res?.current_page || nextPage);
      setIndustryHasMore((res?.current_page || nextPage) < (res?.last_page || 1));
    } catch (e) {
      console.error(e);
    } finally {
      setIndustryLoadingMore(false);
    }
  }, [industryPage]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Manrope:wght@400;500;600;700&display=swap');

        .claw-app {
          font-family: 'Manrope', 'Bricolage Grotesque', sans-serif;
          background-color: #F8F2ED;
          color: #2A1F19;
          min-height: 100vh;
        }

        /* Hero */
        .claw-hero {
          max-width: 1200px;
          margin: 0 auto;
          padding: 56px 24px 40px;
        }
        .claw-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #E65C46;
          background: rgba(230,92,70,0.1);
          border: 1px solid rgba(230,92,70,0.2);
          padding: 4px 14px;
          border-radius: 100px;
          margin-bottom: 18px;
        }
        .claw-hero-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.1;
          color: #2A1F19;
          margin: 0 0 16px;
          letter-spacing: -0.02em;
        }
        .claw-hero-title span {
          color: #E65C46;
        }
        .claw-hero-subtitle {
          font-size: 1.8rem;
          color: #6B5549;
          line-height: 1.65;
          margin: 0 0 28px;
          max-width: 900px;
          font-weight: 500;
        }

        /* Industry stat pills */
        .claw-hero-stats {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .claw-hero-stat {
          display: flex;
          align-items: center;
          gap: 6px;
          background: white;
          border: 1px solid rgba(42,31,25,0.1);
          border-radius: 100px;
          padding: 6px 14px;
          font-size: 13px;
          font-weight: 600;
          color: #2A1F19;
        }
        .claw-hero-stat-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #E65C46;
          flex-shrink: 0;
        }

        /* Demo modal */
        .claw-demo-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .claw-phone {
          width: 310px;
          background: linear-gradient(160deg, #2a2a2e 0%, #1a1a1e 100%);
          border-radius: 48px;
          padding: 14px;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.08),
            0 40px 100px rgba(0,0,0,0.7),
            inset 0 1px 0 rgba(255,255,255,0.12);
          position: relative;
          animation: slideUp 0.35s cubic-bezier(.22,1,.36,1);
        }
        .claw-phone::before {
          content: '';
          position: absolute;
          left: -3px;
          top: 90px;
          width: 3px;
          height: 34px;
          background: #333;
          border-radius: 3px 0 0 3px;
          box-shadow: 0 44px 0 #333;
        }
        .claw-phone::after {
          content: '';
          position: absolute;
          right: -3px;
          top: 110px;
          width: 3px;
          height: 54px;
          background: #333;
          border-radius: 0 3px 3px 0;
        }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .claw-phone-inner {
          background: #000;
          border-radius: 36px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 580px;
        }
        .claw-phone-statusbar {
          background: #000;
          padding: 10px 18px 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .claw-phone-time {
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          font-family: -apple-system, sans-serif;
          letter-spacing: -0.3px;
        }
        .claw-phone-icons {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .claw-signal {
          display: flex;
          align-items: flex-end;
          gap: 1.5px;
          height: 11px;
        }
        .claw-signal span {
          display: block;
          width: 3px;
          background: #fff;
          border-radius: 1px;
        }
        .claw-signal span:nth-child(1) { height: 3px; }
        .claw-signal span:nth-child(2) { height: 5px; }
        .claw-signal span:nth-child(3) { height: 7px; }
        .claw-signal span:nth-child(4) { height: 11px; }
        .claw-wifi {
          font-size: 11px;
          color: #fff;
          line-height: 1;
        }
        .claw-battery {
          display: flex;
          align-items: center;
          gap: 1px;
        }
        .claw-battery-body {
          width: 22px;
          height: 11px;
          border: 1.5px solid rgba(255,255,255,0.7);
          border-radius: 2.5px;
          padding: 1.5px;
          position: relative;
        }
        .claw-battery-fill {
          background: #fff;
          border-radius: 1px;
          height: 100%;
          width: 75%;
        }
        .claw-battery-tip {
          width: 2px;
          height: 5px;
          background: rgba(255,255,255,0.5);
          border-radius: 0 1px 1px 0;
        }
        .claw-phone-island {
          width: 100px;
          height: 30px;
          background: #000;
          border-radius: 20px;
          margin: 0 auto 6px;
          position: relative;
          z-index: 2;
          flex-shrink: 0;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.06);
        }
        .claw-phone-screen {
          background: #F8F2ED;
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border-radius: 0 0 34px 34px;
        }
        .claw-phone-topbar {
          background: #fff;
          padding: 10px 14px;
          border-bottom: 1px solid rgba(42,31,25,0.08);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .claw-phone-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          background: #F0E8E1;
          box-shadow: 0 2px 8px rgba(230,92,70,0.2);
        }
        .claw-phone-name {
          font-size: 13px;
          font-weight: 700;
          color: #2A1F19;
          font-family: 'Manrope', sans-serif;
        }
        .claw-phone-status {
          font-size: 11px;
          color: #22c55e;
          font-family: 'Manrope', sans-serif;
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .claw-phone-status::before {
          content: '';
          width: 6px;
          height: 6px;
          background: #22c55e;
          border-radius: 50%;
          display: inline-block;
        }
        .claw-phone-msgs {
          flex: 1;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow-y: auto;
          scroll-behavior: smooth;
        }
        .claw-msg {
          max-width: 80%;
          padding: 10px 14px;
          border-radius: 18px;
          font-size: 13px;
          line-height: 1.5;
          font-family: 'Manrope', sans-serif;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .claw-msg.visible { opacity: 1; transform: translateY(0); }
        .claw-msg.ai {
          background: #fff;
          color: #2A1F19;
          border-bottom-left-radius: 4px;
          align-self: flex-start;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }
        .claw-msg.user {
          background: #E65C46;
          color: #fff;
          border-bottom-right-radius: 4px;
          align-self: flex-end;
        }
        .claw-typing {
          display: flex;
          gap: 4px;
          align-items: center;
          padding: 10px 14px;
          background: #fff;
          border-radius: 18px;
          border-bottom-left-radius: 4px;
          width: fit-content;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .claw-typing.visible { opacity: 1; }
        .claw-typing span {
          width: 6px; height: 6px;
          background: #9e8074;
          border-radius: 50%;
          animation: bounce 1.2s infinite;
        }
        .claw-typing span:nth-child(2) { animation-delay: 0.2s; }
        .claw-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        .claw-demo-close {
          position: absolute;
          top: -16px;
          right: -16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #fff;
          border: none;
          cursor: pointer;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          color: #2A1F19;
        }

        /* Industry nav bar */
        .claw-ind-nav {
          background: rgba(248, 242, 237, 0.97);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(42, 31, 25, 0.08);
          position: sticky;
          top: 60px;
          z-index: 40;
        }
        .claw-ind-nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          gap: 2px;
          height: 52px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .claw-ind-nav-inner::-webkit-scrollbar { display: none; }
        .claw-ind-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          font-family: 'Manrope', sans-serif;
          white-space: nowrap;
          transition: background 0.15s, color 0.15s;
          color: #6B5549;
          background: transparent;
          flex-shrink: 0;
        }
        .claw-ind-tab:hover:not(.active) {
          background: rgba(42, 31, 25, 0.06);
          color: #2A1F19;
        }
        .claw-ind-tab.active {
          background: #2A1F19;
          color: white;
        }
        .claw-ind-tab-emoji {
          font-size: 14px;
          line-height: 1;
        }
        .claw-ind-nav-right {
          margin-left: auto;
          flex-shrink: 0;
          padding-left: 12px;
        }
        .claw-sort-select {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #6B5549;
          background: white;
          border: 1.5px solid rgba(42, 31, 25, 0.12);
          border-radius: 8px;
          padding: 6px 12px;
          cursor: pointer;
          font-family: 'Manrope', sans-serif;
          outline: none;
        }

        /* Industry banner */
        .claw-ind-banner {
          background: linear-gradient(135deg, #2A1F19 0%, #3d2a20 100%);
          padding: 32px 24px;
          border-bottom: 1px solid rgba(42,31,25,0.15);
        }
        .claw-ind-banner-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }
        .claw-ind-banner-left {}
        .claw-ind-banner-emoji {
          font-size: 36px;
          margin-bottom: 8px;
          display: block;
        }
        .claw-ind-banner-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 6px;
          letter-spacing: -0.02em;
        }
        .claw-ind-banner-title span { color: #E65C46; }
        .claw-ind-banner-desc {
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          margin: 0;
          line-height: 1.6;
        }
        .claw-ind-banner-roles {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .claw-ind-role-tag {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 100px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
        }
        .claw-ind-role-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #E65C46;
          flex-shrink: 0;
        }

        /* Section */
        .claw-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px;
        }
        .claw-section-header {
          margin-bottom: 24px;
          display: flex;
          align-items: baseline;
          gap: 12px;
        }
        .claw-section-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #2A1F19;
          margin: 0;
          letter-spacing: -0.01em;
        }
        .claw-section-subtitle {
          font-size: 13px;
          color: #9e8074;
          margin: 0;
        }
        .claw-section-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #9e8074;
          background: rgba(42,31,25,0.06);
          padding: 3px 10px;
          border-radius: 100px;
        }
        .claw-section-divider {
          border: none;
          border-top: 1px solid rgba(42, 31, 25, 0.08);
          margin: 0 24px;
          max-width: 1152px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Cards grid */
        .claw-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) {
          .claw-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
        }
        @media (max-width: 768px) {
          .claw-hero { padding: 36px 16px 28px; }
          .claw-hero-title { font-size: 2.8rem; }
          .claw-hero-subtitle { font-size: 1.2rem; }
          .claw-section { padding: 28px 16px; }
          .claw-ind-banner { padding: 24px 16px; }
          .claw-ind-banner-title { font-size: 20px; }
        }
        @media (max-width: 480px) {
          .claw-grid { grid-template-columns: 1fr; gap: 12px; }
          .claw-hero-title { font-size: 2.5rem; }
          .claw-hero-subtitle { font-size: 1.1rem; }
          .claw-hero { padding: 28px 16px 20px; }
        }

        .claw-card {
          background: white;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid rgba(42, 31, 25, 0.06);
          box-shadow: 0 2px 8px rgba(42, 31, 25, 0.05);
          transition: box-shadow 0.2s, transform 0.2s;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
        }
        .claw-card:hover {
          box-shadow: 0 8px 28px rgba(42, 31, 25, 0.12);
          transform: translateY(-2px);
        }
        .claw-card-badge {
          background: rgba(248, 242, 237, 0.92);
          backdrop-filter: blur(6px);
          font-size: 11px;
          font-weight: 700;
          color: #6B5549;
          padding: 3px 10px;
          border-radius: 100px;
          border: 1px solid rgba(42, 31, 25, 0.1);
        }
        .claw-card-body {
          padding: 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .claw-card-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #2A1F19;
          margin: 0 0 6px;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }
        .claw-card-desc {
          font-size: 13px;
          color: #6B5549;
          line-height: 1.55;
          margin: 0 0 14px;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .claw-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid rgba(42, 31, 25, 0.07);
        }
        .claw-card-stats {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #9e8074;
          font-weight: 500;
        }
        .claw-card-stat {
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .claw-card-price {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #2A1F19;
        }
        .claw-card-price.free {
          color: #4a9e6b;
          font-size: 13px;
          font-weight: 700;
        }

        /* Skeleton */
        .claw-skeleton {
          background: linear-gradient(90deg, rgba(42,31,25,0.06) 25%, rgba(42,31,25,0.10) 50%, rgba(42,31,25,0.06) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .claw-skeleton-card {
          background: white;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid rgba(42, 31, 25, 0.06);
        }

        /* Load more */
        .claw-load-more {
          text-align: center;
          margin-top: 32px;
        }

        /* Empty state */
        .claw-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 80px 24px;
        }
        .claw-empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        .claw-empty-text {
          font-size: 16px;
          color: #6B5549;
          margin: 0;
          font-style: italic;
        }

        /* All-industries grid preview */
        .claw-industries-overview {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px 48px;
        }
        .claw-ind-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 24px;
        }
        @media (max-width: 900px) {
          .claw-ind-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .claw-ind-grid { grid-template-columns: 1fr; }
        }
        .claw-ind-overview-card {
          background: white;
          border: 1px solid rgba(42,31,25,0.07);
          border-radius: 16px;
          padding: 22px 20px;
          cursor: pointer;
          transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
          text-align: left;
          font-family: 'Manrope', sans-serif;
        }
        .claw-ind-overview-card:hover {
          box-shadow: 0 8px 28px rgba(42,31,25,0.1);
          transform: translateY(-2px);
          border-color: rgba(230,92,70,0.3);
        }
        .claw-ind-ov-emoji {
          font-size: 32px;
          margin-bottom: 10px;
          display: block;
        }
        .claw-ind-ov-name {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #2A1F19;
          margin: 0 0 6px;
        }
        .claw-ind-ov-desc {
          font-size: 13px;
          color: #6B5549;
          line-height: 1.5;
          margin: 0 0 12px;
        }
        .claw-ind-ov-roles {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }
        .claw-ind-ov-role {
          font-size: 11px;
          font-weight: 600;
          color: #9e8074;
          background: rgba(42,31,25,0.05);
          border-radius: 100px;
          padding: 2px 9px;
        }

        .claw-btn-ghost {
          background: white;
          border: 1.5px solid rgba(42,31,25,0.2);
          border-radius: 100px;
          color: #2A1F19;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Manrope', sans-serif;
          transition: background 0.15s, border-color 0.15s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .claw-btn-ghost:hover {
          background: #F0E8E1;
          border-color: rgba(42,31,25,0.35);
        }
      `}</style>

      <div className="claw-app">
        <ClawNav />

        {/* Hero */}
        <div className="claw-hero" style={{ paddingTop: 80 }}>
          <h1 className="claw-hero-title" style={{ fontWeight: 400, fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            AI企业落地解决方案
          </h1>
          <p className="claw-hero-subtitle" style={{ fontWeight: 300, letterSpacing: '0.05em' }}>
            整合的AI客户管理系统、AI进销存系统、AI账单系统、AI客服系统、经营预测分析系统
          </p>
          <button
            onClick={() => setShowOnboarding(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '7px 36px', borderRadius: 100,
              background: '#FFFFFF', color: '#E65C46',
              border: '2px solid #E65C46', cursor: 'pointer',
              fontSize: 20, fontWeight: 700,
              fontFamily: "'Manrope', sans-serif",
              boxShadow: '0 6px 24px rgba(230,92,70,0.2)',
              transition: 'transform 0.15s, box-shadow 0.15s',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 32px rgba(230,92,70,0.3)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(230,92,70,0.2)'; }}
          >
            <span style={{ fontSize: 26 }}>🦞</span>
            马上开通
          </button>
        </div>

        {/* Onboarding chat modal */}
        {showOnboarding && <OnboardingChat onClose={() => setShowOnboarding(false)} />}

        {/* 银行业 AI 场景展示 */}
        <section style={{ padding: '72px 24px', background: 'rgba(240, 232, 225, 0.5)' }}>
          <style>{`
            .bank-scene-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 32px;
              margin-top: 48px;
            }
            .bank-chat-card {
              background: white;
              border-radius: 16px;
              border: 1px solid rgba(42,31,25,0.08);
              box-shadow: 0 4px 24px rgba(42,31,25,0.06);
              overflow: hidden;
              display: flex;
              flex-direction: column;
            }
            .bank-chat-header {
              padding: 16px 20px;
              border-bottom: 1px solid rgba(42,31,25,0.07);
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .bank-chat-avatar {
              width: 36px; height: 36px; border-radius: 50%;
              display: flex; align-items: center; justify-content: center;
              font-size: 18px;
              flex-shrink: 0;
            }
            .bank-chat-body {
              padding: 20px;
              display: flex;
              flex-direction: column;
              gap: 14px;
              flex: 1;
            }
            .bank-msg {
              display: flex;
              gap: 10px;
              align-items: flex-start;
            }
            .bank-msg.user { flex-direction: row-reverse; }
            .bank-msg-avatar {
              width: 30px; height: 30px; border-radius: 50%;
              display: flex; align-items: center; justify-content: center;
              font-size: 14px; flex-shrink: 0;
            }
            .bank-msg-bubble {
              max-width: 82%;
              padding: 10px 14px;
              border-radius: 12px;
              font-size: 13.5px;
              line-height: 1.6;
              white-space: pre-line;
            }
            .bank-msg.ai .bank-msg-bubble {
              background: #F8F2ED;
              color: #2A1F19;
              border-bottom-left-radius: 4px;
            }
            .bank-msg.user .bank-msg-bubble {
              background: #E65C46;
              color: white;
              border-bottom-right-radius: 4px;
            }
            .bank-scene-tag {
              display: inline-flex; align-items: center; gap: 6px;
              background: rgba(230,92,70,0.1); color: #E65C46;
              border-radius: 20px; padding: 4px 12px;
              font-size: 12px; font-weight: 600;
              margin-bottom: 8px;
            }
            @media (max-width: 768px) {
              .bank-scene-grid { grid-template-columns: 1fr; gap: 20px; }
            }
            @keyframes bankMsgIn {
              from { opacity: 0; transform: translateY(8px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            @keyframes bankDot {
              0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
              40% { opacity: 1; transform: scale(1.2); }
            }
          `}</style>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="bank-scene-tag">🏦 银行业 AI 方案</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#2A1F19', fontFamily: "'Bricolage Grotesque', sans-serif", marginBottom: 12 }}>
              让每位客户经理都拥有<span style={{ color: '#E65C46' }}>专属 AI 助理</span>
            </h2>
            <p style={{ color: '#6B5549', fontSize: 16, maxWidth: 600, lineHeight: 1.7 }}>
              从高净值客户维护到产品推荐、风险评估，AI 助理全程辅助客户经理，提升服务质量与成交转化。
            </p>
            <button
              onClick={openBankDemo}
              style={{
                marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 24px', borderRadius: 100,
                background: '#E65C46', color: 'white',
                border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 700,
                fontFamily: "'Manrope', sans-serif",
                boxShadow: '0 4px 16px rgba(230,92,70,0.25)',
              }}
            >
              📱 手机演示
            </button>

            <div className="bank-scene-grid">
              {/* 场景一：高净值客户维护（自动滚动） */}
              <BankScrollChat />

              {/* 场景二：智能产品匹配（自动滚动） */}
              <BankProductChat />
            </div>

            {/* 底部指标 */}
            <div style={{ display: 'flex', gap: 32, marginTop: 48, flexWrap: 'wrap' }}>
              {[
                { num: '3×', label: '客户经理日均跟进量提升' },
                { num: '85%', label: '产品推荐合规通过率' },
                { num: '40%', label: '高净值客户流失率下降' },
                { num: '2min', label: '客户档案 + 方案生成时间' },
              ].map((s, i) => (
                <div key={i} style={{ flex: '1 1 160px', background: 'white', borderRadius: 12, padding: '20px 24px', border: '1px solid rgba(42,31,25,0.07)' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#E65C46', fontFamily: "'Bricolage Grotesque', sans-serif" }}>{s.num}</div>
                  <div style={{ fontSize: 13, color: '#6B5549', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo modal */}
        {showDemo && (
          <div className="claw-demo-overlay" onClick={closeDemo}>
            <div className="claw-phone" onClick={e => e.stopPropagation()}>
              <button className="claw-demo-close" onClick={closeDemo}>×</button>
              <div className="claw-phone-inner">
                <div className="claw-phone-statusbar">
                  <div className="claw-phone-time">9:41</div>
                  <div className="claw-phone-icons">
                    <div className="claw-signal">
                      <span /><span /><span /><span />
                    </div>
                    <div className="claw-wifi">▲</div>
                    <div className="claw-battery">
                      <div className="claw-battery-body"><div className="claw-battery-fill" /></div>
                      <div className="claw-battery-tip" />
                    </div>
                  </div>
                </div>
                <div className="claw-phone-island" />
                <div className="claw-phone-screen">
                  <div className="claw-phone-topbar">
                    <div className="claw-phone-avatar">
                      <img src={currentDemoAvatar} alt="" width={36} height={36} style={{ borderRadius: '50%', display: 'block' }} />
                    </div>
                    <div>
                      <div className="claw-phone-name">{currentDemoName}</div>
                      <div className="claw-phone-status">在线</div>
                    </div>
                  </div>
                  <div className="claw-phone-msgs" ref={msgsRef}>
                    {currentDemoMsgs.map((msg, i) => (
                      visibleMsgs.includes(i) && (
                        <div key={i} className={`claw-msg ${msg.type} visible`}
                          style={{ whiteSpace: 'pre-line' }}>
                          {msg.text.replace(/\\n/g, '\n')}
                        </div>
                      )
                    ))}
                    {showTyping && (
                      <div className="claw-typing visible">
                        <span /><span /><span />
                      </div>
                    )}
                  </div>
                  {/* 底部控制栏 */}
                  <div style={{
                    padding: '7px 12px',
                    borderTop: '1px solid rgba(42,31,25,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#fff',
                    flexShrink: 0,
                    gap: 8,
                  }}>
                    {/* 视角标签 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {currentPersonas.length > 1 && currentPersonas.map((p, idx) => (
                        <button key={idx} onClick={() => switchPersona(idx, currentPersonas)} style={{
                          fontSize: 11, fontWeight: 700,
                          color: activePersonaIdx === idx ? '#fff' : '#9e8074',
                          background: activePersonaIdx === idx ? '#E65C46' : 'rgba(42,31,25,0.06)',
                          border: 'none', borderRadius: 100,
                          padding: '4px 12px', cursor: 'pointer',
                          fontFamily: "'Manrope',sans-serif",
                          transition: 'all 0.15s',
                        }}>
                          {p.label}
                        </button>
                      ))}
                    </div>
                    <span style={{ fontSize: 10, color: '#9e8074', fontFamily: "'Manrope',sans-serif" }}>
                      {visibleMsgs.length} / {currentDemoMsgs.length} 条
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Industry banner (shown for non-all tabs) */}
        {industry !== 'all' && activeIndustry.emoji && (
          <div className="claw-ind-banner">
            <div className="claw-ind-banner-inner">
              <div className="claw-ind-banner-left">
                <span className="claw-ind-banner-emoji">{activeIndustry.emoji}</span>
                <h2 className="claw-ind-banner-title">
                  <span>{activeIndustry.label}</span> · AI 技能包
                </h2>
                <p className="claw-ind-banner-desc">{activeIndustry.desc}</p>
              </div>
              {activeIndustry.roles.length > 0 && (
                <div className="claw-ind-banner-roles">
                  {activeIndustry.roles.map(role => (
                    <div key={role} className="claw-ind-role-tag">
                      <div className="claw-ind-role-dot" />
                      {role}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Industry solutions overview (shown for "全部" tab) */}
        {industry === 'all' && !search && industryListings.length > 0 && (
          <div className="claw-industries-overview">
            <div className="claw-section-header" style={{ marginBottom: 0, justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h2 className="claw-section-title">行业案例展示</h2>
              </div>
              <select
                className="claw-sort-select"
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="claw-grid" style={{ marginTop: 24 }}>
              {sortedIndustryListings.map(l => (
                <ListingCard key={l.id} listing={l} onDemo={openDemo} large />
              ))}
            </div>
            {industryHasMore && (
              <div className="claw-load-more">
                <button
                  onClick={loadMoreIndustry}
                  disabled={industryLoadingMore}
                  className="claw-btn-ghost"
                  style={{ padding: '12px 36px', fontSize: '14px' }}
                >
                  {industryLoadingMore ? <Loader2 size={16} /> : '加载更多'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Main listings - only shown when searching or filtering by industry tab */}
        {(search || industry !== 'all') && (
        <section className="claw-section" style={{ paddingTop: undefined }}>
          {search ? (
            <div className="claw-section-header">
              <h2 className="claw-section-title">"{search}" 的搜索结果</h2>
              <span className="claw-section-subtitle">{listings.length} 个结果</span>
            </div>
          ) : (
            <div className="claw-section-header">
              <h2 className="claw-section-title">{activeIndustry.label}技能包</h2>
              <span className="claw-section-subtitle">{listings.length} 个</span>
            </div>
          )}

          {loading ? (
            <SkeletonGrid />
          ) : (
            <>
              <div className="claw-grid">
                {listings.length > 0 ? listings.map(l => <ListingCard key={l.id} listing={l} onDemo={openDemo} />) : (
                  <div className="claw-empty">
                    <div className="claw-empty-icon">
                      {search ? '🔍' : activeIndustry.emoji || '✨'}
                    </div>
                    <p className="claw-empty-text">
                      {search ? '没有找到匹配的技能，换个关键词试试。' : '该行业暂无技能包，敬请期待。'}
                    </p>
                  </div>
                )}
              </div>
              {hasMore && (
                <div className="claw-load-more">
                  <button
                    onClick={() => fetchListings(true, page + 1)}
                    disabled={loading}
                    className="claw-btn-ghost"
                    style={{ padding: '12px 36px', fontSize: '14px' }}
                  >
                    {loading ? <Loader2 size={16} /> : '加载更多'}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
        )}

        {/* 运行 AI 的三种方式 */}
        {false && <section style={{ padding: '56px 24px', background: 'rgba(240, 232, 225, 0.5)' }}>
          <style>{`
            .claw-ways-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
              gap: 24px;
            }
            .claw-ways-title {
              font-size: 2.4rem;
              font-weight: 300;
              text-align: center;
              margin-bottom: 32px;
              font-family: 'Bricolage Grotesque', sans-serif;
              color: #2A1F19;
            }
            @media (max-width: 640px) {
              .claw-ways-grid { grid-template-columns: 1fr; gap: 16px; }
              .claw-ways-title { font-size: 1.5rem; margin-bottom: 20px; }
            }
          `}</style>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 className="claw-ways-title">企业版龙虾运行方式</h2>
            <div className="claw-ways-grid">
              {[
                {
                  title: "方案一", name: "自己搭建 OpenClaw", highlight: false,
                  pros: ["完全掌控"],
                  cons: ["你来配置每一个技能", "你来调试每一个问题", "你来摸索什么管用", "不投入就不会进步", "需要数周才能达到生产质量"],
                  note: "适合有技术背景、时间无限的人。",
                },
                {
                  title: "方案二", name: "「托管 OpenClaw」主机", highlight: false,
                  pros: ["别人来跑服务器", "包含基础配置"],
                  cons: ["通用配置，不为你的业务定制", "「维护」= 只是保证不宕机", "没有人在主动让它变更好", "最难的部分——让它真正好用——还是你自己来"],
                  note: "装了辅助轮的服务器。你还是驾驶员。",
                },
                {
                  title: "方案三", name: "我们的方案", highlight: true,
                  pros: ["高效的部署方式，企业版5分钟部署好，企业管理者、员工直接扫码绑定就可以开始使用", "内置企业管理系统，包含进销存、CRM，自动报表，经营分析预测系统，AI广告投放系统(包括各大社媒平台自动内容投放系统)，并完美适配龙虾", "我们有为行业定制的完善的AI技能库，让你的员工配备AI工具，工作更高效"],
                  cons: [],
                  note: "你得到员工。我们做其他所有事情。",
                },
              ].map((opt, i) => (
                <div key={i} style={opt.highlight
                  ? { border: '1.5px solid #E65C46', background: 'rgba(230, 92, 70, 0.05)', boxShadow: '0 4px 20px rgba(230,92,70,0.15)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column' }
                  : { border: '1px solid rgba(42, 31, 25, 0.1)', background: 'white', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column' }
                }>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9e8074', marginBottom: 4 }}>{opt.title}</p>
                  <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 16, color: '#2A1F19', fontFamily: "'Bricolage Grotesque', sans-serif" }}>{opt.name}</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
                    {opt.pros.map((p, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: '#2A1F19' }}>
                        <span style={{ color: '#22c55e', fontWeight: 700, flexShrink: 0 }}>✓</span>{p}
                      </li>
                    ))}
                    {opt.cons.map((c, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: '#6B5549' }}>
                        <span style={{ color: '#f87171', fontWeight: 700, flexShrink: 0 }}>✗</span>{c}
                      </li>
                    ))}
                  </ul>
                  <p style={{ fontSize: 12, color: '#9e8074', fontStyle: 'italic', marginTop: 'auto' }}>{opt.note}</p>
                </div>
              ))}
            </div>
            <p style={{ textAlign: 'center', color: '#6B5549', marginTop: 32, fontSize: 14, maxWidth: 672, margin: '32px auto 0', padding: '0 16px' }}>
              其他服务商给你一台服务器，然后祝你好运。我们给你一个能工作的 AI 员工和一支让它保持锋利的团队。工具和队友的区别，在于是否有人在主动让它更好。那就是我们。
            </p>
          </div>
        </section>}

        <ClawFooter />
      </div>
    </>
  );
}
