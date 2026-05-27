# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a full-stack application with **separate backend and frontend** in a monorepo structure:

- **Backend**: Laravel 12 API (PHP 8.4) in `backend/` directory
- **Frontend**: Next.js 16 (React 19.2, TypeScript) in `frontend/` directory

### Authentication Flow
Laravel Sanctum provides token-based authentication. The flow is:
1. Frontend sends credentials to `/api/login` or `/api/register`
2. Backend returns Sanctum token + user object
3. Frontend stores token in localStorage
4. Frontend sends token via `Authorization: Bearer {token}` header for protected routes

**Key Implementation**:
- `AuthProvider` (frontend/lib/auth-context.tsx) manages global auth state
- `useAuth` hook provides auth methods to components
- API client (frontend/lib/api/client.ts) auto-injects tokens

### CORS & Cross-Origin Setup
Backend is configured to accept requests from frontend via:
- `backend/.env`: `SANCTUM_STATEFUL_DOMAINS` specifies allowed origins
- `backend/bootstrap/app.php`: Sanctum middleware prepended to API routes
- Current ports: Backend 8068, Frontend 3111 (both bound to 0.0.0.0 for remote access)

### API Architecture
- Routes defined in `backend/routes/api.php`
- All routes prefixed with `/api`
- Controllers in `backend/app/Http/Controllers/Api/`
- PostController uses route model binding and authorization checks (owner-only operations)

## Development Commands

### Backend (Laravel)
```bash
cd backend

# Start server (remote access)
php artisan serve --host=0.0.0.0 --port=8068

# Database
php artisan migrate              # Run migrations
php artisan migrate:fresh        # Reset database
php artisan db:seed              # Seed data (demo user: demo@example.com / password)

# Testing
php artisan test                 # Run all tests (Pest)
php artisan test --filter=testName  # Run specific test

# Cache
php artisan cache:clear
php artisan config:cache         # Cache config for production
php artisan route:cache          # Cache routes for production

# Utilities
php artisan route:list           # List all routes
php artisan make:controller Api/ExampleController  # New controller
php artisan make:model Example -mf  # Model + migration + factory
```

### Frontend (Next.js)
```bash
cd frontend

# Start dev server (configured for port 3111, remote access)
npm run dev

# Build
npm run build
npm start                        # Production server

# Linting
npm run lint

# Add shadcn/ui components
npx shadcn@latest add [component-name]
```

## File Structure Patterns

### Backend
- **Controllers**: `app/Http/Controllers/Api/` - API endpoints
- **Models**: `app/Models/` - Eloquent models with relationships
- **Routes**: `routes/api.php` - API route definitions
- **Migrations**: `database/migrations/` - Database schema
- **Factories**: `database/factories/` - Test data generation
- **Config**: `bootstrap/app.php` - Middleware, routing, exceptions

### Frontend
- **Pages**: `app/*/page.tsx` - Next.js App Router pages
- **API Layer**: `lib/api/` - HTTP client, type definitions, service methods
- **Auth**: `lib/auth-context.tsx` - Global authentication state
- **UI Components**: `components/ui/` - shadcn/ui components
- **Layout**: `app/layout.tsx` - Root layout with AuthProvider wrapper

## Key Configuration Files

### Backend Environment (backend/.env)
```
APP_URL=http://0.0.0.0:8068
FRONTEND_URL=http://0.0.0.0:3111
SANCTUM_STATEFUL_DOMAINS=localhost:3111,localhost,0.0.0.0:3111,0.0.0.0
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=clawmartcn
DB_USERNAME=clawmartcn

# LLM (开店助手 industry/name/functions/hasAccount 兜底用)
DEEPSEEK_API_KEY2=sk-...        # 注意末尾的 "2"，services.deepseek.api_key 读这个
DEEPSEEK_MODEL=deepseek-chat
# 可选：行业方案生成（IndustryGeneratorService）用 Claude
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-haiku-4-5-20251001
```

### Frontend Environment (frontend/.env.local)
```
NEXT_PUBLIC_API_URL=http://0.0.0.0:8068/api

# /api/store-chat（newListing 智能填写商品）用，**注意是 DEEPSEEK_API_KEY 不带 2**
DEEPSEEK_API_KEY=sk-...
```

**重要：两套 Deepseek key 命名差一个字符**：后端 `DEEPSEEK_API_KEY2`（有 2），前端 `DEEPSEEK_API_KEY`（无 2）。它们各自独立，互不影响。

