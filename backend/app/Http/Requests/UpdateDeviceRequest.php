<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class UpdateDeviceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $deviceId = $this->route('device');

        return [
            'device_code' => ['required', 'string', 'max:50', Rule::unique('devices', 'device_code')->ignore($deviceId)],
            'device_name' => ['required', 'string', 'max:120'],
            'device_type' => ['required', 'string', 'in:TABLET,BARCODE_TERMINAL,RFID_SCANNER,WORKSTATION'],
            'assigned_location' => ['required', 'string', 'max:150'],
            'mac_address' => ['nullable', 'string', 'max:50'],
            'ip_address' => ['nullable', 'ip'],
            'pairing_status' => ['nullable', 'string', 'in:PAIRED,PENDING,REVOKED'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'device_code.required' => 'Device identification code is required.',
            'device_code.unique' => 'This device code is already registered to another factory device.',
            'device_name.required' => 'Device designation name is required.',
            'device_type.required' => 'Device hardware classification is required.',
            'assigned_location.required' => 'Factory floor location assignment is required.',
            'ip_address.ip' => 'Please provide a valid IPv4 or IPv6 address.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'status' => 'error',
            'message' => 'Device update validation failed.',
            'errors' => $validator->errors(),
        ], 422));
    }
}
