'use client';

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { listingsApi, Listing, ListingFormData, Purchase, storeApi, StoreProfile, StoreNote, StoreProduct, StoreBooking, StoreNoteFormData, StoreProductFormData, NoteType, StoreType, BookingStatus } from "@/lib/api";
import { ClawNav, ClawFooter, clawStyles } from "@/components/claw-layout";
import {
  LayoutDashboard, ShoppingBag, Settings, Store,
  User, Globe, FileText, Camera, CheckCircle2, Loader2, ArrowRight,
  Plus, Pencil, Trash2, X, Tag, DollarSign, ImageIcon, Eye, EyeOff,
  Package, Store as StoreIcon, Bell, Box, Calendar, ChevronDown, ChevronUp,
  Upload, Star
} from "lucide-react";
import { StorePhoto, StoreProductPhoto } from "@/lib/api/types";

type Tab = 'overview' | 'purchases' | 'settings' | 'sell' | 'my-listings' | 'my-store';

const CATEGORIES = ['AI 角色', '营销', '工程', '设计', '其他'];
const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 700, color: '#2A1F19', margin: '0 0 20px' }}>
    {children}
  </h2>
);

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const { user, token, isAuthenticated, loading, updateProfile, becomeSeller } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as Tab | null;
  const [tab, setTab] = useState<Tab>(tabParam || 'overview');

  // Settings
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Seller onboarding
  const [becomingSellerLoading, setBecomingSellerLoading] = useState(false);
  const [sellerDone, setSellerDone] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login');
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatarUrl(user.avatar_url || '');
      setWebsiteUrl(user.website_url || '');
      setBio(user.bio || '');
    }
  }, [user]);

  useEffect(() => {
    if (tabParam) setTab(tabParam);
  }, [tabParam]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    try {
      await updateProfile({ name, avatar_url: avatarUrl || null, website_url: websiteUrl || null, bio: bio || null });
      setSaveMsg('保存成功！');
    } catch {
      setSaveMsg('保存失败，请重试。');
    } finally {
      setSaving(false);
    }
  };

  const handleBecomeSeller = async () => {
    setBecomingSellerLoading(true);
    try {
      await becomeSeller();
      setSellerDone(true);
    } catch {
      // ignore
    } finally {
      setBecomingSellerLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <>
        <style>{clawStyles + dashStyles}</style>
        <div className="claw-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <Loader2 size={28} style={{ color: '#E65C46', animation: 'spin 1s linear infinite' }} />
        </div>
      </>
    );
  }

  const isSeller = user.is_seller || sellerDone;

  const TABS: { key: Tab; label: string; icon: React.ReactNode; sellerOnly?: boolean }[] = [
    { key: 'overview' as Tab, label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { key: 'purchases' as Tab, label: '我的购买', icon: <ShoppingBag size={16} /> },
    { key: 'my-listings' as Tab, label: '我的销售', icon: <Package size={16} />, sellerOnly: true },
    { key: 'my-store' as Tab, label: '我的店铺', icon: <StoreIcon size={16} />, sellerOnly: true },
    { key: 'settings' as Tab, label: '我的设置', icon: <Settings size={16} /> },
    ...(!isSeller ? [{ key: 'sell' as Tab, label: 'Start Selling', icon: <Store size={16} /> }] : []),
  ].filter(t => !t.sellerOnly || isSeller);

  return (
    <>
      <style>{clawStyles + dashStyles}</style>
      <div className="claw-page">
        <ClawNav />
        <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 80px' }}>
          <div style={{ marginBottom: 32 }}>
            <div className="claw-label">用户中心</div>
            <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 32, fontWeight: 800, color: '#2A1F19', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              你好，{user.name.split(' ')[0]} 👋
            </h1>
            <p style={{ fontSize: 14, color: '#9e8074', margin: 0 }}>{user.email}</p>
          </div>

          <div className="dash-layout">
            <aside className="dash-sidebar">
              <div className="claw-card" style={{ padding: 8 }}>
                {TABS.map(t => (
                  <button
                    key={t.key}
                    className={`dash-tab-btn${tab === t.key ? ' active' : ''}${t.key === 'sell' ? ' sell' : ''}`}
                    onClick={() => setTab(t.key)}
                  >
                    {t.icon}
                    {t.label}
                  </button>
                ))}
              </div>
            </aside>

            <div className="dash-content">
              {tab === 'overview' && <OverviewTab user={user} isSeller={isSeller} setTab={setTab} token={token!} />}
              {tab === 'purchases' && <PurchasesTab token={token!} />}
              {tab === 'my-listings' && isSeller && <MyListingsTab token={token!} />}
              {tab === 'my-store' && isSeller && <MyStoreTab token={token!} />}
              {tab === 'settings' && (
                <SettingsTab
                  name={name} setName={setName}
                  avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl}
                  websiteUrl={websiteUrl} setWebsiteUrl={setWebsiteUrl}
                  bio={bio} setBio={setBio}
                  saving={saving} saveMsg={saveMsg}
                  onSave={handleSaveProfile}
                  user={user}
                />
              )}
              {tab === 'sell' && (
                <SellTab
                  isSeller={isSeller}
                  loading={becomingSellerLoading}
                  done={sellerDone}
                  onBecome={handleBecomeSeller}
                  onDone={() => setTab('my-listings')}
                />
              )}
            </div>
          </div>
        </main>
        <ClawFooter />
      </div>
    </>
  );
}

