<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditVaultLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditVaultController extends Controller
{
    /**
     * Display a paginated listing of WORM immutable audit logs.
     */
    public function index(Request $request): JsonResponse
    {
        $query = AuditVaultLog::query()->with('user:id,name,username,emp_id');

        // Search by emp_id, entity_id, or IP
        if ($search = $request->query('search')) {
            $search = trim($search);
            $query->where(function ($q) use ($search) {
                $q->where('emp_id', 'ILIKE', "%{$search}%")
                  ->orWhere('entity_id', 'ILIKE', "%{$search}%")
                  ->orWhere('ip_address', 'ILIKE', "%{$search}%");
            });
        }

        // Action Filter
        if ($action = $request->query('action')) {
            $query->where('action', strtoupper($action));
        }

        // Entity Type Filter
        if ($entityType = $request->query('entity_type')) {
            $query->where('entity_type', 'ILIKE', "%{$entityType}%");
        }

        // Date Range Filtering
        if ($dateFrom = $request->query('date_from')) {
            $query->where('created_at', '>=', $dateFrom);
        }
        if ($dateTo = $request->query('date_to')) {
            $query->where('created_at', '<=', $dateTo);
        }

        // Sorting
        $sortBy = $request->query('sort_by', 'created_at');
        $sortDirection = strtolower($request->query('sort_direction', 'desc')) === 'asc' ? 'asc' : 'desc';
        $allowedSorts = ['created_at', 'action', 'entity_type', 'emp_id'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }
        $query->orderBy($sortBy, $sortDirection);

        // Pagination
        $perPage = min(max((int) $request->query('per_page', 15), 5), 100);
        $paginated = $query->paginate($perPage);

        // KPI Telemetry Metrics
        $totalCount = AuditVaultLog::count();
        $authEventsCount = AuditVaultLog::where('action', 'LOGIN')->count();
        $purgeEventsCount = AuditVaultLog::where('action', 'PERMANENT_PURGE')->count();
        $mutationEventsCount = AuditVaultLog::whereIn('action', ['CREATE', 'UPDATE', 'DELETE', 'RESTORE'])->count();

        // Distinct Entity Types & Actions for Filter Dropdowns
        $distinctActions = AuditVaultLog::distinct()->pluck('action');
        $distinctEntities = AuditVaultLog::distinct()->pluck('entity_type');

        return response()->json([
            'status' => 'success',
            'data' => $paginated->items(),
            'pagination' => [
                'total' => $paginated->total(),
                'per_page' => $paginated->perPage(),
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'from' => $paginated->firstItem(),
                'to' => $paginated->lastItem(),
            ],
            'metrics' => [
                'total_logs' => $totalCount,
                'auth_events' => $authEventsCount,
                'mutation_events' => $mutationEventsCount,
                'purge_events' => $purgeEventsCount,
            ],
            'filters' => [
                'actions' => $distinctActions,
                'entity_types' => $distinctEntities,
            ],
        ]);
    }

    /**
     * Display a single immutable audit vault record.
     */
    public function show(string $id): JsonResponse
    {
        $log = AuditVaultLog::with('user:id,name,username,emp_id')->find($id);

        if (!$log) {
            return response()->json([
                'status' => 'error',
                'message' => 'Audit log record not found in the immutable vault.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $log,
        ]);
    }
}
