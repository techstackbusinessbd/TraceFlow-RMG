<?php

namespace App\Http\Controllers\Api\Master;

use App\Http\Controllers\Controller;
use App\Http\Requests\Master\FloorStoreRequest;
use App\Http\Requests\Master\FloorUpdateRequest;
use App\Models\Floor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FloorController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Floor::with(['building.factoryUnit.company'])->withCount(['productionLines']);

        if ($request->filled('building_id')) {
            $query->where('building_id', $request->input('building_id'));
        }

        if ($request->filled('factory_unit_id')) {
            $unitId = $request->input('factory_unit_id');
            $query->whereHas('building', function ($q) use ($unitId) {
                $q->where('factory_unit_id', $unitId);
            });
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('floor_number', 'ilike', "%{$search}%")
                  ->orWhere('code', 'ilike', "%{$search}%");
            });
        }

        if ($request->has('is_active') && $request->input('is_active') !== '') {
            $query->where('is_active', filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN));
        }

        $sortField = $request->input('sort_by', 'sort_order');
        $sortDir = $request->input('sort_dir', 'asc');
        $allowedSorts = ['sort_order', 'name', 'floor_number', 'code', 'area_sqft', 'created_at', 'is_active'];

        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDir === 'desc' ? 'desc' : 'asc');
        } else {
            // Default: strict sequential serial order
            $query->orderBy('sort_order', 'asc');
        }

        $floors = $query->paginate($request->input('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $floors,
        ]);
    }

    public function activeList(Request $request): JsonResponse
    {
        $query = Floor::where('is_active', true);

        if ($request->filled('building_id')) {
            $query->where('building_id', $request->input('building_id'));
        }

        if ($request->filled('factory_unit_id')) {
            $unitId = $request->input('factory_unit_id');
            $query->whereHas('building', function ($q) use ($unitId) {
                $q->where('factory_unit_id', $unitId);
            });
        }

        // Maintain strict serial sorting for floor display (user requirement)
        $floors = $query->orderBy('sort_order', 'asc')
            ->get(['id', 'building_id', 'name', 'floor_number', 'code', 'sort_order']);

        return response()->json([
            'status' => 'success',
            'data' => $floors,
        ]);
    }

    public function nextCode(Request $request): JsonResponse
    {
        $buildingId = $request->input('building_id');
        $code = $this->resolveNextCode($buildingId);

        return response()->json([
            'status' => 'success',
            'data' => [
                'code' => $code,
            ],
        ]);
    }

    private function resolveNextCode(?string $buildingId): string
    {
        $query = Floor::query();
        if ($buildingId) {
            $query->where('building_id', $buildingId);
        }

        $count = $query->count() + 1;
        $candidate = sprintf('FL-%02d', $count);

        while (
            Floor::when($buildingId, fn($q) => $q->where('building_id', $buildingId))
                ->where('code', $candidate)
                ->exists()
        ) {
            $count++;
            $candidate = sprintf('FL-%02d', $count);
        }

        return $candidate;
    }

    public function store(FloorStoreRequest $request): JsonResponse
    {
        $data = $request->validated();

        if (empty($data['code'])) {
            $data['code'] = $this->resolveNextCode($data['building_id']);
        }

        $floor = Floor::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Floor created successfully.',
            'data' => $floor->load(['building.factoryUnit']),
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $floor = Floor::with(['building.factoryUnit.company', 'productionLines'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $floor,
        ]);
    }

    public function update(FloorUpdateRequest $request, string $id): JsonResponse
    {
        $floor = Floor::findOrFail($id);
        $floor->update($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Floor updated successfully.',
            'data' => $floor->fresh(['building.factoryUnit']),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $floor = Floor::findOrFail($id);

        if ($floor->productionLines()->count() > 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot delete floor with active production lines. Please reassign production lines first.',
            ], 422);
        }

        $floor->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Floor archived successfully.',
        ]);
    }
}
