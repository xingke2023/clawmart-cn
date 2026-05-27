<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('store_customer_interactions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('store_customer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('store_profile_id')->constrained()->cascadeOnDelete();
            $table->string('type', 20);
            $table->text('content');
            $table->decimal('amount', 10, 2)->nullable();
            $table->timestamp('interacted_at')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('store_customer_interactions');
    }
};
