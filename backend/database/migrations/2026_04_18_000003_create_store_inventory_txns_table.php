<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('store_inventory_txns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('store_products')->nullOnDelete();
            $table->string('item_name');                          // 商品名称（冗余，方便查询）
            $table->string('type', 20);                          // purchase/sale/adjustment/waste
            $table->decimal('qty', 10, 3);                       // 数量（正数=入库，负数=出库）
            $table->string('unit', 20)->nullable();              // 件/斤/箱/瓶...
            $table->decimal('unit_price', 10, 2)->nullable();    // 单价
            $table->decimal('total_amount', 10, 2)->nullable();  // 合计金额
            $table->string('note')->nullable();                  // 备注
            $table->timestamp('txn_at')->useCurrent();           // 发生时间
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('store_inventory_txns');
    }
};
