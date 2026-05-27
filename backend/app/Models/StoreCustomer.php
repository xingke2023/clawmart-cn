<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StoreCustomer extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_profile_id',
        'name',
        'phone',
        'email',
        'address',
        'note',
        'tags',
        'total_spent',
        'visit_count',
        'last_contact_at',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'total_spent' => 'decimal:2',
            'last_contact_at' => 'datetime',
        ];
    }

    public function storeProfile(): BelongsTo
    {
        return $this->belongsTo(StoreProfile::class);
    }

    public function interactions(): HasMany
    {
        return $this->hasMany(StoreCustomerInteraction::class);
    }
}
