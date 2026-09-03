<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class UserAdminTest extends TestCase
{
    use DatabaseTransactions;

    private User $superAdmin;
    private string $superAdminToken;

    protected function setUp(): void
    {
        parent::setUp();

        $this->superAdmin = User::role('Super Admin')->first() ?? User::where('username', 'super.admin')->first();
        $this->superAdminToken = $this->superAdmin->createToken('admin-test-token')->plainTextToken;
    }

    public function test_super_admin_can_list_users(): void
    {
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->superAdminToken)
            ->getJson('/api/v1/admin/users');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data',
                'pagination' => ['total', 'per_page', 'current_page', 'last_page'],
            ]);
    }

    public function test_user_creation_fails_with_422_when_required_fields_missing(): void
    {
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->superAdminToken)
            ->postJson('/api/v1/admin/users', []);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'type',
                'title',
                'status',
                'errors' => ['emp_id', 'username', 'name', 'password', 'role'],
            ]);
    }

    public function test_user_creation_succeeds_with_valid_data(): void
    {
        $payload = [
            'emp_id' => 'EMP-TEST-999',
            'username' => 'test.qa.inspector',
            'name' => 'QA Inspection Officer',
            'email' => 'qa.inspector@traceflow.com',
            'password' => 'SecurePass#2026',
            'department' => 'Quality Assurance',
            'designation' => 'Senior Inspector',
            'role' => 'Floor Inspector',
            'is_active' => true,
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->superAdminToken)
            ->postJson('/api/v1/admin/users', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'emp_id' => 'EMP-TEST-999',
                    'username' => 'test.qa.inspector',
                    'department' => 'Quality Assurance',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'emp_id' => 'EMP-TEST-999',
            'username' => 'test.qa.inspector',
        ]);
    }

    public function test_user_soft_delete_and_restore_cycle(): void
    {
        // 1. Create user
        $user = User::create([
            'emp_id' => 'EMP-CYCLE-01',
            'username' => 'cycle.user',
            'name' => 'Cycle User',
            'password' => 'Secret123',
            'is_active' => true,
        ]);
        $user->assignRole('Floor Operator');

        // 2. Soft Delete
        $deleteResponse = $this->withHeader('Authorization', 'Bearer ' . $this->superAdminToken)
            ->deleteJson("/api/v1/admin/users/{$user->id}");

        $deleteResponse->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertSoftDeleted('users', ['id' => $user->id]);

        // 3. Archived List contains the user
        $archivedResponse = $this->withHeader('Authorization', 'Bearer ' . $this->superAdminToken)
            ->getJson('/api/v1/admin/users/archived');

        $archivedResponse->assertStatus(200);

        // 4. Restore user
        $restoreResponse = $this->withHeader('Authorization', 'Bearer ' . $this->superAdminToken)
            ->postJson("/api/v1/admin/users/{$user->id}/restore");

        $restoreResponse->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertNotSoftDeleted('users', ['id' => $user->id]);
    }

    public function test_super_admin_cannot_delete_self_or_root_super_admin(): void
    {
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->superAdminToken)
            ->deleteJson("/api/v1/admin/users/{$this->superAdmin->id}");

        $response->assertStatus(422)
            ->assertJson([
                'status' => 422,
                'title' => 'Self-Deletion Prohibited',
            ]);
    }

    public function test_permanent_force_delete_requires_correct_super_admin_password(): void
    {
        $targetUser = User::create([
            'emp_id' => 'EMP-PURGE-01',
            'username' => 'purge.target',
            'name' => 'Purge Target',
            'password' => 'Secret123',
        ]);

        // Wrong password fails with 422
        $wrongPwResponse = $this->withHeader('Authorization', 'Bearer ' . $this->superAdminToken)
            ->deleteJson("/api/v1/admin/users/{$targetUser->id}/force-delete", [
                'super_admin_password' => 'WrongPassword',
            ]);

        $wrongPwResponse->assertStatus(422)
            ->assertJson(['status' => 422]);

        // Correct password succeeds
        $correctPwResponse = $this->withHeader('Authorization', 'Bearer ' . $this->superAdminToken)
            ->deleteJson("/api/v1/admin/users/{$targetUser->id}/force-delete", [
                'super_admin_password' => 'Admin@123456',
            ]);

        $correctPwResponse->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('users', ['id' => $targetUser->id]);
    }

    public function test_can_retrieve_permissions_manifest_and_roles_list(): void
    {
        // 1. Manifest
        $manifestResponse = $this->withHeader('Authorization', 'Bearer ' . $this->superAdminToken)
            ->getJson('/api/v1/admin/permissions/system-manifest');

        $manifestResponse->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'manifest' => [
                    'User & Access Management',
                    'Master Data Management',
                    'Cutting & QR Bundling',
                ],
            ]);

        // 2. Roles List
        $rolesResponse = $this->withHeader('Authorization', 'Bearer ' . $this->superAdminToken)
            ->getJson('/api/v1/admin/roles');

        $rolesResponse->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data',
            ]);
    }

    public function test_can_manage_user_direct_custom_permissions(): void
    {
        $targetUser = User::create([
            'emp_id' => 'EMP-TEST-PERMS',
            'username' => 'test.perms.user',
            'name' => 'Custom Perms Tester',
            'email' => 'perms.tester@traceflow.com',
            'password' => Hash::make('Secret#123'),
            'department' => 'Cutting Floor',
            'designation' => 'Cutting Assistant',
            'is_active' => true,
        ]);
        $targetUser->assignRole('Cutting Master');

        // 1. Get user permissions
        $getResponse = $this->withHeader('Authorization', 'Bearer ' . $this->superAdminToken)
            ->getJson("/api/v1/admin/users/{$targetUser->id}/permissions");

        $getResponse->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'user',
                    'direct_permissions',
                    'role_permissions',
                    'all_permissions',
                ],
            ]);

        // 2. Grant custom direct privilege
        $updateResponse = $this->withHeader('Authorization', 'Bearer ' . $this->superAdminToken)
            ->putJson("/api/v1/admin/users/{$targetUser->id}/permissions", [
                'permissions' => ['orders.view', 'qc.view'],
            ]);

        $updateResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'direct_permissions' => ['orders.view', 'qc.view'],
                ],
            ]);

        $this->assertTrue($targetUser->fresh()->hasDirectPermission('orders.view'));
        $this->assertTrue($targetUser->fresh()->hasDirectPermission('qc.view'));

        // 3. Clear direct permissions
        $clearResponse = $this->withHeader('Authorization', 'Bearer ' . $this->superAdminToken)
            ->putJson("/api/v1/admin/users/{$targetUser->id}/permissions", [
                'permissions' => [],
            ]);

        $clearResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'direct_permissions' => [],
                ],
            ]);

        $this->assertFalse($targetUser->fresh()->hasDirectPermission('orders.view'));

        // Clean up
        $targetUser->forceDelete();
    }

    public function test_system_enforces_singleton_super_admin_and_allows_multiple_it_admins(): void
    {
        // 1. Attempting to create a second Super Admin must fail with 422
        $duplicateSuperAdminRes = $this->withHeader('Authorization', 'Bearer ' . $this->superAdminToken)
            ->postJson('/api/v1/admin/users', [
                'emp_id' => 'EMP-SUPER-2',
                'username' => 'second.super.admin',
                'name' => 'Second Super Admin',
                'email' => 'super2@traceflow.com',
                'password' => 'Pass#123456',
                'department' => 'IT',
                'role' => 'Super Admin',
            ]);

        $duplicateSuperAdminRes->assertStatus(422)
            ->assertJson([
                'status' => 422,
                'title' => 'Singleton Super Admin Restriction',
            ]);

        // 2. Creating multiple IT Admin accounts must succeed
        $itAdmin1Res = $this->withHeader('Authorization', 'Bearer ' . $this->superAdminToken)
            ->postJson('/api/v1/admin/users', [
                'emp_id' => 'EMP-IT-01',
                'username' => 'it.admin.01',
                'name' => 'IT Admin One',
                'email' => 'it1@traceflow.com',
                'password' => 'Pass#123456',
                'department' => 'Information Technology',
                'role' => 'IT Admin',
            ]);

        $itAdmin1Res->assertStatus(201);

        $itAdmin2Res = $this->withHeader('Authorization', 'Bearer ' . $this->superAdminToken)
            ->postJson('/api/v1/admin/users', [
                'emp_id' => 'EMP-IT-02',
                'username' => 'it.admin.02',
                'name' => 'IT Admin Two',
                'email' => 'it2@traceflow.com',
                'password' => 'Pass#123456',
                'department' => 'Information Technology',
                'role' => 'IT Admin',
            ]);

        $itAdmin2Res->assertStatus(201);

        // 3. Demoting the root Super Admin must fail with 403
        $demoteRes = $this->withHeader('Authorization', 'Bearer ' . $this->superAdminToken)
            ->putJson("/api/v1/admin/users/{$this->superAdmin->id}", [
                'emp_id' => $this->superAdmin->emp_id,
                'username' => $this->superAdmin->username,
                'name' => $this->superAdmin->name,
                'email' => $this->superAdmin->email,
                'is_active' => true,
                'role' => 'IT Admin',
            ]);

        $demoteRes->assertStatus(403)
            ->assertJson([
                'status' => 403,
                'title' => 'Protected Root Account',
            ]);

        // Clean up IT admins
        User::where('username', 'it.admin.01')->forceDelete();
        User::where('username', 'it.admin.02')->forceDelete();
    }
}