### 生产端口（经 nginx 反代）
开发约定 8068/3111 写在文档里，但**生产环境**实际跑在：
- Laravel：`127.0.0.1:8072`（PM2 进程名 `clawmart-cn-backend`，id 6）
- Next.js：`127.0.0.1:3113`（PM2 进程名 `clawmart-cn-frontend`，id 7）
- nginx `cn.clawmart.cn` / `www.clawmart.cn` → 上面两个端口
- 配置文件：`/etc/nginx/sites-enabled/{cn,www}.clawmart.cn`

### PM2 生产进程管理（重要）
生产前后端都由 **PM2** 守护。**不要直接 `npm start` / `php artisan serve`**——会跟 PM2 抢同一端口，启动悄悄失败。

发布流程：
```bash
# 前端：build 完 pm2 restart（PM2 会读取新的 .next/）
cd frontend && npm run build && pm2 restart clawmart-cn-frontend

# 后端
pm2 restart clawmart-cn-backend
```

常用命令：
- `pm2 list` — 所有进程总览
- `pm2 logs clawmart-cn-frontend --lines 100` — 实时日志
- `pm2 describe clawmart-cn-frontend | grep -E 'status|uptime|restarts|exec cwd'` — 状态摘要

**陷阱**：`kill <next-server-pid>` 停不掉服务，PM2 会立刻拉起新进程，旧 manifest 继续被服务。要真停得 `pm2 stop`；要替换要 `pm2 restart`。

## Common Development Tasks

### Adding a New API Endpoint
1. Create controller method in `backend/app/Http/Controllers/Api/`
2. Add route in `backend/routes/api.php`
3. Add TypeScript types in `frontend/lib/api/types.ts`
4. Add API method in `frontend/lib/api/` service file
5. Use in components via API client

### Adding a New Model with CRUD
```bash
cd backend
php artisan make:model Example -mfc  # Model + migration + factory + controller
# Edit migration, model relationships, factory
php artisan migrate
# Add routes to routes/api.php
# Create corresponding TypeScript types and API methods in frontend
```

### Adding a New Page
1. Create `frontend/app/[pagename]/page.tsx`
2. Use `'use client'` directive if using hooks or interactivity
3. Import `useAuth` from `@/lib/auth-context` for auth state
4. Import `ClawNav`, `ClawFooter`, `clawStyles` from `@/components/claw-layout` for consistent UI
5. Wrap page with `<style>{clawStyles}</style>` and `<div className="claw-page">` as root
6. **Never write a custom navbar or footer** — always use `<ClawNav />` and `<ClawFooter />`
7. For protected pages, redirect to `/login` if `!isAuthenticated` after loading

### Working with Database
```bash
# Reset and seed (development only)
cd backend
php artisan migrate:fresh --seed

# Interactive testing
php artisan tinker
# >>> User::factory(5)->create();
# >>> Post::factory(10)->create();
```

## Testing Approach

### Backend (Pest)
- Tests in `backend/tests/Feature/` and `backend/tests/Unit/`
- Use factories for model creation
- Test structure: `it('description', function() { ... })`
- Run specific file: `php artisan test tests/Feature/ExampleTest.php`

### API Testing with cURL
```bash
# Login
curl -X POST http://0.0.0.0:8068/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password"}'

# Create post (replace TOKEN)
curl -X POST http://0.0.0.0:8068/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Test","content":"Content","published":true}'
```

## Important Laravel 12 Patterns

### Middleware Registration
Use `bootstrap/app.php` instead of `app/Http/Kernel.php` (removed in Laravel 11+):
```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->api(prepend: [
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    ]);
})
```

### Model Casts
Prefer `casts()` method over `$casts` property:
```php
protected function casts(): array {
    return ['published' => 'boolean'];
}
```

### Authorization
PostController implements owner-only operations by checking `$post->user_id !== $request->user()->id`

### Seller-only endpoints
Use a private `requireSeller(Request $request)` helper that calls `abort(403)` if `!$request->user()->is_seller`. See `ListingController` for reference pattern.

### Slug generation
`ListingController` has a private `uniqueSlug(string $name, ?int $excludeId)` helper using `Str::slug()` with a numeric suffix loop to ensure uniqueness. Reuse this pattern for any model needing unique slugs.

## Frontend Design System (ClawHub Style)

