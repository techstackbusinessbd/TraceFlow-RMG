<?php

namespace App\Http\Controllers\Api\Master;

use App\Http\Controllers\Controller;
use App\Http\Requests\Master\FactoryUnitStoreRequest;
use App\Http\Requests\Master\FactoryUnitUpdateRequest;
use App\Models\FactoryUnit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FactoryUnitController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = FactoryUnit::with(['company'])->withCount(['productionLines']);

        if ($request->filled('company_id')) {
            $query->where('company_id', $request->input('company_id'));
        }

        if ($request->filled('premises_type')) {
            $query->where('premises_type', $request->input('premises_type'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('code', 'ilike', "%{$search}%")
                  ->orWhere('city', 'ilike', "%{$search}%");
            });
        }

        if ($request->has('is_active') && $request->input('is_active') !== '') {
            $query->where('is_active', filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN));
        }

        $units = $query->orderBy('name', 'asc')->paginate($request->input('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $units,
        ]);
    }

    public function store(FactoryUnitStoreRequest $request): JsonResponse
    {
        $unit = FactoryUnit::create($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Factory Plant created successfully.',
            'data' => $unit->load('company'),
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $unit = FactoryUnit::with(['company', 'productionLines'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $unit,
        ]);
    }

    public function update(FactoryUnitUpdateRequest $request, string $id): JsonResponse
    {
        $unit = FactoryUnit::findOrFail($id);
        $unit->update($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Factory Plant updated successfully.',
            'data' => $unit->fresh(['company']),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $unit = FactoryUnit::withCount('productionLines')->findOrFail($id);

        if ($unit->production_lines_count > 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot delete factory plant with active production lines/sections.',
            ], 422);
        }

        $unit->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Factory Plant removed successfully.',
        ]);
    }

    public function activeList(Request $request): JsonResponse
    {
        $query = FactoryUnit::where('is_active', true);

        if ($request->filled('company_id')) {
            $query->where('company_id', $request->input('company_id'));
        }

        $units = $query->select('id', 'company_id', 'name', 'code', 'premises_type')
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $units,
        ]);
    }
}
