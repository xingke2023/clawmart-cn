<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StoreProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_profile_id',
        'name',
        'price',
        'stock',
        'unit',
        'description',
        'image_url',
        'is_active',
        'sort_order',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_active' => 'boolean',
            'metadata' => 'array',
        ];
    }

    public function storeProfile(): BelongsTo
    {
        return $this->belongsTo(StoreProfile::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(StoreProductPhoto::class)->orderBy('sort_order');
    }
}
