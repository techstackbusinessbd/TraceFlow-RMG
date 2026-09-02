<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use \Illuminate\Foundation\Testing\DatabaseTransactions;
    public function test_system_health_check_returns_healthy_with_postgres_and_redis(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'healthy',
                'application' => 'TraceFlow RMG Core API',
                'framework' => 'Laravel 13',
                'database' => [
                    'engine' => 'PostgreSQL 17',
                    'status' => 'connected',
                ],
            ]);
    }

    public function test_login_fails_with_422_when_fields_are_missing(): void
    {
        $response = $this->postJson('/api/v1/auth/login', []);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'type',
                'title',
                'status',
                'detail',
                'errors' => [
                    'identifier',
                    'password',
                ],
            ]);
    }

    public function test_login_fails_with_401_on_invalid_credentials(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'identifier' => 'nonexistent.user',
            'password' => 'WrongPassword123',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'status' => 401,
                'title' => 'Authentication Failed',
            ]);
    }

    public function test_login_succeeds_with_emp_id(): void
    {
        $user = User::firstOrCreate(
            ['username' => 'test.planner'],
            [
                'emp_id' => 'EMP-TEST-01',
                'name' => 'Planning Incharge',
                'email' => 'planner@traceflow.com',
                'password' => Hash::make('Secret123'),
                'is_active' => true,
                'default_dashboard_path' => '/planning/dashboard',
            ]
        );

        $response = $this->postJson('/api/v1/auth/login', [
            'identifier' => 'EMP-TEST-01',
            'password' => 'Secret123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'token',
                'token_type',
                'user' => [
                    'id',
                    'emp_id',
                    'username',
                    'default_dashboard_path',
                ],
            ])
            ->assertJson([
                'user' => [
                    'emp_id' => 'EMP-TEST-01',
                    'default_dashboard_path' => '/planning/dashboard',
                ],
            ]);
    }

    public function test_authenticated_user_can_access_me_and_logout(): void
    {
        $user = User::where('username', 'super.admin')->first();

        $token = $user->createToken('test-token')->plainTextToken;

        // 1. Test /api/v1/auth/me
        $meResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/auth/me');

        $meResponse->assertStatus(200)
            ->assertJson([
                'user' => [
                    'username' => 'super.admin',
                ],
            ]);

        // 2. Test /api/v1/auth/logout
        $logoutResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/auth/logout');

        $logoutResponse->assertStatus(200)
            ->assertJson([
                'message' => 'Successfully logged out.',
            ]);
    }
}
