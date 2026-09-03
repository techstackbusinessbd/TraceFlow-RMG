<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreDeviceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'device_code' => ['required', 'string', 'max:50', 'unique:devices,device_code'],
            'device_name' => ['required', 'string', 'max:120'],
            'device_type' => ['required', 'string', 'in:TABLET,BARCODE_TERMINAL,RFID_SCANNER,WORKSTATION'],
            'assigned_location' => ['required', 'string', 'max:150'],
            'mac_address' => ['nullable', 'string', 'max:50'],
            'serial_number' => ['nullable', 'string', 'max:80'],
            'ip_address' => ['nullable', 'ip'],
            'pairing_status' => ['nullable', 'string', 'in:PAIRED,PENDING,REVOKED'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'device_code.required' => 'Device identification code is required (e.g. DEV-CUT-01).',
            'device_code.unique' => 'This device code is already registered to another factory device.',
            'device_name.required' => 'Device designation name is required.',
            'device_type.required' => 'Device hardware classification is required.',
            'device_type.in' => 'Device type must be TABLET, BARCODE_TERMINAL, RFID_SCANNER, or WORKSTATION.',
            'assigned_location.required' => 'Factory floor location assignment is required.',
            'ip_address.ip' => 'Please provide a valid IPv4 or IPv6 address.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'status' => 'error',
            'message' => 'Device validation failed. Please correct the highlighted errors.',
            'errors' => $validator->errors(),
        ], 422));
    }
}
