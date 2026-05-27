const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8068/api';
const LLM_API_KEY = process.env.FIDELITY_API_KEY || process.env.DEEPSEEK_API_KEY;
const LLM_API_BASE = process.env.FIDELITY_API_BASE || 'https://api.deepseek.com';
const LLM_MODEL = process.env.FIDELITY_API_BASE ? 'gemini-3-flash-preview' : 'deepseek-chat';

export async function POST(request: Request) {
  const body = await request.json();
  const { slug, messages, lang } = body as {
    slug: string;
    messages: { role: 'user' | 'assistant'; content: string }[];
    lang?: string;
  };

  if (!slug || !messages?.length) {
    return new Response(JSON.stringify({ error: '参数缺失' }), { status: 400 });
  }

  // 从后端拉取门店公开数据
  let storeData: any = null;
  try {
    const res = await fetch(`${BACKEND_URL}/public/store/${slug}`);
    if (res.ok) storeData = await res.json();
  } catch { /* 允许继续 */ }

  const systemPrompt = buildSystemPrompt(storeData, lang);

  // 调用 LLM（OpenAI 兼容格式）
  const dsRes = await fetch(`${LLM_API_BASE}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      stream: true,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    }),
  });

  if (!dsRes.ok || !dsRes.body) {
    const err = await dsRes.text();
    return new Response(JSON.stringify({ error: err }), { status: 502 });
  }

  // 转发 SSE 流，统一成 { text } JSON lines 格式（与前端约定一致）
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const reader = dsRes.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const data = trimmed.slice(5).trim();
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const text = parsed.choices?.[0]?.delta?.content;
            if (text) {
              controller.enqueue(encoder.encode(JSON.stringify({ text }) + '\n'));
            }
          } catch { /* ignore malformed */ }
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}

function buildSystemPrompt(store: any, lang?: string): string {
  const langInstruction = lang && lang !== '中文'
    ? `\n\n【语言要求】你必须全程使用「${lang}」回复顾客，包括所有问候语、说明、引导语等，不得使用中文。`
    : '';

  if (!store) {
    return `你是一位门店 AI 助理。请友好地回答顾客的咨询，如果顾客想要预定，请让他们点击页面上的"立即预定"按钮。${langInstruction}`;
  }

  const name = store.shop_name || '本店';
  const desc = store.shop_description || '';
  const address = store.address || '';
  const hours = store.business_hours || '';
  const phone = store.contact_phone || '';
  const email = store.contact_email || '';
  const tags = (store.tags || []).join('、');
  const storeType = ({ restaurant: '餐厅', retail: '零售店', hotel: '酒店' } as Record<string, string>)[store.store_type] || '';

  const noteTypeMap: Record<string, string> = {
    discount: '优惠折扣', announcement: '公告', inventory: '库存', event: '活动', other: '其他',
  };
  const notes: any[] = store.notes || [];
  const notesText = notes.length
    ? notes.map((n: any) => {
        const type = noteTypeMap[n.type] || n.type;
        const title = n.title ? `【${n.title}】` : '';
        const valid = n.valid_until ? `（有效期至 ${n.valid_until.slice(0, 10)}）` : '';
        return `- [${type}] ${title}${n.content}${valid}`;
      }).join('\n')
    : '暂无';

  const products: any[] = store.products || [];
  const productsText = products.length
    ? products.map((p: any) => {
        const price = parseFloat(p.price) === 0 ? '免费' : `¥${parseFloat(p.price).toFixed(0)}`;
        const stock = p.stock != null ? `（库存 ${p.stock}${p.unit || ''}）` : '';
        const d = p.description ? ` — ${p.description}` : '';
        return `- ${p.name}：${price}${stock}${d}`;
      }).join('\n')
    : '暂无';

  return `你是「${name}」的专属 AI 客服。你的知识库**仅限**以下本店资料，不得使用任何外部知识回答问题。

【严格限制】
- 你只能根据下方"本店资料"中的内容回答顾客
- 如果顾客问的内容在本店资料中找不到，必须回答："这个我暂时没有相关资料，请直接联系店家了解。"
- 严禁编造、猜测、引用任何本店资料之外的信息
- 严禁回答与本店无关的任何话题（如天气、新闻、其他商家、通用知识等）
- 当顾客想预定时，引导他们点击页面右上角的「立即预定」按钮

---

【本店资料 — 基本信息】
名称：${name}
类型：${storeType || '综合门店'}
${desc ? `简介：${desc}` : ''}
${address ? `地址：${address}` : ''}
${hours ? `营业时间：${hours}` : ''}
${phone ? `联系电话：${phone}` : ''}
${email ? `联系邮箱：${email}` : ''}
${tags ? `标签：${tags}` : ''}

---

【本店资料 — 公告 / 优惠 / 折扣 / 活动】
${notesText}

---

【本店资料 — 商品 / 菜单 / 服务】
${productsText}

---

---

【外国人在华通用知识库】（仅在顾客问到相关问题时使用，不得主动提及）

**支付**
- 支付宝（Alipay）国际版支持绑定境外 Visa/Mastercard，开通"国际用户收款"后可扫码支付；微信支付同样支持境外银行卡绑定，需在 WeChat → Me → Pay → Wallet 完成实名认证。
- 部分小商家仅支持国内支付，建议外宾备用现金或提前充值支付宝/微信余额。

**打车 / 交通**
- 滴滴（DiDi）App 支持英文界面，境外手机号可注册；在城市内可直接叫车，支持国际信用卡支付。
- 高铁/地铁购票：12306 App 支持境外护照购票；地铁站一般可用现金或绑卡自助购票。
- 从机场可乘机场大巴、地铁或出租车，具体路线请告知出发地，AI 会根据门店地址给出建议。

**网络 / VPN**
- 中国大陆屏蔽 Google、WhatsApp、Instagram 等境外服务；建议在入境前下载好 VPN（如 ExpressVPN、NordVPN）并完成配置，入境后无法在国内应用商店下载。
- 部分酒店和高档商场提供免费 WiFi，信号较好。

**其他常见问题**
- 外国人可凭护照在中国大陆乘火车、住酒店（须实名登记）。
- 叫外卖可通过美团（Meituan）或饿了么（Eleme）App，支持英文版，均可绑定国际卡。
- 购物退税：单笔消费满 500 元可在指定退税商店申请离境退税（VAT refund）。

---

回答要求：简洁友好，通常不超过 150 字。如资料中有相关内容，直接引用原始数据（价格、时间、折扣等），不要模糊表述。对于外国人常见问题，优先用上方通用知识库作答，并结合本店实际情况补充。${langInstruction}`;
}
