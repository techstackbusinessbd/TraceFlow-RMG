<?php

namespace App\Http\Controllers\Api\Master;

use App\Http\Controllers\Controller;
use App\Http\Requests\Master\OrganizationUpdateRequest;
use App\Models\Organization;
use Illuminate\Http\JsonResponse;

class OrganizationController extends Controller
{
    public function show(): JsonResponse
    {
        $organization = Organization::withCount(['companies'])->first();

        if (!$organization) {
            // Seed a default organization if none exists
            $organization = Organization::create([
                'name' => 'Apex Apparel Global Group',
                'code' => 'APEX-GRP',
                'registration_no' => 'C-78901/2012',
                'address' => 'Plot 12-14, Sector 7, Uttara Commercial Area, Dhaka-1230, Bangladesh',
                'country' => 'Bangladesh',
                'contact_email' => 'corporate@apexapparel.com',
                'contact_phone' => '+880-2-8901234',
                'website' => 'https://apexapparel.example.com',
                'settings' => [
                    'fiscal_year_start' => 'July',
                    'timezone' => 'Asia/Dhaka',
                    'currency' => 'USD',
                ],
            ]);
            $organization->loadCount(['companies']);
        }

        return response()->json([
            'status' => 'success',
            'data' => $organization,
        ]);
    }

    public function update(OrganizationUpdateRequest $request): JsonResponse
    {
        $organization = Organization::first();

        if (!$organization) {
            $organization = Organization::create($request->validated());
        } else {
            $organization->update($request->validated());
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Organization profile updated successfully.',
            'data' => $organization->fresh(),
        ]);
    }
}