// ---- Overview ----
function OverviewTab({ user, isSeller, setTab, token }: { user: any; isSeller: boolean; setTab: (t: Tab) => void; token: string }) {
  const [listingCount, setListingCount] = useState<number | null>(null);
  const [purchaseCount, setPurchaseCount] = useState<number | null>(null);

  useEffect(() => {
    listingsApi.getPurchases(token).then(r => setPurchaseCount(r.total)).catch(() => {});
    if (isSeller) {
      listingsApi.getMyListings(token).then(r => setListingCount(r.total)).catch(() => {});
    }
  }, [isSeller, token]);

  const stats = [
    { label: '已购买', value: purchaseCount === null ? '…' : String(purchaseCount), icon: <ShoppingBag size={18} style={{ color: '#E65C46' }} /> },
    ...(isSeller ? [{ label: '上架技能', value: listingCount === null ? '…' : String(listingCount), icon: <Package size={18} style={{ color: '#E65C46' }} /> }] : []),
    { label: '账户状态', value: isSeller ? 'Seller ✦' : '普通用户', icon: <User size={18} style={{ color: '#E65C46' }} /> },
    { label: '加入时间', value: new Date(user.created_at).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' }), icon: <CheckCircle2 size={18} style={{ color: '#E65C46' }} /> },
  ];

  return (
    <div>
      <H2>概览</H2>
      <div className="dash-stats-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${isSeller ? 4 : 3}, 1fr)`, gap: 16, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div key={i} className="claw-card" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 20 }}>
            {s.icon}
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", color: '#2A1F19' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#9e8074', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button className="claw-btn-primary" onClick={() => setTab('purchases')}>
          <ShoppingBag size={15} /> 我的购买
        </button>
        {isSeller && (
          <button className="claw-btn-primary" onClick={() => setTab('my-listings')} style={{ background: '#2A1F19' }}>
            <Package size={15} /> 我的销售
          </button>
        )}
        <button className="claw-btn-ghost" onClick={() => setTab('settings')}>
          <Settings size={15} /> 编辑资料
        </button>
        {!isSeller && (
          <button className="claw-btn-ghost" onClick={() => setTab('sell')} style={{ color: '#E65C46', borderColor: 'rgba(230,92,70,0.3)' }}>
            <Store size={15} /> Start Selling
          </button>
        )}
      </div>
    </div>
  );
}

// ---- Purchases ----
function PurchasesTab({ token }: { token: string }) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listingsApi.getPurchases(token)
      .then(r => setPurchases(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div>
      <H2>我的购买</H2>
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...Array(3)].map((_, i) => <div key={i} className="claw-skeleton" style={{ height: 72, borderRadius: 12 }} />)}
        </div>
      ) : purchases.length === 0 ? (
        <div className="claw-card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🛍️</div>
          <p style={{ fontSize: 15, color: '#6B5549', margin: '0 0 20px' }}>还没有购买记录。</p>
          <Link href="/" className="claw-btn-primary">浏览技能市场 <ArrowRight size={15} /></Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {purchases.map(p => (
            <Link key={p.id} href={`/install/${p.listing.slug}`} style={{ textDecoration: 'none' }}>
              <div className="claw-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, transition: 'box-shadow 0.15s', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(42,31,25,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '')}>
                <div style={{ fontSize: 28, flexShrink: 0 }}>🤖</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 15, color: '#2A1F19', marginBottom: 3 }}>
                    {p.listing.name}
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#9e8074' }}>{p.listing.category}</span>
                    <span style={{ fontSize: 12, color: '#9e8074' }}>
                      获取于 {new Date(p.created_at).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#4a9e6b', background: 'rgba(74,158,107,0.1)', padding: '3px 10px', borderRadius: 100 }}>
                    {parseFloat(p.price_paid) === 0 ? '免费获取' : `¥${p.price_paid}`}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- My Listings ----
function MyListingsTab({ token }: { token: string }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Listing | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listingsApi.getMyListings(token);
      setListings(res.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  const handleDelete = async (id: number) => {
    setDeleting(true);
    try {
      await listingsApi.deleteListing(id, token);
      setDeleteId(null);
      fetchListings();
    } catch {
      // ignore
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <H2>我的销售</H2>
        <button className="claw-btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus size={15} /> 上架新技能
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="claw-skeleton" style={{ height: 72, borderRadius: 12 }} />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="claw-card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📦</div>
          <p style={{ fontSize: 15, color: '#6B5549', margin: '0 0 20px' }}>还没有上架任何技能。</p>
          <button className="claw-btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>
            <Plus size={15} /> 上架第一个技能
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {listings.map(listing => (
            <div key={listing.id} className="claw-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>🤖</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 15, color: '#2A1F19', marginBottom: 2 }}>
                  {listing.name}
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: '#9e8074' }}>{listing.category}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: parseFloat(listing.price) === 0 ? '#4a9e6b' : '#2A1F19' }}>
                    {parseFloat(listing.price) === 0 ? '免费' : `¥${listing.price}`}
                  </span>
                  <span className={`listing-status-badge ${listing.status}`}>
                    {listing.status === 'available' ? '上架中' : listing.status === 'draft' ? '草稿' : '已售罄'}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <Link href={`/listings/${listing.slug}`} target="_blank" className="dash-icon-btn" title="预览">
                  <Eye size={15} />
                </Link>
                <button className="dash-icon-btn" title="编辑" onClick={() => { setEditing(listing); setShowForm(true); }}>
                  <Pencil size={15} />
                </button>
                <button className="dash-icon-btn danger" title="删除" onClick={() => setDeleteId(listing.id)}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      {deleteId !== null && (
        <div className="dash-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="dash-modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 700, margin: '0 0 12px', color: '#2A1F19' }}>确认删除</h3>
            <p style={{ fontSize: 14, color: '#6B5549', margin: '0 0 24px' }}>删除后无法恢复，确定要删除这个技能吗？</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="claw-btn-ghost" onClick={() => setDeleteId(null)}>取消</button>
              <button
                className="claw-btn-primary"
                style={{ background: '#bf3f30' }}
                disabled={deleting}
                onClick={() => handleDelete(deleteId)}
              >
                {deleting ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={14} />}
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit form modal */}
      {showForm && (
        <ListingFormModal
          token={token}
          editing={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={() => { setShowForm(false); setEditing(null); fetchListings(); }}
        />
      )}
    </div>
  );
}

// ---- Listing Form Modal ----
function ListingFormModal({ token, editing, onClose, onSaved }: {
  token: string;
  editing: Listing | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(editing?.name || '');
  const [price, setPrice] = useState(editing ? String(parseFloat(editing.price)) : '');
  const [description, setDescription] = useState(editing?.description || '');
  const [imageUrl, setImageUrl] = useState(editing?.image_url || '');
  const [category, setCategory] = useState(editing?.category || CATEGORIES[0]);
  const [status, setStatus] = useState<'available' | 'draft' | 'sold'>(
    (editing?.status as any) || 'available'
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const data: ListingFormData = {
      name,
      price: parseFloat(price) || 0,
      description: description || undefined,
      image_url: imageUrl || undefined,
      category,
      status,
    };
    try {
      if (editing) {
        await listingsApi.updateListing(editing.id, data, token);
      } else {
        await listingsApi.createListing(data, token);
      }
      onSaved();
    } catch (err: any) {
      setError(err.message || '保存失败，请重试。');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dash-modal-overlay" onClick={onClose}>
      <div className="dash-modal dash-modal-lg" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 700, margin: 0, color: '#2A1F19' }}>
            {editing ? '编辑技能' : '上架新技能'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9e8074', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label className="claw-form-label"><Package size={13} style={{ display: 'inline', marginRight: 5 }} />技能名称 *</label>
            <input className="claw-input" value={name} onChange={e => setName(e.target.value)} placeholder="例：营销文案专家 v2" required />
          </div>

          <div className="dash-form-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="claw-form-label"><DollarSign size={13} style={{ display: 'inline', marginRight: 5 }} />价格（¥）*</label>
              <input className="claw-input" type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="0 = 免费" required />
            </div>
            <div>
              <label className="claw-form-label"><Tag size={13} style={{ display: 'inline', marginRight: 5 }} />分类 *</label>
              <select className="claw-input" value={category} onChange={e => setCategory(e.target.value)} style={{ cursor: 'pointer' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="claw-form-label"><FileText size={13} style={{ display: 'inline', marginRight: 5 }} />功能描述</label>
            <textarea className="claw-textarea" rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="详细介绍这个技能的功能和使用场景..." />
          </div>

          <div>
            <label className="claw-form-label"><ImageIcon size={13} style={{ display: 'inline', marginRight: 5 }} />封面图 URL</label>
            <input className="claw-input" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/cover.jpg" />
          </div>

          <div>
            <label className="claw-form-label">发布状态</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {([['available', '上架中', <Eye size={13} />], ['draft', '草稿', <EyeOff size={13} />]] as const).map(([val, label, icon]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setStatus(val)}
                  className={`claw-chip${status === val ? ' active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  {icon}{label}
                </button>
              ))}
            </div>
          </div>

          {error && <div style={{ fontSize: 13, color: '#bf3f30', fontWeight: 600 }}>{error}</div>}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
            <button type="button" className="claw-btn-ghost" onClick={onClose}>取消</button>
            <button type="submit" className="claw-btn-primary" disabled={saving}>
              {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : null}
              {editing ? '保存更改' : '立即上架'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---- Settings ----
function SettingsTab({ name, setName, avatarUrl, setAvatarUrl, websiteUrl, setWebsiteUrl, bio, setBio, saving, saveMsg, onSave, user }: any) {
  return (
    <div>
      <H2>我的设置</H2>
      <div className="claw-card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid rgba(42,31,25,0.08)' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: avatarUrl ? 'transparent' : '#E65C46', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(42,31,25,0.1)' }}>
            {avatarUrl
              ? <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ color: 'white', fontSize: 24, fontWeight: 700 }}>{user.name[0]?.toUpperCase()}</span>
            }
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#2A1F19' }}>{name || user.name}</div>
            <div style={{ fontSize: 13, color: '#9e8074' }}>{user.email}</div>
          </div>
        </div>
        <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label className="claw-form-label"><User size={13} style={{ display: 'inline', marginRight: 5 }} />昵称</label>
            <input className="claw-input" value={name} onChange={e => setName(e.target.value)} placeholder="你的名字" />
          </div>
          <div>
            <label className="claw-form-label"><Camera size={13} style={{ display: 'inline', marginRight: 5 }} />头像 URL</label>
            <input className="claw-input" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://example.com/avatar.jpg" />
          </div>
          <div>
            <label className="claw-form-label"><Globe size={13} style={{ display: 'inline', marginRight: 5 }} />Website URL</label>
            <input className="claw-input" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} placeholder="https://yoursite.com" />
          </div>
          <div>
            <label className="claw-form-label"><FileText size={13} style={{ display: 'inline', marginRight: 5 }} />Bio</label>
            <textarea className="claw-textarea" rows={4} value={bio} onChange={e => setBio(e.target.value)} placeholder="介绍一下自己..." />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button type="submit" className="claw-btn-primary" disabled={saving}>
              {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : null}
              保存更改
            </button>
            {saveMsg && <span style={{ fontSize: 13, color: saveMsg.includes('成功') ? '#4a9e6b' : '#bf3f30', fontWeight: 600 }}>{saveMsg}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}

// ---- Sell / Onboarding ----
function SellTab({ isSeller, loading, done, onBecome, onDone }: { isSeller: boolean; loading: boolean; done: boolean; onBecome: () => void; onDone: () => void }) {
  if (isSeller || done) {
    return (
      <div>
        <H2>Seller 状态</H2>
        <div className="claw-card" style={{ padding: 40, textAlign: 'center' }}>
          <CheckCircle2 size={40} style={{ color: '#4a9e6b', margin: '0 auto 16px' }} />
          <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 700, color: '#2A1F19', margin: '0 0 8px' }}>你已经是 Seller 了！</h3>
          <p style={{ fontSize: 14, color: '#6B5549', margin: '0 0 24px' }}>你现在可以在 CLAW MART 上架和销售 AI 技能。</p>
          <button className="claw-btn-primary" onClick={onDone}><Package size={15} /> 管理我的技能</button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <H2>Start Selling on Claw Mart</H2>
      <div className="claw-card" style={{ padding: 32, marginBottom: 20 }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>🚀</div>
        <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 700, color: '#2A1F19', margin: '0 0 12px' }}>成为创作者，销售你的 AI 技能</h3>
        <p style={{ fontSize: 14, color: '#6B5549', lineHeight: 1.7, margin: '0 0 24px' }}>将你的 AI 智能体、Prompt 包和工作流上架到全球最大的 AI 技能市场，触达数千名专业用户。</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          {['上架无限制 AI 技能和角色', '直接收款，平台费用透明', '获得专属创作者徽章和曝光位', '访问详细的销售数据和分析'].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle2 size={15} style={{ color: '#4a9e6b', flexShrink: 0 }} />
              <span style={{ fontSize: 14, color: '#2A1F19' }}>{item}</span>
            </div>
          ))}
        </div>
        <button className="claw-btn-primary" onClick={onBecome} disabled={loading} style={{ fontSize: 15, padding: '12px 28px' }}>
          {loading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Store size={15} />}
          立即成为 Seller
        </button>
      </div>
      <div className="claw-highlight-box">
        <span style={{ fontSize: 13, color: '#6B5549' }}>有问题？查看我们的 <a href="#" style={{ color: '#E65C46', fontWeight: 600, textDecoration: 'none' }}>创作者指南</a> 或联系支持团队。</span>
      </div>
    </div>
  );
}

const NOTE_TYPES: { value: NoteType; label: string; emoji: string; color: string }[] = [
  { value: 'discount',     label: '打折',  emoji: '🏷️', color: '#E65C46' },
  { value: 'announcement', label: '公告',  emoji: '📢', color: '#3b82f6' },
  { value: 'inventory',    label: '库存',  emoji: '📦', color: '#8b5cf6' },
  { value: 'event',        label: '活动',  emoji: '🎉', color: '#f59e0b' },
  { value: 'other',        label: '其他',  emoji: '📝', color: '#6B5549' },
];

function getNoteStyle(type: NoteType) {
  return NOTE_TYPES.find(t => t.value === type) || NOTE_TYPES[4];
}

// ---- My Store Tab ----
function MyStoreTab({ token }: { token: string }) {
  const [store, setStore] = useState<StoreProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'info' | 'notes' | 'products' | 'bookings'>('info');

  const fetchStore = useCallback(async () => {
    try {
      const s = await storeApi.getMyStore(token);
      setStore(s);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchStore(); }, [fetchStore]);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {[...Array(3)].map((_, i) => <div key={i} className="claw-skeleton" style={{ height: 72, borderRadius: 12 }} />)}
    </div>
  );

  if (!store) return (
    <div className="claw-card" style={{ padding: 40, textAlign: 'center' }}>
      <p style={{ color: '#6B5549' }}>店铺信息加载失败，请刷新重试。</p>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <H2>我的店铺</H2>
        {store.slug && (
          <a href={`/store/${store.slug}`} target="_blank"
            style={{ fontSize: 13, color: '#E65C46', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Eye size={14} /> 公开页面
          </a>
        )}
      </div>

      {/* Section 切换 */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {([
          { key: 'info', label: '基本信息', icon: <StoreIcon size={14} /> },
          { key: 'notes', label: '零碎信息', icon: <Bell size={14} /> },
          { key: 'products', label: '商品库', icon: <Box size={14} /> },
          { key: 'bookings', label: '预定管理', icon: <Calendar size={14} /> },
        ] as const).map(s => (
          <button key={s.key} onClick={() => setActiveSection(s.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
              borderRadius: 8, border: '1px solid', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              fontFamily: "'Manrope', sans-serif",
              background: activeSection === s.key ? '#E65C46' : 'white',
              color: activeSection === s.key ? 'white' : '#6B5549',
              borderColor: activeSection === s.key ? '#E65C46' : 'rgba(42,31,25,0.12)',
            }}>
            {s.icon}{s.label}
          </button>
        ))}
      </div>

      {activeSection === 'info' && <StoreInfoSection store={store} token={token} onSaved={fetchStore} />}
      {activeSection === 'notes' && <StoreNotesSection store={store} token={token} />}
      {activeSection === 'products' && <StoreProductsSection store={store} token={token} />}
      {activeSection === 'bookings' && <StoreBookingsSection store={store} token={token} />}
    </div>
  );
}

// ── 基本信息 ──
function StoreInfoSection({ store, token, onSaved }: { store: StoreProfile; token: string; onSaved: () => void }) {
  const [shopName, setShopName] = useState(store.shop_name || '');
  const [desc, setDesc] = useState(store.shop_description || '');
  const [logoUrl, setLogoUrl] = useState(store.logo_url || '');
  const [phone, setPhone] = useState(store.contact_phone || '');
  const [email, setEmail] = useState(store.contact_email || '');
  const [address, setAddress] = useState(store.address || '');
  const [hours, setHours] = useState(store.business_hours || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(store.tags || []);
  const [isPublic, setIsPublic] = useState(store.is_public);
  const [storeType, setStoreType] = useState<StoreType>(store.store_type || 'retail');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // 店铺相册
  const [storePhotos, setStorePhotos] = useState<StorePhoto[]>(store.photos || []);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [uploadCategory, setUploadCategory] = useState<'environment' | 'menu' | 'products' | 'video'>('environment');

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) { setTags([...tags, t]); }
    setTagInput('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      await storeApi.updateMyStore({
        shop_name: shopName, shop_description: desc || null, logo_url: logoUrl || null,
        contact_phone: phone || null, contact_email: email || null,
        address: address || null, business_hours: hours || null,
        tags, is_public: isPublic, store_type: storeType,
      }, token);
      setMsg('保存成功！');
      onSaved();
    } catch {
      setMsg('保存失败，请重试。');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    setPhotoError('');
    try {
      const photo = await storeApi.uploadStorePhoto(file, token, uploadCategory);
      setStorePhotos(prev => [...prev, photo]);
    } catch (err: any) {
      setPhotoError(err.message || '上传失败');
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleDeletePhoto = async (id: number) => {
    try {
      await storeApi.deleteStorePhoto(id, token);
      setStorePhotos(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      setPhotoError(err.message || '删除失败');
    }
  };

  return (
    <div className="claw-card" style={{ padding: 28 }}>
      {/* 店铺头部预览 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid rgba(42,31,25,0.08)' }}>
        <div style={{ width: 64, height: 64, borderRadius: 14, background: logoUrl ? 'transparent' : '#E65C46', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(42,31,25,0.1)' }}>
          {logoUrl ? <img src={logoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <StoreIcon size={24} color="white" />}
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#2A1F19', fontFamily: "'Bricolage Grotesque', sans-serif" }}>{shopName || '未命名店铺'}</div>
          <div style={{ fontSize: 12, color: '#9e8074', marginTop: 2 }}>
            {isPublic ? '🟢 公开' : '🔴 隐藏'} · slug: {store.slug || '—'}
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <label className="claw-form-label"><StoreIcon size={13} style={{ display: 'inline', marginRight: 5 }} />店铺名称 *</label>
          <input className="claw-input" value={shopName} onChange={e => setShopName(e.target.value)} placeholder="我的 AI 技能店" required />
        </div>
        <div>
          <label className="claw-form-label"><ImageIcon size={13} style={{ display: 'inline', marginRight: 5 }} />Logo URL</label>
          <input className="claw-input" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://example.com/logo.png" />
        </div>

        {/* 店铺相册 */}
        <div>
          <label className="claw-form-label"><Camera size={13} style={{ display: 'inline', marginRight: 5 }} />店铺相册</label>

          {/* 分类 tab */}
          {(['environment', 'menu', 'products', 'video'] as const).map(cat => {
            const catLabel = { environment: '门店环境', menu: '价目表', products: '商品秀', video: '视频' }[cat];
            const catPhotos = storePhotos.filter(p => p.category === cat);
            return (
              <div key={cat} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(42,31,25,0.07)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#2A1F19' }}>{catLabel} <span style={{ fontSize: 11, color: '#9e8074', fontWeight: 400 }}>（{catPhotos.length}张）</span></span>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 7, border: '1.5px dashed rgba(42,31,25,0.2)', cursor: uploadingPhoto ? 'not-allowed' : 'pointer', fontSize: 12, color: '#6B5549', fontFamily: "'Manrope', sans-serif", background: 'rgba(240,232,225,0.3)' }}>
                    {uploadingPhoto && uploadCategory === cat ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={12} />}
                    上传
                    <input type="file" accept="image/*,video/*" style={{ display: 'none' }} disabled={uploadingPhoto}
                      onChange={e => { setUploadCategory(cat); handlePhotoUpload(e); }} />
                  </label>
                </div>
                {catPhotos.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {catPhotos.map((photo, idx) => {
                      const globalIdx = storePhotos.indexOf(photo);
                      return (
                        <div key={photo.id} draggable
                          onDragStart={e => { e.dataTransfer.setData('photoIdx', String(globalIdx)); }}
                          onDragOver={e => e.preventDefault()}
                          onDrop={e => {
                            e.preventDefault();
                            const fromIdx = parseInt(e.dataTransfer.getData('photoIdx'));
                            if (fromIdx === globalIdx) return;
                            const reordered = [...storePhotos];
                            const [moved] = reordered.splice(fromIdx, 1);
                            reordered.splice(globalIdx, 0, moved);
                            setStorePhotos(reordered);
                            storeApi.reorderStorePhotos(reordered.map(p => p.id), token).catch(() => {});
                          }}
                          style={{ position: 'relative', width: 80, height: 80, cursor: 'grab' }}>
                          <img src={photo.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 9, border: '1.5px solid rgba(42,31,25,0.1)' }} />
                          <button type="button" onClick={() => handleDeletePhoto(photo.id)}
                            style={{ position: 'absolute', top: 3, right: 3, width: 20, height: 20, borderRadius: 4, border: 'none', background: 'rgba(255,255,255,0.9)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <X size={10} style={{ color: '#bf3f30' }} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ fontSize: 11, color: '#9e8074' }}>支持 JPG/PNG/WebP，最大 5MB · 拖拽图片可调整顺序</div>
          {photoError && <div style={{ fontSize: 12, color: '#bf3f30', marginTop: 4 }}>{photoError}</div>}
        </div>

        <div>
          <label className="claw-form-label"><FileText size={13} style={{ display: 'inline', marginRight: 5 }} />店铺介绍</label>
          <textarea className="claw-textarea" rows={3} value={desc} onChange={e => setDesc(e.target.value)} placeholder="介绍你的店铺..." />
        </div>
        <div className="dash-form-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label className="claw-form-label">联系电话</label>
            <input className="claw-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="138xxxx8888" />
          </div>
          <div>
            <label className="claw-form-label">联系邮箱</label>
            <input className="claw-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="store@example.com" />
          </div>
        </div>
        <div>
          <label className="claw-form-label">地址</label>
          <input className="claw-input" value={address} onChange={e => setAddress(e.target.value)} placeholder="北京市朝阳区..." />
        </div>
        <div>
          <label className="claw-form-label"><Calendar size={13} style={{ display: 'inline', marginRight: 5 }} />营业时间</label>
          <input className="claw-input" value={hours} onChange={e => setHours(e.target.value)} placeholder="周一至周五 9:00–18:00" />
        </div>
        <div>
          <label className="claw-form-label"><Tag size={13} style={{ display: 'inline', marginRight: 5 }} />标签</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            {tags.map(t => (
              <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(230,92,70,0.1)', color: '#E65C46', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 100 }}>
                {t}
                <button type="button" onClick={() => setTags(tags.filter(x => x !== t))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E65C46', lineHeight: 1, padding: 0 }}>×</button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="claw-input" value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="输入标签后回车" style={{ flex: 1 }} />
            <button type="button" onClick={addTag} className="claw-btn-ghost" style={{ flexShrink: 0, padding: '0 14px' }}>添加</button>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input type="checkbox" id="is-public" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
          <label htmlFor="is-public" style={{ fontSize: 14, color: '#2A1F19', cursor: 'pointer' }}>公开店铺（允许任何人查看）</label>
        </div>
        <div>
          <label className="claw-form-label"><StoreIcon size={13} style={{ display: 'inline', marginRight: 5 }} />店铺类型</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {([
              { value: 'restaurant', label: '餐厅',   emoji: '🍽️' },
              { value: 'retail',     label: '零售店', emoji: '🛒' },
              { value: 'hotel',      label: '酒店',   emoji: '🏨' },
            ] as const).map(t => (
              <button key={t.value} type="button" onClick={() => setStoreType(t.value)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px',
                  borderRadius: 8, border: '1.5px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  fontFamily: "'Manrope', sans-serif",
                  background: storeType === t.value ? '#2A1F19' : 'white',
                  color: storeType === t.value ? 'white' : '#6B5549',
                  borderColor: storeType === t.value ? '#2A1F19' : 'rgba(42,31,25,0.15)',
                }}>
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="submit" className="claw-btn-primary" disabled={saving}>
            {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : null}
            保存店铺信息
          </button>
          {msg && <span style={{ fontSize: 13, color: msg.includes('成功') ? '#4a9e6b' : '#bf3f30', fontWeight: 600 }}>{msg}</span>}
        </div>
      </form>
    </div>
  );
}

// ── 零碎信息 ──
function StoreNotesSection({ store, token }: { store: StoreProfile; token: string }) {
  const [notes, setNotes] = useState<StoreNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<StoreNote | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const r = await storeApi.getMyNotes(token);
      setNotes(r.data);
    } catch { } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const handleDelete = async (id: number) => {
    try {
      await storeApi.deleteNote(id, token);
      setDeletingId(null);
      fetchNotes();
    } catch { }
  };

  const isExpired = (note: StoreNote) => note.valid_until && new Date(note.valid_until) < new Date();

  return (
    <div>
      {/* 快速录入按钮 */}
      <div style={{ marginBottom: 16 }}>
        <button className="claw-btn-primary" onClick={() => { setEditingNote(null); setShowForm(true); }}>
          <Plus size={15} /> 录入新信息
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...Array(3)].map((_, i) => <div key={i} className="claw-skeleton" style={{ height: 72, borderRadius: 12 }} />)}
        </div>
      ) : notes.length === 0 ? (
        <div className="claw-card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
          <p style={{ fontSize: 14, color: '#6B5549', margin: '0 0 16px' }}>还没有录入任何信息</p>
          <button className="claw-btn-primary" onClick={() => { setEditingNote(null); setShowForm(true); }}>
            <Plus size={14} /> 录入第一条
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {notes.map(note => {
            const nt = getNoteStyle(note.type);
            const expired = isExpired(note);
            return (
              <div key={note.id} className="claw-card" style={{
                padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'flex-start',
                opacity: expired || !note.is_active ? 0.5 : 1,
              }}>
                <div style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{nt.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: `${nt.color}18`, color: nt.color }}>{nt.label}</span>
                    {note.title && <span style={{ fontSize: 14, fontWeight: 600, color: '#2A1F19', fontFamily: "'Bricolage Grotesque', sans-serif" }}>{note.title}</span>}
                    {expired && <span style={{ fontSize: 11, color: '#9e8074', background: 'rgba(42,31,25,0.06)', padding: '2px 8px', borderRadius: 100 }}>已过期</span>}
                    {!note.is_active && <span style={{ fontSize: 11, color: '#9e8074', background: 'rgba(42,31,25,0.06)', padding: '2px 8px', borderRadius: 100 }}>已停用</span>}
                  </div>
                  <p style={{ fontSize: 13, color: '#6B5549', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{note.content}</p>
                  {(note.valid_from || note.valid_until) && (
                    <div style={{ fontSize: 11, color: '#9e8074', marginTop: 6, display: 'flex', gap: 8 }}>
                      {note.valid_from && <span>从 {new Date(note.valid_from).toLocaleDateString('zh-CN')}</span>}
                      {note.valid_until && <span>至 {new Date(note.valid_until).toLocaleDateString('zh-CN')}</span>}
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: '#9e8074', marginTop: 4 }}>
                    {new Date(note.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button className="dash-icon-btn" onClick={() => { setEditingNote(note); setShowForm(true); }}><Pencil size={14} /></button>
                  <button className="dash-icon-btn danger" onClick={() => setDeletingId(note.id)}><Trash2 size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {deletingId !== null && (
        <div className="dash-modal-overlay" onClick={() => setDeletingId(null)}>
          <div className="dash-modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 700, margin: '0 0 12px', color: '#2A1F19' }}>确认删除</h3>
            <p style={{ fontSize: 14, color: '#6B5549', margin: '0 0 24px' }}>删除后无法恢复，确定要删除这条信息吗？</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="claw-btn-ghost" onClick={() => setDeletingId(null)}>取消</button>
              <button className="claw-btn-primary" style={{ background: '#bf3f30' }} onClick={() => handleDelete(deletingId)}>确认删除</button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <NoteFormModal token={token} editing={editingNote}
          onClose={() => { setShowForm(false); setEditingNote(null); }}
          onSaved={() => { setShowForm(false); setEditingNote(null); fetchNotes(); }} />
      )}
    </div>
  );
}

function NoteFormModal({ token, editing, onClose, onSaved }: { token: string; editing: StoreNote | null; onClose: () => void; onSaved: () => void }) {
  const [type, setType] = useState<NoteType>(editing?.type || 'other');
  const [title, setTitle] = useState(editing?.title || '');
  const [content, setContent] = useState(editing?.content || '');
  const [validFrom, setValidFrom] = useState(editing?.valid_from ? editing.valid_from.slice(0, 10) : '');
  const [validUntil, setValidUntil] = useState(editing?.valid_until ? editing.valid_until.slice(0, 10) : '');
  const [isActive, setIsActive] = useState(editing?.is_active !== false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const data: StoreNoteFormData = {
      type, content, is_active: isActive,
      title: title || null,
      valid_from: validFrom || null,
      valid_until: validUntil || null,
    };
    try {
      if (editing) {
        await storeApi.updateNote(editing.id, data, token);
      } else {
        await storeApi.createNote(data, token);
      }
      onSaved();
    } catch (err: any) {
      setError(err.message || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dash-modal-overlay" onClick={onClose}>
      <div className="dash-modal dash-modal-lg" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 700, margin: 0, color: '#2A1F19' }}>
            {editing ? '编辑信息' : '录入新信息'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9e8074', padding: 4 }}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label className="claw-form-label">信息类型 *</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {NOTE_TYPES.map(nt => (
                <button key={nt.value} type="button" onClick={() => setType(nt.value)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px',
                    borderRadius: 100, border: '1.5px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    background: type === nt.value ? nt.color : 'white',
                    color: type === nt.value ? 'white' : nt.color,
                    borderColor: nt.color,
                  }}>
                  {nt.emoji} {nt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="claw-form-label">标题（可选）</label>
            <input className="claw-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="例：全场八折优惠" />
          </div>
          <div>
            <label className="claw-form-label">内容 *</label>
            <textarea className="claw-textarea" rows={4} value={content} onChange={e => setContent(e.target.value)}
              placeholder="随时输入任何零碎信息，如：胡萝卜今天卖完了，明天多进50斤..." required />
          </div>
          <div className="dash-form-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="claw-form-label"><Calendar size={13} style={{ display: 'inline', marginRight: 5 }} />开始时间</label>
              <input className="claw-input" type="date" value={validFrom} onChange={e => setValidFrom(e.target.value)} />
            </div>
            <div>
              <label className="claw-form-label"><Calendar size={13} style={{ display: 'inline', marginRight: 5 }} />结束时间</label>
              <input className="claw-input" type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" id="note-active" checked={isActive} onChange={e => setIsActive(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
            <label htmlFor="note-active" style={{ fontSize: 14, color: '#2A1F19', cursor: 'pointer' }}>立即启用</label>
          </div>
          {error && <div style={{ fontSize: 13, color: '#bf3f30', fontWeight: 600 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="claw-btn-ghost" onClick={onClose}>取消</button>
            <button type="submit" className="claw-btn-primary" disabled={saving}>
              {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : null}
              {editing ? '保存更改' : '立即录入'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── 商品库 ──
function StoreProductsSection({ store, token }: { store: StoreProfile; token: string }) {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<StoreProduct | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const r = await storeApi.getMyProducts(token);
      setProducts(r.data);
    } catch { } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id: number) => {
    try {
      await storeApi.deleteProduct(id, token);
      setDeletingId(null);
      fetchProducts();
    } catch { }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <button className="claw-btn-primary" onClick={() => { setEditingProduct(null); setShowForm(true); }}>
          <Plus size={15} /> 添加商品
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...Array(3)].map((_, i) => <div key={i} className="claw-skeleton" style={{ height: 64, borderRadius: 12 }} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="claw-card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🛒</div>
          <p style={{ fontSize: 14, color: '#6B5549', margin: '0 0 16px' }}>还没有添加任何商品</p>
          <button className="claw-btn-primary" onClick={() => { setEditingProduct(null); setShowForm(true); }}>
            <Plus size={14} /> 添加第一个商品
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {products.map(p => (
            <div key={p.id} className="claw-card" style={{
              padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 14,
              opacity: p.is_active ? 1 : 0.5,
            }}>
              {p.image_url ? (
                <img src={p.image_url} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(230,92,70,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Box size={20} style={{ color: '#E65C46' }} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 14, color: '#2A1F19' }}>{p.name}</div>
                <div style={{ display: 'flex', gap: 10, marginTop: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#E65C46' }}>¥{parseFloat(p.price).toFixed(2)}</span>
                  {p.unit && <span style={{ fontSize: 12, color: '#9e8074' }}>/ {p.unit}</span>}
                  {p.stock !== null && (
                    <span style={{ fontSize: 12, color: p.stock > 0 ? '#4a9e6b' : '#bf3f30', fontWeight: 600 }}>
                      库存 {p.stock}
                    </span>
                  )}
                  {!p.is_active && <span style={{ fontSize: 11, color: '#9e8074', background: 'rgba(42,31,25,0.06)', padding: '2px 8px', borderRadius: 100 }}>已下架</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="dash-icon-btn" onClick={() => { setEditingProduct(p); setShowForm(true); }}><Pencil size={14} /></button>
                <button className="dash-icon-btn danger" onClick={() => setDeletingId(p.id)}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deletingId !== null && (
        <div className="dash-modal-overlay" onClick={() => setDeletingId(null)}>
          <div className="dash-modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 700, margin: '0 0 12px', color: '#2A1F19' }}>确认删除商品</h3>
            <p style={{ fontSize: 14, color: '#6B5549', margin: '0 0 24px' }}>删除后无法恢复，确定要删除这个商品吗？</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="claw-btn-ghost" onClick={() => setDeletingId(null)}>取消</button>
              <button className="claw-btn-primary" style={{ background: '#bf3f30' }} onClick={() => handleDelete(deletingId)}>确认删除</button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <ProductFormModal token={token} editing={editingProduct}
          onClose={() => { setShowForm(false); setEditingProduct(null); }}
          onSaved={() => { setShowForm(false); setEditingProduct(null); fetchProducts(); }} />
      )}
    </div>
  );
}

function ProductFormModal({ token, editing, onClose, onSaved }: { token: string; editing: StoreProduct | null; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(editing?.name || '');
  const [price, setPrice] = useState(editing ? String(parseFloat(editing.price)) : '');
  const [stock, setStock] = useState(editing?.stock !== null && editing?.stock !== undefined ? String(editing.stock) : '');
  const [unit, setUnit] = useState(editing?.unit || '');
  const [desc, setDesc] = useState(editing?.description || '');
  const [isActive, setIsActive] = useState(editing?.is_active !== false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Photo management (only for existing products)
  const [photos, setPhotos] = useState<StoreProductPhoto[]>(editing?.photos || []);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploadingPhoto(true);
    setPhotoError('');
    try {
      const photo = await storeApi.uploadProductPhoto(editing.id, file, token);
      setPhotos(prev => [...prev, photo]);
    } catch (err: any) {
      setPhotoError(err.message || '上传失败');
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleDeletePhoto = async (id: number) => {
    try {
      await storeApi.deleteProductPhoto(id, token);
      setPhotos(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      setPhotoError(err.message || '删除失败');
    }
  };

  const handleSetPrimary = async (id: number) => {
    try {
      const updated = await storeApi.setProductPhotoPrimary(id, token);
      setPhotos(prev => prev.map(p => ({ ...p, is_primary: p.id === id })));
    } catch (err: any) {
      setPhotoError(err.message || '操作失败');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const data: StoreProductFormData = {
      name, price: parseFloat(price) || 0, is_active: isActive,
      stock: stock !== '' ? parseInt(stock) : null,
      unit: unit || null, description: desc || null,
    };
    try {
      if (editing) {
        await storeApi.updateProduct(editing.id, data, token);
      } else {
        await storeApi.createProduct(data, token);
      }
      onSaved();
    } catch (err: any) {
      setError(err.message || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dash-modal-overlay" onClick={onClose}>
      <div className="dash-modal dash-modal-lg" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 700, margin: 0, color: '#2A1F19' }}>
            {editing ? '编辑商品' : '添加商品'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9e8074', padding: 4 }}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="claw-form-label">商品名称 *</label>
            <input className="claw-input" value={name} onChange={e => setName(e.target.value)} placeholder="胡萝卜" required />
          </div>
          <div className="dash-form-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label className="claw-form-label">价格（¥）*</label>
              <input className="claw-input" type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="9.90" required />
            </div>
            <div>
              <label className="claw-form-label">库存数量</label>
              <input className="claw-input" type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} placeholder="不填=不限" />
            </div>
            <div>
              <label className="claw-form-label">单位</label>
              <input className="claw-input" value={unit} onChange={e => setUnit(e.target.value)} placeholder="kg/件/盒" />
            </div>
          </div>
          <div>
            <label className="claw-form-label">商品描述</label>
            <textarea className="claw-textarea" rows={3} value={desc} onChange={e => setDesc(e.target.value)} placeholder="商品描述..." />
          </div>

          {/* 商品图片区域 */}
          <div>
            <label className="claw-form-label"><ImageIcon size={13} style={{ display: 'inline', marginRight: 5 }} />商品图片</label>
            {!editing ? (
              <div style={{ fontSize: 12, color: '#9e8074', padding: '10px 14px', background: 'rgba(240,232,225,0.5)', borderRadius: 8, border: '1px solid rgba(42,31,25,0.08)' }}>
                💡 保存商品后即可上传图片
              </div>
            ) : (
              <div>
                {/* 已上传图片缩略图 */}
                {photos.length > 0 && (
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
                    {photos.map(photo => (
                      <div key={photo.id} style={{ position: 'relative', width: 80, height: 80 }}>
                        <img src={photo.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, border: photo.is_primary ? '2.5px solid #E65C46' : '1.5px solid rgba(42,31,25,0.1)' }} />
                        {photo.is_primary && (
                          <div style={{ position: 'absolute', top: 3, left: 3, background: '#E65C46', borderRadius: 4, padding: '1px 5px', fontSize: 10, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Star size={9} fill="white" /> 主图
                          </div>
                        )}
                        <div style={{ position: 'absolute', top: 3, right: 3, display: 'flex', gap: 3 }}>
                          {!photo.is_primary && (
                            <button type="button" onClick={() => handleSetPrimary(photo.id)} title="设为主图"
                              style={{ width: 22, height: 22, borderRadius: 4, border: 'none', background: 'rgba(255,255,255,0.9)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Star size={11} style={{ color: '#E65C46' }} />
                            </button>
                          )}
                          <button type="button" onClick={() => handleDeletePhoto(photo.id)} title="删除"
                            style={{ width: 22, height: 22, borderRadius: 4, border: 'none', background: 'rgba(255,255,255,0.9)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <X size={11} style={{ color: '#bf3f30' }} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* 上传按钮 */}
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 8, border: '1.5px dashed rgba(42,31,25,0.2)', cursor: uploadingPhoto ? 'not-allowed' : 'pointer', fontSize: 13, color: '#6B5549', fontFamily: "'Manrope', sans-serif", background: 'rgba(240,232,225,0.3)' }}>
                  {uploadingPhoto ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={14} />}
                  {uploadingPhoto ? '上传中...' : '点击上传图片'}
                  <input type="file" accept="image/*" style={{ display: 'none' }} disabled={uploadingPhoto} onChange={handlePhotoUpload} />
                </label>
                <div style={{ fontSize: 11, color: '#9e8074', marginTop: 5 }}>支持 JPG/PNG/WebP，最大 5MB · 第一张自动设为主图</div>
                {photoError && <div style={{ fontSize: 12, color: '#bf3f30', marginTop: 4 }}>{photoError}</div>}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" id="product-active" checked={isActive} onChange={e => setIsActive(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
            <label htmlFor="product-active" style={{ fontSize: 14, color: '#2A1F19', cursor: 'pointer' }}>上架销售</label>
          </div>
          {error && <div style={{ fontSize: 13, color: '#bf3f30', fontWeight: 600 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="claw-btn-ghost" onClick={onClose}>取消</button>
            <button type="submit" className="claw-btn-primary" disabled={saving}>
              {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : null}
              {editing ? '保存更改' : '添加商品'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── 预定管理 ──
const BOOKING_STATUSES: { value: BookingStatus | 'all'; label: string; color: string }[] = [
  { value: 'all',         label: '全部',   color: '#6B5549' },
  { value: 'pending',     label: '待确认', color: '#f59e0b' },
  { value: 'confirmed',   label: '已确认', color: '#3b82f6' },
  { value: 'in_progress', label: '进行中', color: '#8b5cf6' },
  { value: 'completed',   label: '已完成', color: '#4a9e6b' },
  { value: 'cancelled',   label: '已取消', color: '#9e8074' },
];

function StoreBookingsSection({ store, token }: { store: StoreProfile; token: string }) {
  const [bookings, setBookings] = useState<StoreBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const r = await storeApi.getMyBookings(token, statusFilter);
      setBookings(r.data);
    } catch { } finally { setLoading(false); }
  }, [token, statusFilter]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleStatus = async (id: number, status: BookingStatus) => {
    setUpdatingId(id);
    try {
      await storeApi.updateBookingStatus(id, status, token);
      fetchBookings();
    } catch { } finally { setUpdatingId(null); }
  };

  const getStatusStyle = (status: BookingStatus) =>
    BOOKING_STATUSES.find(s => s.value === status) || BOOKING_STATUSES[0];

  const NEXT_ACTIONS: Record<BookingStatus, { label: string; next: BookingStatus; color?: string }[]> = {
    pending:     [{ label: '确认', next: 'confirmed', color: '#3b82f6' }, { label: '拒绝', next: 'cancelled', color: '#bf3f30' }],
    confirmed:   [{ label: '开始服务', next: 'in_progress' }, { label: '取消', next: 'cancelled', color: '#bf3f30' }],
    in_progress: [{ label: '完成', next: 'completed', color: '#4a9e6b' }, { label: '取消', next: 'cancelled', color: '#bf3f30' }],
    completed:   [],
    cancelled:   [],
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {BOOKING_STATUSES.map(s => (
          <button key={s.value} onClick={() => setStatusFilter(s.value)}
            style={{
              padding: '5px 12px', borderRadius: 100, border: '1.5px solid', fontSize: 12,
              fontWeight: 600, cursor: 'pointer', fontFamily: "'Manrope', sans-serif",
              background: statusFilter === s.value ? s.color : 'white',
              color: statusFilter === s.value ? 'white' : s.color,
              borderColor: s.color,
            }}>
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...Array(3)].map((_, i) => <div key={i} className="claw-skeleton" style={{ height: 80, borderRadius: 12 }} />)}
        </div>
      ) : bookings.length === 0 ? (
        <div className="claw-card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📅</div>
          <p style={{ fontSize: 14, color: '#6B5549' }}>暂无预定记录</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {bookings.map(b => {
            const st = getStatusStyle(b.status);
            const isExpanded = expandedId === b.id;
            const actions = NEXT_ACTIONS[b.status] || [];
            return (
              <div key={b.id} className="claw-card" style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                      <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 15, color: '#2A1F19' }}>{b.customer_name}</span>
                      <span style={{ fontSize: 13, color: '#9e8074' }}>{b.customer_phone}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: `${st.color}18`, color: st.color }}>{st.label}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 12, color: '#9e8074' }}>
                      {b.booking_at && <span>📅 {new Date(b.booking_at).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>}
                      {b.party_size && <span>👥 {b.party_size} 人</span>}
                      {b.table_area && <span>🪑 {b.table_area}</span>}
                      {b.items && b.items.length > 0 && <span>🛒 {b.items.length} 项</span>}
                      <span style={{ color: '#ddd' }}>#{b.id}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
                    {actions.map(a => (
                      <button key={a.next} disabled={updatingId === b.id} onClick={() => handleStatus(b.id, a.next)}
                        style={{ padding: '5px 12px', borderRadius: 7, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: a.color || '#E65C46', color: 'white', fontFamily: "'Manrope', sans-serif", opacity: updatingId === b.id ? 0.6 : 1 }}>
                        {updatingId === b.id ? '…' : a.label}
                      </button>
                    ))}
                    <button onClick={() => setExpandedId(isExpanded ? null : b.id)} className="dash-icon-btn">
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>
                {isExpanded && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(42,31,25,0.08)' }}>
                    {b.customer_note && (
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 11, color: '#9e8074', fontWeight: 600, marginBottom: 3 }}>备注</div>
                        <div style={{ fontSize: 13, color: '#2A1F19' }}>{b.customer_note}</div>
                      </div>
                    )}
                    {b.items && b.items.length > 0 && (
                      <div>
                        <div style={{ fontSize: 11, color: '#9e8074', fontWeight: 600, marginBottom: 6 }}>明细</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {b.items.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                              <span style={{ color: '#2A1F19', fontWeight: 500 }}>{item.name}</span>
                              <span style={{ color: '#9e8074' }}>× {item.qty}{item.unit ? ` ${item.unit}` : ''}</span>
                              {item.price && <span style={{ color: '#E65C46', fontWeight: 600 }}>¥{item.price}</span>}
                              {item.staff && <span style={{ color: '#9e8074' }}>@{item.staff}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{ fontSize: 11, color: '#bbb', marginTop: 10 }}>提交于 {new Date(b.created_at).toLocaleString('zh-CN')}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const dashStyles = `
  .dash-layout {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 24px;
    align-items: start;
  }
  .dash-sidebar { position: sticky; top: 80px; }
  .dash-tab-btn {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 10px 14px; font-size: 14px; font-weight: 500; color: #6B5549;
    background: transparent; border: none; border-radius: 8px; cursor: pointer;
    font-family: 'Manrope', sans-serif; transition: background 0.12s, color 0.12s; text-align: left;
  }
  .dash-tab-btn:hover { background: rgba(240,232,225,0.8); color: #2A1F19; }
  .dash-tab-btn.active { background: rgba(230,92,70,0.1); color: #E65C46; font-weight: 600; }
  .dash-tab-btn.sell { color: #E65C46; }
  .dash-tab-btn.sell:hover { background: rgba(230,92,70,0.08); }

  .dash-icon-btn {
    width: 32px; height: 32px; border-radius: 8px; border: 1px solid rgba(42,31,25,0.12);
    background: white; display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #6B5549; transition: all 0.12s; text-decoration: none;
  }
  .dash-icon-btn:hover { background: rgba(240,232,225,0.8); color: #2A1F19; border-color: rgba(42,31,25,0.2); }
  .dash-icon-btn.danger:hover { background: rgba(191,63,48,0.08); color: #bf3f30; border-color: rgba(191,63,48,0.2); }

  .listing-status-badge {
    font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 100px;
  }
  .listing-status-badge.available { background: rgba(74,158,107,0.12); color: #2e7d52; }
  .listing-status-badge.draft { background: rgba(42,31,25,0.08); color: #6B5549; }
  .listing-status-badge.sold { background: rgba(230,92,70,0.12); color: #bf3f30; }

  .dash-modal-overlay {
    position: fixed; inset: 0; background: rgba(42,31,25,0.4); backdrop-filter: blur(4px);
    z-index: 200; display: flex; align-items: center; justify-content: center; padding: 24px;
  }
  .dash-modal {
    background: white; border-radius: 16px; padding: 28px; width: 100%; max-width: 420px;
    box-shadow: 0 16px 48px rgba(42,31,25,0.18); max-height: 90vh; overflow-y: auto;
    animation: modalIn 0.15s ease;
  }
  .dash-modal-lg { max-width: 560px; }
  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.96) translateY(8px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @media (max-width: 640px) {
    .dash-layout { grid-template-columns: 1fr; gap: 0; }
    .dash-sidebar {
      position: static;
      display: flex;
      flex-direction: row;
      overflow-x: auto;
      gap: 4px;
      padding: 8px 0 12px;
      border-bottom: 1px solid rgba(42,31,25,0.08);
      scrollbar-width: none;
    }
    .dash-sidebar::-webkit-scrollbar { display: none; }
    .dash-tab-btn {
      white-space: nowrap;
      flex-shrink: 0;
      padding: 8px 14px;
      border-radius: 100px;
      font-size: 13px;
    }
    .dash-tab-btn.active {
      background: #2A1F19;
      color: white;
    }
  }
  @media (max-width: 480px) {
    .dash-stats-grid { grid-template-columns: 1fr 1fr !important; }
    .dash-form-two-col { grid-template-columns: 1fr !important; }
  }
`;
