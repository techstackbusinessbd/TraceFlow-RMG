<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseApiRequest;

class StoreRoleRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user() && ($this->user()->hasRole('Super Admin') || $this->user()->can('roles.create'));
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:60', 'unique:roles,name'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Role name is required.',
            'name.unique' => 'A role with this name already exists.',
            'permissions.*.exists' => 'One or more selected permissions are invalid.',
        ];
    }
}
