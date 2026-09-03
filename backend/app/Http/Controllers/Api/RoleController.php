<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreRoleRequest;
use App\Http\Requests\Admin\UpdateRolePermissionsRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Get system permissions manifest grouped by module.
     */
    public function systemManifest(Request $request): JsonResponse
    {
        $this->authorizePermission($request->user(), 'roles.view');

        $grouped = [
            'User & Access Management' => [
                'users.view' => 'View users directory and profile details',
                'users.create' => 'Create new user accounts',
                'users.edit' => 'Update user details and status',
                'users.delete' => 'Soft delete and deactivate user accounts',
                'users.restore' => 'Restore deactivated or archived users',
                'users.force_delete' => 'Permanently purge user accounts (Super Admin only)',
                'roles.view' => 'View roles and permission matrices',
                'roles.create' => 'Create new system roles',
                'roles.edit' => 'Configure and update role permissions',
                'roles.delete' => 'Remove custom roles',
                'audit.view' => 'View enterprise forensic audit vault logs',
            ],
            'Master Data Management' => [
                'master_data.view' => 'View buyers, styles, colors, sizes, and lines',
                'master_data.create' => 'Add new master data entities',
                'master_data.edit' => 'Update master data records',
                'master_data.delete' => 'Deactivate or soft delete master data records',
            ],
            'Order Management & Planning' => [
                'orders.view' => 'View buyer orders and purchase orders',
                'orders.create' => 'Create new purchase orders and style mappings',
                'orders.edit' => 'Modify order quantities and delivery dates',
                'orders.delete' => 'Cancel or archive purchase orders',
                'planning.view' => 'View production schedules and line allocations',
                'planning.edit' => 'Allocate styles and quantities to sewing lines',
            ],
            'Cutting & QR Bundling' => [
                'cutting.view' => 'View cutting orders and marker plans',
                'cutting.create' => 'Create cutting lays and mark roll consumption',
                'cutting.bundle_generate' => 'Generate and print single-piece QR bundle tickets',
            ],
            'Sewing Floor Tracking' => [
                'sewing.view' => 'Monitor live line-in and line-out production speeds',
                'sewing.line_in' => 'Scan bundles into sewing lines',
                'sewing.line_out' => 'Scan completed garments out of sewing lines',
            ],
            'Quality Control (QC)' => [
                'qc.view' => 'View end-line QC boards and DHU analytics',
                'qc.inspect' => 'Perform 100% garment inspection scan',
                'qc.defect_log' => 'Record defects and send garments to alteration',
            ],
            'Finishing, Packing & Export' => [
                'finishing.view' => 'View iron, wash and finishing status',
                'packing.view' => 'View packing lists and carton mappings',
                'packing.carton_scan' => 'Scan garments into master cartons',
                'commercial.export' => 'Approve container stuffing and export invoices',
            ],
        ];

        return response()->json([
            'success' => true,
            'manifest' => $grouped,
        ]);
    }

    /**
     * Display a listing of all roles with counts and slug.
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorizePermission($request->user(), 'roles.view');

        $roles = Role::with(['permissions'])
            ->withCount('users')
            ->orderBy('name', 'asc')
            ->get()
            ->map(function ($role) {
                $roleArray = $role->toArray();
                $roleArray['slug'] = Str::slug($role->name);
                return $roleArray;
            });

        return response()->json([
            'success' => true,
            'data' => $roles,
        ]);
    }

    /**
     * Store a newly created role.
     */
    public function store(StoreRoleRequest $request): JsonResponse
    {
        $role = Role::create([
            'name' => trim($request->name),
            'guard_name' => 'web',
        ]);

        if ($request->has('permissions') && is_array($request->permissions)) {
            $role->syncPermissions($request->permissions);
        }

        // Audit Log
        DB::table('audit_vault_logs')->insert([
            'id' => (string) Str::uuid(),
            'user_id' => $request->user()->id,
            'emp_id' => $request->user()->emp_id,
            'action' => 'CREATE_ROLE',
            'entity_type' => 'Role',
            'entity_id' => (string) $role->id,
            'new_values' => json_encode(['name' => $role->name, 'permissions' => $request->permissions]),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
        ]);

        $roleData = $role->load('permissions')->toArray();
        $roleData['slug'] = Str::slug($role->name);

        return response()->json([
            'success' => true,
            'message' => 'System role created successfully.',
            'data' => $roleData,
        ], 201);
    }

    /**
     * Display the specified role by ID or slug.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $this->authorizePermission($request->user(), 'roles.view');

        $role = $this->resolveRole($id);
        $roleData = $role->toArray();
        $roleData['slug'] = Str::slug($role->name);

        return response()->json([
            'success' => true,
            'data' => $roleData,
        ]);
    }

    /**
     * Update permissions for a specific role by ID or slug.
     */
    public function updatePermissions(UpdateRolePermissionsRequest $request, string $id): JsonResponse
    {
        $role = $this->resolveRole($id);

        if ($role->name === 'Super Admin' && ! $request->user()->hasRole('Super Admin')) {
            return response()->json([
                'type' => 'https://tools.ietf.org/html/rfc7807',
                'title' => 'Forbidden Access',
                'status' => 403,
                'detail' => 'Only a Super Admin can modify the Super Admin role permissions.',
            ], 403);
        }

        $oldPermissions = $role->permissions->pluck('name')->toArray();
        $role->syncPermissions($request->permissions);

        // Audit Log
        DB::table('audit_vault_logs')->insert([
            'id' => (string) Str::uuid(),
            'user_id' => $request->user()->id,
            'emp_id' => $request->user()->emp_id,
            'action' => 'UPDATE_ROLE_PERMISSIONS',
            'entity_type' => 'Role',
            'entity_id' => (string) $role->id,
            'old_values' => json_encode(['permissions' => $oldPermissions]),
            'new_values' => json_encode(['permissions' => $request->permissions]),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Role permissions updated successfully.',
            'data' => $role->load('permissions'),
        ]);
    }

    /**
     * Delete a custom role.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $this->authorizePermission($request->user(), 'roles.delete');

        $role = $this->resolveRole($id);

        if ($role->name === 'Super Admin') {
            return response()->json([
                'type' => 'https://tools.ietf.org/html/rfc7807',
                'title' => 'Protected Role',
                'status' => 403,
                'detail' => 'The Super Admin role is protected and cannot be removed.',
            ], 403);
        }

        if ($role->users_count > 0) {
            return response()->json([
                'type' => 'https://tools.ietf.org/html/rfc7807',
                'title' => 'Assigned Role Conflict',
                'status' => 409,
                'detail' => "Cannot delete role because it is assigned to {$role->users_count} active user(s). Reassign users first.",
            ], 409);
        }

        $role->delete();

        // Audit Log
        DB::table('audit_vault_logs')->insert([
            'id' => (string) Str::uuid(),
            'user_id' => $request->user()->id,
            'emp_id' => $request->user()->emp_id,
            'action' => 'DELETE_ROLE',
            'entity_type' => 'Role',
            'entity_id' => (string) $role->id,
            'old_values' => json_encode(['name' => $role->name]),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Role deleted successfully.',
        ]);
    }

    /**
     * Resolve Role model by numeric ID or URL Slug.
     */
    private function resolveRole(string $identifier): Role
    {
        if (is_numeric($identifier)) {
            return Role::with('permissions')->withCount('users')->findOrFail((int) $identifier);
        }

        $normalized = str_replace('-', ' ', $identifier);
        $role = Role::with('permissions')
            ->withCount('users')
            ->whereRaw('LOWER(name) = ?', [strtolower($normalized)])
            ->orWhereRaw('LOWER(name) = ?', [strtolower($identifier)])
            ->first();

        if (! $role) {
            $allRoles = Role::with('permissions')->withCount('users')->get();
            $role = $allRoles->first(fn ($r) => Str::slug($r->name) === strtolower($identifier));
        }

        if (! $role) {
            abort(response()->json([
                'type' => 'https://tools.ietf.org/html/rfc7807',
                'title' => 'Role Not Found',
                'status' => 404,
                'detail' => "No system role found matching identifier [{$identifier}].",
            ], 404));
        }

        return $role;
    }

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

