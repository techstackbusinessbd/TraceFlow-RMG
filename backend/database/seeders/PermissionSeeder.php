<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $modules = [
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

        $allPermissionNames = [];

        foreach ($modules as $group => $permissions) {
            foreach ($permissions as $name => $description) {
                Permission::firstOrCreate(
                    ['name' => $name, 'guard_name' => 'web']
                );
                $allPermissionNames[] = $name;
            }
        }

        // Assign all permissions to Super Admin role
        $superAdminRole = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
        $superAdminRole->syncPermissions($allPermissionNames);

        // Assign operational admin permissions to IT Admin
        $itAdminRole = Role::firstOrCreate(['name' => 'IT Admin', 'guard_name' => 'web']);
        $itAdminPermissions = array_diff($allPermissionNames, ['users.force_delete']);
        $itAdminRole->syncPermissions($itAdminPermissions);
    }
}
