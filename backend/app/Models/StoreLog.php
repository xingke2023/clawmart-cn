<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StoreLog extends Model
{
    protected $fillable = [
        'store_profile_id',
        'category',
        'content',
        'amount',
        'amount_type',
        'logged_at',
    ];

    protected function casts(): array
    {
        return [
            'logged_at' => 'datetime',
        ];
    }

    public function storeProfile(): BelongsTo
    {
        return $this->belongsTo(StoreProfile::class);
    }
}
