<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StoreBooking;
use App\Models\StoreCustomer;
use App\Models\StoreCustomerInteraction;
use App\Models\StoreInventoryTxn;
use App\Models\StoreLog;
use App\Models\StoreNote;
use App\Models\StorePhoto;
use App\Models\StoreProduct;
use App\Models\StoreProductPhoto;
use App\Models\StoreProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StoreController extends Controller
{
    // ─────────────────────────────────────────
    // 私有接口（需 auth:sanctum + is_seller）
    // ─────────────────────────────────────────

    public function myStore(Request $request): JsonResponse
    {
        $this->requireSeller($request);

        $user = $request->user();

        // Auto-create store profile on first visit
        if (! $user->storeProfile()->exists()) {
            $base = \Illuminate\Support\Str::slug($user->name ?: 'store');
            $slug = $base;
            $i = 1;
            while (StoreProfile::where('slug', $slug)->exists()) {
                $slug = $base.'-'.$i++;
            }

            $user->storeProfile()->create([
                'shop_name' => ($user->name ?: '我的店铺'),
                'slug' => $slug,
                'store_type' => 'retail',
                'is_public' => false,
            ]);
        }

        $store = $user->storeProfile()
            ->withCount(['notes', 'products'])
            ->with('photos')
            ->first();

        return response()->json($store);
    }

    public function updateMyStore(Request $request): JsonResponse
    {
        $this->requireSeller($request);

        $validated = $request->validate([
            'shop_name' => ['required', 'string', 'max:100'],
            'shop_description' => ['nullable', 'string', 'max:2000'],
            'logo_url' => ['nullable', 'url', 'max:2048'],
            'contact_phone' => ['nullable', 'string', 'max:30'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string', 'max:300'],
            'business_hours' => ['nullable', 'string', 'max:300'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:30'],
            'is_public' => ['boolean'],
            'store_type' => ['sometimes', 'in:restaurant,retail,service,general'],
        ]);

        $store = $request->user()->storeProfile;
        $store->update($validated);

        return response()->json($store->fresh());
    }

    // ── Notes ──

    public function myNotes(Request $request): JsonResponse
    {
        $this->requireSeller($request);

        $store = $request->user()->storeProfile;
        $notes = $store->notes()
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($notes);
    }

    public function storeNote(Request $request): JsonResponse
    {
        $this->requireSeller($request);

        $validated = $request->validate([
            'type' => ['required', 'in:discount,announcement,inventory,event,other'],
            'title' => ['nullable', 'string', 'max:200'],
            'content' => ['required', 'string', 'max:2000'],
            'valid_from' => ['nullable', 'date'],
            'valid_until' => ['nullable', 'date', 'after_or_equal:valid_from'],
            'is_active' => ['boolean'],
            'metadata' => ['nullable', 'array'],
        ]);

        $store = $request->user()->storeProfile;
        $note = $store->notes()->create($validated);

        return response()->json($note, 201);
    }

    public function updateNote(Request $request, int $id): JsonResponse
    {
        $this->requireSeller($request);

        $note = $this->findOwnedNote($request, $id);

        $validated = $request->validate([
            'type' => ['sometimes', 'in:discount,announcement,inventory,event,other'],
            'title' => ['nullable', 'string', 'max:200'],
            'content' => ['sometimes', 'string', 'max:2000'],
            'valid_from' => ['nullable', 'date'],
            'valid_until' => ['nullable', 'date', 'after_or_equal:valid_from'],
            'is_active' => ['boolean'],
            'metadata' => ['nullable', 'array'],
        ]);

        $note->update($validated);

        return response()->json($note->fresh());
    }

    public function destroyNote(Request $request, int $id): JsonResponse
    {
        $this->requireSeller($request);

        $note = $this->findOwnedNote($request, $id);
        $note->delete();

        return response()->json(['message' => 'Note deleted']);
    }

    // ── Products ──

    public function myProducts(Request $request): JsonResponse
    {
        $this->requireSeller($request);

        $store = $request->user()->storeProfile;
        $products = $store->products()
            ->with('photos')
            ->orderBy('sort_order')
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return response()->json($products);
    }

    public function storeProduct(Request $request): JsonResponse
    {
        $this->requireSeller($request);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'unit' => ['nullable', 'string', 'max:20'],
            'description' => ['nullable', 'string', 'max:2000'],
            'image_url' => ['nullable', 'url', 'max:2048'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer'],
        ]);

        $store = $request->user()->storeProfile;
        $product = $store->products()->create($validated);

        return response()->json($product, 201);
    }

    public function updateProduct(Request $request, int $id): JsonResponse
    {
        $this->requireSeller($request);

        $product = $this->findOwnedProduct($request, $id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'unit' => ['nullable', 'string', 'max:20'],
            'description' => ['nullable', 'string', 'max:2000'],
            'image_url' => ['nullable', 'url', 'max:2048'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer'],
        ]);

        $product->update($validated);

        return response()->json($product->fresh());
    }

    public function destroyProduct(Request $request, int $id): JsonResponse
    {
        $this->requireSeller($request);

        $product = $this->findOwnedProduct($request, $id);
        $product->delete();

        return response()->json(['message' => 'Product deleted']);
    }

    // ─────────────────────────────────────────
    // 店铺日志（私有，不公开）
    // ─────────────────────────────────────────

    public function myLogs(Request $request): JsonResponse
    {
        $this->requireSeller($request);

        $store = $request->user()->storeProfile;
        $category = $request->query('category');

        $logs = $store->logs()
            ->when($category, fn ($q) => $q->where('category', $category))
            ->orderBy('logged_at', 'desc')
            ->paginate(50);

        return response()->json($logs);
    }

    public function storeLog(Request $request): JsonResponse
    {
        $this->requireSeller($request);

        $validated = $request->validate([
            'content' => ['required', 'string', 'max:2000'],
            'category' => ['sometimes', 'in:sales,purchase,operations,finance,staff,other'],
            'amount' => ['nullable', 'numeric', 'min:0'],
            'amount_type' => ['nullable', 'in:income,expense'],
            'logged_at' => ['nullable', 'date'],
        ]);

        $store = $request->user()->storeProfile;
        $log = $store->logs()->create($validated);

        return response()->json($log, 201);
    }

    public function updateLog(Request $request, int $id): JsonResponse
    {
        $this->requireSeller($request);

        $log = $this->findOwnedLog($request, $id);

        $validated = $request->validate([
            'content' => ['sometimes', 'string', 'max:2000'],
            'category' => ['sometimes', 'in:sales,purchase,operations,finance,staff,other'],
            'amount' => ['nullable', 'numeric', 'min:0'],
            'amount_type' => ['nullable', 'in:income,expense'],
            'logged_at' => ['nullable', 'date'],
        ]);

        $log->update($validated);

        return response()->json($log->fresh());
    }

    public function destroyLog(Request $request, int $id): JsonResponse
    {
        $this->requireSeller($request);

        $log = $this->findOwnedLog($request, $id);
        $log->delete();

        return response()->json(['message' => 'Log deleted']);
    }

    // ─────────────────────────────────────────
    // 进销存
    // ─────────────────────────────────────────

    /** 库存流水列表 */
    public function inventoryTxns(Request $request): JsonResponse
    {
        $this->requireSeller($request);

        $store = $request->user()->storeProfile;

        $txns = $store->inventoryTxns()
            ->when($request->query('type'), fn ($q, $v) => $q->where('type', $v))
            ->when($request->query('item'), fn ($q, $v) => $q->where('item_name', 'like', "%{$v}%"))
            ->orderBy('txn_at', 'desc')
            ->paginate(50);

        return response()->json($txns);
    }

    /** 库存汇总（按商品聚合当前库存） */
    public function inventorySummary(Request $request): JsonResponse
    {
        $this->requireSeller($request);

        $store = $request->user()->storeProfile;

        $summary = $store->inventoryTxns()
            ->selectRaw('item_name, unit, SUM(qty) as stock, SUM(CASE WHEN qty > 0 THEN total_amount ELSE 0 END) as total_purchase, SUM(CASE WHEN qty < 0 THEN ABS(total_amount) ELSE 0 END) as total_sale')
            ->groupBy('item_name', 'unit')
            ->orderByRaw('SUM(qty) DESC')
            ->get();

        return response()->json($summary);
    }

    /** 新增流水记录 */
    public function storeInventoryTxn(Request $request): JsonResponse
    {
        $this->requireSeller($request);

        $validated = $request->validate([
            'item_name' => ['required', 'string', 'max:100'],
            'type' => ['required', 'in:purchase,sale,adjustment,waste'],
            'qty' => ['required', 'numeric'],
            'unit' => ['nullable', 'string', 'max:20'],
            'unit_price' => ['nullable', 'numeric', 'min:0'],
            'total_amount' => ['nullable', 'numeric', 'min:0'],
            'note' => ['nullable', 'string', 'max:500'],
            'product_id' => ['nullable', 'integer', 'exists:store_products,id'],
            'txn_at' => ['nullable', 'date'],
        ]);

        $store = $request->user()->storeProfile;
        $txn = $store->inventoryTxns()->create($validated);

        return response()->json($txn, 201);
    }

    /** 修改流水记录 */
    public function updateInventoryTxn(Request $request, int $id): JsonResponse
    {
        $this->requireSeller($request);

        $txn = $this->findOwnedInventoryTxn($request, $id);

        $validated = $request->validate([
            'item_name' => ['sometimes', 'string', 'max:100'],
            'type' => ['sometimes', 'in:purchase,sale,adjustment,waste'],
            'qty' => ['sometimes', 'numeric'],
            'unit' => ['nullable', 'string', 'max:20'],
            'unit_price' => ['nullable', 'numeric', 'min:0'],
            'total_amount' => ['nullable', 'numeric', 'min:0'],
            'note' => ['nullable', 'string', 'max:500'],
            'txn_at' => ['nullable', 'date'],
        ]);

        $txn->update($validated);

        return response()->json($txn->fresh());
    }

    /** 删除流水记录 */
    public function destroyInventoryTxn(Request $request, int $id): JsonResponse
    {
        $this->requireSeller($request);

        $txn = $this->findOwnedInventoryTxn($request, $id);
        $txn->delete();

        return response()->json(['message' => 'Transaction deleted']);
    }

    // ─────────────────────────────────────────
    // 公开接口（无需认证）
    // ─────────────────────────────────────────

    public function publicIndex(): JsonResponse
    {
        $stores = StoreProfile::query()
            ->where('is_public', true)
            ->with('user:id,name,avatar_url')
            ->withCount(['notes' => fn ($q) => $q->active()])
            ->orderBy('updated_at', 'desc')
            ->paginate(20);

        return response()->json($stores);
    }

    public function publicShow(string $slug): JsonResponse
    {
        $store = StoreProfile::query()
            ->where('slug', $slug)
            ->where('is_public', true)
            ->with('user:id,name,avatar_url,bio,website_url')
            ->firstOrFail();

        $store->load([
            'notes' => fn ($q) => $q->active()->orderBy('created_at', 'desc')->limit(20),
            'photos' => fn ($q) => $q->orderBy('sort_order'),
            'products' => fn ($q) => $q->where('is_active', true)
                ->with(['photos' => fn ($q) => $q->orderBy('sort_order')])
                ->orderBy('sort_order')
                ->limit(50),
        ]);

        return response()->json($store);
    }

    public function publicNotes(string $slug): JsonResponse
    {
        $store = StoreProfile::query()
            ->where('slug', $slug)
            ->where('is_public', true)
            ->firstOrFail();

        $type = request('type');
        $notes = $store->notes()
            ->active()
            ->when($type, fn ($q) => $q->where('type', $type))
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($notes);
    }

    public function publicProducts(string $slug): JsonResponse
    {
        $store = StoreProfile::query()
            ->where('slug', $slug)
            ->where('is_public', true)
            ->firstOrFail();

        $products = $store->products()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return response()->json($products);
    }

    /**
     * 全文搜索：在店铺名称、描述、notes 内容中检索
     * 支持 query（关键词）、type（note 类型）、shop_slug（限定店铺）
     */
    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'query' => ['required', 'string', 'min:1', 'max:200'],
            'type' => ['nullable', 'in:discount,announcement,inventory,event,other'],
            'shop_slug' => ['nullable', 'string'],
            'top_k' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $query = $request->input('query');
        $topK = $request->integer('top_k', 10);

        $notesQuery = StoreNote::query()
            ->active()
            ->whereHas('storeProfile', fn ($q) => $q->where('is_public', true))
            ->with('storeProfile:id,shop_name,slug,logo_url')
            ->where(function ($q) use ($query): void {
                $q->whereRaw('content ILIKE ?', ["%{$query}%"])
                    ->orWhereRaw('title ILIKE ?', ["%{$query}%"]);
            });

        if ($request->filled('type')) {
            $notesQuery->where('type', $request->input('type'));
        }

        if ($request->filled('shop_slug')) {
            $notesQuery->whereHas(
                'storeProfile',
                fn ($q) => $q->where('slug', $request->input('shop_slug'))
            );
        }

        $notes = $notesQuery->orderBy('created_at', 'desc')->limit($topK)->get();

        return response()->json([
            'query' => $query,
            'results' => $notes,
            'count' => $notes->count(),
        ]);
    }

    // ─────────────────────────────────────────
    // 预定系统
    // ─────────────────────────────────────────

    /** 公开：顾客提交预定 */
    public function createBooking(Request $request, string $slug): JsonResponse
    {
        $store = StoreProfile::query()
            ->where('slug', $slug)
            ->where('is_public', true)
            ->firstOrFail();

        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:100'],
            'customer_phone' => ['required', 'string', 'max:30'],
            'customer_note' => ['nullable', 'string', 'max:500'],
            'booking_at' => ['nullable', 'date'],
            // 餐厅
            'table_area' => ['nullable', 'string', 'max:100'],
            'party_size' => ['nullable', 'integer', 'min:1', 'max:999'],
            // 零售/服务明细
            'items' => ['nullable', 'array'],
            'items.*.name' => ['required_with:items', 'string', 'max:100'],
            'items.*.qty' => ['required_with:items', 'numeric', 'min:0'],
            'items.*.unit' => ['nullable', 'string', 'max:20'],
            'items.*.price' => ['nullable', 'string'],
            // 通用扩展
            'extra' => ['nullable', 'array'],
        ]);

        $booking = $store->bookings()->create($validated);

        return response()->json($booking, 201);
    }

    /** 私有：查看自己店铺的预定列表 */
    public function myBookings(Request $request): JsonResponse
    {
        $this->requireSeller($request);

        $store = $request->user()->storeProfile;
        $status = $request->query('status');

        $query = $store->bookings()
            ->when($status, fn ($q) => $q->where('status', $status))
            ->orderBy('booking_at', 'asc')
            ->orderBy('created_at', 'desc');

        return response()->json($query->paginate(20));
    }

    /** 私有：更新预定状态 */
    public function updateBookingStatus(Request $request, int $id): JsonResponse
    {
        $this->requireSeller($request);

        $request->validate([
            'status' => ['required', 'in:pending,confirmed,in_progress,completed,cancelled'],
        ]);

        $booking = $this->findOwnedBooking($request, $id);
        $booking->update(['status' => $request->input('status')]);

        return response()->json($booking->fresh());
    }

    /** 私有：删除预定记录 */
    public function destroyBooking(Request $request, int $id): JsonResponse
    {
        $this->requireSeller($request);

        $booking = $this->findOwnedBooking($request, $id);
        $booking->delete();

        return response()->json(['message' => 'Booking deleted']);
    }

    // ─────────────────────────────────────────
    // 店铺相册
    // ─────────────────────────────────────────

    /** 私有：上传店铺图片 */
    public function storePhoto(Request $request): JsonResponse
    {
        $this->requireSeller($request);

        $request->validate([
            'photo' => ['required', 'image', 'max:5120'],
            'caption' => ['nullable', 'string', 'max:200'],
            'category' => ['nullable', 'in:environment,menu,products,video'],
        ]);

        $store = $request->user()->storeProfile;
        $maxOrder = $store->photos()->max('sort_order') ?? -1;

        $path = Storage::disk('cos')->putFile('store-photos', $request->file('photo'));
        $url = Storage::disk('cos')->url($path);

        $photo = $store->photos()->create([
            'url' => $url,
            'caption' => $request->input('caption'),
            'category' => $request->input('category', 'environment'),
            'sort_order' => $maxOrder + 1,
        ]);

        return response()->json($photo, 201);
    }

    /** 私有：删除店铺图片 */
    public function destroyPhoto(Request $request, int $id): JsonResponse
    {
        $this->requireSeller($request);

        $store = $request->user()->storeProfile;
        $photo = StorePhoto::query()
            ->where('id', $id)
            ->where('store_profile_id', $store->id)
            ->firstOrFail();

        $this->cosDelete($photo->url);
        $photo->delete();

        return response()->json(['message' => 'Photo deleted']);
    }

    /** 私有：调整店铺相册顺序 */
    public function reorderPhotos(Request $request): JsonResponse
    {
        $this->requireSeller($request);

        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer'],
        ]);

        $store = $request->user()->storeProfile;
        $ids = $request->input('ids');

        foreach ($ids as $order => $id) {
            StorePhoto::query()
                ->where('id', $id)
                ->where('store_profile_id', $store->id)
                ->update(['sort_order' => $order]);
        }

        return response()->json(['message' => 'Reordered']);
    }

    /** 公开：查看店铺相册 */
    public function publicPhotos(string $slug): JsonResponse
    {
        $store = StoreProfile::query()
            ->where('slug', $slug)
            ->where('is_public', true)
            ->firstOrFail();

        return response()->json($store->photos()->orderBy('sort_order')->get());
    }

    // ─────────────────────────────────────────
    // 商品图片
    // ─────────────────────────────────────────

    /** 私有：为商品上传图片 */
    public function storeProductPhoto(Request $request, int $productId): JsonResponse
    {
        $this->requireSeller($request);

        $request->validate([
            'photo' => ['required', 'image', 'max:5120'],
            'caption' => ['nullable', 'string', 'max:200'],
        ]);

        $product = $this->findOwnedProduct($request, $productId);
        $maxOrder = $product->photos()->max('sort_order') ?? -1;
        $isFirst = $product->photos()->count() === 0;

        $path = Storage::disk('cos')->putFile('product-photos', $request->file('photo'));
        $url = Storage::disk('cos')->url($path);

        $photo = $product->photos()->create([
            'url' => $url,
            'caption' => $request->input('caption'),
            'sort_order' => $maxOrder + 1,
            'is_primary' => $isFirst,
        ]);

        // 第一张图自动同步到商品主图
        if ($isFirst) {
            $product->update(['image_url' => $url]);
        }

        return response()->json($photo, 201);
    }

    /** 私有：删除商品图片 */
    public function destroyProductPhoto(Request $request, int $id): JsonResponse
    {
        $this->requireSeller($request);

        $store = $request->user()->storeProfile;
        $photo = StoreProductPhoto::query()
            ->whereHas('storeProduct', fn ($q) => $q->where('store_profile_id', $store->id))
            ->where('id', $id)
            ->firstOrFail();

        $wasPrimary = $photo->is_primary;
        $productId = $photo->store_product_id;

        $this->cosDelete($photo->url);
        $photo->delete();

        // 若删除的是主图，自动把剩余第一张设为主图
        if ($wasPrimary) {
            $next = StoreProductPhoto::query()
                ->where('store_product_id', $productId)
                ->orderBy('sort_order')
                ->first();

            if ($next) {
                $next->update(['is_primary' => true]);
                StoreProduct::query()->where('id', $productId)->update(['image_url' => $next->url]);
            } else {
                StoreProduct::query()->where('id', $productId)->update(['image_url' => null]);
            }
        }

        return response()->json(['message' => 'Product photo deleted']);
    }

    /** 私有：设商品图片为主图 */
    public function setPrimaryPhoto(Request $request, int $id): JsonResponse
    {
        $this->requireSeller($request);

        $store = $request->user()->storeProfile;
        $photo = StoreProductPhoto::query()
            ->whereHas('storeProduct', fn ($q) => $q->where('store_profile_id', $store->id))
            ->where('id', $id)
            ->firstOrFail();

        // 清除同商品其他主图
        StoreProductPhoto::query()
            ->where('store_product_id', $photo->store_product_id)
            ->update(['is_primary' => false]);

        $photo->update(['is_primary' => true]);

        // 同步到商品 image_url
        StoreProduct::query()
            ->where('id', $photo->store_product_id)
            ->update(['image_url' => $photo->url]);

        return response()->json($photo->fresh());
    }

    /** 公开：查看商品图片列表 */
    public function publicProductPhotos(string $slug, int $productId): JsonResponse
    {
        $store = StoreProfile::query()
            ->where('slug', $slug)
            ->where('is_public', true)
            ->firstOrFail();

        $product = StoreProduct::query()
            ->where('id', $productId)
            ->where('store_profile_id', $store->id)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json($product->photos()->get());
    }

    // ─────────────────────────────────────────
    // CRM — 客户管理
    // ─────────────────────────────────────────

    /** 客户列表（支持 ?search= 模糊搜索 name/phone） */
    public function myCustomers(Request $request): JsonResponse
    {
        $this->requireSeller($request);

        $store = $request->user()->storeProfile;
        $search = $request->query('search');

        $customers = $store->customers()
            ->when($search, function ($q) use ($search): void {
                $q->where(function ($q) use ($search): void {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->orderBy('last_contact_at', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return response()->json($customers);
    }

    /** 新增客户 */
    public function storeCustomer(Request $request): JsonResponse
    {
        $this->requireSeller($request);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:300'],
            'note' => ['nullable', 'string'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
        ]);

        $store = $request->user()->storeProfile;
        $customer = $store->customers()->create($validated);

        return response()->json($customer, 201);
    }

    /** 修改客户 */
    public function updateCustomer(Request $request, int $id): JsonResponse
    {
        $this->requireSeller($request);

        $customer = $this->findOwnedCustomer($request, $id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:300'],
            'note' => ['nullable', 'string'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
        ]);

        $customer->update($validated);

        return response()->json($customer->fresh());
    }

    /** 删除客户 */
    public function destroyCustomer(Request $request, int $id): JsonResponse
    {
        $this->requireSeller($request);

        $customer = $this->findOwnedCustomer($request, $id);
        $customer->delete();

        return response()->json(['message' => 'Customer deleted']);
    }

    /** 查看某客户的互动记录 */
    public function customerInteractions(Request $request, int $customerId): JsonResponse
    {
        $this->requireSeller($request);

        $customer = $this->findOwnedCustomer($request, $customerId);

        $interactions = $customer->interactions()
            ->orderBy('interacted_at', 'desc')
            ->paginate(50);

        return response()->json($interactions);
    }

    /** 新增互动记录（同时更新客户的 visit_count、last_contact_at、total_spent） */
    public function storeInteraction(Request $request, int $customerId): JsonResponse
    {
        $this->requireSeller($request);

        $customer = $this->findOwnedCustomer($request, $customerId);

        $validated = $request->validate([
            'type' => ['required', 'in:visit,call,message,order,other'],
            'content' => ['required', 'string', 'max:2000'],
            'amount' => ['nullable', 'numeric', 'min:0'],
            'interacted_at' => ['nullable', 'date'],
        ]);

        $store = $request->user()->storeProfile;

        $interaction = $customer->interactions()->create(array_merge($validated, [
            'store_profile_id' => $store->id,
        ]));

        // 更新客户汇总字段
        $customer->increment('visit_count');
        $customer->update(['last_contact_at' => $interaction->interacted_at]);

        if (! empty($validated['amount']) && $validated['amount'] > 0) {
            $customer->increment('total_spent', $validated['amount']);
        }

        return response()->json($interaction, 201);
    }

    /** 删除互动记录 */
    public function destroyInteraction(Request $request, int $id): JsonResponse
    {
        $this->requireSeller($request);

        $store = $request->user()->storeProfile;

        $interaction = StoreCustomerInteraction::query()
            ->where('id', $id)
            ->where('store_profile_id', $store->id)
            ->firstOrFail();

        $interaction->delete();

        return response()->json(['message' => 'Interaction deleted']);
    }

    // ─────────────────────────────────────────
    // 私有辅助方法
    // ─────────────────────────────────────────

    private function requireSeller(Request $request): void
    {
        if (! $request->user()->is_seller) {
            abort(403, 'Only sellers can manage store.');
        }
    }

    private function findOwnedNote(Request $request, int $id): StoreNote
    {
        $store = $request->user()->storeProfile;

        return StoreNote::query()
            ->where('id', $id)
            ->where('store_profile_id', $store->id)
            ->firstOrFail();
    }

    private function findOwnedProduct(Request $request, int $id): StoreProduct
    {
        $store = $request->user()->storeProfile;

        return StoreProduct::query()
            ->where('id', $id)
            ->where('store_profile_id', $store->id)
            ->firstOrFail();
    }

    private function findOwnedInventoryTxn(Request $request, int $id): StoreInventoryTxn
    {
        $store = $request->user()->storeProfile;

        return StoreInventoryTxn::query()
            ->where('id', $id)
            ->where('store_profile_id', $store->id)
            ->firstOrFail();
    }

    private function findOwnedLog(Request $request, int $id): StoreLog
    {
        $store = $request->user()->storeProfile;

        return StoreLog::query()
            ->where('id', $id)
            ->where('store_profile_id', $store->id)
            ->firstOrFail();
    }

    private function findOwnedBooking(Request $request, int $id): StoreBooking
    {
        $store = $request->user()->storeProfile;

        return StoreBooking::query()
            ->where('id', $id)
            ->where('store_profile_id', $store->id)
            ->firstOrFail();
    }

    private function findOwnedCustomer(Request $request, int $id): StoreCustomer
    {
        $store = $request->user()->storeProfile;

        return StoreCustomer::query()
            ->where('id', $id)
            ->where('store_profile_id', $store->id)
            ->firstOrFail();
    }

    // ─────────────────────────────────────────
    // 海报生成
    // ─────────────────────────────────────────

    /** 私有：调用第三方 AI 生成海报，上传 COS 并返回图片 URL */
    public function generatePoster(Request $request): JsonResponse
    {
        $this->requireSeller($request);

        $request->validate([
            'prompt'           => ['required', 'string', 'max:2000'],
            'aspectRatio'      => ['nullable', 'string', 'in:1:1,16:9,9:16,4:3,3:4'],
            'imageSize'        => ['nullable', 'string'],
            'temperature'      => ['nullable', 'numeric', 'min:0', 'max:2'],
            'topP'             => ['nullable', 'numeric', 'min:0', 'max:1'],
            'enableSearch'     => ['nullable', 'boolean'],
            // JSON 方式（已有 base64）
            'objectImages'     => ['nullable', 'array'],
            'objectImages.*'   => ['array'],
            'characterImages'  => ['nullable', 'array'],
            'characterImages.*'=> ['array'],
            // 文件上传方式
            'object_files'     => ['nullable', 'array'],
            'object_files.*'   => ['file', 'image', 'max:5120'],
            'character_files'  => ['nullable', 'array'],
            'character_files.*'=> ['file', 'image', 'max:5120'],
        ]);

        // 将上传的文件转为 base64 对象数组，合并到 objectImages / characterImages
        $objectImages    = $request->input('objectImages', []) ?? [];
        $characterImages = $request->input('characterImages', []) ?? [];

        foreach ($request->file('object_files', []) as $file) {
            $objectImages[] = [
                'mimeType' => $file->getMimeType() ?: 'image/jpeg',
                'data'     => base64_encode(file_get_contents($file->getRealPath())),
            ];
        }

        foreach ($request->file('character_files', []) as $file) {
            $characterImages[] = [
                'mimeType' => $file->getMimeType() ?: 'image/jpeg',
                'data'     => base64_encode(file_get_contents($file->getRealPath())),
            ];
        }

        $payload = array_filter([
            'prompt'          => $request->input('prompt'),
            'aspectRatio'     => $request->input('aspectRatio', '1:1'),
            'imageSize'       => $request->input('imageSize', '1K'),
            'temperature'     => $request->input('temperature', 1.0),
            'topP'            => $request->input('topP', 0.95),
            'enableSearch'    => $request->boolean('enableSearch', false),
            'objectImages'    => $objectImages    ?: null,
            'characterImages' => $characterImages ?: null,
            'baseUrl'         => config('services.image_gen.base_url'),
            'apiKey'          => config('services.image_gen.api_key'),
        ], fn ($v) => $v !== null);

        $endpoint = 'https://xingke888.com/fastify/image/generate';

        $response = \Illuminate\Support\Facades\Http::timeout(120)
            ->post($endpoint, $payload);

        if (! $response->successful()) {
            return response()->json([
                'success' => false,
                'error'   => '图片生成服务请求失败：'.$response->status(),
            ], 502);
        }

        $body = $response->json();

        if (! ($body['success'] ?? false)) {
            return response()->json([
                'success' => false,
                'error'   => $body['error'] ?? '图片生成失败',
            ], 422);
        }

        // 将 base64 图片上传到 COS
        $mimeType  = $body['data']['mimeType'] ?? 'image/png';
        $base64    = $body['data']['image'] ?? '';
        $ext       = $mimeType === 'image/jpeg' ? 'jpg' : 'png';
        $filename  = 'posters/'.uniqid('poster_', true).'.'.$ext;

        Storage::disk('cos')->put($filename, base64_decode($base64), 'public');
        $url = Storage::disk('cos')->url($filename);

        return response()->json([
            'success'  => true,
            'url'      => $url,
            'mimeType' => $mimeType,
            'prompt'   => $body['data']['prompt'] ?? $validated['prompt'],
            'model'    => $body['data']['model']  ?? 'gemini-3.1-flash-image-preview',
        ]);
    }

    private function cosDelete(string $url): void
    {
        try {
            $path = ltrim(parse_url($url, PHP_URL_PATH), '/');
            if ($path) {
                Storage::disk('cos')->delete($path);
            }
        } catch (\Throwable) {
            // 忽略 COS 删除失败，不影响数据库操作
        }
    }
}
