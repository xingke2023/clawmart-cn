'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { clawStyles } from "@/components/claw-layout";
import { storeApi, StoreProfile, StoreNote, StoreProduct, NoteType, StoreType, BookingFormData, BookingItem } from "@/lib/api";
import { MapPin, Clock, Phone, Mail, Globe, CalendarCheck, X, Plus, Trash2, Loader2, ImageIcon, Video, QrCode, MessageCircle } from "lucide-react";

const STORE_TYPE_META: Record<StoreType, { label: string; emoji: string }> = {
  restaurant: { label: '餐厅',   emoji: '🍽️' },
  retail:     { label: '零售店', emoji: '🛒' },
  hotel:      { label: '酒店',   emoji: '🏨' },
};

const NOTE_TYPES: { value: NoteType; label: string; emoji: string; color: string }[] = [
  { value: 'discount',     label: '打折',  emoji: '🏷️', color: '#E65C46' },
  { value: 'announcement', label: '公告',  emoji: '📢', color: '#3b82f6' },
  { value: 'event',        label: '活动',  emoji: '🎉', color: '#f59e0b' },
  { value: 'other',        label: '其他',  emoji: '📝', color: '#6B5549' },
];

export default function StorePublicPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [store, setStore] = useState<StoreProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [filterType, setFilterType] = useState<NoteType | 'all'>('all');
  const [showBooking, setShowBooking] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'deals' | 'products' | 'reviews'>('deals');
  const chatUrl = typeof window !== 'undefined' ? `${window.location.origin}/store/${slug}/chat` : '';

  useEffect(() => {
    storeApi.getPublicStore(slug)
      .then(s => setStore(s))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <>
      <style>{clawStyles + pageStyles}</style>
      <div className="claw-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ color: '#9e8074', fontSize: 14 }}>加载中...</div>
      </div>
    </>
  );

  if (notFound || !store) return (
    <>
      <style>{clawStyles + pageStyles}</style>
      <div className="claw-page">
        <div style={{ maxWidth: 600, margin: '120px auto', textAlign: 'center', padding: '0 24px' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🏪</div>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 28, fontWeight: 800, color: '#2A1F19', margin: '0 0 12px' }}>找不到这家店铺</h1>
          <p style={{ color: '#6B5549', marginBottom: 28 }}>该店铺不存在或已设为私密。</p>
          <Link href="/" className="claw-btn-primary">← 返回首页</Link>
        </div>
      </div>
    </>
  );

  const notes = (store.notes || []).filter(n => filterType === 'all' || n.type === filterType);
  const products = (store.products || []).filter(p => p.is_active);
  const photos = store.photos || [];
  const bannerPhoto = photos[0];
  const extraPhotos = photos.slice(1);
  const usedTypes = [...new Set((store.notes || []).map(n => n.type))];
  const typeMeta = store.store_type && STORE_TYPE_META[store.store_type];

  return (
    <>
      <style>{clawStyles + pageStyles}</style>
      <div className="claw-page">
        <main>

          {/* ── Hero（无 banner 图，仅店铺信息） ── */}
          <section style={{ background: 'white', borderBottom: '1px solid rgba(42,31,25,0.08)', padding: '40px 20px 10px', position: 'relative' }}>
            {/* 二维码 — 右上角，直接显示小码，点击放大 */}
            <div onClick={() => setShowQR(true)} title="点击放大二维码"
              style={{ position: 'absolute', top: 12, right: 14, cursor: 'pointer', padding: 5, background: 'white', borderRadius: 8, border: '1.5px solid rgba(42,31,25,0.1)', boxShadow: '0 1px 6px rgba(42,31,25,0.08)', display: 'inline-flex' }}>
              <QRCodeSVG value={chatUrl} size={50} fgColor="#2A1F19" bgColor="transparent" level="M" />
            </div>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                  <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 26, fontWeight: 800, color: '#2A1F19', margin: 0 }}>{store.shop_name}</h1>
                  {typeMeta && (
                    <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 100, background: 'rgba(42,31,25,0.07)', color: '#6B5549' }}>
                      {typeMeta.emoji} {typeMeta.label}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  {store.shop_description && (
                    <p style={{ fontSize: 14, color: '#6B5549', margin: 0, lineHeight: 1.6, flex: 1 }}>{store.shop_description}</p>
                  )}
                  {photos.length > 0 && (
                    <button type="button" onClick={() => setLightboxIdx(0)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0, background: 'none', border: '1px solid rgba(230,92,70,0.3)', borderRadius: 6, cursor: 'pointer', fontSize: 11, color: '#E65C46', fontWeight: 600, padding: '3px 8px', fontFamily: "'Manrope', sans-serif" }}>
                      <ImageIcon size={11} />
                      店铺展示区
                    </button>
                  )}
                </div>
              </div>
              {/* 信息条 + 预定按钮 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', paddingTop: 10, borderTop: '1px solid rgba(42,31,25,0.07)', alignItems: 'center' }}>
                {/* 第一行：营业时间 + 电话 */}
                {store.business_hours && <span className="store-meta-item"><Clock size={12} />{store.business_hours}</span>}
                {store.contact_phone && (
                  <a href={`tel:${store.contact_phone}`} className="store-meta-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Phone size={12} />{store.contact_phone}
                  </a>
                )}
                {/* 强制换行后：地址 */}
                {store.address && <span className="store-meta-item" style={{ flexBasis: '100%', marginTop: 2 }}><MapPin size={12} />{store.address}</span>}
                {store.user?.website_url && (
                  <a href={store.user.website_url} target="_blank" rel="noreferrer" className="store-meta-item" style={{ textDecoration: 'none', color: '#E65C46' }}>
                    <Globe size={12} />网站
                  </a>
                )}
                {store.tags && store.tags.length > 0 && store.tags.map(t => (
                  <span key={t} style={{ background: 'rgba(230,92,70,0.1)', color: '#E65C46', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 100 }}>{t}</span>
                ))}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                  <Link href={`/store/${slug}/chat`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, padding: '5px 14px', borderRadius: 8, border: '1.5px solid rgba(230,92,70,0.35)', color: '#E65C46', fontWeight: 700, textDecoration: 'none', fontFamily: "'Manrope', sans-serif", background: 'white', transition: 'all 0.15s' }}>
                    <MessageCircle size={15} /> AI 咨询
                  </Link>
