'use client';
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { storeApi, StoreProfile, BookingFormData, BookingItem } from "@/lib/api";
import { clawStyles } from "@/components/claw-layout";
import { Send, ArrowLeft, CalendarCheck, X, Loader2, Plus, Trash2, ChevronDown, ChevronUp, Globe, Mic, MicOff } from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const NOTE_META: Record<string, { label: string; emoji: string; color: string }> = {
  discount:     { label: '优惠折扣', emoji: '🏷️', color: '#E65C46' },
  announcement: { label: '公告',    emoji: '📢', color: '#3b82f6' },
  inventory:    { label: '库存',    emoji: '📦', color: '#8b5cf6' },
  event:        { label: '活动',    emoji: '🎉', color: '#f59e0b' },
  other:        { label: '其他',    emoji: '📝', color: '#6B5549' },
};

export default function StoreChatPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [store, setStore] = useState<StoreProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [storeLoading, setStoreLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [contextExpanded, setContextExpanded] = useState(false);
  const [lang, setLang] = useState('中文');
  const [langOpen, setLangOpen] = useState(false);

  const LANGUAGES = [
    { label: '中文', code: 'zh' },
    { label: 'English', code: 'en' },
    { label: 'Français', code: 'fr' },
    { label: '日本語', code: 'ja' },
    { label: '한국어', code: 'ko' },
    { label: 'Español', code: 'es' },
    { label: 'Português', code: 'pt' },
    { label: 'Русский', code: 'ru' },
  ];

  const I18N: Record<string, Record<string, string>> = {
    '中文':     { online: '客服在线', bookBtn: '立即预定', actionBook: '预定下单', actionProducts: '🛒 查看商品', actionDeals: '🏷️ 优惠折扣', placeholder: '输入消息…', storeInfo: '本店资料', announcements: '条公告', items: '件商品', bookingIntent: '好的！点击下方按钮填写预定信息 👇', q1: '有什么优惠？', q2: '商品有哪些？', q3: '营业时间？', q4: '门店WiFi密码？', q5: '门店电话？', q6: '怎么用支付宝/微信支付？', q7: '从机场/火车站怎么来？', q8: '怎么叫滴滴打车？', q9: '能推荐VPN吗？', q10: '附近有哪些好玩的地方？' },
    'English':  { online: 'AI Assistant Online', bookBtn: 'Book Now', actionBook: 'Book / Order', actionProducts: '🛒 Products', actionDeals: '🏷️ Deals', placeholder: 'Type a message…', storeInfo: 'Store Info', announcements: 'notices', items: 'items', bookingIntent: 'Sure! Click the button below to fill in your booking details 👇', q1: 'Any deals?', q2: 'What products?', q3: 'Opening hours?', q4: 'WiFi password?', q5: 'Phone number?', q6: 'How to pay with Alipay / WeChat Pay as a foreigner?', q7: 'How to get here from the airport / train station?', q8: 'How to use DiDi (ride-hailing)?', q9: 'Can you recommend a VPN?', q10: 'Any nearby attractions to visit?' },
    'Français': { online: 'Assistant IA en ligne', bookBtn: 'Réserver', actionBook: 'Réserver', actionProducts: '🛒 Produits', actionDeals: '🏷️ Offres', placeholder: 'Écrire un message…', storeInfo: 'Infos boutique', announcements: 'annonces', items: 'articles', bookingIntent: 'Bien sûr ! Cliquez sur le bouton ci-dessous pour remplir votre réservation 👇', q1: 'Des promotions ?', q2: 'Quels produits ?', q3: 'Horaires ?', q4: 'Mot de passe WiFi ?', q5: 'Téléphone ?', q6: 'Comment utiliser Alipay / WeChat Pay en tant qu\'étranger ?', q7: 'Comment venir depuis l\'aéroport ?', q8: 'Comment utiliser DiDi ?', q9: 'Recommandez-vous un VPN ?', q10: 'Quels endroits visiter à proximité ?' },
    '日本語':   { online: 'AIアシスタント対応中', bookBtn: '今すぐ予約', actionBook: '予約・注文', actionProducts: '🛒 商品一覧', actionDeals: '🏷️ お得情報', placeholder: 'メッセージを入力…', storeInfo: '店舗情報', announcements: 'お知らせ', items: '商品', bookingIntent: 'かしこまりました！下のボタンから予約情報をご入力ください 👇', q1: 'お得情報は？', q2: '商品は何がありますか？', q3: '営業時間は？', q4: 'WiFiパスワードは？', q5: '電話番号は？', q6: '外国人がAlipay/WeChat Payを使う方法は？', q7: '空港・駅からのアクセスは？', q8: 'DiDi（配車）の使い方は？', q9: 'VPNのおすすめは？', q10: '近くの観光スポットは？' },
    '한국어':   { online: 'AI 어시스턴트 온라인', bookBtn: '지금 예약', actionBook: '예약/주문', actionProducts: '🛒 상품 보기', actionDeals: '🏷️ 할인 혜택', placeholder: '메시지를 입력하세요…', storeInfo: '매장 정보', announcements: '공지', items: '상품', bookingIntent: '네! 아래 버튼을 눌러 예약 정보를 입력해 주세요 👇', q1: '할인 있나요?', q2: '어떤 상품이 있나요?', q3: '영업 시간은?', q4: 'WiFi 비밀번호는?', q5: '전화번호는?', q6: '외국인이 알리페이/위챗페이 쓰는 방법은?', q7: '공항/기차역에서 오는 방법은?', q8: 'DiDi(차량 호출) 사용법은?', q9: 'VPN 추천해 주실 수 있나요?', q10: '근처 볼거리가 있나요?' },
    'Español':  { online: 'Asistente IA en línea', bookBtn: 'Reservar', actionBook: 'Reservar', actionProducts: '🛒 Productos', actionDeals: '🏷️ Ofertas', placeholder: 'Escribe un mensaje…', storeInfo: 'Info tienda', announcements: 'avisos', items: 'artículos', bookingIntent: '¡Claro! Haz clic en el botón de abajo para completar tu reserva 👇', q1: '¿Hay ofertas?', q2: '¿Qué productos hay?', q3: '¿Horario de apertura?', q4: '¿Contraseña WiFi?', q5: '¿Teléfono?', q6: '¿Cómo usar Alipay / WeChat Pay como extranjero?', q7: '¿Cómo llegar desde el aeropuerto?', q8: '¿Cómo usar DiDi (taxi)?', q9: '¿Puede recomendar una VPN?', q10: '¿Qué lugares visitar cerca?' },
    'Português':{ online: 'Assistente IA online', bookBtn: 'Reservar', actionBook: 'Reservar', actionProducts: '🛒 Produtos', actionDeals: '🏷️ Promoções', placeholder: 'Escreva uma mensagem…', storeInfo: 'Info loja', announcements: 'avisos', items: 'itens', bookingIntent: 'Claro! Clique no botão abaixo para preencher a sua reserva 👇', q1: 'Há promoções?', q2: 'Quais produtos?', q3: 'Horário de funcionamento?', q4: 'Senha WiFi?', q5: 'Telefone?', q6: 'Como usar Alipay / WeChat Pay como estrangeiro?', q7: 'Como chegar do aeroporto?', q8: 'Como usar o DiDi (transporte)?', q9: 'Pode recomendar uma VPN?', q10: 'O que visitar por perto?' },
    'Русский':  { online: 'ИИ-помощник онлайн', bookBtn: 'Забронировать', actionBook: 'Бронь/Заказ', actionProducts: '🛒 Товары', actionDeals: '🏷️ Акции', placeholder: 'Введите сообщение…', storeInfo: 'О магазине', announcements: 'объявл.', items: 'товаров', bookingIntent: 'Хорошо! Нажмите кнопку ниже, чтобы заполнить заявку 👇', q1: 'Есть акции?', q2: 'Какие товары?', q3: 'Часы работы?', q4: 'Пароль WiFi?', q5: 'Номер телефона?', q6: 'Как использовать Alipay / WeChat Pay иностранцу?', q7: 'Как добраться из аэропорта?', q8: 'Как пользоваться DiDi?', q9: 'Можете рекомендовать VPN?', q10: 'Что посмотреть рядом?' },
  };

  const t = I18N[lang] || I18N['中文'];

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    storeApi.getPublicStore(slug)
      .then(s => {
        setStore(s);
        setMessages([{
          role: 'assistant',
          content: `你好 👋 我是「${s.shop_name}」的 AI 客服，上方是本店的完整资料。有什么想了解的，直接问我吧！`,
        }]);
      })
      .catch(() => {
        setMessages([{ role: 'assistant', content: '你好！我是本店的 AI 客服助理，有什么可以帮到你的？' }]);
      })
      .finally(() => setStoreLoading(false));
  }, [slug]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  const BOOKING_KEYWORDS = ['预定', '预约', '订位', '订餐', '下单', '订购', '预订', '想订', '帮我订'];

  const doStream = async (newMessages: Message[]) => {
    // 检测预定/下单意图，直接弹窗无需走 LLM
    const lastUserMsg = newMessages[newMessages.length - 1]?.content || '';
    if (BOOKING_KEYWORDS.some(k => lastUserMsg.includes(k))) {
      setMessages(prev => [...prev, { role: 'assistant', content: t.bookingIntent }]);
      setLoading(false);
      setTimeout(() => setShowBooking(true), 300);
      return;
    }

    const assistantMsg: Message = { role: 'assistant', content: '' };
    setMessages(prev => [...prev, assistantMsg]);
    try {
      const res = await fetch('/chat-api/store-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, messages: newMessages, lang }),
      });
      if (!res.body) throw new Error('无响应');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of decoder.decode(value, { stream: true }).split('\n').filter(Boolean)) {
          try {
            const { text } = JSON.parse(line);
            if (text) { full += text; setMessages(prev => { const u = [...prev]; u[u.length - 1] = { role: 'assistant', content: full }; return u; }); }
          } catch { /* ignore */ }
        }
      }
    } catch {
      setMessages(prev => { const u = [...prev]; u[u.length - 1] = { role: 'assistant', content: '抱歉，网络异常，请稍后再试。' }; return u; });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const newMessages = [...messages, { role: 'user' as const, content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    await doStream(newMessages);
  };

  const sendQuick = async (text: string) => {
    if (loading) return;
    const newMessages = [...messages, { role: 'user' as const, content: text }];
    setMessages(newMessages);
    setLoading(true);
    await doStream(newMessages);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('您的浏览器不支持语音输入'); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = lang === '中文' ? 'zh-CN'
      : lang === 'English' ? 'en-US'
      : lang === '日本語' ? 'ja-JP'
      : lang === '한국어' ? 'ko-KR'
      : lang === 'Français' ? 'fr-FR'
      : lang === 'Español' ? 'es-ES'
      : lang === 'Português' ? 'pt-BR'
      : lang === 'Русский' ? 'ru-RU'
      : 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(prev => (prev ? prev + ' ' : '') + transcript);
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };
  const notes = store?.notes || [];
  const products = (store?.products || []).filter(p => p.is_active);
  const quickReplies = [t.q1, t.q2, t.q3, t.q4, t.q5];
  const foreignerQuickReplies = [t.q6, t.q7, t.q8, t.q9, t.q10];

  return (
    <>
      <style>{clawStyles + chatStyles}</style>
      <div className="chat-page">

        {/* ── 顶部导航 ── */}
        <div className="chat-header">
          <Link href={`/store/${slug}`} className="chat-back-btn"><ArrowLeft size={18} /></Link>
          <div className="chat-header-info">
            <div>
              <div className="chat-store-name">{store?.shop_name || '门店客服'}</div>
              <div className="chat-store-status"><span className="chat-online-dot" />{t.online}</div>
            </div>
          </div>
          <button onClick={() => setShowBooking(true)} className="chat-book-btn">
            <CalendarCheck size={15} /> {t.bookBtn}
          </button>

          {/* 语言选择 */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button onClick={() => setLangOpen(v => !v)} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'none', border: '1.5px solid #E65C46',
              borderRadius: 8, padding: '5px 8px', cursor: 'pointer',
              color: '#E65C46', fontSize: 12, fontWeight: 600,
              fontFamily: "'Manrope', sans-serif", transition: 'all 0.15s',
            }}>
              <Globe size={14} />
            </button>
            {langOpen && (
              <div style={{
                position: 'absolute', right: 0, top: '110%', zIndex: 100,
                background: 'white', borderRadius: 10, boxShadow: '0 4px 20px rgba(42,31,25,0.12)',
                border: '1px solid rgba(42,31,25,0.08)', minWidth: 120, overflow: 'hidden',
              }}>
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => { setLang(l.label); setLangOpen(false); }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '8px 14px', background: lang === l.label ? '#FFF4F2' : 'none',
                      border: 'none', cursor: 'pointer', fontSize: 13,
                      color: lang === l.label ? '#E65C46' : '#2A1F19',
                      fontWeight: lang === l.label ? 700 : 400,
                      fontFamily: "'Manrope', sans-serif",
                    }}>
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── 门店背景资料面板 ── */}
        {!storeLoading && store && (
          <div className="ctx-panel">
            <button className="ctx-toggle" onClick={() => setContextExpanded(v => !v)}>
              <span>📋 {t.storeInfo} · {notes.length} {t.announcements} · {products.length} {t.items}</span>
              {contextExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>

            {contextExpanded && (
              <div className="ctx-body">
                {/* 基本信息行 */}
                <div className="ctx-meta-row">
                  {store.business_hours && <span className="ctx-meta-chip">🕐 {store.business_hours}</span>}
                  {store.address && <span className="ctx-meta-chip">📍 {store.address}</span>}
                  {store.contact_phone && <a href={`tel:${store.contact_phone}`} className="ctx-meta-chip ctx-meta-link">📞 {store.contact_phone}</a>}
                </div>

                {/* Notes */}
                {notes.length > 0 && (
                  <div className="ctx-section">
                    <div className="ctx-section-title">公告 / 优惠 / 活动</div>
                    <div className="ctx-notes">
                      {notes.map(n => {
                        const m = NOTE_META[n.type] || NOTE_META.other;
                        return (
                          <div key={n.id} className="ctx-note-card" style={{ borderLeftColor: m.color }}>
                            <div className="ctx-note-head">
                              <span className="ctx-note-badge" style={{ background: `${m.color}18`, color: m.color }}>{m.emoji} {m.label}</span>
                              {n.title && <span className="ctx-note-title">{n.title}</span>}
                              {n.valid_until && <span className="ctx-note-date">至 {n.valid_until.slice(0, 10)}</span>}
                            </div>
                            <p className="ctx-note-content">{n.content}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 商品 */}
                {products.length > 0 && (
                  <div className="ctx-section">
                    <div className="ctx-section-title">商品 / 菜单</div>
                    <div className="ctx-products">
                      {products.map(p => (
                        <div key={p.id} className="ctx-product-card">
                          {p.image_url
                            ? <img src={p.image_url} alt="" className="ctx-product-img" />
                            : <div className="ctx-product-img ctx-product-img-placeholder">🛒</div>
                          }
                          <div className="ctx-product-name">{p.name}</div>
                          <div className="ctx-product-price">¥{parseFloat(p.price).toFixed(0)}{p.unit ? `/${p.unit}` : ''}</div>
                          {p.stock != null && <div className="ctx-product-stock">余 {p.stock}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── 消息区域 ── */}
        <div className="chat-messages">
          {storeLoading ? (
            <div className="chat-loading"><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /></div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div key={i} className={`chat-bubble-wrap ${msg.role}`}>
                  {msg.role === 'assistant' && <div className="chat-ai-avatar">🦞</div>}
                  <div className={`chat-bubble ${msg.role}`}>
                    {msg.content || (loading && i === messages.length - 1
                      ? <span className="chat-typing"><span /><span /><span /></span>
                      : ''
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* 快捷回复 */}
        {messages.length <= 1 && !loading && (
          <div className="chat-quick-replies">
            {[...quickReplies, ...foreignerQuickReplies].map(q => (
              <button key={q} className="chat-quick-btn" onClick={() => sendQuick(q)}>{q}</button>
            ))}
          </div>
        )}

        {/* 常驻操作栏：预定 / 下单 */}
        {!storeLoading && store && (
          <div className="chat-action-bar">
            <button className="chat-action-btn primary" onClick={() => setShowBooking(true)}>
              <CalendarCheck size={15} /> {t.actionBook}
            </button>
            {products.length > 0 && (
              <button className="chat-action-btn ghost" onClick={() => sendQuick(t.q2)}>
                {t.actionProducts}
              </button>
            )}
            {notes.some(n => n.type === 'discount') && (
              <button className="chat-action-btn ghost" onClick={() => sendQuick(t.q1)}>
                {t.actionDeals}
              </button>
            )}
          </div>
        )}

        {/* ── 输入区域 ── */}
        <div className="chat-input-area">
          <textarea ref={inputRef} className="chat-input" rows={1} value={input}
            onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
            placeholder={t.placeholder} disabled={loading} />
          <button
            className={`chat-voice-btn${listening ? ' listening' : ''}`}
            onClick={listening ? stopVoice : startVoice}
            disabled={loading}
            title={listening ? '停止语音' : '语音输入'}
            type="button"
          >
            {listening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <button className="chat-send-btn" onClick={sendMessage} disabled={!input.trim() || loading}>
            {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={18} />}
          </button>
        </div>

      </div>

      {showBooking && store && (
        <BookingModal store={store} slug={slug} onClose={() => setShowBooking(false)} />
      )}
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
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const addOrderItem = (product?: { id: number; name: string; unit: string | null; price: string }) => {
    setOrderItems(prev => [...prev, { name: product?.name || '', qty: '1', unit: product?.unit || '', price: product ? parseFloat(product.price).toFixed(2) : '', product_id: product?.id }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('');
    const items: BookingItem[] = storeType === 'retail'
      ? orderItems.filter(i => i.name).map(i => ({ name: i.name, qty: parseFloat(i.qty) || 1, unit: i.unit || undefined, price: i.price || undefined, product_id: i.product_id }))
      : [];
    const data: BookingFormData = { customer_name: name, customer_phone: phone, customer_note: note || null, booking_at: bookingAt || null, table_area: tableArea || null, party_size: partySize ? parseInt(partySize) : null, items: items.length > 0 ? items : undefined };
    try {
      const b = await storeApi.createBooking(slug, data);
      setBookingId(b.id); setDone(true);
    } catch (err: any) {
      setError(err.message || '提交失败，请重试');
    } finally { setSaving(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(42,31,25,0.45)', backdropFilter: 'blur(4px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ background: 'white', borderRadius: 18, padding: 32, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(42,31,25,0.2)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
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
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 800, color: '#2A1F19', margin: 0 }}>预定 · {store.shop_name}</h3>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9e8074', padding: 4 }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
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
                    <button type="button" onClick={() => addOrderItem()} style={{ fontSize: 12, color: '#E65C46', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}><Plus size={13} /> 添加</button>
                  </div>
                  {products.length > 0 && orderItems.length === 0 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                      {products.slice(0, 5).map(p => (
                        <button key={p.id} type="button" onClick={() => addOrderItem(p)} style={{ fontSize: 12, padding: '3px 9px', borderRadius: 100, border: '1px solid rgba(230,92,70,0.3)', background: 'white', color: '#E65C46', cursor: 'pointer' }}>+ {p.name}</button>
                      ))}
                    </div>
                  )}
                  {orderItems.map((item, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 5, marginBottom: 5, alignItems: 'center' }}>
                      <input className="claw-input" value={item.name} onChange={e => setOrderItems(prev => prev.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} placeholder="商品名" style={{ fontSize: 13 }} />
                      <input className="claw-input" type="number" min="0" value={item.qty} onChange={e => setOrderItems(prev => prev.map((x, j) => j === i ? { ...x, qty: e.target.value } : x))} placeholder="数量" style={{ fontSize: 13 }} />
                      <input className="claw-input" value={item.unit} onChange={e => setOrderItems(prev => prev.map((x, j) => j === i ? { ...x, unit: e.target.value } : x))} placeholder="单位" style={{ fontSize: 13 }} />
                      <input className="claw-input" value={item.price} onChange={e => setOrderItems(prev => prev.map((x, j) => j === i ? { ...x, price: e.target.value } : x))} placeholder="单价" style={{ fontSize: 13 }} />
                      <button type="button" onClick={() => setOrderItems(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9e8074', padding: 2 }}><Trash2 size={14} /></button>
                    </div>
                  ))}
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

const chatStyles = `
  .chat-page {
    display: flex; flex-direction: column; height: 100dvh;
    background: #F8F2ED; font-family: 'Manrope', sans-serif;
  }
  .chat-header {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 16px; background: white;
    border-bottom: 1px solid rgba(42,31,25,0.08);
    position: sticky; top: 0; z-index: 10; flex-shrink: 0;
  }
  .chat-back-btn {
    display: flex; align-items: center; justify-content: center;
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(42,31,25,0.05); color: #6B5549;
    text-decoration: none; flex-shrink: 0; transition: background 0.15s;
  }
  .chat-back-btn:hover { background: rgba(42,31,25,0.1); }
  .chat-header-info { display: flex; align-items: center; gap: 10px; flex: 1; }
  .chat-avatar { width: 38px; height: 38px; border-radius: 12px; object-fit: cover; flex-shrink: 0; }
  .chat-avatar-placeholder {
    background: #E65C46; display: flex; align-items: center; justify-content: center;
    color: white; font-weight: 800; font-size: 16px;
    font-family: 'Bricolage Grotesque', sans-serif;
  }
  .chat-store-name { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 15px; color: #2A1F19; line-height: 1.2; }
  .chat-store-status { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #9e8074; }
  .chat-online-dot { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; display: inline-block; }
  .chat-book-btn {
    display: flex; align-items: center; gap: 5px;
    background: #E65C46; color: white; border: none; border-radius: 10px;
    padding: 5px 12px; font-size: 13px; font-weight: 700; cursor: pointer;
    font-family: 'Manrope', sans-serif; flex-shrink: 0; transition: background 0.15s;
  }
  .chat-book-btn:hover { background: #d44a35; }

  /* ── 背景资料面板 ── */
  .ctx-panel {
    background: white; border-bottom: 1px solid rgba(42,31,25,0.08);
    flex-shrink: 0; max-height: 50vh; overflow: hidden;
    display: flex; flex-direction: column;
  }
  .ctx-toggle {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 16px; background: none; border: none; cursor: pointer;
    font-size: 12px; font-weight: 700; color: #6B5549;
    font-family: 'Manrope', sans-serif; flex-shrink: 0;
    border-bottom: 1px solid rgba(42,31,25,0.06);
  }
  .ctx-toggle:hover { background: rgba(42,31,25,0.03); }
  .ctx-body { overflow-y: auto; padding: 12px 16px 16px; display: flex; flex-direction: column; gap: 14px; }
  .ctx-meta-row { display: flex; flex-wrap: wrap; gap: 8px; }
  .ctx-meta-chip {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 12px; color: #6B5549; background: rgba(42,31,25,0.05);
    padding: 4px 10px; border-radius: 100px; white-space: nowrap;
  }
  .ctx-meta-link { color: #E65C46; text-decoration: none; }
  .ctx-section-title { font-size: 11px; font-weight: 700; color: #9e8074; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
  .ctx-notes { display: flex; flex-direction: column; gap: 8px; }
  .ctx-note-card {
    border-left: 3px solid #E65C46; background: #F8F2ED;
    border-radius: 0 8px 8px 0; padding: 10px 12px;
  }
  .ctx-note-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 5px; }
  .ctx-note-badge { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 100px; }
  .ctx-note-title { font-size: 13px; font-weight: 700; color: #2A1F19; }
  .ctx-note-date { font-size: 11px; color: #E65C46; font-weight: 600; margin-left: auto; }
  .ctx-note-content { font-size: 13px; color: #2A1F19; margin: 0; line-height: 1.6; white-space: pre-wrap; }
  .ctx-products { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 4px; }
  .ctx-products::-webkit-scrollbar { height: 3px; }
  .ctx-products::-webkit-scrollbar-thumb { background: rgba(42,31,25,0.15); border-radius: 2px; }
  .ctx-product-card {
    flex-shrink: 0; width: 100px; background: #F8F2ED;
    border-radius: 10px; padding: 10px 8px; text-align: center;
    border: 1px solid rgba(42,31,25,0.07);
  }
  .ctx-product-img { width: 56px; height: 56px; border-radius: 8px; object-fit: cover; margin: 0 auto 6px; display: block; }
  .ctx-product-img-placeholder {
    width: 56px; height: 56px; border-radius: 8px; margin: 0 auto 6px;
    background: rgba(230,92,70,0.08); display: flex; align-items: center;
    justify-content: center; font-size: 22px;
  }
  .ctx-product-name { font-size: 12px; font-weight: 700; color: #2A1F19; line-height: 1.3; margin-bottom: 3px; }
  .ctx-product-price { font-size: 13px; font-weight: 800; color: #E65C46; }
  .ctx-product-stock { font-size: 11px; color: #9e8074; margin-top: 2px; }

  /* ── 消息 ── */
  .chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
  .chat-loading { display: flex; align-items: center; justify-content: center; color: #9e8074; padding: 40px 0; }
  .chat-bubble-wrap { display: flex; align-items: flex-end; gap: 8px; }
  .chat-bubble-wrap.user { flex-direction: row-reverse; }
  .chat-ai-avatar { width: 30px; height: 30px; border-radius: 50%; background: white; border: 1.5px solid #E65C46; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
  .chat-bubble { max-width: 72%; padding: 10px 14px; border-radius: 16px; font-size: 14px; line-height: 1.65; white-space: pre-wrap; word-break: break-word; }
  .chat-bubble.assistant { background: white; color: #2A1F19; border-bottom-left-radius: 4px; box-shadow: 0 1px 4px rgba(42,31,25,0.07); }
  .chat-bubble.user { background: #E65C46; color: white; border-bottom-right-radius: 4px; }
  .chat-typing { display: flex; gap: 4px; align-items: center; padding: 2px 0; }
  .chat-typing span { width: 6px; height: 6px; border-radius: 50%; background: #9e8074; animation: typing-bounce 1.2s infinite; }
  .chat-typing span:nth-child(2) { animation-delay: 0.2s; }
  .chat-typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typing-bounce { 0%,60%,100% { transform:translateY(0);opacity:.4 } 30% { transform:translateY(-4px);opacity:1 } }
  .chat-quick-replies { padding: 0 16px 10px; display: flex; gap: 8px; flex-wrap: wrap; flex-shrink: 0; }
  .chat-quick-btn { padding: 6px 14px; border-radius: 100px; border: 1.5px solid rgba(230,92,70,0.35); background: white; color: #E65C46; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Manrope', sans-serif; transition: all 0.12s; }
  .chat-quick-btn:hover { background: #E65C46; color: white; }
  .chat-action-bar { display: flex; gap: 6px; padding: 5px 16px; flex-shrink: 0; flex-wrap: wrap; background: rgba(248,242,237,0.8); border-top: 1px solid rgba(42,31,25,0.06); }
  .chat-action-btn { display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Manrope', sans-serif; transition: all 0.15s; border: none; }
  .chat-action-btn.primary { background: #E65C46; color: white; }
  .chat-action-btn.primary:hover { background: #d44a35; }
  .chat-action-btn.ghost { background: white; color: #6B5549; border: 1.5px solid rgba(42,31,25,0.15); }
  .chat-action-btn.ghost:hover { border-color: #E65C46; color: #E65C46; }
  .chat-input-area { display: flex; align-items: flex-end; gap: 10px; padding: 12px 16px; background: white; border-top: 1px solid rgba(42,31,25,0.07); flex-shrink: 0; }
  .chat-input { flex: 1; resize: none; border: 1.5px solid rgba(42,31,25,0.12); border-radius: 12px; padding: 10px 14px; font-size: 14px; font-family: 'Manrope', sans-serif; color: #2A1F19; background: #F8F2ED; outline: none; transition: border-color 0.15s; line-height: 1.5; max-height: 120px; overflow-y: auto; }
  .chat-input:focus { border-color: #E65C46; }
  .chat-input:disabled { opacity: 0.6; }
  .chat-send-btn { width: 42px; height: 42px; border-radius: 12px; background: #E65C46; border: none; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: background 0.15s, opacity 0.15s; }
  .chat-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .chat-send-btn:not(:disabled):hover { background: #d44a35; }
  .chat-voice-btn { width: 42px; height: 42px; border-radius: 12px; background: rgba(42,31,25,0.07); border: none; color: #6B5549; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: background 0.15s, color 0.15s; }
  .chat-voice-btn:hover { background: rgba(42,31,25,0.13); }
  .chat-voice-btn.listening { background: #E65C46; color: white; animation: pulse-mic 1s ease-in-out infinite; }
  .chat-voice-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  @keyframes pulse-mic { 0%,100% { box-shadow: 0 0 0 0 rgba(230,92,70,0.4); } 50% { box-shadow: 0 0 0 8px rgba(230,92,70,0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
`;
