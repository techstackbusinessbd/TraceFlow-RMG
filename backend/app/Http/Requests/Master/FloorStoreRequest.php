<?php

namespace App\Http\Requests\Master;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FloorStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'building_id' => ['required', 'uuid', 'exists:buildings,id'],
            'name' => ['required', 'string', 'max:150'],
            'floor_number' => ['required', 'string', 'max:50'],
            'code' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('floors')->where(function ($query) {
                    return $query->where('building_id', $this->building_id)
                                 ->whereNull('deleted_at');
                }),
            ],
            'sort_order' => ['required', 'integer', 'min:0', 'max:100'],
            'area_sqft' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ];
    }
}
