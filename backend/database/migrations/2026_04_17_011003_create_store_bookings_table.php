<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('store_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_profile_id')->constrained()->cascadeOnDelete();
            $table->string('status', 30)->default('pending');

            // 顾客信息
            $table->string('customer_name');
            $table->string('customer_phone', 30);
            $table->text('customer_note')->nullable();

            // 预定时间
            $table->timestamp('booking_at')->nullable();

            // 餐厅专属
            $table->string('table_area')->nullable();
            $table->integer('party_size')->nullable();

            // 零售/服务明细
            $table->json('items')->nullable();

            // 通用扩展
            $table->json('extra')->nullable();

            $table->timestamps();

            $table->index(['store_profile_id', 'status']);
            $table->index('booking_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('store_bookings');
    }
};
