<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\FactoryUnit;
use App\Models\Organization;
use App\Models\ProductionLine;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrganizationSetupTest extends TestCase
{
    use DatabaseTransactions;

    private User $adminUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->adminUser = User::firstOrCreate(
            ['username' => 'super.admin'],
            [
                'emp_id' => 'EMP-0001',
                'name' => 'System IT Administrator',
                'email' => 'it.admin@traceflow.com',
                'password' => \Illuminate\Support\Facades\Hash::make('Admin@123456'),
                'phone' => '+8801700000000',
                'department' => 'Information Technology',
                'designation' => 'Principal Enterprise Administrator',
                'is_active' => true,
                'default_dashboard_path' => '/admin/platform-overview',
            ]
        );

        Sanctum::actingAs($this->adminUser);
    }

    public function test_can_fetch_and_update_organization_profile(): void
    {
        $response = $this->getJson('/api/v1/master/organization');
        $response->assertStatus(200)
                 ->assertJsonPath('status', 'success')
                 ->assertJsonStructure(['data' => ['id', 'name', 'code']]);

        $updateResponse = $this->putJson('/api/v1/master/organization', [
            'name' => 'TraceFlow Global RMG Holdings',
            'code' => 'TF-HOLDINGS',
            'country' => 'Bangladesh',
            'contact_email' => 'holdings@traceflow.com',
        ]);

        $updateResponse->assertStatus(200)
                       ->assertJsonPath('data.name', 'TraceFlow Global RMG Holdings')
                       ->assertJsonPath('data.code', 'TF-HOLDINGS');
    }

    public function test_company_crud_lifecycle_and_validation(): void
    {
        $org = Organization::create([
            'name' => 'Demo Org',
            'code' => 'DEMO-ORG',
            'country' => 'Bangladesh',
        ]);

        // Validation failure without required fields
        $this->postJson('/api/v1/master/companies', [])
             ->assertStatus(422)
             ->assertJsonValidationErrors(['organization_id', 'name', 'code']);

        // Create company
        $storeResponse = $this->postJson('/api/v1/master/companies', [
            'organization_id' => $org->id,
            'name' => 'TraceFlow Woven Ltd.',
            'code' => 'TFW-01',
            'bin_number' => '123456789-0101',
            'currency' => 'USD',
            'is_active' => true,
        ]);

        $storeResponse->assertStatus(201)
                      ->assertJsonPath('data.name', 'TraceFlow Woven Ltd.');

        $companyId = $storeResponse->json('data.id');

        // Update company
        $this->putJson("/api/v1/master/companies/{$companyId}", [
            'name' => 'TraceFlow High-Fashion Woven Ltd.',
            'currency' => 'EUR',
        ])->assertStatus(200)
          ->assertJsonPath('data.name', 'TraceFlow High-Fashion Woven Ltd.');

        // Active List
        $this->getJson('/api/v1/master/companies/active')
             ->assertStatus(200)
             ->assertJsonFragment(['name' => 'TraceFlow High-Fashion Woven Ltd.']);
    }

    public function test_factory_unit_and_production_line_relationships(): void
    {
        $org = Organization::create([
            'name' => 'Apex Group',
            'code' => 'APEX',
            'country' => 'Bangladesh',
        ]);

        $company = Company::create([
            'organization_id' => $org->id,
            'name' => 'Apex Woven Apparels',
            'code' => 'AWA',
            'currency' => 'USD',
        ]);

        // Create Factory Unit
        $unitResponse = $this->postJson('/api/v1/master/units', [
            'company_id' => $company->id,
            'name' => 'Gazipur Cutting & Sewing Plant',
            'code' => 'GZP-01',
            'premises_type' => 'Woven',
            'total_floors' => 4,
            'is_active' => true,
        ]);

        $unitResponse->assertStatus(201)
                     ->assertJsonPath('data.code', 'GZP-01');

        $unitId = $unitResponse->json('data.id');

        // Create Production Line in this Unit
        $lineResponse = $this->postJson('/api/v1/master/lines', [
            'factory_unit_id' => $unitId,
            'name' => 'Sewing Line 01 (Jack A4 Auto)',
            'code' => 'LINE-01',
            'section_type' => 'Sewing',
            'floor_no' => '2nd Floor',
            'operator_capacity' => 38,
            'target_efficiency_percentage' => 75.50,
            'is_active' => true,
        ]);

        $lineResponse->assertStatus(201)
                     ->assertJsonPath('data.code', 'LINE-01')
                     ->assertJsonPath('data.operator_capacity', 38);

        $lineId = $lineResponse->json('data.id');

        // Attempting to delete factory unit with active lines must be blocked
        $this->deleteJson("/api/v1/master/units/{$unitId}")
             ->assertStatus(422)
             ->assertJsonPath('status', 'error');

        // Deleting line succeeds
        $this->deleteJson("/api/v1/master/lines/{$lineId}")
             ->assertStatus(200);

        // Deleting unit succeeds now
        $this->deleteJson("/api/v1/master/units/{$unitId}")
             ->assertStatus(200);
    }
}
