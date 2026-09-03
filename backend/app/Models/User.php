<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasRoles, HasUuids, Notifiable, SoftDeletes;

    /**
     * Spatie Permission guard name.
     */
    protected $guard_name = 'web';

    /**
     * The primary key type is UUID string.
     */
    protected $keyType = 'string';
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'emp_id',
        'username',
        'email',
        'name',
        'password',
        'phone',
        'department',
        'designation',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'two_factor_confirmed_at',
        'is_active',
        'default_dashboard_path',
        'last_login_at',
        'last_login_ip',
        'failed_login_attempts',
        'locked_at',
        'locked_until',
        'unlocked_at',
        'unlocked_by',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    /**
     * Appended dynamic accessors.
     */
    protected $appends = [
        'is_locked',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'is_active' => 'boolean',
            'failed_login_attempts' => 'integer',
            'locked_at' => 'datetime',
            'locked_until' => 'datetime',
            'unlocked_at' => 'datetime',
            'last_login_at' => 'datetime',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Determine whether the user account is actively locked out.
     */
    public function getIsLockedAttribute(): bool
    {
        // Root Super Administrator is permanently immune to account lockouts
        if ($this->hasRole('Super Admin')) {
            return false;
        }

        if ($this->locked_at === null) {
            return false;
        }

        if ($this->locked_until !== null && $this->locked_until->isPast()) {
            return false;
        }

        return true;
    }

    /**
     * Lock the user account.
     */
    public function lockAccount(?\DateTimeInterface $until = null): void
    {
        // Root Super Administrator is permanently immune to account lockouts
        if ($this->hasRole('Super Admin')) {
            return;
        }

        $this->update([
            'locked_at' => now(),
            'locked_until' => $until,
            'failed_login_attempts' => max($this->failed_login_attempts, 5),
        ]);
    }

    /**
     * Unlock the user account.
     */
    public function unlockAccount(User $admin): void
    {
        $this->update([
            'failed_login_attempts' => 0,
            'locked_at' => null,
            'locked_until' => null,
            'unlocked_at' => now(),
            'unlocked_by' => $admin->id,
        ]);
    }
}

