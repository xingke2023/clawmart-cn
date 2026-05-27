<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('store_photos', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('store_profile_id')
                ->constrained('store_profiles')
                ->cascadeOnDelete();
            $table->string('url');
            $table->string('caption')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('store_photos');
    }
};
