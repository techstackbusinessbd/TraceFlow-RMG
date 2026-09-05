<?php

namespace App\Http\Requests\Master;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductionLineStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'factory_unit_id' => ['required', 'uuid', 'exists:factory_units,id'],
            'building_id' => ['nullable', 'uuid', 'exists:buildings,id'],
            'floor_id' => ['nullable', 'uuid', 'exists:floors,id'],
            'name' => ['required', 'string', 'max:100'],
            'code' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('production_lines')->where(function ($query) {
                    return $query->where('factory_unit_id', $this->factory_unit_id)
                                 ->whereNull('deleted_at');
                }),
            ],
            'section_type' => ['required', 'string', 'in:Cutting,Sewing,Embroidery,Printing,Finishing,Washing,QC,Packing'],
            'floor_no' => ['nullable', 'string', 'max:50'],
            'operator_capacity' => ['required', 'integer', 'min:0', 'max:500'],
            'target_efficiency_percentage' => ['required', 'numeric', 'min:1', 'max:200'],
            'is_active' => ['boolean'],
        ];
    }
}
