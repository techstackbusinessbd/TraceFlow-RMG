<?php

namespace App\Http\Controllers\Api\Master;

use App\Http\Controllers\Controller;
use App\Http\Requests\Master\BuildingStoreRequest;
use App\Http\Requests\Master\BuildingUpdateRequest;
use App\Models\Building;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BuildingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Building::with(['factoryUnit.company'])->withCount(['floors', 'productionLines']);

        if ($request->filled('factory_unit_id')) {
            $query->where('factory_unit_id', $request->input('factory_unit_id'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('code', 'ilike', "%{$search}%");
            });
        }

        if ($request->has('is_active') && $request->input('is_active') !== '') {
            $query->where('is_active', filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN));
        }

        $sortField = $request->input('sort_by', 'created_at');
        $sortDir = $request->input('sort_dir', 'desc');
        $allowedSorts = ['name', 'code', 'total_floors', 'created_at', 'is_active'];

        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDir === 'asc' ? 'asc' : 'desc');
        } else {
            $query->latest();
        }

        $buildings = $query->paginate($request->input('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $buildings,
        ]);
    }

    public function activeList(Request $request): JsonResponse
    {
        $query = Building::where('is_active', true);

        if ($request->filled('factory_unit_id')) {
            $query->where('factory_unit_id', $request->input('factory_unit_id'));
        }

        $buildings = $query->orderBy('name', 'asc')->get(['id', 'factory_unit_id', 'name', 'code', 'total_floors']);

        return response()->json([
            'status' => 'success',
            'data' => $buildings,
        ]);
    }

    public function nextCode(Request $request): JsonResponse
    {
        $factoryUnitId = $request->input('factory_unit_id');
        $code = $this->resolveNextCode($factoryUnitId);

        return response()->json([
            'status' => 'success',
            'data' => [
                'code' => $code,
            ],
        ]);
    }

    private function resolveNextCode(?string $factoryUnitId): string
    {
        $query = Building::query();
        if ($factoryUnitId) {
            $query->where('factory_unit_id', $factoryUnitId);
        }

        $count = $query->count() + 1;
        $candidate = sprintf('BLD-%02d', $count);

        while (
            Building::when($factoryUnitId, fn($q) => $q->where('factory_unit_id', $factoryUnitId))
                ->where('code', $candidate)
                ->exists()
        ) {
            $count++;
            $candidate = sprintf('BLD-%02d', $count);
        }

        return $candidate;
    }

    public function store(BuildingStoreRequest $request): JsonResponse
    {
        $data = $request->validated();

        if (empty($data['code'])) {
            $data['code'] = $this->resolveNextCode($data['factory_unit_id']);
        }

        $building = Building::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Factory building registered successfully.',
            'data' => $building->load(['factoryUnit.company']),
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $building = Building::with(['factoryUnit.company', 'floors' => function ($q) {
            $q->orderBy('sort_order', 'asc');
        }])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $building,
        ]);
    }

    public function update(BuildingUpdateRequest $request, string $id): JsonResponse
    {
        $building = Building::findOrFail($id);
        $building->update($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Building updated successfully.',
            'data' => $building->fresh(['factoryUnit.company']),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $building = Building::findOrFail($id);

        if ($building->floors()->count() > 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot delete building with active floors. Please delete or reassign floors first.',
            ], 422);
        }

        $building->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Building archived successfully.',
        ]);
    }
}
