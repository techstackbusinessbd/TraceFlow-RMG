<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductionLine extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'factory_unit_id',
        'building_id',
        'floor_id',
        'name',
        'code',
        'section_type',
        'floor_no',
        'operator_capacity',
        'target_efficiency_percentage',
        'is_active',
    ];

    protected $casts = [
        'operator_capacity' => 'integer',
        'target_efficiency_percentage' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function factoryUnit(): BelongsTo
    {
        return $this->belongsTo(FactoryUnit::class);
    }

    public function building(): BelongsTo
    {
        return $this->belongsTo(Building::class);
    }

    public function floor(): BelongsTo
    {
        return $this->belongsTo(Floor::class);
    }
}
