<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Building extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'factory_unit_id',
        'name',
        'code',
        'total_floors',
        'description',
        'is_active',
    ];

    protected $casts = [
        'total_floors' => 'integer',
        'is_active' => 'boolean',
    ];

    public function factoryUnit(): BelongsTo
    {
        return $this->belongsTo(FactoryUnit::class);
    }

    public function floors(): HasMany
    {
        return $this->hasMany(Floor::class)->orderBy('sort_order', 'asc');
    }

    public function productionLines(): HasMany
    {
        return $this->hasMany(ProductionLine::class);
    }
}
