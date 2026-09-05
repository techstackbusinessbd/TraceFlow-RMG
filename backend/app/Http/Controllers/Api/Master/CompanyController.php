<?php

namespace App\Http\Controllers\Api\Master;

use App\Http\Controllers\Controller;
use App\Http\Requests\Master\CompanyStoreRequest;
use App\Http\Requests\Master\CompanyUpdateRequest;
use App\Models\Company;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Company::with(['organization'])->withCount(['factoryUnits']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('code', 'ilike', "%{$search}%")
                  ->orWhere('bin_number', 'ilike', "%{$search}%");
            });
        }

        if ($request->has('is_active') && $request->input('is_active') !== '') {
            $query->where('is_active', filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN));
        }

        $companies = $query->orderBy('name', 'asc')->paginate($request->input('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $companies,
        ]);
    }

    public function store(CompanyStoreRequest $request): JsonResponse
    {
        $company = Company::create($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Sister Company created successfully.',
            'data' => $company->load('organization'),
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $company = Company::with(['organization', 'factoryUnits'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $company,
        ]);
    }

    public function update(CompanyUpdateRequest $request, string $id): JsonResponse
    {
        $company = Company::findOrFail($id);
        $company->update($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Sister Company updated successfully.',
            'data' => $company->fresh(['organization']),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $company = Company::withCount('factoryUnits')->findOrFail($id);

        if ($company->factory_units_count > 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot delete company with active factory plants. Please reassign or delete plants first.',
            ], 422);
        }

        $company->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Sister Company removed successfully.',
        ]);
    }

    public function activeList(): JsonResponse
    {
        $companies = Company::where('is_active', true)
            ->select('id', 'name', 'code', 'currency')
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $companies,
        ]);
    }
}
