<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('store_logs', function (Blueprint $table) {
            $table->decimal('amount', 10, 2)->nullable()->after('content');
            $table->string('amount_type', 10)->nullable()->after('amount'); // income / expense
        });
    }

    public function down(): void
    {
        Schema::table('store_logs', function (Blueprint $table) {
            $table->dropColumn(['amount', 'amount_type']);
        });
    }
};