The frontend follows the **clawhub.ai** design aesthetic — warm, organic, modern. All pages must adhere to this system.

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| Background | `#F8F2ED` | Page background (warm cream) |
| Text primary | `#2A1F19` | Headings, body text |
| Text secondary | `#6B5549` | Subtitles, descriptions |
| Text muted | `#9e8074` | Meta info, labels, placeholders |
| Accent / CTA | `#E65C46` | Buttons, links, highlights, accent spans |
| Card background | `#FFFFFF` | Cards, modals, inputs |
| Muted section bg | `rgba(240, 232, 225, 0.5)` | Alternating sections |
| Footer background | `#F0E8E1` | Footer area |
| Border | `rgba(42, 31, 25, 0.1)` | Dividers, card borders, input borders |

### Typography
- **Display/Heading font**: `Bricolage Grotesque` (weights 600–800)
- **Body font**: `Manrope` (weights 400–700)
- Loaded via Google Fonts in `clawStyles` string
- `font-family: 'Manrope', 'Bricolage Grotesque', sans-serif` on `.claw-page`

### Shared Layout Components (`frontend/components/claw-layout.tsx`)
- `<ClawNav />` — sticky navbar with logo, nav links, and **user dropdown** (Dashboard / 我的购买 / 我的设置 / Start Selling / 退出登录). Always use this, never write a custom navbar.
- `<ClawFooter />` — 4-column footer with links and social links
- `clawStyles` — CSS string containing all shared utility classes (import with `<style>{clawStyles}</style>`)

**ClawNav dropdown behaviour**: when logged in, shows avatar + name button. Dropdown includes Dashboard link, purchases, settings, "Start Selling" (hidden once user is a seller), and logout.

### Utility CSS Classes (from `clawStyles`)
| Class | Purpose |
|-------|---------|
| `.claw-page` | Root page wrapper (sets font, bg, min-height) |
| `.claw-container` | Max-width 1200px centered container |
| `.claw-section` | Section with padding 56px 24px, max-width 1200px |
| `.claw-label` | Coral pill label for section tags |
| `.claw-h1` | Display heading (52px, 800 weight, Bricolage) |
| `.claw-h2` | Section heading (32px, 700 weight, Bricolage) |
| `.claw-lead` | Lead paragraph (17px, secondary color) |
| `.claw-body` | Body paragraph (15px, secondary color) |
| `.claw-btn-primary` | Coral filled button (`#E65C46`) |
| `.claw-btn-ghost` | White outlined button |
| `.claw-card` | White rounded card with border and shadow |
| `.claw-card-hover` | Adds hover lift animation to cards |
| `.claw-divider` | `<hr>` section divider |
| `.claw-step-num` | Numbered circle for step lists |
| `.claw-input` | Styled form input |
| `.claw-textarea` | Styled form textarea |
| `.claw-form-label` | Form field label |
| `.claw-chip` | Pill-shaped selectable tag |
| `.claw-skeleton` | Loading shimmer animation |
| `.claw-accordion` | Accordion container |
| `.claw-accordion-btn` | Accordion toggle button |
| `.claw-accordion-body` | Accordion content area |
| `.claw-highlight-box` | Left-bordered callout box (coral accent) |
| `.claw-accent` | Inline coral color span |

### Page Template
```tsx
'use client';
import { ClawNav, ClawFooter, clawStyles } from "@/components/claw-layout";

export default function MyPage() {
  return (
    <>
      <style>{clawStyles}</style>
      <div className="claw-page">
        <ClawNav />
        <main>
          <section style={{ padding: '72px 24px', maxWidth: 1200, margin: '0 auto' }}>
            <div className="claw-label">Section Label</div>
            <h1 className="claw-h1">Page <span className="claw-accent">Title</span></h1>
            <p className="claw-lead">Lead description text.</p>
          </section>
          <hr className="claw-divider" />
          {/* More sections... */}
        </main>
        <ClawFooter />
      </div>
    </>
  );
}
```

### Design Rules
- **Never** use Tailwind `bg-background`, `text-foreground`, `text-muted-foreground` etc. on new pages — use inline styles or claw classes instead
- Alternate sections: white bg vs `.claw-muted-section` (rgba warm tint)
- Always use `<hr className="claw-divider" />` between major sections
- Headings use `fontFamily: "'Bricolage Grotesque', sans-serif"` when set inline
- Cards have `borderRadius: 14px`, white background, `border: 1px solid rgba(42,31,25,0.07)`
- CTA buttons always use `#E65C46` coral red as primary color

## Business Domain: CLAW MART

This is an **AI skill marketplace** (AI 技能集市). Key concepts:

