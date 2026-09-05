<?php

namespace App\Http\Requests\Master;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BuildingUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $buildingId = $this->route('building') ?? $this->route('id');

        return [
            'factory_unit_id' => ['sometimes', 'required', 'uuid', 'exists:factory_units,id'],
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'code' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                Rule::unique('buildings')->where(function ($query) {
                    return $query->where('factory_unit_id', $this->factory_unit_id ?? $this->building?->factory_unit_id)
                                 ->whereNull('deleted_at');
                })->ignore($buildingId),
            ],
            'total_floors' => ['sometimes', 'required', 'integer', 'min:1', 'max:50'],
            'description' => ['nullable', 'string', 'max:500'],
            'is_active' => ['boolean'],
        ];
    }
}
