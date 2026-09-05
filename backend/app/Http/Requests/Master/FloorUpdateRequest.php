<?php

namespace App\Http\Requests\Master;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FloorUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $floorId = $this->route('floor') ?? $this->route('id');

        return [
            'building_id' => ['sometimes', 'required', 'uuid', 'exists:buildings,id'],
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'floor_number' => ['sometimes', 'required', 'string', 'max:50'],
            'code' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                Rule::unique('floors')->where(function ($query) {
                    return $query->where('building_id', $this->building_id ?? $this->floor?->building_id)
                                 ->whereNull('deleted_at');
                })->ignore($floorId),
            ],
            'sort_order' => ['sometimes', 'required', 'integer', 'min:0', 'max:100'],
            'area_sqft' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ];
    }
}
