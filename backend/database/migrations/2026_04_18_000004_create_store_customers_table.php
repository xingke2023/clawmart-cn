<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('store_customers', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('store_profile_id')->constrained()->cascadeOnDelete();
            $table->string('name', 100);
            $table->string('phone', 30)->nullable();
            $table->string('email', 100)->nullable();
            $table->string('address', 300)->nullable();
            $table->text('note')->nullable();
            $table->json('tags')->nullable();
            $table->decimal('total_spent', 10, 2)->default(0);
            $table->integer('visit_count')->default(0);
            $table->timestamp('last_contact_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('store_customers');
    }
};
