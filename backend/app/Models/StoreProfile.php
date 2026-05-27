<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StoreProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'shop_name',
        'shop_description',
        'logo_url',
        'contact_phone',
        'contact_email',
        'address',
        'business_hours',
        'tags',
        'is_public',
        'slug',
        'store_type',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'is_public' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(StoreNote::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(StoreProduct::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(StoreBooking::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(StorePhoto::class)->orderBy('sort_order');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(StoreLog::class);
    }

    public function inventoryTxns(): HasMany
    {
        return $this->hasMany(StoreInventoryTxn::class);
    }

    public function customers(): HasMany
    {
        return $this->hasMany(StoreCustomer::class);
    }
}
