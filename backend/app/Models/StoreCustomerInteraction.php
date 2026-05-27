<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StoreCustomerInteraction extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_customer_id',
        'store_profile_id',
        'type',
        'content',
        'amount',
        'interacted_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'interacted_at' => 'datetime',
        ];
    }

    public function storeCustomer(): BelongsTo
    {
        return $this->belongsTo(StoreCustomer::class);
    }

    public function storeProfile(): BelongsTo
    {
        return $this->belongsTo(StoreProfile::class);
    }
}
