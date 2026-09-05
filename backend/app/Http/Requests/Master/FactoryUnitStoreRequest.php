<?php

namespace App\Http\Requests\Master;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FactoryUnitStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_id' => ['required', 'uuid', 'exists:companies,id'],
            'name' => ['required', 'string', 'max:150'],
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('factory_units')->where(function ($query) {
                    return $query->where('company_id', $this->company_id)
                                 ->whereNull('deleted_at');
                }),
            ],
            'premises_type' => ['required', 'string', 'in:Woven,Knit,Denim,Washing,Composite,Warehouse,Printing,Embroidery,Central Warehouse'],
            'address' => ['nullable', 'string', 'max:500'],
            'city' => ['nullable', 'string', 'max:100'],
            'total_floors' => ['required', 'integer', 'min:1', 'max:50'],
            'compliance_grade' => ['nullable', 'string', 'max:20'],
            'is_active' => ['boolean'],
        ];
    }
}
