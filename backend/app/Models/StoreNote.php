<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StoreNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_profile_id',
        'type',
        'title',
        'content',
        'valid_from',
        'valid_until',
        'is_active',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'metadata' => 'array',
            'valid_from' => 'datetime',
            'valid_until' => 'datetime',
        ];
    }

    public function storeProfile(): BelongsTo
    {
        return $this->belongsTo(StoreProfile::class);
    }

    /**
     * 只返回当前有效的 notes（is_active=true 且未过期）
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query
            ->where('is_active', true)
            ->where(function (Builder $q): void {
                $q->whereNull('valid_until')
                    ->orWhere('valid_until', '>', now());
            });
    }
}
