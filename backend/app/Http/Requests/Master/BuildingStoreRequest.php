<?php

namespace App\Http\Requests\Master;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BuildingStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'factory_unit_id' => ['required', 'uuid', 'exists:factory_units,id'],
            'name' => ['required', 'string', 'max:150'],
            'code' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('buildings')->where(function ($query) {
                    return $query->where('factory_unit_id', $this->factory_unit_id)
                                 ->whereNull('deleted_at');
                }),
            ],
            'total_floors' => ['required', 'integer', 'min:1', 'max:50'],
            'description' => ['nullable', 'string', 'max:500'],
            'is_active' => ['boolean'],
        ];
    }
}
