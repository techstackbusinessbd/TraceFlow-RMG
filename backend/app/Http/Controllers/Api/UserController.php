<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ForceDeleteUserRequest;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserPermissionsRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    /**
     * Display a listing of active users with role/dept filters and search.
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorizePermission($request->user(), 'users.view');

        $query = User::query()->with('roles');

        // Text Search across emp_id, username, name, email
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('emp_id', 'ilike', "%{$search}%")
                  ->orWhere('username', 'ilike', "%{$search}%")
                  ->orWhere('name', 'ilike', "%{$search}%")
                  ->orWhere('email', 'ilike', "%{$search}%");
            });
        }

        // Role filter
        if ($role = $request->input('role')) {
            $query->whereHas('roles', function ($q) use ($role) {
                $q->where('name', $role);
            });
        }

        // Department filter
        if ($department = $request->input('department')) {
            $query->where('department', $department);
        }

        // Active state filter
        if ($request->has('is_active') && $request->input('is_active') !== '') {
            $query->where('is_active', filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN));
        }

        // Sorting
        $allowedSorts = ['emp_id', 'name', 'username', 'department', 'is_active', 'created_at'];
        $sortBy = in_array($request->input('sort_by'), $allowedSorts, true) ? $request->input('sort_by') : 'emp_id';
        $sortDirection = strtolower($request->input('sort_direction', 'asc')) === 'desc' ? 'desc' : 'asc';

        $perPage = min((int) $request->input('per_page', 15), 100);
        $users = $query->orderBy($sortBy, $sortDirection)->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $users->items(),
            'pagination' => [
                'total' => $users->total(),
                'per_page' => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'from' => $users->firstItem() ?? 0,
                'to' => $users->lastItem() ?? 0,
                'sort_by' => $sortBy,
                'sort_direction' => $sortDirection,
            ],
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = DB::transaction(function () use ($validated, $request) {
            $newUser = User::create([
                'emp_id' => strtoupper(trim($validated['emp_id'])),
                'username' => strtolower(trim($validated['username'])),
                'name' => trim($validated['name']),
                'email' => ! empty($validated['email']) ? strtolower(trim($validated['email'])) : null,
                'password' => Hash::make($validated['password']),
                'phone' => $validated['phone'] ?? null,
                'department' => $validated['department'] ?? null,
                'designation' => $validated['designation'] ?? null,
                'is_active' => $validated['is_active'] ?? true,
                'default_dashboard_path' => $validated['default_dashboard_path'] ?? '/orders',
            ]);

            $newUser->assignRole($validated['role']);

            // Append to WORM audit log
            DB::table('audit_vault_logs')->insert([
                'id' => (string) Str::uuid(),
                'user_id' => $request->user()->id,
                'emp_id' => $request->user()->emp_id,
                'action' => 'CREATE_USER',
                'entity_type' => 'User',
                'entity_id' => $newUser->id,
                'old_values' => null,
                'new_values' => json_encode([
                    'emp_id' => $newUser->emp_id,
                    'username' => $newUser->username,
                    'role' => $validated['role'],
                    'department' => $newUser->department,
                ]),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            return $newUser;
        });

        $user->load('roles');

        return response()->json([
            'success' => true,
            'message' => 'User account created successfully.',
            'data' => $user,
        ], 201);
    }

    /**
     * Display the specified user.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $this->authorizePermission($request->user(), 'users.view');

        $user = User::withTrashed()->with('roles')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $user,
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(UpdateUserRequest $request, string $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $validated = $request->validated();

        $oldSnapshot = [
            'emp_id' => $user->emp_id,
            'username' => $user->username,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->roles->pluck('name')->first(),
            'is_active' => $user->is_active,
        ];

        DB::transaction(function () use ($user, $validated, $oldSnapshot, $request) {
            $updateData = [
                'emp_id' => strtoupper(trim($validated['emp_id'])),
                'username' => strtolower(trim($validated['username'])),
                'name' => trim($validated['name']),
                'email' => ! empty($validated['email']) ? strtolower(trim($validated['email'])) : null,
                'phone' => $validated['phone'] ?? null,
                'department' => $validated['department'] ?? null,
                'designation' => $validated['designation'] ?? null,
                'is_active' => (bool) $validated['is_active'],
                'default_dashboard_path' => $validated['default_dashboard_path'] ?? $user->default_dashboard_path,
            ];

            if (! empty($validated['password'])) {
                $updateData['password'] = Hash::make($validated['password']);
            }

            $user->update($updateData);
            $user->syncRoles([$validated['role']]);

            // Append to WORM audit log
            DB::table('audit_vault_logs')->insert([
                'id' => (string) Str::uuid(),
                'user_id' => $request->user()->id,
                'emp_id' => $request->user()->emp_id,
                'action' => 'UPDATE_USER',
                'entity_type' => 'User',
                'entity_id' => $user->id,
                'old_values' => json_encode($oldSnapshot),
                'new_values' => json_encode([
                    'emp_id' => $user->emp_id,
                    'username' => $user->username,
                    'name' => $user->name,
                    'role' => $validated['role'],
                    'is_active' => $user->is_active,
                ]),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);
        });

        $user->load('roles');

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully.',
            'data' => $user,
        ]);
    }

    /**
     * Tier-1: Soft Delete User (Revokes active tokens and sets deleted_at).
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $this->authorizePermission($request->user(), 'users.delete');

        $user = User::findOrFail($id);

        // Safeguards
        if ($user->id === $request->user()->id) {
            return response()->json([
                'type' => 'https://tools.ietf.org/html/rfc7807',
                'title' => 'Self-Deletion Prohibited',
                'status' => 422,
                'detail' => 'You cannot delete your own logged-in account.',
            ], 422);
        }

        if ($user->username === 'super.admin') {
            return response()->json([
                'type' => 'https://tools.ietf.org/html/rfc7807',
                'title' => 'Protected System Account',
                'status' => 403,
                'detail' => 'The root Super Admin account is system-protected and cannot be deleted.',
            ], 403);
        }

        DB::transaction(function () use ($user, $request) {
            // Revoke all Sanctum tokens immediately
            $user->tokens()->delete();
            $user->update(['is_active' => false]);
            $user->delete();

            // Append to WORM audit log
            DB::table('audit_vault_logs')->insert([
                'id' => (string) Str::uuid(),
                'user_id' => $request->user()->id,
                'emp_id' => $request->user()->emp_id,
                'action' => 'SOFT_DELETE_USER',
                'entity_type' => 'User',
                'entity_id' => $user->id,
                'old_values' => json_encode(['username' => $user->username, 'emp_id' => $user->emp_id]),
                'new_values' => json_encode(['deleted_at' => now()->toIso8601String(), 'is_active' => false]),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'User account has been soft-deleted and archived.',
        ]);
    }

    /**
     * List all archived (soft-deleted) users.
     */
    public function archived(Request $request): JsonResponse
    {
        $this->authorizePermission($request->user(), 'users.view');

        $users = User::onlyTrashed()
            ->with('roles')
            ->orderBy('deleted_at', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $users->items(),
            'pagination' => [
                'total' => $users->total(),
                'per_page' => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
            ],
        ]);
    }

    /**
     * Restore an archived (soft-deleted) user.
     */
    public function restore(Request $request, string $id): JsonResponse
    {
        $this->authorizePermission($request->user(), 'users.restore');

        $user = User::onlyTrashed()->findOrFail($id);

        DB::transaction(function () use ($user, $request) {
            $user->restore();
            $user->update(['is_active' => true]);

            // Append to WORM audit log
            DB::table('audit_vault_logs')->insert([
                'id' => (string) Str::uuid(),
                'user_id' => $request->user()->id,
                'emp_id' => $request->user()->emp_id,
                'action' => 'RESTORE_USER',
                'entity_type' => 'User',
                'entity_id' => $user->id,
                'old_values' => json_encode(['deleted_at' => $user->deleted_at]),
                'new_values' => json_encode(['is_active' => true, 'restored_at' => now()->toIso8601String()]),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'User account restored successfully.',
        ]);
    }

    /**
     * Tier-2: Permanent Hard Delete (STRICT Super Admin Only + Password Auth + Production Check).
     */
    public function forceDelete(ForceDeleteUserRequest $request, string $id): JsonResponse
    {
        $authUser = $request->user();

        // 1. Re-authenticate Super Admin password
        if (! Hash::check($request->super_admin_password, $authUser->password)) {
            return response()->json([
                'type' => 'https://tools.ietf.org/html/rfc7807',
                'title' => 'Password Verification Failed',
                'status' => 422,
                'detail' => 'The Super Admin password provided is incorrect.',
                'errors' => [
                    'super_admin_password' => ['Incorrect Super Admin password.'],
                ],
            ], 422);
        }

        $user = User::withTrashed()->findOrFail($id);

        if ($user->username === 'super.admin' || $user->id === $authUser->id) {
            return response()->json([
                'type' => 'https://tools.ietf.org/html/rfc7807',
                'title' => 'Protected System Account',
                'status' => 403,
                'detail' => 'The primary root Super Admin account cannot be permanently destroyed.',
            ], 403);
        }

        // 2. Production History Check (Check for linked production transaction records)
        // If the user has created audit logs or production items, prevent orphaned records
        $hasAuditHistory = DB::table('audit_vault_logs')->where('user_id', $user->id)->exists();
        if ($hasAuditHistory) {
            return response()->json([
                'type' => 'https://tools.ietf.org/html/rfc7807',
                'title' => 'Referential Integrity Block',
                'status' => 409,
                'detail' => 'Cannot permanently purge user because critical factory audit history is linked to this account. Use Soft Delete to maintain compliance.',
            ], 409);
        }

        DB::transaction(function () use ($user, $authUser, $request) {
            $userSnapshot = [
                'emp_id' => $user->emp_id,
                'username' => $user->username,
                'name' => $user->name,
                'purged_by_super_admin' => $authUser->username,
            ];

            $user->forceDelete();

            // Permanent purge log in WORM audit vault
            DB::table('audit_vault_logs')->insert([
                'id' => (string) Str::uuid(),
                'user_id' => $authUser->id,
                'emp_id' => $authUser->emp_id,
                'action' => 'PERMANENT_PURGE_USER',
                'entity_type' => 'User',
                'entity_id' => $user->id,
                'old_values' => json_encode($userSnapshot),
                'new_values' => null,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'User account permanently purged from the system.',
        ]);
    }

    /**
     * Get user direct, role-inherited, and effective permissions.
     */
    public function getPermissions(Request $request, string $id): JsonResponse
    {
        $this->authorizePermission($request->user(), 'users.view');

        $user = User::with('roles')->findOrFail($id);

        $directPermissions = $user->getDirectPermissions()->pluck('name')->values()->toArray();
        $rolePermissions = $user->getPermissionsViaRoles()->pluck('name')->unique()->values()->toArray();
        $allPermissions = $user->getAllPermissions()->pluck('name')->unique()->values()->toArray();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'emp_id' => $user->emp_id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'department' => $user->department,
                    'designation' => $user->designation,
                    'roles' => $user->roles->pluck('name')->toArray(),
                ],
                'direct_permissions' => $directPermissions,
                'role_permissions' => $rolePermissions,
                'all_permissions' => $allPermissions,
            ],
        ]);
    }

    /**
     * Update direct custom permissions for a specific user.
     */
    public function updatePermissions(UpdateUserPermissionsRequest $request, string $id): JsonResponse
    {
        $user = User::with('roles')->findOrFail($id);

        if ($user->username === 'super.admin' && ! $request->user()->hasRole('Super Admin')) {
            return response()->json([
                'type' => 'https://tools.ietf.org/html/rfc7807',
                'title' => 'Forbidden Access',
                'status' => 403,
                'detail' => 'Only a Super Admin can modify root administrator permissions.',
            ], 403);
        }

        $oldDirect = $user->getDirectPermissions()->pluck('name')->toArray();
        $user->syncPermissions($request->permissions);

        // Audit Log in WORM immutable vault
        DB::table('audit_vault_logs')->insert([
            'id' => (string) Str::uuid(),
            'user_id' => $request->user()->id,
            'emp_id' => $request->user()->emp_id,
            'action' => 'UPDATE_USER_CUSTOM_PERMISSIONS',
            'entity_type' => 'User',
            'entity_id' => (string) $user->id,
            'old_values' => json_encode(['direct_permissions' => $oldDirect]),
            'new_values' => json_encode(['direct_permissions' => $request->permissions]),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User custom privileges updated successfully.',
            'data' => [
                'direct_permissions' => $user->getDirectPermissions()->pluck('name')->values()->toArray(),
                'role_permissions' => $user->getPermissionsViaRoles()->pluck('name')->unique()->values()->toArray(),
                'all_permissions' => $user->getAllPermissions()->pluck('name')->unique()->values()->toArray(),
            ],
        ]);
    }

    /**
     * Helper to verify permission or super admin role.
     */
    private function authorizePermission(User $user, string $permission): void
    {
        if ($user->hasRole('Super Admin')) {
            return;
        }

        if (! $user->can($permission)) {
            abort(response()->json([
                'type' => 'https://tools.ietf.org/html/rfc7807',
                'title' => 'Forbidden Access',
                'status' => 403,
                'detail' => "You do not possess the required privilege [{$permission}] to perform this action.",
            ], 403));
        }
    }
}