- **Listing** — an AI agent/skill/prompt pack sold on the platform. Has name, slug, price, description, category, status, user_id (seller).
- **Purchase** — a user acquiring a listing. Free listings (price=0) are acquired immediately on click. Paid listings need a payment flow (not yet implemented).
- **Seller** — a user with `is_seller=true`. Can create/edit/delete their own listings via Dashboard → 我的销售.
- **Install page** — after purchasing, users go to `/install/[slug]` which shows two modes: "已有 OpenClaw" (Skill ID + ZIP download) and "帮我安装" (managed install service via sourcing request).

### Core User Flows
1. Browse listings (`/`) → click listing (`/listings/[slug]`) → free acquire → dashboard purchases
2. Purchased items in Dashboard → click → `/install/[slug]` (install instructions)
3. Register → Dashboard → Start Selling → become seller → upload listings → 我的销售 manage
4. Settings: avatar URL, nickname, website URL, bio

### Key Models & Relationships
- `User` hasMany `Purchase`, hasMany `Listing` (as seller)
- `Listing` belongsTo `User` (seller), hasMany `Purchase`
- `Purchase` belongsTo `User`, belongsTo `Listing`; unique on (user_id, listing_id)

### User Fields (beyond standard)
`avatar_url`, `website_url`, `bio`, `is_seller` (boolean, default false)

### Listing Fields
`user_id` (nullable, seller), `name`, `slug` (unique), `price` (decimal), `description`, `image_url`, `status` (available/draft/sold), `category`

### All listings default to price = 0 (free)
When creating new listings via seed or seller dashboard, default price is 0.

### Seeder note
`ListingSeeder` uses `Listing::query()->delete()` (not `truncate()`) to avoid FK constraint errors with the purchases table.

### Protected API routes (auth:sanctum)
- `GET /api/purchases` — user's purchase list (with listing)
- `POST /api/purchases` — acquire free listing (`listing_id`)
- `GET /api/purchases/check/{listingId}` — check ownership
- `GET /api/my-listings` — seller's own listings
- `POST /api/listings` — create listing (seller only)
- `PUT /api/listings/{id}` — update own listing
- `DELETE /api/listings/{id}` — delete own listing
- `PUT /api/profile` — update profile fields
- `POST /api/become-seller` — set is_seller=true

### Public LLM endpoints — 首页开店助手 (throttle:20,1, Cache 24h)
- `POST /api/onboarding/classify-industry` — body `{text}` → `{industry, confidence, reason}`，6 个枚举 + `unknown` + `其他`
- `POST /api/onboarding/validate` — body `{step: "name"|"functions"|"hasAccount", text}` → `{valid, reason, data}`
  - `step=name`：判是否像合理店铺名
  - `step=functions`：解析想要的功能集合，`data.matched: string[]`
  - `step=hasAccount`：判断有无账号，`data.has_account: boolean`

**前端入口**：`storeApi.classifyIndustry(text)` 和 `storeApi.validateOnboarding(step, text)`（见 `frontend/lib/api/store.ts`）。在 `frontend/app/page.tsx` 的 `handleChatInput` 和 `handleNameSubmit` 里调用，按钮路径**不**调 LLM，仅自由文本输入触发。异常一律静默降级到旧行为，不弹错误。

## 开店助手聊天面板（首页 `app/page.tsx`）

首页有一个浮动入口（🦞 Clawmart 开店助手），点开是固定全屏 modal 的聊天对话。这是新用户首次开店的引导入口，也是已登录卖家的快捷管理面板。**所有改动都集中在 `frontend/app/page.tsx`**，不要拆出独立组件——状态依赖很重。

### Step 状态机
全部状态写在 `OnboardingStep` union type 上：
- 未登录引导：`industry` → `name` → `functions` → `hasAccount` → `register` / `login`
- 登录后管理：`manage`（主菜单）/ `newListing`（上架表单）/ `viewListings`（商品库存）/ `viewBookings`（订单列表）

### 主菜单按钮（`step === 'manage'`）
- **卖家** (`user.is_seller === true`)：上架新商品 · 商品及库存 · 经营报表 · 使用说明 · 预定和订单
- **非卖家**：「激活卖家权限（免费）」大按钮 + 经营报表 · 使用说明 小按钮

