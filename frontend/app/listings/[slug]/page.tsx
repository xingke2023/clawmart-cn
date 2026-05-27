'use client';

import { useEffect, useState, use, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { listingsApi, Listing, DemoMessage, DemoPersona } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  ChevronLeft, ShoppingCart, CheckCircle2, ShieldCheck, Zap,
  Globe, Star, Download, Loader2, MessageSquare, FileText,
  Package, User, BookOpen, ChevronDown, ChevronUp, Play
} from "lucide-react";
import { ClawNav, ClawFooter, clawStyles } from "@/components/claw-layout";

type Tab = '概览' | '使用说明' | '评论';

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

const MOCK_COMMENTS = [
  { user: '小明同学', comment: '非常好用！部署简单，效果很棒，强烈推荐给团队里的朋友。', time: '3天前', rating: 5 },
  { user: 'AI达人_007', comment: '这个技能包质量很高，文档详细清晰，按步骤操作很顺畅。', time: '1周前', rating: 5 },
  { user: '效率控Pro', comment: '用了之后工作效率提升明显，特别是处理重复任务时省了很多时间。', time: '2周前', rating: 4 },
  { user: '开发者Leo', comment: '按照说明一步步操作，很顺利就跑起来了。希望后续能更新更多功能！', time: '1个月前', rating: 5 },
  { user: 'TechFan88', comment: '期待更多功能更新，整体来说还不错。', time: '1个月前', rating: 4 },
  { user: 'Claude用户', comment: '很实用的工具，节省了大量重复劳动，感谢开发者！', time: '2个月前', rating: 5 },
];

const INSTALL_STEPS = [
  {
    step: 1,
    title: '下载技能包',
    desc: '点击右侧「下载 ZIP」按钮，获取包含 SKILL.md 的完整技能包压缩文件。',
  },
  {
    step: 2,
    title: '解压并查看 SKILL.md',
    desc: '解压后打开 SKILL.md 文件，了解该技能的使用方式、所需权限和参数说明。',
  },
  {
    step: 3,
    title: '导入至 OpenClaw',
    desc: '打开 OpenClaw 客户端 → 技能管理 → 导入本地技能，选择解压出的文件夹完成导入。',
  },
  {
    step: 4,
    title: '配置与测试',
    desc: '根据 SKILL.md 中的说明配置所需的 API Key 或环境变量，然后运行示例命令验证是否正常工作。',
  },
];

function generateSkillMd(listing: Listing): string {
  return `---
name: ${listing.name}
category: ${listing.category}
version: v1.0.0
price: ${listing.category === '行业方案' ? '商务合作' : parseFloat(listing.price) === 0 ? 'Free' : '¥' + listing.price}
status: ${listing.status}
---

# ${listing.name}

## 概览

${listing.description || '该技能可帮助你自动化相关任务，提升工作效率。'}

## 使用方式

在 OpenClaw 中导入本技能后，可通过以下方式调用：

\`\`\`
# 示例调用
openclaw run ${listing.slug} --input "你的输入内容"
\`\`\`

## 参数说明

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| input | string | 是 | 输入内容 |
| output | string | 否 | 输出格式，默认为 text |

## 注意事项

- 请确保已安装 OpenClaw 客户端（>= 1.0.0）
- 部分功能可能需要配置相关 API Key
- 如遇问题请查阅官方文档或联系卖家

## 许可证

购买后可在个人或商业项目中使用，禁止二次销售或转让。
`;
}

const CAPABILITIES_BY_CATEGORY: Record<string, string[]> = {
  '写作': ['长文博客撰写', '内容策略规划', 'SEO 关键词优化', '品牌声音塑造', '社媒文案生成', '邮件营销文案', '产品描述撰写', '多语言内容适配'],
  '编程': ['代码审查与重构', 'Bug 自动定位', '单元测试生成', 'API 文档撰写', '数据库查询优化', '代码注释补全', '多语言代码转换', 'CI/CD 脚本生成'],
  '数据分析': ['数据清洗与预处理', '统计报告生成', '可视化图表建议', '异常值检测', '预测模型搭建', 'SQL 查询生成', '数据摘要提炼', '趋势洞察分析'],
  '客服': ['智能问答对话', '工单自动分类', '情绪识别与处理', '多轮对话管理', '知识库检索', '退款流程引导', '多语言客户支持', '服务质量评估'],
  '营销': ['广告文案生成', 'A/B 测试方案设计', '受众画像分析', '竞品调研报告', '营销活动策划', '转化漏斗优化', '社媒投放策略', 'KOL 合作方案'],
  '教育': ['个性化课程规划', '知识点讲解', '习题自动生成', '学习进度追踪', '错题分析报告', '教学视频脚本', '多格式内容适配', '互动式问答设计'],
  '设计': ['创意概念提炼', '配色方案建议', 'UI 原型描述', '品牌视觉规范', '图像提示词生成', '设计稿评审反馈', '用户体验优化建议', '多端适配检查'],
  '研究': ['文献综述生成', '论文摘要提炼', '实验方案设计', '引用格式转换', '多源信息整合', '研究假设验证', '数据解读报告', '学术写作润色'],
};

