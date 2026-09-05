<?php

namespace App\Http\Controllers\Api\Master;

use App\Http\Controllers\Controller;
use App\Http\Requests\Master\ProductionLineStoreRequest;
use App\Http\Requests\Master\ProductionLineUpdateRequest;
use App\Models\ProductionLine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductionLineController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ProductionLine::with(['factoryUnit.company', 'building', 'floor']);

        if ($request->filled('factory_unit_id')) {
            $query->where('factory_unit_id', $request->input('factory_unit_id'));
        }

        if ($request->filled('building_id')) {
            $query->where('building_id', $request->input('building_id'));
        }

        if ($request->filled('floor_id')) {
            $query->where('floor_id', $request->input('floor_id'));
        }

        if ($request->filled('section_type')) {
            $query->where('section_type', $request->input('section_type'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('code', 'ilike', "%{$search}%")
                  ->orWhere('floor_no', 'ilike', "%{$search}%");
            });
        }

        if ($request->has('is_active') && $request->input('is_active') !== '') {
            $query->where('is_active', filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN));
        }

        $lines = $query->orderBy('name', 'asc')->paginate($request->input('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $lines,
        ]);
    }

    public function nextCode(Request $request): JsonResponse
    {
        $factoryUnitId = $request->input('factory_unit_id');
        $sectionType = $request->input('section_type', 'Sewing');

        $code = $this->resolveNextCode($factoryUnitId, $sectionType);

        return response()->json([
            'status' => 'success',
            'data' => [
                'code' => $code,
            ],
        ]);
    }

    protected function resolveNextCode(?string $factoryUnitId, string $sectionType): string
    {
        $prefix = match (strtoupper($sectionType)) {
            'SEWING' => 'L',
            'CUTTING' => 'CUT',
            'FINISHING' => 'FIN',
            'EMBROIDERY' => 'EMB',
            'PRINTING' => 'PRN',
            'PACKAGING' => 'PCK',
            'WASHING' => 'WSH',
            'QC' => 'QC',
            'EMBELLISHMENT' => 'EMB',
            default => 'SEC',
        };

        $query = ProductionLine::where('section_type', $sectionType);
        if ($factoryUnitId) {
            $query->where('factory_unit_id', $factoryUnitId);
        }

        $count = $query->count() + 1;
        $candidate = sprintf('%s-%02d', $prefix, $count);

        while (
            ProductionLine::when($factoryUnitId, fn($q) => $q->where('factory_unit_id', $factoryUnitId))
                ->where('code', $candidate)
                ->exists()
        ) {
            $count++;
            $candidate = sprintf('%s-%02d', $prefix, $count);
        }

        return $candidate;
    }

    public function store(ProductionLineStoreRequest $request): JsonResponse
    {
        $data = $request->validated();

        if (empty($data['code'])) {
            $data['code'] = $this->resolveNextCode($data['factory_unit_id'], $data['section_type']);
        }

        $line = ProductionLine::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Production Line/Section created successfully.',
            'data' => $line->load(['factoryUnit.company', 'building', 'floor']),
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $line = ProductionLine::with(['factoryUnit.company', 'building', 'floor'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $line,
        ]);
    }

    public function update(ProductionLineUpdateRequest $request, string $id): JsonResponse
    {
        $line = ProductionLine::findOrFail($id);
        $line->update($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Production Line/Section updated successfully.',
            'data' => $line->fresh(['factoryUnit.company', 'building', 'floor']),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $line = ProductionLine::findOrFail($id);
        $line->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Production Line/Section removed successfully.',
        ]);
    }

    public function activeList(Request $request): JsonResponse
    {
        $query = ProductionLine::where('is_active', true);

        if ($request->filled('factory_unit_id')) {
            $query->where('factory_unit_id', $request->input('factory_unit_id'));
        }

        if ($request->filled('section_type')) {
            $query->where('section_type', $request->input('section_type'));
        }

        $lines = $query->select('id', 'factory_unit_id', 'name', 'code', 'section_type', 'floor_no', 'operator_capacity')
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $lines,
        ]);
    }
}
