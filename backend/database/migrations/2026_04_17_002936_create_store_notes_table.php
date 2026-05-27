<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('store_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_profile_id')->constrained()->cascadeOnDelete();
            $table->string('type', 30)->default('other');
            $table->string('title')->nullable();
            $table->text('content');
            $table->timestamp('valid_from')->nullable();
            $table->timestamp('valid_until')->nullable();
            $table->boolean('is_active')->default(true);
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        // pgvector 向量列，供语义检索使用
        DB::statement('ALTER TABLE store_notes ADD COLUMN IF NOT EXISTS embedding vector(1536)');
    }

    public function down(): void
    {
        Schema::dropIfExists('store_notes');
    }
};
