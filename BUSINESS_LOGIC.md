# Claw Mart 核心业务逻辑分析

> 分析日期：2026-04-17

---

## 一、开店逻辑

**流程：**
1. 普通用户注册后，`is_seller = false`
2. 点击"Start Selling" → 调用 `POST /api/become-seller` → 后端将 `is_seller` 置为 `true`，同时**自动创建 `StoreProfile`**（店铺档案，含 shop_name、slug）
3. 首次进入 `GET /api/my-store` 时，如果 StoreProfile 不存在，会**再次自动创建**（兜底）
4. 卖家在 Dashboard → 我的店铺 中完善：店名、简介、Logo、联系方式、地址、营业时间、标签、`is_public`（是否公开）

**关键文件：**
- `backend/app/Http/Controllers/Api/AuthController.php` → `becomeSeller()`
- `backend/app/Http/Controllers/Api/StoreController.php` → `myStore()`
- `backend/app/Models/User.php` → `is_seller` 字段
- `backend/app/Models/StoreProfile.php`

**关键模型：** `User.is_seller` + `StoreProfile`（一对一）

---

## 二、商品上架逻辑

### 1. Listing（AI 技能包）

**流程：**
- 卖家调用 `POST /api/listings` 创建，需填：名称、价格、描述、分类、图片、状态（`available / draft / sold`）
- slug 自动由名称生成，重复则加数字后缀（`uniqueSlug()` 方法）
- 只有 `status = available` 的 listing 才在公开市场展示
- 卖家通过 `PUT /api/listings/{id}` 编辑，`DELETE /api/listings/{id}` 删除

**关键文件：**
- `backend/app/Http/Controllers/Api/ListingController.php`
- `backend/app/Models/Listing.php`
- `frontend/app/dashboard/page.tsx` → 我的销售模块

### 2. StoreProduct（实体商品 / 菜单）

**流程：**
- 卖家调用 `POST /api/my-store/products` 创建，需填：名称、价格、库存、单位、描述、图片、`is_active`、排序
- `is_active = false` 则不在公开店铺页展示
- 适合餐厅菜单、零售商品等实体场景

**关键文件：**
- `backend/app/Http/Controllers/Api/StoreController.php` → `storeProduct()` / `updateProduct()` / `destroyProduct()`
- `backend/app/Models/StoreProduct.php`

---

## 三、客户预定逻辑

**预定（Booking）是无需登录的公开接口：**

**流程：**
1. 客户访问公开店铺页 `/stores/[slug]`
2. 填写：姓名、电话、备注、预定时间
   - 餐厅型：还可填桌区（`table_area`）、人数（`party_size`）
   - 零售 / 服务型：可填商品明细列表（`items`: 名称 + 数量 + 单价）
3. 提交 → `POST /api/public/store/{slug}/bookings` → 后端创建 `StoreBooking`，状态默认 `pending`
4. 卖家在 Dashboard → 我的预定 中查看列表，可将状态流转

**状态流转：**
```
pending → confirmed → in_progress → completed
                    ↘ cancelled
```

**关键文件：**
- `backend/app/Http/Controllers/Api/StoreController.php` → `createBooking()` / `myBookings()` / `updateBookingStatus()`
- `backend/app/Models/StoreBooking.php`
- `frontend/app/stores/[slug]/page.tsx` → 公开店铺页（客户端）

---

## 总结对比

| 维度 | Listing 技能包 | StoreProduct 商品 | StoreBooking 预定 |
|------|--------------|----------------|--------------------|
| 谁创建 | 卖家 | 卖家 | 客户（无需登录） |
| 购买方式 | Purchase（免费直接获取 / Stripe 付费） | 通过预定下单 | 本身就是下单动作 |
| 核心表 | `listings` + `purchases` | `store_products` | `store_bookings` |
| 公开接口 | `GET /api/listings` | `GET /api/public/store/{slug}/products` | `POST /api/public/store/{slug}/bookings` |
| 管理接口 | `GET /api/my-listings` | `GET /api/my-store/products` | `GET /api/my-store/bookings` |

---

## 相关路由速查

### 公开路由（无需登录）
```
GET  /api/listings                          # 浏览技能包列表
GET  /api/listings/{slug}                   # 技能包详情
GET  /api/public/store                     # 浏览店铺列表
GET  /api/public/store/{slug}              # 店铺详情（含商品+公告）
GET  /api/public/store/{slug}/products     # 店铺商品列表
POST /api/public/store/{slug}/bookings     # 提交预定（客户）
POST /api/public/search                     # 全文搜索
```

### 私有路由（需 auth:sanctum）
```
POST /api/become-seller                     # 成为卖家
GET  /api/my-store                          # 查看/初始化店铺
PUT  /api/my-store                          # 更新店铺信息
POST /api/my-store/products                 # 上架商品
PUT  /api/my-store/products/{id}            # 编辑商品
DELETE /api/my-store/products/{id}          # 下架商品
GET  /api/my-store/bookings                 # 查看预定列表
PUT  /api/my-store/bookings/{id}/status     # 更新预定状态
POST /api/listings                          # 创建 AI 技能包
PUT  /api/listings/{id}                     # 编辑技能包
DELETE /api/listings/{id}                   # 删除技能包
POST /api/purchases                         # 购买/获取技能包
```