<button onClick={() => setShowBooking(true)} className="claw-btn-primary" style={{ flexShrink: 0, fontSize: 14, padding: '5px 18px' }}>
                    <CalendarCheck size={15} /> 立即预定
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ── 正文区域 ── */}
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '15px 20px 80px' }}>

            {/* Tab 栏 */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '2px solid rgba(42,31,25,0.08)' }}>
              {([
                { key: 'deals',    label: '商家优惠' },
                { key: 'products', label: '商品' },
                { key: 'reviews',  label: '评论' },
              ] as const).map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  style={{
                    padding: '10px 0', fontSize: 15, fontWeight: 600, cursor: 'pointer',
                    flex: 1, textAlign: 'center' as const,
                    background: 'none', border: 'none', fontFamily: "'Manrope', sans-serif",
                    color: activeTab === t.key ? '#E65C46' : '#6B5549',
                    borderBottom: activeTab === t.key ? '2px solid #E65C46' : '2px solid transparent',
                    marginBottom: -2,
                    transition: 'color 0.15s',
                  }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* 商家优惠 tab */}
            {activeTab === 'deals' && (
              <div>
                {(store.notes || []).length > 0 ? (
                  <>
                    {usedTypes.length > 1 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                        <button onClick={() => setFilterType('all')} className={`store-filter-btn${filterType === 'all' ? ' active' : ''}`}>全部</button>
                        {usedTypes.map(type => {
                          const nt = NOTE_TYPES.find(n => n.value === type);
                          if (!nt) return null;
                          return (
                            <button key={type} onClick={() => setFilterType(type)} className={`store-filter-btn${filterType === type ? ' active' : ''}`}>
                              {nt.emoji} {nt.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {notes.length === 0 ? (
                      <div className="claw-card" style={{ padding: 28, textAlign: 'center', color: '#9e8074', fontSize: 14 }}>该分类暂无信息</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {notes.map(note => {
                          const nt = NOTE_TYPES.find(n => n.value === note.type) || { label: '其他', emoji: '📝', color: '#6B5549' };
                          return (
                            <div key={note.id} className="claw-card" style={{ padding: '16px 20px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <span style={{ fontSize: 18 }}>{nt.emoji}</span>
                                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: `${nt.color}18`, color: nt.color }}>{nt.label}</span>
                                {note.title && <span style={{ fontSize: 14, fontWeight: 700, color: '#2A1F19', fontFamily: "'Bricolage Grotesque', sans-serif" }}>{note.title}</span>}
                              </div>
                              <p style={{ fontSize: 14, color: '#2A1F19', margin: '0 0 10px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{note.content}</p>
                              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                                {(note.valid_from || note.valid_until) && (
                                  <span style={{ fontSize: 12, color: '#E65C46', fontWeight: 600 }}>
                                    {note.valid_from && new Date(note.valid_from).toLocaleDateString('zh-CN')}
                                    {note.valid_from && note.valid_until && ' – '}
                                    {note.valid_until && new Date(note.valid_until).toLocaleDateString('zh-CN')}
                                  </span>
                                )}
                                <span style={{ fontSize: 12, color: '#9e8074' }}>
                                  {new Date(note.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="claw-card" style={{ padding: 48, textAlign: 'center' }}>
                    <div style={{ fontSize: 36, marginBottom: 10 }}>🏷️</div>
                    <p style={{ color: '#9e8074', fontSize: 14, margin: 0 }}>暂无商家优惠信息</p>
                  </div>
                )}
              </div>
            )}

            {/* 商品 tab */}
            {activeTab === 'products' && (
              <div>
                {products.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {products.map(p => (
                      <div key={p.id} className="claw-card" style={{ padding: '12px 16px', display: 'flex', gap: 14, alignItems: 'center' }}>
                        {p.image_url ? (
                          <img src={p.image_url} alt="" style={{ width: 56, height: 56, borderRadius: 9, objectFit: 'cover', flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 56, height: 56, borderRadius: 9, background: 'rgba(230,92,70,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontSize: 24 }}>🛒</span>
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 14, color: '#2A1F19', marginBottom: 3 }}>{p.name}</div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span style={{ fontSize: 15, fontWeight: 800, color: '#E65C46' }}>¥{parseFloat(p.price).toFixed(2)}</span>
                            {p.unit && <span style={{ fontSize: 12, color: '#9e8074' }}>/ {p.unit}</span>}
                            {p.stock !== null && (
                              <span style={{ fontSize: 11, color: p.stock > 0 ? '#4a9e6b' : '#bf3f30', fontWeight: 600 }}>余 {p.stock}</span>
                            )}
                          </div>
                          {p.description && <p style={{ fontSize: 12, color: '#9e8074', margin: '3px 0 0', lineHeight: 1.4 }}>{p.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="claw-card" style={{ padding: 48, textAlign: 'center' }}>
                    <div style={{ fontSize: 36, marginBottom: 10 }}>🛒</div>
                    <p style={{ color: '#9e8074', fontSize: 14, margin: 0 }}>暂无商品信息</p>
                  </div>
                )}
              </div>
            )}

            {/* 评论 tab */}
            {activeTab === 'reviews' && (
              <div className="claw-card" style={{ padding: 48, textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>💬</div>
                <p style={{ color: '#9e8074', fontSize: 14, margin: 0 }}>评论功能即将上线，敬请期待</p>
              </div>
            )}

          </div>
        </main>

        {showBooking && store && (
          <BookingModal store={store} slug={slug} onClose={() => setShowBooking(false)} />
        )}

        {/* 二维码弹窗 */}
        {showQR && store && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(42,31,25,0.45)', backdropFilter: 'blur(4px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
            onClick={() => setShowQR(false)}
          >
            <div
              style={{ background: 'white', borderRadius: 20, padding: '32px 36px', textAlign: 'center', boxShadow: '0 20px 60px rgba(42,31,25,0.2)', maxWidth: 320, width: '100%' }}
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setShowQR(false)} style={{ position: 'absolute', marginLeft: 200, marginTop: -16, background: 'rgba(42,31,25,0.07)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6B5549' }}>
                <X size={16} />
              </button>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 17, color: '#2A1F19', marginBottom: 4 }}>{store.shop_name}</div>
              <div style={{ fontSize: 12, color: '#9e8074', marginBottom: 20 }}>扫码与 AI 客服对话 · 在线咨询预定</div>
              <div style={{ display: 'inline-flex', padding: 12, background: '#F8F2ED', borderRadius: 14, marginBottom: 20 }}>
                <QRCodeSVG
                  value={chatUrl}
                  size={180}
                  fgColor="#2A1F19"
                  bgColor="transparent"
                  level="M"
                />
              </div>
              <div style={{ fontSize: 12, color: '#9e8074', lineHeight: 1.6 }}>
                扫描二维码，即可与<br />
                <strong style={{ color: '#E65C46' }}>{store.shop_name} AI 客服</strong>开始对话
              </div>
              <Link
                href={`/store/${slug}/chat`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16, fontSize: 13, fontWeight: 700, color: '#E65C46', textDecoration: 'none', fontFamily: "'Manrope', sans-serif" }}
              >
                <MessageCircle size={14} /> 直接打开聊天页 →
              </Link>
            </div>
          </div>
        )}

        {/* Lightbox */}
        {lightboxIdx !== null && photos.length > 0 && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setLightboxIdx(null)}
          >
            {/* 关闭 */}
            <button onClick={() => setLightboxIdx(null)}
              style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
              <X size={20} />
            </button>
            {/* 上一张 */}
            {photos.length > 1 && (
              <button onClick={e => { e.stopPropagation(); setLightboxIdx(i => (i! - 1 + photos.length) % photos.length); }}
                style={{ position: 'absolute', left: 20, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 22 }}>
                ‹
              </button>
            )}
            {/* 大图 */}
            <img
              src={photos[lightboxIdx].url}
              alt=""
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 12, boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}
            />
            {/* 下一张 */}
            {photos.length > 1 && (
              <button onClick={e => { e.stopPropagation(); setLightboxIdx(i => (i! + 1) % photos.length); }}
                style={{ position: 'absolute', right: 20, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 22 }}>
                ›
              </button>
            )}
            {/* 缩略图条 */}
            {photos.length > 1 && (
              <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}
                onClick={e => e.stopPropagation()}>
                {photos.map((p, i) => (
                  <button key={p.id} onClick={() => setLightboxIdx(i)}
                    style={{ width: 52, height: 52, borderRadius: 8, overflow: 'hidden', border: i === lightboxIdx ? '2.5px solid white' : '2px solid rgba(255,255,255,0.3)', padding: 0, cursor: 'pointer', flexShrink: 0 }}>
                    <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </button>
                ))}
              </div>
            )}
            {/* 计数 */}
            <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
              {lightboxIdx + 1} / {photos.length}
            </div>
          </div>
        )}

      </div>

      {/* 底部返回龙虾中国 */}
      <div style={{ textAlign: 'right', padding: '16px 24px', background: '#F8F2ED' }}>
        <a href="https://www.clawmart.cn" target="_blank" rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 12, fontWeight: 700, color: '#E65C46', textDecoration: 'none',
            fontFamily: "'Manrope', sans-serif",
          }}>
          🦞 龙虾中国
        </a>
      </div>
    </>
  );
}

// ── 预定弹窗 ──
function BookingModal({ store, slug, onClose }: { store: StoreProfile; slug: string; onClose: () => void }) {
  const storeType = store.store_type || 'general';
  const products = (store.products || []).filter(p => p.is_active);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [bookingAt, setBookingAt] = useState('');
  const [tableArea, setTableArea] = useState('');
  const [partySize, setPartySize] = useState('');
  const [orderItems, setOrderItems] = useState<{ name: string; qty: string; unit: string; price: string; product_id?: number }[]>([]);
  const [serviceItems, setServiceItems] = useState<{ name: string; staff: string; qty: string }[]>([]);

  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const addOrderItem = (product?: { id: number; name: string; unit: string | null; price: string }) => {
    setOrderItems(prev => [...prev, {
      name: product?.name || '',
      qty: '1',
      unit: product?.unit || '',
      price: product ? parseFloat(product.price).toFixed(2) : '',
      product_id: product?.id,
    }]);
  };

  const addServiceItem = () => setServiceItems(prev => [...prev, { name: '', staff: '', qty: '1' }]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const items: BookingItem[] = storeType === 'retail'
      ? orderItems.filter(i => i.name).map(i => ({ name: i.name, qty: parseFloat(i.qty) || 1, unit: i.unit || undefined, price: i.price || undefined, product_id: i.product_id }))
      : storeType === 'hotel'
        ? serviceItems.filter(i => i.name).map(i => ({ name: i.name, qty: parseFloat(i.qty) || 1, staff: i.staff || undefined }))
        : [];

    const data: BookingFormData = {
      customer_name: name,
      customer_phone: phone,
      customer_note: note || null,
      booking_at: bookingAt || null,
      table_area: tableArea || null,
      party_size: partySize ? parseInt(partySize) : null,
      items: items.length > 0 ? items : undefined,
    };

    try {
      const b = await storeApi.createBooking(slug, data);
      setBookingId(b.id);
      setDone(true);
    } catch (err: any) {
      setError(err.message || '提交失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(42,31,25,0.45)', backdropFilter: 'blur(4px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}>
      <div style={{ background: 'white', borderRadius: 18, padding: 32, width: '100%', maxWidth: 520, boxShadow: '0 20px 60px rgba(42,31,25,0.2)', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}>

        {done ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 800, color: '#2A1F19', margin: '0 0 10px' }}>预定成功！</h3>
            <p style={{ color: '#6B5549', fontSize: 14, margin: '0 0 6px' }}>预定编号：<strong>#{bookingId}</strong></p>
            <p style={{ color: '#9e8074', fontSize: 13, margin: '0 0 28px' }}>店家将尽快与您确认，请保持电话畅通。</p>
            <button className="claw-btn-primary" onClick={onClose}>关闭</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 800, color: '#2A1F19', margin: 0 }}>
                预定 · {store.shop_name}
              </h3>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9e8074', padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B5549', marginBottom: 5 }}>姓名 *</label>
                  <input className="claw-input" value={name} onChange={e => setName(e.target.value)} placeholder="您的姓名" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B5549', marginBottom: 5 }}>联系电话 *</label>
                  <input className="claw-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="138xxxx8888" required />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B5549', marginBottom: 5 }}>预定时间</label>
                <input className="claw-input" type="datetime-local" value={bookingAt} onChange={e => setBookingAt(e.target.value)} />
              </div>

              {storeType === 'restaurant' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B5549', marginBottom: 5 }}>区域/台号</label>
                    <input className="claw-input" value={tableArea} onChange={e => setTableArea(e.target.value)} placeholder="如：大厅3号桌" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B5549', marginBottom: 5 }}>用餐人数</label>
                    <input className="claw-input" type="number" min="1" value={partySize} onChange={e => setPartySize(e.target.value)} placeholder="人数" />
                  </div>
                </div>
              )}

              {storeType === 'retail' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#6B5549' }}>商品明细</label>
                    <button type="button" onClick={() => addOrderItem()} style={{ fontSize: 12, color: '#E65C46', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Plus size={13} /> 添加
                    </button>
                  </div>
                  {products.length > 0 && orderItems.length === 0 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                      {products.slice(0, 6).map(p => (
                        <button key={p.id} type="button" onClick={() => addOrderItem(p)}
                          style={{ fontSize: 12, padding: '4px 10px', borderRadius: 100, border: '1px solid rgba(230,92,70,0.3)', background: 'white', color: '#E65C46', cursor: 'pointer' }}>
                          + {p.name}
                        </button>
                      ))}
                    </div>
                  )}
                  {orderItems.map((item, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                      <input className="claw-input" value={item.name} onChange={e => setOrderItems(prev => prev.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} placeholder="商品名" style={{ fontSize: 13 }} />
                      <input className="claw-input" type="number" min="0" value={item.qty} onChange={e => setOrderItems(prev => prev.map((x, j) => j === i ? { ...x, qty: e.target.value } : x))} placeholder="数量" style={{ fontSize: 13 }} />
                      <input className="claw-input" value={item.unit} onChange={e => setOrderItems(prev => prev.map((x, j) => j === i ? { ...x, unit: e.target.value } : x))} placeholder="单位" style={{ fontSize: 13 }} />
                      <input className="claw-input" value={item.price} onChange={e => setOrderItems(prev => prev.map((x, j) => j === i ? { ...x, price: e.target.value } : x))} placeholder="单价" style={{ fontSize: 13 }} />
                      <button type="button" onClick={() => setOrderItems(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9e8074', padding: 2 }}><Trash2 size={14} /></button>
                    </div>
                  ))}
                  {orderItems.length === 0 && (
                    <button type="button" onClick={() => addOrderItem()} className="claw-btn-ghost" style={{ width: '100%', fontSize: 13 }}>
                      <Plus size={14} /> 添加商品
                    </button>
                  )}
                </div>
              )}

              {storeType === 'hotel' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#6B5549' }}>增值服务（可选）</label>
                    <button type="button" onClick={addServiceItem} style={{ fontSize: 12, color: '#E65C46', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Plus size={13} /> 添加
                    </button>
                  </div>
                  {serviceItems.map((item, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                      <input className="claw-input" value={item.name} onChange={e => setServiceItems(prev => prev.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} placeholder="如：早餐、接机" style={{ fontSize: 13 }} />
                      <input className="claw-input" value={item.staff} onChange={e => setServiceItems(prev => prev.map((x, j) => j === i ? { ...x, staff: e.target.value } : x))} placeholder="备注（可选）" style={{ fontSize: 13 }} />
                      <input className="claw-input" type="number" min="1" value={item.qty} onChange={e => setServiceItems(prev => prev.map((x, j) => j === i ? { ...x, qty: e.target.value } : x))} placeholder="数量" style={{ fontSize: 13 }} />
                      <button type="button" onClick={() => setServiceItems(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9e8074', padding: 2 }}><Trash2 size={14} /></button>
                    </div>
                  ))}
                  {serviceItems.length === 0 && (
                    <button type="button" onClick={addServiceItem} className="claw-btn-ghost" style={{ width: '100%', fontSize: 13 }}>
                      <Plus size={14} /> 添加增值服务
                    </button>
                  )}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B5549', marginBottom: 5 }}>备注</label>
                <textarea className="claw-textarea" rows={2} value={note} onChange={e => setNote(e.target.value)} placeholder="特殊要求或说明..." />
              </div>

              {error && <div style={{ fontSize: 13, color: '#bf3f30', fontWeight: 600 }}>{error}</div>}

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
                <button type="button" className="claw-btn-ghost" onClick={onClose}>取消</button>
                <button type="submit" className="claw-btn-primary" disabled={saving}>
                  {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CalendarCheck size={14} />}
                  提交预定
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

const pageStyles = `
  .store-meta-item {
    display: flex; align-items: center; gap: 5px;
    font-size: 13px; color: #9e8074;
  }
  .store-filter-btn {
    padding: 4px 12px; border-radius: 100px; border: 1.5px solid rgba(42,31,25,0.15);
    background: white; font-size: 12px; font-weight: 600; color: #6B5549; cursor: pointer;
    font-family: 'Manrope', sans-serif; transition: all 0.12s;
  }
  .store-filter-btn:hover { border-color: #E65C46; color: #E65C46; }
  .store-filter-btn.active { background: #E65C46; color: white; border-color: #E65C46; }
  div:has(> .photo-banner-overlay):hover .photo-banner-overlay { background: rgba(0,0,0,0.32) !important; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @media (max-width: 680px) {
    main > div[style*='grid-template-columns'] { grid-template-columns: 1fr !important; }
  }
`;
