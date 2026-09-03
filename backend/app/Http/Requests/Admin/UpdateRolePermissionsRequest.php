<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseApiRequest;

class UpdateRolePermissionsRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user() && ($this->user()->hasRole('Super Admin') || $this->user()->can('roles.edit'));
    }

    public function rules(): array
    {
        return [
            'permissions' => ['present', 'array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ];
    }

    public function messages(): array
    {
        return [
            'permissions.present' => 'Permissions payload must be provided.',
            'permissions.*.exists' => 'One or more selected permissions do not exist in the system registry.',
        ];
    }
}
