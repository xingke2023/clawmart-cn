<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IndustrySolution extends Model
{
    protected $fillable = [
        'industry_key',
        'name',
        'emoji',
        'tagline',
        'pain_points',
        'target_users',
        'modules',
        'keywords',
        'listing_id',
        'status',
        'generation_error',
        'generated_at',
    ];

    protected function casts(): array
    {
        return [
            'pain_points'    => 'array',
            'target_users'   => 'array',
            'modules'        => 'array',
            'keywords'       => 'array',
            'generated_at'   => 'datetime',
        ];
    }

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }
}
