<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Device extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'devices';

    protected $fillable = [
        'id',
        'device_code',
        'device_name',
        'device_type',
        'assigned_location',
        'mac_address',
        'ip_address',
        'pairing_status',
        'is_active',
        'last_ping_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_ping_at' => 'datetime',
    ];
}
