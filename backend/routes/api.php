<?php

use App\Http\Controllers\Api\AuditVaultController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DeviceController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| TraceFlow RMG Enterprise API Routes
|--------------------------------------------------------------------------
| All routes strictly adhere to API-First, Pure Server Validation,
| and Sanctum Bearer Token security standards.
*/

// 1. System Health Check
Route::get('/health', [HealthController::class, 'check']);

// 2. Public Authentication Endpoints
Route::prefix('v1/auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

// 3. Protected Endpoints (auth:sanctum)
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // User Administration & Two-Tier Deletion
    Route::get('/admin/users/archived', [UserController::class, 'archived']);
    Route::post('/admin/users/{id}/restore', [UserController::class, 'restore']);
    Route::delete('/admin/users/{id}/force-delete', [UserController::class, 'forceDelete']);
    Route::post('/admin/users/{id}/unlock', [UserController::class, 'unlock']);
    Route::post('/admin/users/{id}/lock', [UserController::class, 'lock']);
    Route::post('/admin/users/{id}/reset-password', [UserController::class, 'resetPassword']);
    Route::get('/admin/users/{id}/permissions', [UserController::class, 'getPermissions']);
    Route::put('/admin/users/{id}/permissions', [UserController::class, 'updatePermissions']);
    Route::apiResource('admin/users', UserController::class);

    // Role & Permission RBAC
    Route::get('/admin/permissions/system-manifest', [RoleController::class, 'systemManifest']);
    Route::put('/admin/roles/{id}/permissions', [RoleController::class, 'updatePermissions']);
    Route::apiResource('admin/roles', RoleController::class)->except(['update']);

    // WORM Immutable Audit Vault
    Route::get('/admin/audit-vault', [AuditVaultController::class, 'index']);
    Route::get('/admin/audit-vault/{id}', [AuditVaultController::class, 'show']);

    // Factory Device Management
    Route::post('/admin/devices/probe-hardware', [DeviceController::class, 'probeHardware']);
    Route::post('/admin/devices/{id}/sync-telemetry', [DeviceController::class, 'syncTelemetry']);
    Route::post('/admin/devices/{id}/toggle-pairing', [DeviceController::class, 'togglePairing']);
    Route::apiResource('admin/devices', DeviceController::class);

    // Module 02: Master Library - Organization Structure Setup
    Route::prefix('master')->group(function () {
        // Group Organization
        Route::get('/organization', [\App\Http\Controllers\Api\Master\OrganizationController::class, 'show']);
        Route::put('/organization', [\App\Http\Controllers\Api\Master\OrganizationController::class, 'update']);

        // Sister Companies
        Route::get('/companies/active', [\App\Http\Controllers\Api\Master\CompanyController::class, 'activeList']);
        Route::apiResource('/companies', \App\Http\Controllers\Api\Master\CompanyController::class);

        // Factory Plants / Units
        Route::get('/units/active', [\App\Http\Controllers\Api\Master\FactoryUnitController::class, 'activeList']);
        Route::apiResource('/units', \App\Http\Controllers\Api\Master\FactoryUnitController::class);

        // Factory Buildings
        Route::get('/buildings/active', [\App\Http\Controllers\Api\Master\BuildingController::class, 'activeList']);
        Route::get('/buildings/next-code', [\App\Http\Controllers\Api\Master\BuildingController::class, 'nextCode']);
        Route::apiResource('/buildings', \App\Http\Controllers\Api\Master\BuildingController::class);

        // Building Floors
        Route::get('/floors/active', [\App\Http\Controllers\Api\Master\FloorController::class, 'activeList']);
        Route::get('/floors/next-code', [\App\Http\Controllers\Api\Master\FloorController::class, 'nextCode']);
        Route::apiResource('/floors', \App\Http\Controllers\Api\Master\FloorController::class);

        // Production Lines & Sections
        Route::get('/lines/active', [\App\Http\Controllers\Api\Master\ProductionLineController::class, 'activeList']);
        Route::get('/lines/next-code', [\App\Http\Controllers\Api\Master\ProductionLineController::class, 'nextCode']);
        Route::apiResource('/lines', \App\Http\Controllers\Api\Master\ProductionLineController::class);
    });
});

// Device Floor Telemetry & Dynamic DHCP Heartbeat (Called by factory tablets/scanners)
Route::post('/v1/devices/heartbeat', [DeviceController::class, 'heartbeat']);

