<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

abstract class BaseApiRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
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