### 经营报表 弹出菜单（重要）
**这不是 step 切换，是悬浮 dropdown**：
- 触发按钮右侧带 7×1px 三横线浅灰图标 `rgba(42,31,25,0.3)`，作为可展开的视觉提示
- 状态：`const [showReportMenu, setShowReportMenu] = useState(false)` + `reportMenuRef`
- 弹层 `position: absolute; bottom: calc(100% + 6px)`，从按钮**上方**升起
- 锚定容器：`<div ref={reportMenuRef} style={{ position: 'relative', flex: 1 }}>`
- `useEffect` 监听 `mousedown` / `touchstart`，点击容器外自动关闭
- 选项点击 → `setShowReportMenu(false)` + 调对应 `handleReport*` → 报表以多条气泡推入聊天，**step 保持 `manage`**

报表选项集中定义在 `reportItems: { label, fn }[]` 数组里。新增 / 调整顺序只改这一处。

### 报表 Handlers 模式
4 个独立函数：`handleReportProducts` / `handleReportStock` / `handleReportBookings` / `handleReportNotes`。统一套路：
1. push 用户气泡（如 `"商品概览"`）
2. `setWaitingUser(false)` + `setTyping(true)`
3. `await storeApi.getMyProducts / getMyBookings / getMyNotes`
4. 本地聚合（按 `is_active` / `stock` / `status` / `type` 分桶，近 7 天用 `Date.now() - 7 * 24 * 3600 * 1000`）
5. `pushSequence([...lines])` 推 3–4 条 AI 气泡
6. `catch` 静默降级，`pushAI` 一句友好错误

### 按钮文字设计规则
**聊天面板内所有按钮 label 不带左侧 emoji logo**。保留 `←` 返回 / `✕` 取消 等功能性 unicode 符号。订单卡片里 `📦 商品×数量` 这类**内容性** emoji 不算按钮装饰，保留。

新增按钮时遵守此规则；如果按钮点击后还会 push 一条 user 气泡镜像按钮文字（让聊天里"看起来像用户说了一句话"），气泡文字也得跟按钮 label 一致（同样不带 emoji）。

## LLM 集成模式

后端有两套 LLM 通道（`config/services.php`）：
- `services.anthropic` — `IndustryGeneratorService::callClaude()`（行业方案生成用）
- `services.deepseek` — `IndustryGeneratorService::callDeepSeek()`（开店助手兜底用）

**新增需调 LLM 的端点时的标准模式**：
1. 业务 Service 注入 `IndustryGeneratorService`，调 `callDeepSeek($prompt)` 或 `callClaude($prompt)` —— **不要自己写 HTTP 客户端**
2. 在 Service 入口检查 `empty(config('services.deepseek.api_key'))` → 直接返回 fallback 结构，不抛异常
3. 用 `try/catch (Throwable)` 包住 LLM 调用，失败时 `Log::warning` 并返回 fallback —— 用户永远不该看到 500
4. JSON 解析用与 `IndustryClassifierService::parseJson()` 类似的清理（去 markdown 包裹 + regex 提取 `{...}` + `json_decode`）
5. Controller 用 `Cache::remember('prefix:'.md5($text), 24h, fn() => ...)` 包一层，相同输入 24h 内不重复调用
6. 路由加 `->middleware('throttle:20,1')` —— 公开端点防滥用

参考实现：`IndustryClassifierService.php`、`OnboardingValidatorService.php`、`OnboardingController.php`。

**前端 LLM 化的设计原则**：
- 按钮 / chips / 二选 → 直接推进，**不调 LLM**（省钱、即时）
- 自由文本输入 → 调 LLM 校验或解析
- LLM 判 `invalid` → 复读问题，**停留在当前步骤**，不推进
- 异常 / 网络断 → 静默降级到原有"接受原文"的行为，不弹错误对话框

## 行业方案 Listing 模版

`行业方案` 是平台的高价值品类（category: `行业方案`），每个 listing 代表针对某一行业的**完整 AI 解决方案套件**，而非单个技能包。

### 已有方案
- **生鲜门店 AI 店长助手**（slug: `fresh-market-ai-manager`，¥299）— 生鲜连锁门店全链路经营系统

### 新增行业方案 Listing 的规范

**定价**：¥199–¥999（视方案复杂度），不设免费

**description 结构**（参考生鲜方案格式）：
```
第一段：一句话定位（为XX行业打造的XX系统，核心价值主张）

第二段：核心理念或设计原则（可选，2–3句）

第三段：功能模块列表，格式：
① 模块名（核心功能描述）
② 模块名（核心功能描述）
...

最后一行：适用场景（适用于XX类型的客户/企业）
```

