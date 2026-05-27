<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StoreInventoryTxn extends Model
{
    protected $fillable = [
        'store_profile_id',
        'product_id',
        'item_name',
        'type',
        'qty',
        'unit',
        'unit_price',
        'total_amount',
        'note',
        'txn_at',
    ];

    protected function casts(): array
    {
        return [
            'qty'          => 'decimal:3',
            'unit_price'   => 'decimal:2',
            'total_amount' => 'decimal:2',
            'txn_at'       => 'datetime',
        ];
    }

    public function storeProfile(): BelongsTo
    {
        return $this->belongsTo(StoreProfile::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(StoreProduct::class, 'product_id');
    }
}
