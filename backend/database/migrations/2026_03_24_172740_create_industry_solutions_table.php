<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('industry_solutions', function (Blueprint $table) {
            $table->id();

            // 基础信息
            $table->string('industry_key')->unique();      // 唯一标识，如 fresh_market
            $table->string('name');                        // 行业名称，如 生鲜门店
            $table->string('emoji', 10)->default('🏭');   // 行业 emoji
            $table->string('tagline');                     // 一句话定位
            $table->json('pain_points');                   // 行业痛点（JSON 数组）
            $table->json('target_users');                  // 目标用户（JSON 数组）
            $table->json('modules');                       // 功能模块列表（JSON 数组）
            $table->json('keywords');                      // 关键词（JSON 数组，用于搜索）

            // 关联 listing
            $table->foreignId('listing_id')
                  ->nullable()
                  ->constrained('listings')
                  ->nullOnDelete();

            // 生成状态
            $table->enum('status', ['pending', 'generating', 'done', 'failed'])->default('pending');
            $table->text('generation_error')->nullable();
            $table->timestamp('generated_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('industry_solutions');
    }
};
