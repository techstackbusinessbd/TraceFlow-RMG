<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;

class HealthController extends Controller
{
    /**
     * Comprehensive System Health Check.
     */
    public function check(): JsonResponse
    {
        $dbStatus = 'disconnected';
        $dbVersion = null;
        $redisStatus = 'disconnected';

        // 1. Check PostgreSQL 17 Connection
        try {
            $result = DB::select('SELECT version();');
            if (! empty($result)) {
                $dbStatus = 'connected';
                $dbVersion = $result[0]->version ?? 'PostgreSQL 17';
            }
        } catch (\Throwable $e) {
            $dbStatus = 'error: ' . $e->getMessage();
        }

        // 2. Check Redis 7 Connection
        try {
            $pong = Redis::ping();
            if ($pong === true || $pong === 'PONG') {
                $redisStatus = 'connected';
            }
        } catch (\Throwable $e) {
            $redisStatus = 'error: ' . $e->getMessage();
        }

        $allHealthy = ($dbStatus === 'connected' && $redisStatus === 'connected');

        return response()->json([
            'status' => $allHealthy ? 'healthy' : 'degraded',
            'application' => 'TraceFlow RMG Core API',
            'version' => '1.0.0',
            'framework' => 'Laravel 13',
            'database' => [
                'engine' => 'PostgreSQL 17',
                'status' => $dbStatus,
                'version' => $dbVersion,
            ],
            'cache_and_queue' => [
                'engine' => 'Redis 7',
                'status' => $redisStatus,
            ],
            'timestamp' => now()->toIso8601String(),
        ], $allHealthy ? 200 : 503);
    }
}
