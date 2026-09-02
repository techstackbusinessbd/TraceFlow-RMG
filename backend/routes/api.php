<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HealthController;
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
});
