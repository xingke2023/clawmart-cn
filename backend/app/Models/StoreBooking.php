<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StoreBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_profile_id',
        'status',
        'customer_name',
        'customer_phone',
        'customer_note',
        'booking_at',
        'table_area',
        'party_size',
        'items',
        'extra',
    ];

    protected function casts(): array
    {
        return [
            'booking_at' => 'datetime',
            'items' => 'array',
            'extra' => 'array',
        ];
    }

    public function storeProfile(): BelongsTo
    {
        return $this->belongsTo(StoreProfile::class);
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'pending');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->whereIn('status', ['pending', 'confirmed', 'in_progress']);
    }
}
