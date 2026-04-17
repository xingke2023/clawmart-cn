'use client';

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { listingsApi, Listing, ListingParams, DemoMessage, DemoPersona } from "@/lib/api";
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
type OnboardingStep = 'industry' | 'name' | 'functions' | 'hasAccount' | 'register' | 'login' | 'manage' | 'newListing' | 'viewListings';
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
  const [myListings, setMyListings]         = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [nlName, setNlName]                 = useState('');
  const [nlCategory, setNlCategory]         = useState('营销');
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

  // fetch listings when entering viewListings
  useEffect(() => {
    if (step === 'viewListings' && token) {
      setListingsLoading(true);
      listingsApi.getMyListings(token)
        .then(res => setMyListings(res?.data || []))
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

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !waitingUser) return;
    const name = nameInput.trim();
    setWaitingUser(false);
    setNameInput('');
    setMsgs(prev => [...prev, { from: 'user', text: name }]);
    setBizState(s => ({ ...s, name }));
    setStep('functions');
    pushAI(`「${name}」——好名字！✨\n\n您最希望 AI 店铺帮您实现哪些功能？（可多选）`);
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
      await listingsApi.createListing({
        name: nlName.trim(), category: nlCategory,
        price: parseFloat(nlPrice) || 0,
        description: nlDesc.trim() || undefined,
        status: 'available',
      }, token);
      const created = nlName.trim();
      setNlName(''); setNlCategory('营销'); setNlPrice('0'); setNlDesc('');
      setMsgs(prev => [...prev, { from: 'user', text: `上架：${created}` }]);
      setStep('manage');
      pushAI(`✅ 「${created}」已成功上架！\n\n还想做什么？`);
    } catch { setNlError('上架失败，请重试'); }
    finally { setNlSubmitting(false); }
  };

  const handleDeleteListing = async (listing: Listing) => {
    if (!token) return;
    try {
      await listingsApi.deleteListing(listing.id, token);
      setMyListings(prev => prev.filter(l => l.id !== listing.id));
      setMsgs(prev => [...prev, { from: 'ai', text: `🗑️ 已删除「${listing.name}」` }]);
      scrollBottom();
    } catch {}
  };

  const backToManage = () => { setStep('manage'); pushAI("好的，还有什么可以帮您？"); };

  // ── universal text input handler ───────────────────────────────────────────
  const handleChatInput = (e: React.FormEvent) => {
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
      pushAI("✅ 已收到您的语音消息，正在处理…", 800);
      return;
    }

    // if image
    if (img) {
      setMsgs(prev => [...prev, { from: 'user', text, image: img }]);
      pushAI("✅ 已收到您发送的图片，我来查看一下…", 800);
      return;
    }

    // if file (pdf/excel etc.)
    if (fil) {
      const icon = fileTypeIcon(fil.type);
      const sizeStr = fil.size > 1024 * 1024 ? `${(fil.size / 1024 / 1024).toFixed(1)}MB` : `${(fil.size / 1024).toFixed(0)}KB`;
      setMsgs(prev => [...prev, { from: 'user', text: `${icon} ${fil.name}（${sizeStr}）` }]);
      pushAI(`✅ 已收到文件「${fil.name}」，我来查看一下…`, 800);
      return;
    }

    const t = text;
    const tl = t.toLowerCase();

    if (step === 'industry') {
      // Try to match an industry option
      const match = INDUSTRY_OPTIONS.find(o =>
        o.label.includes(t) || o.value.includes(t) ||
        tl.includes(o.value.toLowerCase()) || tl.includes(o.label.toLowerCase())
      );
      if (match) { handleIndustry(match.value, match.label); return; }
      // Accept free text as the industry name
      if (!waitingUser) return;
      setWaitingUser(false);
      setMsgs(prev => [...prev, { from: 'user', text: t }]);
      setBizState(s => ({ ...s, industry: t }));
      setStep('name');
      pushAI(`好的，${t} 行业！您的店铺名称是什么？`);

    } else if (step === 'functions') {
      // treat typed text as a request, confirm and move on
      if (!waitingUser) return;
      setWaitingUser(false);
      setMsgs(prev => [...prev, { from: 'user', text: t }]);
      setBizState(s => ({ ...s, functions: [t] }));
      setStep('hasAccount');
      pushAI(`明白！功能需求已记录：${t}\n\n您已经有 ClawMart 账号了吗？`);

    } else if (step === 'hasAccount') {
      if (!waitingUser) return;
      const hasAcc = /有|登录|已有|有账号/.test(tl);
      handleHasAccount(hasAcc ? 'has' : 'no', t);

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
        pushAI(`您好！我理解您的意思 😊\n\n我目前可以帮您：\n📦 上架新商品\n📋 查看我的商品\n📊 经营报表\n💡 使用说明\n\n请问您想做哪个？`);
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
      "📋 管理商品\n点「我的商品」可以查看所有已上架的商品，随时删除不需要的。\n\n今后还会支持直接在这里编辑商品内容。",
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
      const res = await listingsApi.getMyListings(token);
      const all = res?.data || [];
      const active = all.filter(l => l.status === 'available').length;
      const draft  = all.filter(l => l.status === 'draft').length;
      const free   = all.filter(l => parseFloat(l.price) === 0).length;
      const paid   = all.length - free;
      const cats: Record<string, number> = {};
      all.forEach(l => { cats[l.category] = (cats[l.category] || 0) + 1; });
      const catLines = Object.entries(cats).map(([k, v]) => `  · ${k}：${v} 个`).join('\n') || '  · 暂无分类数据';
      const report = [
        `📊 您的店铺经营报表`,
        `商品总数：${all.length} 个\n✅ 上架中：${active} 个\n📝 草稿：${draft} 个`,
        `💰 付费商品：${paid} 个\n🆓 免费商品：${free} 个`,
        `按分类分布：\n${catLines}`,
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {!user?.is_seller ? (
                <>
                  <p style={{ margin: '0 0 4px', fontSize: 13, color: '#9e8074', fontFamily: "'Manrope', sans-serif" }}>
                    需要先激活卖家权限才能上架商品 👇
                  </p>
                  <button onClick={handleBecomeSeller} disabled={sellerLoading} style={btnPrimary(sellerLoading)}>
                    {sellerLoading ? '激活中…' : '🔓 激活卖家权限（免费）'}
                  </button>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handleReport}
                      style={{ ...optBtn({ flex: 1 }) }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#E65C46'; e.currentTarget.style.background = 'rgba(230,92,70,0.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,31,25,0.15)'; e.currentTarget.style.background = '#F8F2ED'; }}
                    >📊 经营报表</button>
                    <button onClick={handleHelp}
                      style={{ ...optBtn({ flex: 1 }) }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#E65C46'; e.currentTarget.style.background = 'rgba(230,92,70,0.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,31,25,0.15)'; e.currentTarget.style.background = '#F8F2ED'; }}
                    >💡 使用说明</button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setMsgs(prev => [...prev, { from: 'user', text: '📦 上架新商品' }]); setStep('newListing'); setTyping(true); setTimeout(() => { setTyping(false); setMsgs(prev => [...prev, { from: 'ai', text: '好的！请填写商品信息 👇' }]); setWaitingUser(true); scrollBottom(); }, 400); }}
                      style={{ ...optBtn({ flex: 1 }) }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#E65C46'; e.currentTarget.style.background = 'rgba(230,92,70,0.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,31,25,0.15)'; e.currentTarget.style.background = '#F8F2ED'; }}
                    >📦 上架新商品</button>
                    <button onClick={() => { setMsgs(prev => [...prev, { from: 'user', text: '📋 我的商品' }]); setStep('viewListings'); setTyping(true); setTimeout(() => { setTyping(false); setMsgs(prev => [...prev, { from: 'ai', text: '正在加载您的商品列表…' }]); scrollBottom(); }, 300); }}
                      style={{ ...optBtn({ flex: 1 }) }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#E65C46'; e.currentTarget.style.background = 'rgba(230,92,70,0.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,31,25,0.15)'; e.currentTarget.style.background = '#F8F2ED'; }}
                    >📋 我的商品</button>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handleReport}
                      style={{ ...optBtn({ flex: 1 }) }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#E65C46'; e.currentTarget.style.background = 'rgba(230,92,70,0.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,31,25,0.15)'; e.currentTarget.style.background = '#F8F2ED'; }}
                    >📊 经营报表</button>
                    <button onClick={handleHelp}
                      style={{ ...optBtn({ flex: 1 }) }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#E65C46'; e.currentTarget.style.background = 'rgba(230,92,70,0.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,31,25,0.15)'; e.currentTarget.style.background = '#F8F2ED'; }}
                    >💡 使用说明</button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── new listing form ──────────────────────────────────────────── */}
          {waitingUser && !typing && step === 'newListing' && (
            <form onSubmit={handleCreateListing} style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <input autoFocus value={nlName} onChange={e => setNlName(e.target.value)} placeholder="商品名称" style={inputStyle} required />
              <div style={{ display: 'flex', gap: 8 }}>
                <select value={nlCategory} onChange={e => setNlCategory(e.target.value)} style={{ ...inputStyle, flex: 1, cursor: 'pointer' }}>
                  {LISTING_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="number" value={nlPrice} onChange={e => setNlPrice(e.target.value)} placeholder="价格" min="0" step="0.01"
                  style={{ ...inputStyle, width: 90, flexShrink: 0 }} />
              </div>
              <textarea value={nlDesc} onChange={e => setNlDesc(e.target.value)} placeholder="商品描述（可选）"
                rows={2} style={{ ...inputStyle, resize: 'none' as const }} />
              {nlError && <p style={{ margin: 0, fontSize: 12, color: '#D32F2F', fontFamily: "'Manrope', sans-serif" }}>{nlError}</p>}
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={backToManage} style={{ ...optBtn({ width: 'auto', padding: '10px 14px', flexShrink: 0 }) }}>← 返回</button>
                <button type="submit" disabled={nlSubmitting || !nlName.trim()} style={{ ...btnPrimary(nlSubmitting || !nlName.trim()), flex: 1 }}>
                  {nlSubmitting ? '上架中…' : '✅ 确认上架'}
                </button>
              </div>
            </form>
          )}

          {/* ── view listings ─────────────────────────────────────────────── */}
          {waitingUser && !typing && step === 'viewListings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 260, overflowY: 'auto' }}>
              {listingsLoading ? (
                <p style={{ margin: 0, fontSize: 14, color: '#9e8074', fontFamily: "'Manrope', sans-serif", textAlign: 'center', padding: '12px 0' }}>加载中…</p>
              ) : myListings.length === 0 ? (
                <p style={{ margin: 0, fontSize: 14, color: '#9e8074', fontFamily: "'Manrope', sans-serif", textAlign: 'center', padding: '12px 0' }}>暂无商品，去上架第一个吧！</p>
              ) : myListings.map(l => (
                <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#F8F2ED', borderRadius: 10, border: '1px solid rgba(42,31,25,0.1)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#2A1F19', fontFamily: "'Manrope', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.name}</div>
                    <div style={{ fontSize: 12, color: '#9e8074', fontFamily: "'Manrope', sans-serif', marginTop: 2" }}>
                      {l.category} · {parseFloat(l.price) === 0 ? '免费' : `¥${l.price}`} · {l.status === 'available' ? '上架中' : l.status}
                    </div>
                  </div>
                  <button onClick={() => handleDeleteListing(l)} style={{ flexShrink: 0, background: 'none', border: '1px solid rgba(230,92,70,0.35)', color: '#E65C46', borderRadius: 7, padding: '4px 10px', fontSize: 12, cursor: 'pointer', fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>删除</button>
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
            让你的店铺马上拥有AI能力
          </h1>
          <p className="claw-hero-subtitle" style={{ fontWeight: 300, letterSpacing: '0.05em' }}>
            客户端：AI智能客服，预定，下单，排号留座<br />
            门店端：AI记账、经营预测、报表分析、AI营销文案海报视频
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
                <h2 className="claw-section-title">AI店铺展示</h2>
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