const DEFAULT_CAPABILITIES = ['多智能体编排', '自动化工作流', '上下文记忆管理', '工具调用集成', '结构化输出生成', '任务分解执行', '错误自动重试', '批量处理支持'];

function getCapabilities(listing: Listing, seed: number): string[] {
  const pool = CAPABILITIES_BY_CATEGORY[listing.category] ?? DEFAULT_CAPABILITIES;
  // Pick 5–7 items deterministically based on seed
  const count = 5 + Math.floor(seededRandom(seed * 3) * 3);
  const result: string[] = [];
  for (let i = 0; i < count && i < pool.length; i++) {
    const idx = Math.floor(seededRandom(seed * (i + 7)) * pool.length);
    const item = pool[(idx + i) % pool.length];
    if (!result.includes(item)) result.push(item);
  }
  return result.length >= 4 ? result : pool.slice(0, 6);
}

export default function ListingDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [owned, setOwned] = useState(false);
  const [buying, setBuying] = useState(false);
  const [buySuccess, setBuySuccess] = useState(false);
  const [paymentCancelled, setPaymentCancelled] = useState(false);
  const [paidFromStripe, setPaidFromStripe] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('概览');
  const [securityExpanded, setSecurityExpanded] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [visibleMsgs, setVisibleMsgs] = useState<number[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const [currentDemoMsgs, setCurrentDemoMsgs] = useState<DemoMessage[]>([]);
  const [currentPersonas, setCurrentPersonas] = useState<DemoPersona[]>([]);
  const [activePersonaIdx, setActivePersonaIdx] = useState(0);
  const demoTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const msgsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [visibleMsgs, showTyping]);

  const playDemoMsgs = useCallback((messages: DemoMessage[]) => {
    demoTimers.current.forEach(clearTimeout);
    demoTimers.current = [];
    setVisibleMsgs([]);
    setShowTyping(false);
    const count = messages.length;
    const aiTyping   = count > 6 ? 1000 : 1400;
    const aiRead     = count > 6 ? 1500 : 2200;
    const userTyping = count > 6 ? 500  : 700;
    const userRead   = count > 6 ? 700  : 1000;
    let delay = 300;
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
  }, []);

  const openDemo = useCallback((listing: Listing) => {
    const personas: DemoPersona[] = listing.demo_personas?.length
      ? listing.demo_personas
      : listing.demo_messages?.length
        ? [{ label: '演示', messages: listing.demo_messages }]
        : [];
    if (!personas.length) return;
    setCurrentPersonas(personas);
    setActivePersonaIdx(0);
    setCurrentDemoMsgs(personas[0].messages);
    setShowDemo(true);
    playDemoMsgs(personas[0].messages);
  }, [playDemoMsgs]);

  const switchPersona = useCallback((idx: number, personas: DemoPersona[]) => {
    setActivePersonaIdx(idx);
    const msgs = personas[idx].messages;
    setCurrentDemoMsgs(msgs);
    playDemoMsgs(msgs);
  }, [playDemoMsgs]);

  const closeDemo = useCallback(() => {
    setShowDemo(false);
    demoTimers.current.forEach(clearTimeout);
    setVisibleMsgs([]);
    setShowTyping(false);
  }, []);

  const skipDemo = useCallback(() => {
    demoTimers.current.forEach(clearTimeout);
    setShowTyping(false);
    setVisibleMsgs(currentDemoMsgs.map((_, i) => i));
  }, [currentDemoMsgs]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    if (paymentStatus === 'success') {
      setBuySuccess(true);
      setOwned(true);
      setPaidFromStripe(true);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 5000);
    } else if (paymentStatus === 'cancelled') {
      setPaymentCancelled(true);
    }
  }, []);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await listingsApi.getListing(slug);
        setListing(response);
      } catch (error) {
        console.error("Failed to fetch listing:", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchListing();
  }, [slug]);

  useEffect(() => {
    if (isAuthenticated && token && listing && !paidFromStripe) {
      listingsApi.checkPurchased(listing.id, token)
        .then(r => setOwned(r.owned))
        .catch(() => {});
    }
  }, [isAuthenticated, token, listing, paidFromStripe]);

  // Auto-play demo for 行业方案 listings
  useEffect(() => {
    if (listing && listing.category === '行业方案') {
      const hasDemo = listing.demo_personas?.length || listing.demo_messages?.length;
      if (hasDemo) openDemo(listing);
    }
  }, [listing]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBuy = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setBuying(true);
    setPaymentCancelled(false);
    try {
      if (isFree) {
        await listingsApi.purchaseFree(listing!.id, token!);
        setOwned(true);
        setBuySuccess(true);
      } else {
        const { url } = await listingsApi.createCheckoutSession(listing!.id, token!);
        window.location.href = url;
      }
    } catch (e: any) {
      console.error(e);
      setBuying(false);
    }
  };

  const handleDownloadZip = () => {
    if (!listing) return;
    const skillMd = generateSkillMd(listing);
    const blob = new Blob([skillMd], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${listing.slug}-skill.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <>
        <style>{clawStyles + detailStyles}</style>
        <div className="claw-page">
          <ClawNav />
          <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
            <div className="claw-skeleton" style={{ height: 20, width: 120, marginBottom: 40 }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40 }}>
              <div>
                <div className="claw-skeleton" style={{ height: 36, width: '60%', marginBottom: 16 }} />
                <div className="claw-skeleton" style={{ height: 16, width: '40%', marginBottom: 24 }} />
                <div className="claw-skeleton" style={{ height: 200, marginBottom: 16 }} />
              </div>
              <div>
                <div className="claw-skeleton" style={{ height: 280, borderRadius: 14 }} />
              </div>
            </div>
          </main>
          <ClawFooter />
        </div>
      </>
    );
  }

  if (!listing) {
    return (
      <>
        <style>{clawStyles + detailStyles}</style>
        <div className="claw-page">
          <ClawNav />
          <main style={{ maxWidth: 1200, margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h2 className="claw-h2" style={{ marginBottom: 24 }}>未找到该智能体</h2>
            <Link href="/" className="claw-btn-primary">返回首页</Link>
          </main>
          <ClawFooter />
        </div>
      </>
    );
  }

  const isFree = parseFloat(listing.price) === 0;
  const isBusinessCooperation = listing.category === '行业方案';
  const isSold = listing.status === 'sold';
  const isOwned = owned || buySuccess;
  const seed = listing.id;
  const starCount = Math.floor(seededRandom(seed * 7) * 150 + 20);
  const downloadCount = Math.floor(seededRandom(seed * 13) * 50 + 5);
  const installCount = Math.floor(seededRandom(seed * 17) * 300 + 30);
  const allTimeInstalls = installCount + Math.floor(seededRandom(seed * 23) * 50 + 10);
  const fileSize = (seededRandom(seed * 31) * 8 + 1.2).toFixed(1);
  const publishedDate = new Date(listing.created_at).toLocaleDateString('zh-CN');

  // Pick 3–5 comments deterministically
  const commentCount = Math.floor(seededRandom(seed * 41) * 3) + 3;
  const comments = MOCK_COMMENTS.slice(0, commentCount);

  const TABS: Tab[] = ['概览', '使用说明', '评论'];

  return (
    <>
      <style>{clawStyles + detailStyles}</style>
      <div className="claw-page">
        <ClawNav />

        {/* Demo Modal - Phone Style */}
        {showDemo && currentDemoMsgs.length > 0 && (
          <div className="detail-demo-overlay" onClick={closeDemo}>
            <div className="detail-phone" onClick={e => e.stopPropagation()}>
              <button className="detail-demo-close" onClick={closeDemo}>×</button>
              <div className="detail-phone-inner">
                <div className="detail-phone-statusbar">
                  <div className="detail-phone-time">9:41</div>
                  <div className="detail-phone-icons">
                    <div className="detail-signal">
                      <span /><span /><span /><span />
                    </div>
                    <div className="detail-wifi">▲</div>
                    <div className="detail-battery">
                      <div className="detail-battery-body"><div className="detail-battery-fill" /></div>
                      <div className="detail-battery-tip" />
                    </div>
                  </div>
                </div>
                <div className="detail-phone-island" />
                <div className="detail-phone-screen">
                  <div className="detail-phone-topbar">
                    <div className="detail-phone-avatar">
                      <img
                        src={(() => {
                          const styles = ['shapes', 'icons', 'identicon', 'rings', 'bottts'];
                          const style = styles[listing.id % styles.length];
                          return `https://api.dicebear.com/9.x/${style}/svg?seed=${listing.id}&size=36&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
                        })()}
                        alt=""
                        width={36} height={36}
                        style={{ borderRadius: '50%', display: 'block' }}
                      />
                    </div>
                    <div>
                      <div className="detail-phone-name">{listing.name}</div>
                      <div className="detail-phone-status">在线</div>
                    </div>
                  </div>
                  <div className="detail-phone-msgs" ref={msgsRef}>
                    {currentDemoMsgs.map((msg, i) => (
                      visibleMsgs.includes(i) && (
                        <div key={i} className={`detail-msg ${msg.type} visible`} style={{ whiteSpace: 'pre-line' }}>
                          {msg.text.replace(/\\n/g, '\n')}
                        </div>
                      )
                    ))}
                    {showTyping && (
                      <div className="detail-typing visible">
                        <span /><span /><span />
                      </div>
                    )}
                  </div>
                  <div style={{
                    padding: '7px 12px',
                    borderTop: '1px solid rgba(42,31,25,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: '#fff', flexShrink: 0, gap: 8,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {currentPersonas.length > 1 && currentPersonas.map((p, idx) => (
                        <button key={idx} onClick={() => switchPersona(idx, currentPersonas)} style={{
                          fontSize: 11, fontWeight: 700,
                          color: activePersonaIdx === idx ? '#fff' : '#9e8074',
                          background: activePersonaIdx === idx ? '#E65C46' : 'rgba(42,31,25,0.06)',
                          border: 'none', borderRadius: 100,
                          padding: '4px 10px', cursor: 'pointer',
                          fontFamily: "'Manrope',sans-serif",
                          transition: 'all 0.15s',
                        }}>
                          {p.label}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 10, color: '#9e8074', fontFamily: "'Manrope',sans-serif" }}>
                        {visibleMsgs.length} / {currentDemoMsgs.length} 条
                      </span>
                      {visibleMsgs.length < currentDemoMsgs.length && (
                        <button onClick={skipDemo} style={{
                          fontSize: 11, fontWeight: 700, color: '#E65C46',
                          background: 'rgba(230,92,70,0.08)', border: '1px solid rgba(230,92,70,0.25)',
                          borderRadius: 100, padding: '3px 10px', cursor: 'pointer',
                          fontFamily: "'Manrope',sans-serif",
                        }}>
                          ⚡ 快进
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {showSuccessToast && (
          <div style={{
            position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
            zIndex: 9999, display: 'flex', alignItems: 'center', gap: 12,
            background: '#1a7a48', color: '#fff',
            padding: '14px 20px', borderRadius: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            fontSize: 15, fontWeight: 600,
            animation: 'toastIn 0.3s ease',
          }}>
            <CheckCircle2 size={20} />
            🎉 支付成功！技能已加入你的库
            <button onClick={() => setShowSuccessToast(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: 8, opacity: 0.7, fontSize: 18 }}>×</button>
          </div>
        )}

        <main style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 20px 80px' }}>
          {/* Back */}
          <Link href="/" className="detail-back">
            <ChevronLeft size={16} />
            返回列表
          </Link>

          {/* Hero */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                  <img
                    src={(() => {
                      if (listing.category === 'AI 角色') {
                        return `https://api.dicebear.com/9.x/open-peeps/svg?seed=${listing.id}&size=48&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
                      }
                      const styles = ['shapes', 'icons', 'identicon', 'rings', 'bottts', 'pixel-art', 'fun-emoji'];
                      const style = styles[listing.id % styles.length];
                      return `https://api.dicebear.com/9.x/${style}/svg?seed=${listing.id}&size=48&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
                    })()}
                    alt=""
                    width={48}
                    height={48}
                    style={{ borderRadius: 10, background: '#F0E8E1', flexShrink: 0 }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <h1 style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontSize: 34,
                        fontWeight: 800,
                        color: '#2A1F19',
                        lineHeight: 1.15,
                        letterSpacing: '-0.02em',
                        margin: 0,
                      }}>
                        {listing.name}
                      </h1>
                      <span className="claw-card-badge" style={{ marginTop: 6, flexShrink: 0 }}>{listing.category}</span>
                      {(listing.demo_personas?.length || listing.demo_messages?.length) ? (
                        <button
                          onClick={() => openDemo(listing)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            marginTop: 5,
                            padding: '4px 12px',
                            background: 'rgba(230,92,70,0.08)',
                            color: '#E65C46',
                            border: '1px solid rgba(230,92,70,0.28)',
                            borderRadius: 100,
                            fontSize: 12.5, fontWeight: 700,
                            cursor: 'pointer',
                            flexShrink: 0,
                            transition: 'all 0.15s',
                          }}
                          onMouseOver={e => { e.currentTarget.style.background = 'rgba(230,92,70,0.16)'; }}
                          onMouseOut={e => { e.currentTarget.style.background = 'rgba(230,92,70,0.08)'; }}
                        >
                          <Play size={11} fill="#E65C46" />
                          查看演示
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
                {listing.description && (
                  <p style={{ fontSize: 15, color: '#6B5549', margin: '10px 0 14px', lineHeight: 1.6, maxWidth: 620 }}>
                    {listing.description.split('\n')[0].substring(0, 120)}
                    {listing.description.length > 120 ? '…' : ''}
                  </p>
                )}
                {/* Stats row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#9e8074', fontWeight: 500 }}>
                    <Star size={13} fill="#f5a623" color="#f5a623" />
                    {starCount} 好评
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#9e8074', fontWeight: 500 }}>
                    <Download size={13} />
                    {downloadCount}k 下载
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#9e8074', fontWeight: 500 }}>
                    <Package size={13} />
                    {installCount} 当前安装 · {allTimeInstalls} 历史安装
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#9e8074', fontWeight: 500 }}>
                    <Globe size={13} />
                    v{Math.floor(seededRandom(seed * 19) * 4) + 1}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <hr className="claw-divider" style={{ margin: '0 0 32px' }} />

          {/* Main two-column */}
          <div className="detail-layout">
            {/* Left: tabbed content */}
            <div className="detail-content">

              {/* Security scan */}
              <div style={{
                background: '#fff',
                border: '1px solid rgba(42,31,25,0.09)',
                borderRadius: 12,
                marginBottom: 24,
                overflow: 'hidden',
              }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(42,31,25,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9e8074' }}>安全扫描</span>
                  <button
                    onClick={() => setSecurityExpanded(!securityExpanded)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9e8074', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}
                  >
                    详情 {securityExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
                <div style={{ padding: '14px 18px', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: 'rgba(74,158,107,0.08)', border: '1px solid rgba(74,158,107,0.2)', borderRadius: 8 }}>
                    <ShieldCheck size={15} style={{ color: '#4a9e6b' }} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#2e7d52' }}>VirusTotal</div>
                      <div style={{ fontSize: 11, color: '#4a9e6b' }}>安全无害</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: 'rgba(42,31,25,0.04)', border: '1px solid rgba(42,31,25,0.1)', borderRadius: 8 }}>
                    <Zap size={15} style={{ color: '#E65C46' }} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#2A1F19' }}>OpenClaw AI</div>
                      <div style={{ fontSize: 11, color: '#6B5549' }}>内容合规</div>
                    </div>
                  </div>
                </div>
                {securityExpanded && (
                  <div style={{ padding: '0 18px 14px', fontSize: 13, color: '#6B5549', lineHeight: 1.65, borderTop: '1px solid rgba(42,31,25,0.06)' }}>
                    <div style={{ padding: '12px 0 0' }}>
                      该技能已通过 VirusTotal 多引擎扫描，未发现恶意代码。OpenClaw AI 对技能描述与功能一致性进行了验证，评估结果为内容合规。如同贝壳保护甲壳类动物，安全需要层层把关 — 在运行任何技能前请先审阅代码。
                    </div>
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div style={{ borderBottom: '2px solid rgba(42,31,25,0.08)', marginBottom: 24, display: 'flex', gap: 0 }}>
                {TABS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      padding: '10px 20px',
                      fontSize: 14, fontWeight: activeTab === tab ? 700 : 500,
                      color: activeTab === tab ? '#E65C46' : '#6B5549',
                      borderBottom: activeTab === tab ? '2px solid #E65C46' : '2px solid transparent',
                      marginBottom: -2,
                      transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    {tab === '概览' && <BookOpen size={14} />}
                    {tab === '使用说明' && <FileText size={14} />}
                    {tab === '评论' && <MessageSquare size={14} />}
                    {tab}
                    {tab === '评论' && (
                      <span style={{
                        background: 'rgba(42,31,25,0.08)', color: '#6B5549',
                        fontSize: 11, fontWeight: 700,
                        padding: '1px 6px', borderRadius: 100,
                      }}>{commentCount}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab: 概览 */}
              {activeTab === '概览' && (
                <div>
                  {/* Description */}
                  <div style={{ marginBottom: 28 }}>
                    <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, fontWeight: 700, color: '#2A1F19', marginBottom: 12 }}>功能描述</h3>
                    <p style={{ fontSize: 15, color: '#6B5549', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>
                      {listing.description || '该技能可自动化处理相关业务流程，集成到 OpenClaw 后即可使用。支持多种输入格式，适配主流 AI 模型，开箱即用。'}
                    </p>
                  </div>

                  {/* Features */}
                  <div style={{ marginBottom: 28 }}>
                    <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, fontWeight: 700, color: '#2A1F19', marginBottom: 12 }}>核心能力</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {getCapabilities(listing, seed).map((cap, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#E65C46', flexShrink: 0 }} />
                          <span style={{ fontSize: 15, color: '#6B5549', lineHeight: 1.8 }}>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Files */}
                  <div style={{ marginBottom: 28 }}>
                    <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, fontWeight: 700, color: '#2A1F19', marginBottom: 14 }}>
                      文件 <span style={{ fontSize: 13, fontWeight: 500, color: '#9e8074', marginLeft: 6 }}>共 1 个</span>
                    </h3>
                    <div style={{
                      background: '#fff',
                      border: '1px solid rgba(42,31,25,0.09)',
                      borderRadius: 10,
                      overflow: 'hidden',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid rgba(42,31,25,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <FileText size={16} style={{ color: '#9e8074' }} />
                          <span style={{ fontSize: 14, fontWeight: 600, color: '#2A1F19' }}>SKILL.md</span>
                        </div>
                        <span style={{ fontSize: 12, color: '#9e8074' }}>{fileSize} KB</span>
                      </div>
                      <div style={{ padding: '10px 16px', fontSize: 12, color: '#9e8074' }}>
                        包含完整的技能描述、参数说明及示例代码
                      </div>
                    </div>
                  </div>

                  {/* Callout */}
                  <div className="claw-highlight-box">
                    <div style={{ fontSize: 13, color: '#6B5549', lineHeight: 1.65 }}>
                      需要更多定制化功能？<Link href="/sourcing" style={{ color: '#E65C46', fontWeight: 600, textDecoration: 'none' }}>提交众包需求</Link>，我们将为您匹配专属开发者。
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: 使用说明 */}
              {activeTab === '使用说明' && (
                <div>
                  <div style={{ marginBottom: 24 }}>
                    <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, fontWeight: 700, color: '#2A1F19', marginBottom: 6 }}>安装步骤</h3>
                    <p style={{ fontSize: 14, color: '#9e8074', margin: '0 0 20px' }}>按照以下步骤将技能导入 OpenClaw 并开始使用。</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {INSTALL_STEPS.map((s) => (
                        <div key={s.step} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                          <div className="claw-step-num" style={{ flexShrink: 0, width: 32, height: 32, fontSize: 13 }}>{s.step}</div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#2A1F19', marginBottom: 4 }}>{s.title}</div>
                            <div style={{ fontSize: 13, color: '#6B5549', lineHeight: 1.65 }}>{s.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, fontWeight: 700, color: '#2A1F19', marginBottom: 12 }}>SKILL.md 示例</h3>
                    <pre style={{
                      background: '#1e1e2e',
                      color: '#cdd6f4',
                      borderRadius: 10,
                      padding: '18px 20px',
                      fontSize: 12.5,
                      lineHeight: 1.7,
                      overflowX: 'auto',
                      margin: 0,
                      fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                    }}>{`---
name: ${listing.name}
version: v1.0.0
category: ${listing.category}
---

# ${listing.name}

## 概览

${(listing.description || '技能描述').split('\n')[0].substring(0, 80)}

## 示例调用

\`\`\`json
{
  "action": "run",
  "input": "你的输入内容",
  "output": "text"
}
\`\`\``}</pre>
                  </div>

                  <div className="claw-highlight-box">
                    <div style={{ fontSize: 13, color: '#6B5549', lineHeight: 1.65 }}>
                      遇到安装问题？查看 <Link href="/help" style={{ color: '#E65C46', fontWeight: 600, textDecoration: 'none' }}>帮助文档</Link> 或 <Link href="/sourcing" style={{ color: '#E65C46', fontWeight: 600, textDecoration: 'none' }}>联系我们</Link> 获取支持。
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: 评论 */}
              {activeTab === '评论' && (
                <div>
                  {/* Rating summary */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 24,
                    padding: '20px 24px',
                    background: '#fff',
                    border: '1px solid rgba(42,31,25,0.08)',
                    borderRadius: 12,
                    marginBottom: 20,
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 40, fontWeight: 800, color: '#2A1F19', lineHeight: 1 }}>4.8</div>
                      <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginTop: 6 }}>
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} size={14} fill={i <= 5 ? '#f5a623' : 'none'} color="#f5a623" />
                        ))}
                      </div>
                      <div style={{ fontSize: 12, color: '#9e8074', marginTop: 4 }}>{starCount} 条评价</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      {[5,4,3,2,1].map((star, i) => {
                        const pct = [72, 20, 5, 2, 1][i];
                        return (
                          <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                            <span style={{ fontSize: 12, color: '#9e8074', width: 8, textAlign: 'right' }}>{star}</span>
                            <Star size={11} fill="#f5a623" color="#f5a623" />
                            <div style={{ flex: 1, height: 6, background: 'rgba(42,31,25,0.08)', borderRadius: 100, overflow: 'hidden' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: '#f5a623', borderRadius: 100 }} />
                            </div>
                            <span style={{ fontSize: 12, color: '#9e8074', width: 28 }}>{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Comments */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {comments.map((c, i) => (
                      <div key={i} style={{
                        padding: '16px 18px',
                        background: '#fff',
                        border: '1px solid rgba(42,31,25,0.08)',
                        borderRadius: 12,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 32, height: 32, borderRadius: '50%',
                              background: `hsl(${(i * 47 + seed * 13) % 360}, 60%, 65%)`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 13, fontWeight: 700, color: '#fff',
                            }}>
                              {c.user[0]}
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#2A1F19' }}>{c.user}</div>
                              <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
                                {[1,2,3,4,5].map(s => (
                                  <Star key={s} size={11} fill={s <= c.rating ? '#f5a623' : 'none'} color={s <= c.rating ? '#f5a623' : '#ddd'} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span style={{ fontSize: 12, color: '#9e8074' }}>{c.time}</span>
                        </div>
                        <p style={{ fontSize: 14, color: '#6B5549', margin: 0, lineHeight: 1.65 }}>{c.comment}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 20, textAlign: 'center' }}>
                    <p style={{ fontSize: 13, color: '#9e8074' }}>购买后即可发表评价</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: purchase card (sticky) */}
            <div className="detail-sidebar">
              <div style={{
                background: '#fff',
                border: '1px solid rgba(42,31,25,0.09)',
                borderRadius: 16,
                padding: 24,
                position: 'sticky',
                top: 88,
              }}>
                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <span style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: 34,
                    fontWeight: 800,
                    color: isFree ? '#4a9e6b' : '#2A1F19',
                  }}>
                    {isBusinessCooperation ? '商务合作' : isFree ? '免费' : `¥${listing.price}`}
                  </span>
                  {isSold && (
                    <span style={{ background: 'rgba(42,31,25,0.08)', color: '#6B5549', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 100 }}>已售罄</span>
                  )}
                </div>

                {/* CTA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  {paymentCancelled && !isOwned && (
                    <div style={{ padding: '10px 14px', background: 'rgba(230,92,70,0.07)', borderRadius: 8, border: '1px solid rgba(230,92,70,0.2)', fontSize: 13, color: '#E65C46' }}>
                      支付已取消，您可以随时重新发起购买。
                    </div>
                  )}

                  {isOwned ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', background: 'rgba(74,158,107,0.1)', borderRadius: 10, border: '1px solid rgba(74,158,107,0.25)' }}>
                        <CheckCircle2 size={18} style={{ color: '#4a9e6b', flexShrink: 0 }} />
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#2e7d52' }}>已加入你的库！</span>
                      </div>
                      <button
                        onClick={handleDownloadZip}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          padding: '12px 20px',
                          background: '#E65C46',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 10,
                          fontSize: 14, fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'opacity 0.15s',
                        }}
                        onMouseOver={e => (e.currentTarget.style.opacity = '0.88')}
                        onMouseOut={e => (e.currentTarget.style.opacity = '1')}
                      >
                        <Download size={16} />
                        下载 ZIP
                      </button>
                      <Link href="/dashboard?tab=purchases" className="claw-btn-ghost" style={{ justifyContent: 'center', padding: '11px 20px', fontSize: 14, textDecoration: 'none' }}>
                        查看我的购买 →
                      </Link>
                    </>
                  ) : isBusinessCooperation ? (
                    <a
                      href="https://work.weixin.qq.com/kfid/kfcdfdb02ed73c8e4d0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="claw-btn-primary"
                      style={{ justifyContent: 'center', padding: '13px 20px', fontSize: 15, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <ShoppingCart size={16} />联系商务合作
                    </a>
                  ) : (
                    <button
                      className="claw-btn-primary"
                      disabled={isSold || buying}
                      onClick={handleBuy}
                      style={{ justifyContent: 'center', padding: '13px 20px', fontSize: 15, opacity: isSold ? 0.5 : 1, cursor: isSold ? 'not-allowed' : 'pointer' }}
                    >
                      {buying
                        ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        : isSold ? '已售罄' : isFree
                          ? <><ShoppingCart size={16} />免费获取</>
                          : <><ShoppingCart size={16} />立即支付 ¥{listing.price}</>
                      }
                    </button>
                  )}

                  <Link href="/sourcing" className="claw-btn-ghost" style={{ justifyContent: 'center', padding: '11px 20px', fontSize: 14, textDecoration: 'none' }}>
                    提交定制化需求
                  </Link>

                  {(listing.demo_personas?.length || listing.demo_messages?.length) ? (
                    <button
                      onClick={() => openDemo(listing)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                        padding: '10px 20px',
                        background: 'rgba(230,92,70,0.07)',
                        color: '#E65C46',
                        border: '1px solid rgba(230,92,70,0.25)',
                        borderRadius: 10,
                        fontSize: 13.5, fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseOver={e => { e.currentTarget.style.background = 'rgba(230,92,70,0.13)'; }}
                      onMouseOut={e => { e.currentTarget.style.background = 'rgba(230,92,70,0.07)'; }}
                    >
                      <Play size={14} fill="#E65C46" />
                      查看演示
                    </button>
                  ) : null}
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid rgba(42,31,25,0.08)', margin: '0 0 18px' }} />

                {/* Seller */}
                {listing.user && (
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9e8074', marginBottom: 10 }}>卖家</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: listing.user.avatar_url ? 'transparent' : '#E65C46',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}>
                        {listing.user.avatar_url
                          ? <img src={listing.user.avatar_url} alt={listing.user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <User size={18} style={{ color: '#fff' }} />
                        }
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#2A1F19' }}>{listing.user.name || '匿名卖家'}</div>
                        {listing.user.website_url && (
                          <a href={listing.user.website_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#E65C46', textDecoration: 'none' }}>
                            个人主页 →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <hr style={{ border: 'none', borderTop: '1px solid rgba(42,31,25,0.08)', margin: '0 0 18px' }} />

                {/* Trust badges */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9e8074', marginBottom: 4 }}>保障</div>
                  {[
                    { icon: <CheckCircle2 size={14} />, text: '智能体角色已通过专家调优，随时可部署在生产环境中。' },
                    { icon: <ShieldCheck size={14} />, text: '包含全套工作流文档和隐私合规性检查。' },
                    { icon: <Zap size={14} />, text: '即时交付：获取后立即可下载和部署。' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                      <span style={{ color: '#E65C46', marginTop: 1, flexShrink: 0 }}>{item.icon}</span>
                      <span style={{ fontSize: 12, color: '#6B5549', lineHeight: 1.6 }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        <ClawFooter />
      </div>
    </>
  );
}

const detailStyles = `
  .detail-back {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    font-weight: 600;
    color: #9e8074;
    text-decoration: none;
    margin-bottom: 14px;
    transition: color 0.15s;
  }
  .detail-back:hover { color: #2A1F19; }

  .detail-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 40px;
    align-items: start;
  }

  .detail-version-badge {
    background: #fff;
    border: 1px solid rgba(42,31,25,0.1);
    border-radius: 10px;
    padding: 10px 16px;
    text-align: center;
    flex-shrink: 0;
  }

  .claw-card-badge {
    background: rgba(248, 242, 237, 0.92);
    font-size: 11px;
    font-weight: 700;
    color: #6B5549;
    padding: 3px 10px;
    border-radius: 100px;
    border: 1px solid rgba(42, 31, 25, 0.1);
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(-12px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }

  /* Phone demo modal */
  .detail-demo-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.55);
    z-index: 9998;
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .detail-phone {
    width: 310px;
    background: linear-gradient(160deg, #2a2a2e 0%, #1a1a1e 100%);
    border-radius: 48px;
    padding: 14px;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.12);
    position: relative;
    animation: slideUp 0.35s cubic-bezier(.22,1,.36,1);
  }
  .detail-phone::before {
    content: ''; position: absolute; left: -3px; top: 90px;
    width: 3px; height: 34px; background: #333; border-radius: 3px 0 0 3px;
    box-shadow: 0 44px 0 #333;
  }
  .detail-phone::after {
    content: ''; position: absolute; right: -3px; top: 110px;
    width: 3px; height: 54px; background: #333; border-radius: 0 3px 3px 0;
  }
  @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .detail-phone-inner {
    background: #000; border-radius: 36px; overflow: hidden;
    display: flex; flex-direction: column; height: 580px;
  }
  .detail-phone-statusbar {
    background: #000; padding: 10px 18px 4px;
    display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
  }
  .detail-phone-time { font-size: 13px; font-weight: 700; color: #fff; font-family: -apple-system, sans-serif; letter-spacing: -0.3px; }
  .detail-phone-icons { display: flex; align-items: center; gap: 5px; }
  .detail-signal { display: flex; align-items: flex-end; gap: 1.5px; height: 11px; }
  .detail-signal span { display: block; width: 3px; background: #fff; border-radius: 1px; }
  .detail-signal span:nth-child(1) { height: 3px; }
  .detail-signal span:nth-child(2) { height: 5px; }
  .detail-signal span:nth-child(3) { height: 7px; }
  .detail-signal span:nth-child(4) { height: 11px; }
  .detail-wifi { font-size: 11px; color: #fff; line-height: 1; }
  .detail-battery { display: flex; align-items: center; gap: 1px; }
  .detail-battery-body { width: 22px; height: 11px; border: 1.5px solid rgba(255,255,255,0.7); border-radius: 2.5px; padding: 1.5px; }
  .detail-battery-fill { background: #fff; border-radius: 1px; height: 100%; width: 75%; }
  .detail-battery-tip { width: 2px; height: 5px; background: rgba(255,255,255,0.5); border-radius: 0 1px 1px 0; }
  .detail-phone-island {
    width: 100px; height: 30px; background: #000; border-radius: 20px;
    margin: 0 auto 6px; position: relative; z-index: 2; flex-shrink: 0;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.06);
  }
  .detail-phone-screen {
    background: #F8F2ED; flex: 1; overflow: hidden;
    display: flex; flex-direction: column; border-radius: 0 0 34px 34px;
  }
  .detail-phone-topbar {
    background: #fff; padding: 10px 14px;
    border-bottom: 1px solid rgba(42,31,25,0.08);
    display: flex; align-items: center; gap: 10px;
  }
  .detail-phone-avatar { width: 36px; height: 36px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: #F0E8E1; box-shadow: 0 2px 8px rgba(230,92,70,0.2); }
  .detail-phone-name { font-size: 13px; font-weight: 700; color: #2A1F19; font-family: 'Manrope', sans-serif; }
  .detail-phone-status { font-size: 11px; color: #22c55e; font-family: 'Manrope', sans-serif; display: flex; align-items: center; gap: 3px; }
  .detail-phone-status::before { content: ''; width: 6px; height: 6px; background: #22c55e; border-radius: 50%; display: inline-block; }
  .detail-phone-msgs { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 10px; overflow-y: auto; scroll-behavior: smooth; }
  .detail-msg {
    max-width: 80%; padding: 10px 14px; border-radius: 18px;
    font-size: 13px; line-height: 1.5; font-family: 'Manrope', sans-serif;
    opacity: 0; transform: translateY(8px);
    transition: opacity 0.4s ease, transform 0.4s ease;
  }
  .detail-msg.visible { opacity: 1; transform: translateY(0); }
  .detail-msg.ai { background: #fff; color: #2A1F19; border-bottom-left-radius: 4px; align-self: flex-start; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
  .detail-msg.user { background: #E65C46; color: #fff; border-bottom-right-radius: 4px; align-self: flex-end; }
  .detail-typing {
    display: flex; gap: 4px; align-items: center; padding: 10px 14px;
    background: #fff; border-radius: 18px; border-bottom-left-radius: 4px;
    width: fit-content; box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    opacity: 0; transition: opacity 0.3s;
  }
  .detail-typing.visible { opacity: 1; }
  .detail-typing span { width: 6px; height: 6px; background: #9e8074; border-radius: 50%; animation: bounce 1.2s infinite; }
  .detail-typing span:nth-child(2) { animation-delay: 0.2s; }
  .detail-typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-5px); } }
  .detail-demo-close {
    position: absolute; top: -16px; right: -16px;
    width: 36px; height: 36px; border-radius: 50%;
    background: #fff; border: none; cursor: pointer; font-size: 18px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2); color: #2A1F19;
  }

  @media (max-width: 800px) {
    .detail-layout { grid-template-columns: 1fr; gap: 28px; }
    .detail-sidebar { order: -1; }
    .detail-version-badge { display: none; }
  }
  @media (max-width: 480px) {
    .detail-back { margin-bottom: 16px; }
  }
`;
