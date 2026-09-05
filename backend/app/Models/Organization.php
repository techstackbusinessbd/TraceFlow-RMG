<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Organization extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'name',
        'code',
        'registration_no',
        'logo_path',
        'address',
        'country',
        'contact_email',
        'contact_phone',
        'website',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
    ];

    public function companies(): HasMany
    {
        return $this->hasMany(Company::class);
    }
}
