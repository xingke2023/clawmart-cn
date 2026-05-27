import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  const body = await request.json();
  const { idea, audience, features } = body;

  if (!idea) {
    return new Response(JSON.stringify({ error: '请提供技能描述' }), { status: 400 });
  }

  const prompt = `你是一位 AI 技能集市的产品专家，帮助卖家创建高质量的 AI 技能 listing。

用户想要创建的 AI 技能：
- 核心想法：${idea}
${audience ? `- 目标用户：${audience}` : ''}
${features ? `- 主要功能/特点：${features}` : ''}

请生成一个完整的技能 listing，以 JSON 格式返回，包含以下字段：

{
  "name": "技能名称（简洁有力，15字以内）",
  "category": "分类（从以下选择：AI 角色、营销、工程、设计、行业方案、其他）",
  "price": 数字（0=免费，或 9/19/29/49/99/199/299 中选择合适的价格）,
  "description": "详细描述（200-400字，包含：一句话定位、核心功能列表用①②③格式、适用场景）",
  "demo_messages": [
    {"type": "user", "text": "用户口语化的碎片输入"},
    {"type": "ai", "text": "✅ 确认收到\n\n📊 分析内容\n\n💡 行动建议"},
    {"type": "user", "text": "用户跟进"},
    {"type": "ai", "text": "继续对话"}
  ]
}

只返回 JSON，不要其他文字。demo_messages 要体现真实使用场景，AI 回复要专业且有价值。`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const messageStream = await client.messages.stream({
        model: 'claude-opus-4-6',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
        thinking: { type: 'adaptive' },
      });

      for await (const event of messageStream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          const chunk = JSON.stringify({ text: event.delta.text }) + '\n';
          controller.enqueue(encoder.encode(chunk));
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
