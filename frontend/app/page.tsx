'use client';

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { listingsApi, Listing, ListingParams, DemoMessage, DemoPersona } from "@/lib/api";
import { Star, Download, Loader2 } from "lucide-react";
import { ClawNav, ClawFooter } from "@/components/claw-layout";

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
    // popular: fresh-market is pinned first, then by pseudo click count
    if (a.slug === 'fresh-market-ai-manager') return -1;
    if (b.slug === 'fresh-market-ai-manager') return 1;
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
          font-size: 48px;
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
          font-size: 16px;
          color: #6B5549;
          line-height: 1.65;
          margin: 0 0 28px;
          max-width: 620px;
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
          .claw-hero-title { font-size: 32px; }
          .claw-hero-subtitle { font-size: 15px; }
          .claw-section { padding: 28px 16px; }
          .claw-ind-banner { padding: 24px 16px; }
          .claw-ind-banner-title { font-size: 20px; }
        }
        @media (max-width: 480px) {
          .claw-grid { grid-template-columns: 1fr; gap: 12px; }
          .claw-hero-title { font-size: 28px; }
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
          <h1 className="claw-hero-title" style={{ fontSize: '3rem', fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            我们的目标：让龙虾更可控，让文盲也会用
          </h1>
          <p className="claw-hero-subtitle" style={{ fontSize: '1.4rem', fontWeight: 600 }}>
            小龙虾行业解决方案提供商，用AI为传统行业赋能
          </p>
        </div>

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
                <h2 className="claw-section-title">案例展示</h2>
                {sort === 'popular' && (
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#E65C46', background: 'rgba(230,92,70,0.08)', border: '1px solid rgba(230,92,70,0.2)', borderRadius: 100, padding: '2px 10px' }}>
                    🔥 最热门
                  </span>
                )}
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
        <section style={{ padding: '56px 24px', background: 'rgba(240, 232, 225, 0.5)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 32, fontFamily: "'Bricolage Grotesque', sans-serif", color: '#2A1F19' }}>运行 AI 的三种方式。<span style={{ fontWeight: 400, fontSize: '1.2rem', color: '#6B5549', marginLeft: 12 }}>只有一种你真正想要。</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
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
                  title: "方案三", name: "clawmart龙虾服务", highlight: true,
                  pros: ["直接微信扫码绑定就可以开始使用", "可以自行灵活配置龙虾可以使用的技能", "我们负责搭建、托管和维护", "我们帮您升级到最新版本", "第一天就是生产级别", "为你的精确工作流定制搭建"],
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
            <p style={{ textAlign: 'center', color: '#6B5549', marginTop: 32, fontSize: 14, maxWidth: 672, margin: '32px auto 0' }}>
              其他服务商给你一台服务器，然后祝你好运。我们给你一个能工作的 AI 员工和一支让它保持锋利的团队。工具和队友的区别，在于是否有人在主动让它更好。那就是我们。
            </p>
          </div>
        </section>

        <ClawFooter />
      </div>
    </>
  );
}
