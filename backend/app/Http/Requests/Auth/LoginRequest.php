<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     * Pure Server-Side Validation Only.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'identifier' => ['required', 'string', 'max:150'],
            'password' => ['required', 'string', 'min:6'],
            'two_factor_code' => ['nullable', 'string', 'size:6'],
        ];
    }

    /**
     * Custom validation messages (in English as per UI/UX rules).
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'identifier.required' => 'Please enter your Employee ID, Username, or Email.',
            'identifier.string' => 'Invalid identifier format.',
            'password.required' => 'Password is required to authenticate.',
            'password.min' => 'Password must be at least 6 characters.',
            'two_factor_code.size' => 'The 2FA code must be exactly 6 digits.',
        ];
    }

    /**
     * Handle a failed validation attempt (RFC 7807 Problem Details compliant).
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'type' => 'https://tools.ietf.org/html/rfc7807',
            'title' => 'Validation Error',
            'status' => 422,
            'detail' => 'The given data failed server-side validation rules.',
            'errors' => $validator->errors(),
        ], 422));
    }
}
