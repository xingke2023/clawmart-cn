<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StorePhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_profile_id',
        'url',
        'caption',
        'category',
        'sort_order',
    ];

    public function storeProfile(): BelongsTo
    {
        return $this->belongsTo(StoreProfile::class);
    }
}
