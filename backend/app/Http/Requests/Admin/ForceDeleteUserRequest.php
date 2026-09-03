<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseApiRequest;

class ForceDeleteUserRequest extends BaseApiRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * STRICT Super Admin ONLY.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->hasRole('Super Admin');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'super_admin_password' => ['required', 'string'],
        ];
    }

    /**
     * Custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'super_admin_password.required' => 'Your Super Admin password is required to authorize permanent purge.',
        ];
    }
}
