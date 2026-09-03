<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Universal Login Endpoint (Tri-Identifier Auth with Smart Role Redirection).
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $identifier = trim($request->input('identifier'));
        $password = $request->input('password');

        // Resolve user by Email, Emp ID, or Username
        $user = User::query()
            ->where('email', $identifier)
            ->orWhere('emp_id', $identifier)
            ->orWhere('username', $identifier)
            ->first();

        // 1. Check if user account is actively locked out
        if ($user && $user->is_locked && ! $user->hasRole('Super Admin')) {
            return response()->json([
                'type' => 'https://tools.ietf.org/html/rfc7807',
                'title' => 'Account Locked',
                'status' => 423,
                'detail' => 'Your account is locked due to multiple failed login attempts. Please contact your System Administrator to unlock it.',
            ], 423);
        }

        // 2. Validate Password and handle Brute-Force lockout
        if (! $user || ! Hash::check($password, $user->password)) {
            if ($user) {
                // Root Super Admin is PERMANENTLY immune to lockout (prevents DoS on root authority)
                if ($user->hasRole('Super Admin')) {
                    DB::table('audit_vault_logs')->insert([
                        'id' => (string) Str::uuid(),
                        'user_id' => $user->id,
                        'emp_id' => $user->emp_id,
                        'action' => 'FAILED_SUPER_ADMIN_LOGIN_ATTEMPT',
                        'entity_type' => 'User',
                        'entity_id' => $user->id,
                        'ip_address' => $request->ip(),
                        'user_agent' => $request->userAgent(),
                        'created_at' => now(),
                    ]);

                    return response()->json([
                        'type' => 'https://tools.ietf.org/html/rfc7807',
                        'title' => 'Authentication Failed',
                        'status' => 401,
                        'detail' => 'Invalid credentials provided. Please check your identifier and password.',
                    ], 401);
                }

                $newAttempts = $user->failed_login_attempts + 1;
                if ($newAttempts >= 5) {
                    $user->lockAccount();

                    // WORM Audit Log
                    DB::table('audit_vault_logs')->insert([
                        'id' => (string) Str::uuid(),
                        'user_id' => $user->id,
                        'emp_id' => $user->emp_id,
                        'action' => 'ACCOUNT_LOCKED_FAILED_ATTEMPTS',
                        'entity_type' => 'User',
                        'entity_id' => $user->id,
                        'ip_address' => $request->ip(),
                        'user_agent' => $request->userAgent(),
                        'created_at' => now(),
                    ]);

                    return response()->json([
                        'type' => 'https://tools.ietf.org/html/rfc7807',
                        'title' => 'Account Locked',
                        'status' => 423,
                        'detail' => 'Account has been locked due to 5 consecutive failed login attempts. Please contact your System Administrator.',
                    ], 423);
                }

                $user->update(['failed_login_attempts' => $newAttempts]);
                $remaining = 5 - $newAttempts;

                return response()->json([
                    'type' => 'https://tools.ietf.org/html/rfc7807',
                    'title' => 'Authentication Failed',
                    'status' => 401,
                    'detail' => "Invalid credentials provided. You have {$remaining} attempt(s) remaining before account lockout.",
                ], 401);
            }

            return response()->json([
                'type' => 'https://tools.ietf.org/html/rfc7807',
                'title' => 'Authentication Failed',
                'status' => 401,
                'detail' => 'Invalid credentials provided. Please check your identifier and password.',
            ], 401);
        }

        // 3. Reset failed attempts upon successful password match
        if ($user->failed_login_attempts > 0) {
            $user->update(['failed_login_attempts' => 0]);
        }

        if (! $user->is_active) {
            return response()->json([
                'type' => 'https://tools.ietf.org/html/rfc7807',
                'title' => 'Account Deactivated',
                'status' => 403,
                'detail' => 'Your account is deactivated. Please contact your System Administrator.',
            ], 403);
        }

        // Update login audit telemetry
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);

        // Insert into immutable WORM audit log
        DB::table('audit_vault_logs')->insert([
            'id' => (string) Str::uuid(),
            'user_id' => $user->id,
            'emp_id' => $user->emp_id,
            'action' => 'LOGIN',
            'entity_type' => 'User',
            'entity_id' => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
        ]);

        // Issue Sanctum Token
        $token = $user->createToken('traceflow-auth-token')->plainTextToken;

        // Fetch assigned role names
        $roles = $user->getRoleNames();
        $primaryRole = $roles->first() ?? 'Standard User';

        return response()->json([
            'message' => 'Authentication successful.',
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'emp_id' => $user->emp_id,
                'username' => $user->username,
                'name' => $user->name,
                'email' => $user->email,
                'department' => $user->department,
                'designation' => $user->designation,
                'primary_role' => $primaryRole,
                'roles' => $roles,
                'default_dashboard_path' => $user->default_dashboard_path ?: '/orders',
            ],
        ], 200);
    }

    /**
     * Get Current Authenticated User Profile.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'emp_id' => $user->emp_id,
                'username' => $user->username,
                'name' => $user->name,
                'email' => $user->email,
                'department' => $user->department,
                'designation' => $user->designation,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
                'default_dashboard_path' => $user->default_dashboard_path,
            ],
        ]);
    }

    /**
     * Revoke Current Access Token.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out.',
        ]);
    }
}
