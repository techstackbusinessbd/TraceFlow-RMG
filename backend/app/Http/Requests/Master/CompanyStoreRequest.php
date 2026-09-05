<?php

namespace App\Http\Requests\Master;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'organization_id' => ['required', 'uuid', 'exists:organizations,id'],
            'name' => ['required', 'string', 'max:150'],
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('companies')->where(function ($query) {
                    return $query->where('organization_id', $this->organization_id)
                                 ->whereNull('deleted_at');
                }),
            ],
            'bin_number' => ['nullable', 'string', 'max:50'],
            'tin_number' => ['nullable', 'string', 'max:50'],
            'trade_license' => ['nullable', 'string', 'max:100'],
            'registered_address' => ['nullable', 'string', 'max:500'],
            'contact_email' => ['nullable', 'email', 'max:150'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
            'currency' => ['required', 'string', 'max:10'],
            'is_active' => ['boolean'],
        ];
    }
}
