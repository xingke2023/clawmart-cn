const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8068/api';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_MODEL = 'deepseek-chat';

export async function POST(request: Request) {
  const body = await request.json();
  const { slug, messages } = body as {
    slug: string;
    messages: { role: 'user' | 'assistant'; content: string }[];
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

  const systemPrompt = buildSystemPrompt(storeData);

  // 调用 DeepSeek（OpenAI 兼容格式）
  const dsRes = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
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

function buildSystemPrompt(store: any): string {
  if (!store) {
    return `你是一位门店 AI 助理。请友好地回答顾客的咨询，如果顾客想要预定，请让他们点击页面上的"立即预定"按钮。`;
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

  return `你是「${name}」的 AI 智能客服助理。你的职责是：
1. 用简洁友好的中文回答顾客对本门店的一切咨询
2. 主动推荐适合顾客需求的商品/服务
3. 当顾客想要预定时，引导他们点击页面右上角的「立即预定」按钮

---

【门店基本信息】
名称：${name}
类型：${storeType || '综合门店'}
${desc ? `简介：${desc}` : ''}
${address ? `地址：${address}` : ''}
${hours ? `营业时间：${hours}` : ''}
${phone ? `联系电话：${phone}` : ''}
${email ? `联系邮箱：${email}` : ''}
${tags ? `标签：${tags}` : ''}

---

【最新公告 / 优惠】
${notesText}

---

【商品 / 菜单】
${productsText}

---

注意：
- 只回答与本门店相关的问题
- 如果顾客询问门店范围外的内容，礼貌地说明你只负责本门店的咨询
- 回答简洁，通常不超过 150 字，除非顾客需要详细说明
- 不要编造门店没有的信息`;
}