**demo_messages 规范**：
- 4–6 条对话，展示核心业务场景
- 第一条必须是 `user` 发起，模拟真实员工/用户的碎片化输入（口语化、不完整）
- AI 回复要体现：① 确认收到 ② 数据分析 ③ 行动建议 三段结构
- 使用 emoji 分隔三段（✅ 📊 💡）

**示例（生鲜方案 demo_messages）**：
```php
'demo_messages' => [
    ['type' => 'user', 'text' => '胡萝卜今天下午3点就卖完了'],
    ['type' => 'ai',   'text' => "✅ 已记录：胡萝卜 今日15:00 售罄\n\n📊 AI 分析：\n胡萝卜本周已连续3天提前售罄，今日较昨日提前2小时。\n\n💡 建议：\n明日进货量建议从 50斤 → 70斤（+40%）\n是否立即发送进货调整建议给采购？"],
    ['type' => 'user', 'text' => '好的，发给采购'],
    ['type' => 'ai',   'text' => "✅ 已通知采购小王\n📋 明日胡萝卜调整进货单已发送\n\n另：西红柿昨日剩余15斤，今日已是第2天，建议触发8折清货促销，是否确认执行？"],
],
```

### 行业方案前端 Tab 过滤规则
- `industry === 'industry'` 时，直接用 `params.category = '行业方案'` 传给后端，**不做客户端关键词过滤**
- 与 `AI 角色` tab 的处理方式相同（都是精确 category 匹配）
- 新增其他精确 category tab 时，在 `fetchListings` 的条件里补充对应的 `industry value`

### 未来可扩展的行业方案方向
- 餐饮连锁 AI 运营助手
- 医疗诊所 AI 助理系统
- 教育机构 AI 管理中台
- 物流仓储 AI 调度系统

## Technology Versions

- Laravel 13.8.0, PHP 8.4.1, Sanctum 4.x, Pest 4.4+, Filament 5.6.3, Livewire 4.x
- Next.js 16.0.5, React 19.2.0, TypeScript 5.x, Tailwind CSS 4.x
- Database: PostgreSQL（生产和开发均使用 pgsql，数据库名 clawmartcn）

## Troubleshooting

### CORS Issues
- Verify both servers are running on correct ports
- Check `SANCTUM_STATEFUL_DOMAINS` in backend/.env includes frontend URL
- Clear browser cache and localStorage

### Authentication Issues
- Clear localStorage: `localStorage.clear()` in browser console
- Verify `NEXT_PUBLIC_API_URL` in frontend/.env.local matches backend
- Check token is being sent: inspect Network tab in DevTools

### Port Conflicts
Dev convention: backend 8068, frontend 3111。**生产实际为 8072 + 3113**（见上面"生产端口"）。修改：
- Backend: `backend/.env` APP_URL and serve command
- Frontend: `frontend/package.json` dev script and `.env.local`
- 改生产端口时记得同步 `/etc/nginx/sites-enabled/{cn,www}.clawmart.cn` 的 `proxy_pass`

### LLM 兜底返回 `fallback: no api key`
- 检查 `backend/.env` 里 `DEEPSEEK_API_KEY2`（**带 2**）是否填了
- 改完跑 `php artisan config:clear`（Laravel 默认不缓存 config，但有时 opcache 会卡）
- 直接 curl 验证：`curl -X POST http://127.0.0.1:8072/api/onboarding/classify-industry -H 'Content-Type: application/json' -d '{"text":"我开烧烤店"}'`

### 前端没用新 build / 旧行为复现
- Next.js 生产模式（PM2 → `next start`）**不热重载**，build 完必须 `pm2 restart clawmart-cn-frontend`
- 别 `kill -9` 直接打 next-server pid —— PM2 会立刻把新进程拉起来，旧 manifest 照样在用；只有 `pm2 restart` / `pm2 stop` 有效
- 自己手敲 `npm start` 启服务会**悄悄失败**（端口被 PM2 占用 → exit code 非 0，但终端日志容易被忽略）。改完代码就走 `npm run build && pm2 restart …`
- 浏览器可能缓存了旧 chunk → 用户硬刷（Ctrl+F5 / ⌘+Shift+R）
- 验证当前 next-server 跑的是哪份代码：`readlink /proc/<pid>/cwd` 和 `stat -c %y /proc/<pid>`
- 验证 PM2 是否正确重启：`pm2 describe clawmart-cn-frontend | grep -E 'status|uptime|restarts'`
