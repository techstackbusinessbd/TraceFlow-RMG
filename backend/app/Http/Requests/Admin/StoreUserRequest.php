<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseApiRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends BaseApiRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && ($this->user()->hasRole('Super Admin') || $this->user()->can('users.create'));
    }

    /**
     * Get the validation rules that apply to the request.
     * Pure Server-Side Validation.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'emp_id' => [
                'required',
                'string',
                'max:30',
                Rule::unique('users', 'emp_id')->whereNull('deleted_at'),
            ],
            'username' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-zA-Z0-9._-]+$/',
                Rule::unique('users', 'username')->whereNull('deleted_at'),
            ],
            'name' => ['required', 'string', 'max:100'],
            'email' => [
                'nullable',
                'email',
                'max:150',
                Rule::unique('users', 'email')->whereNull('deleted_at'),
            ],
            'password' => ['required', 'string', 'min:8'],
            'phone' => ['nullable', 'string', 'max:20'],
            'department' => ['nullable', 'string', 'max:50'],
            'designation' => ['nullable', 'string', 'max:50'],
            'role' => ['required', 'string', 'exists:roles,name'],
            'is_active' => ['nullable', 'boolean'],
            'default_dashboard_path' => ['nullable', 'string', 'max:100'],
        ];
    }

    /**
     * Custom validation messages in English (UI standard).
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'emp_id.required' => 'Employee ID is required.',
            'emp_id.unique' => 'This Employee ID is already registered to an active account.',
            'username.required' => 'Username is required.',
            'username.regex' => 'Username may only contain letters, numbers, dots, dashes, and underscores.',
            'username.unique' => 'This username is already taken.',
            'name.required' => 'Full name is required.',
            'email.email' => 'Please provide a valid corporate email address.',
            'email.unique' => 'This email address is already registered.',
            'password.required' => 'Password is required.',
            'password.min' => 'Password must be at least 8 characters long.',
            'role.required' => 'Please select a system role for this user.',
            'role.exists' => 'The selected system role is invalid.',
        ];
    }
}
