<?php

namespace App\Http\Requests\Master;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FactoryUnitUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $unitId = $this->route('unit') ?? $this->route('id');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'code' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                Rule::unique('factory_units')->where(function ($query) {
                    return $query->where('company_id', $this->company_id ?? $this->factory_unit?->company_id)
                                 ->whereNull('deleted_at');
                })->ignore($unitId),
            ],
            'premises_type' => ['sometimes', 'required', 'string', 'in:Woven,Knit,Denim,Washing,Composite,Warehouse,Printing,Embroidery,Central Warehouse'],
            'address' => ['nullable', 'string', 'max:500'],
            'city' => ['nullable', 'string', 'max:100'],
            'total_floors' => ['sometimes', 'required', 'integer', 'min:1', 'max:50'],
            'compliance_grade' => ['nullable', 'string', 'max:20'],
            'is_active' => ['boolean'],
        ];
    }
}
