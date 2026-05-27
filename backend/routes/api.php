<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ListingController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\PurchaseController;
use App\Http\Controllers\Api\SourcingRequestController;
use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\StripeController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Listing routes (public)
Route::get('/listings', [ListingController::class, 'index']);
Route::get('/listings/{slug}', [ListingController::class, 'show']);
Route::get('/listings/{slug}/related', [ListingController::class, 'related']);

// Sourcing routes
Route::post('/sourcing', [SourcingRequestController::class, 'store']);

// Stripe webhook (public, no auth)
Route::post('/stripe/webhook', [StripeController::class, 'webhook']);

// ── 公开店铺查询 ──
Route::get('/public/store', [StoreController::class, 'publicIndex']);
Route::get('/public/store/{slug}', [StoreController::class, 'publicShow']);
Route::get('/public/store/{slug}/notes', [StoreController::class, 'publicNotes']);
Route::get('/public/store/{slug}/photos', [StoreController::class, 'publicPhotos']);
Route::get('/public/store/{slug}/products', [StoreController::class, 'publicProducts']);
Route::get('/public/store/{slug}/products/{productId}/photos', [StoreController::class, 'publicProductPhotos']);
Route::post('/public/store/{slug}/bookings', [StoreController::class, 'createBooking']);
Route::post('/public/search', [StoreController::class, 'search']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/become-seller', [AuthController::class, 'becomeSeller']);

    // Purchases
    Route::get('/purchases', [PurchaseController::class, 'index']);
    Route::post('/purchases', [PurchaseController::class, 'store']);
    Route::get('/purchases/check/{listingId}', [PurchaseController::class, 'check']);

    // Stripe checkout
    Route::post('/stripe/checkout', [StripeController::class, 'createCheckoutSession']);

    // Seller listing management
    Route::get('/my-listings', [ListingController::class, 'myListings']);
    Route::post('/listings', [ListingController::class, 'store']);
    Route::put('/listings/{id}', [ListingController::class, 'update']);
    Route::delete('/listings/{id}', [ListingController::class, 'destroy']);

    // ── 店铺管理 ──
    Route::get('/my-store', [StoreController::class, 'myStore']);
    Route::put('/my-store', [StoreController::class, 'updateMyStore']);

    // 进销存
    Route::get('/my-store/inventory/summary', [StoreController::class, 'inventorySummary']);
    Route::get('/my-store/inventory/txns', [StoreController::class, 'inventoryTxns']);
    Route::post('/my-store/inventory/txns', [StoreController::class, 'storeInventoryTxn']);
    Route::put('/my-store/inventory/txns/{id}', [StoreController::class, 'updateInventoryTxn']);
    Route::delete('/my-store/inventory/txns/{id}', [StoreController::class, 'destroyInventoryTxn']);

    // 店铺日志（私密，不公开）
    Route::get('/my-store/logs', [StoreController::class, 'myLogs']);
    Route::post('/my-store/logs', [StoreController::class, 'storeLog']);
    Route::put('/my-store/logs/{id}', [StoreController::class, 'updateLog']);
    Route::delete('/my-store/logs/{id}', [StoreController::class, 'destroyLog']);

    // 零碎信息（Notes）
    Route::get('/my-store/notes', [StoreController::class, 'myNotes']);
    Route::post('/my-store/notes', [StoreController::class, 'storeNote']);
    Route::put('/my-store/notes/{id}', [StoreController::class, 'updateNote']);
    Route::delete('/my-store/notes/{id}', [StoreController::class, 'destroyNote']);

    // 商品库
    Route::get('/my-store/products', [StoreController::class, 'myProducts']);
    Route::post('/my-store/products', [StoreController::class, 'storeProduct']);
    Route::put('/my-store/products/{id}', [StoreController::class, 'updateProduct']);
    Route::delete('/my-store/products/{id}', [StoreController::class, 'destroyProduct']);

    // 预定管理
    Route::get('/my-store/bookings', [StoreController::class, 'myBookings']);
    Route::put('/my-store/bookings/{id}/status', [StoreController::class, 'updateBookingStatus']);
    Route::delete('/my-store/bookings/{id}', [StoreController::class, 'destroyBooking']);

    // 店铺相册
    Route::post('/my-store/photos', [StoreController::class, 'storePhoto']);
    Route::delete('/my-store/photos/{id}', [StoreController::class, 'destroyPhoto']);
    Route::put('/my-store/photos/reorder', [StoreController::class, 'reorderPhotos']);

    // 商品图片
    Route::post('/my-store/products/{productId}/photos', [StoreController::class, 'storeProductPhoto']);
    Route::delete('/my-store/product-photos/{id}', [StoreController::class, 'destroyProductPhoto']);
    Route::put('/my-store/product-photos/{id}/primary', [StoreController::class, 'setPrimaryPhoto']);

    // 海报生成
    Route::post('/my-store/poster', [StoreController::class, 'generatePoster']);

    // CRM — 客户管理
    Route::get('/my-store/customers', [StoreController::class, 'myCustomers']);
    Route::post('/my-store/customers', [StoreController::class, 'storeCustomer']);
    Route::put('/my-store/customers/{id}', [StoreController::class, 'updateCustomer']);
    Route::delete('/my-store/customers/{id}', [StoreController::class, 'destroyCustomer']);
    Route::get('/my-store/customers/{customerId}/interactions', [StoreController::class, 'customerInteractions']);
    Route::post('/my-store/customers/{customerId}/interactions', [StoreController::class, 'storeInteraction']);
    Route::delete('/my-store/customer-interactions/{id}', [StoreController::class, 'destroyInteraction']);
});

// Post routes (index and show are public, rest require auth)
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{post}', [PostController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/posts', [PostController::class, 'store']);
    Route::put('/posts/{post}', [PostController::class, 'update']);
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);
});
