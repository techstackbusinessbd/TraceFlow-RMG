<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(PermissionSeeder::class);
        // 1. Seed Core Enterprise Roles
        $roles = [
            'Super Admin',
            'Platform Owner',
            'Managing Director',
            'CEO',
            'Chairman',
            'General Manager',
            'Plant Head',
            'CFO',
            'Commercial Manager',
            'Head of QA',
            'Quality Manager',
            'Planning Manager',
            'IE Manager',
            'Fabric Store Manager',
            'Warehouse Head',
            'IT Admin',
            'Sewing Supervisor',
            'Cutting Master',
            'Floor Inspector',
            'Floor Operator',
            'Floor TV Device',
        ];

        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
        }

        // 2. Seed Accounts: abdulkhaled as Super Admin, super.admin as IT Admin
        $superAdmin = User::where('username', 'abdulkhaled')->orWhere('emp_id', '255776')->first();
        if ($superAdmin) {
            $superAdmin->syncRoles(['Super Admin']);
        }

        $itAdmin = User::firstOrCreate(
            ['username' => 'super.admin'],
            [
                'emp_id' => 'EMP-0001',
                'name' => 'System IT Administrator',
                'email' => 'it.admin@traceflow.com',
                'password' => Hash::make('Admin@123456'),
                'phone' => '+8801700000000',
                'department' => 'Information Technology',
                'designation' => 'Principal Enterprise Administrator',
                'is_active' => true,
                'default_dashboard_path' => '/admin/platform-overview',
            ]
        );

        if (! $superAdmin) {
            $itAdmin->syncRoles(['Super Admin']);
        } else {
            $itAdmin->syncRoles(['IT Admin']);
        }

        // 3. Seed Sample C-Suite CEO Account
        $ceoUser = User::firstOrCreate(
            ['username' => 'ceo.director'],
            [
                'emp_id' => 'EMP-0002',
                'name' => 'Managing Director & CEO',
                'email' => 'ceo@traceflow.com',
                'password' => Hash::make('Ceo@123456'),
                'department' => 'Executive Office',
                'designation' => 'Managing Director',
                'is_active' => true,
                'default_dashboard_path' => '/commercial/bi/dashboard',
            ]
        );
        $ceoUser->assignRole('CEO');

        // 4. Seed Sample QA Head Account
        $qaHead = User::firstOrCreate(
            ['username' => 'qa.head'],
            [
                'emp_id' => 'EMP-0003',
                'name' => 'Head of Quality Assurance',
                'email' => 'qa@traceflow.com',
                'password' => Hash::make('Qa@123456'),
                'department' => 'Quality Assurance',
                'designation' => 'Head of QA',
                'is_active' => true,
                'default_dashboard_path' => '/qc/dhu-board',
            ]
        );
        $qaHead->assignRole('Head of QA');
    }
}
