import apiClient from './apiClient';

export interface DeviceItem {
  id: string;
  device_code: string;
  device_name: string;
  device_type: 'TABLET' | 'BARCODE_TERMINAL' | 'RFID_SCANNER' | 'WORKSTATION';
  assigned_location: string;
  mac_address: string | null;
  serial_number: string | null;
  ip_address: string | null;
  pairing_status: 'PAIRED' | 'PENDING' | 'REVOKED';
  is_active: boolean;
  last_ping_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DeviceQueryParams {
  search?: string;
  device_type?: string;
  pairing_status?: string;
  is_active?: boolean;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface DeviceResponse {
  status: string;
  data: DeviceItem[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
  };
  metrics: {
    total_devices: number;
    online_devices: number;
    tablet_devices: number;
    revoked_devices: number;
  };
}

export interface DevicePayload {
  device_code: string;
  device_name: string;
  device_type: string;
  assigned_location: string;
  mac_address?: string | null;
  serial_number?: string | null;
  ip_address?: string | null;
  pairing_status?: string;
  is_active?: boolean;
}

export const deviceService = {
  getDevices: async (params?: DeviceQueryParams): Promise<DeviceResponse> => {
    const response = await apiClient.get<DeviceResponse>('/v1/admin/devices', { params });
    return response.data;
  },

  getDevice: async (id: string): Promise<DeviceItem> => {
    const response = await apiClient.get<{ status: string; data: DeviceItem }>(`/v1/admin/devices/${id}`);
    return response.data.data;
  },

  createDevice: async (payload: DevicePayload): Promise<{ status: string; message: string; data: DeviceItem }> => {
    const response = await apiClient.post<{ status: string; message: string; data: DeviceItem }>('/v1/admin/devices', payload);
    return response.data;
  },

  updateDevice: async (id: string, payload: DevicePayload): Promise<{ status: string; message: string; data: DeviceItem }> => {
    const response = await apiClient.put<{ status: string; message: string; data: DeviceItem }>(`/v1/admin/devices/${id}`, payload);
    return response.data;
  },

  deleteDevice: async (id: string): Promise<{ status: string; message: string }> => {
    const response = await apiClient.delete<{ status: string; message: string }>(`/v1/admin/devices/${id}`);
    return response.data;
  },

  togglePairing: async (id: string): Promise<{ status: string; message: string; data: DeviceItem }> => {
    const response = await apiClient.post<{ status: string; message: string; data: DeviceItem }>(`/v1/admin/devices/${id}/toggle-pairing`);
    return response.data;
  },

  probeHardware: async (): Promise<{ status: string; message: string; data: { mac_address: string; serial_number: string; ip_address: string } }> => {
    const response = await apiClient.post<{ status: string; message: string; data: { mac_address: string; serial_number: string; ip_address: string } }>('/v1/admin/devices/probe-hardware');
    return response.data;
  },

  syncTelemetry: async (id: string, payload?: { mac_address?: string; serial_number?: string }): Promise<{ status: string; message: string; data: DeviceItem }> => {
    const response = await apiClient.post<{ status: string; message: string; data: DeviceItem }>(`/v1/admin/devices/${id}/sync-telemetry`, payload);
    return response.data;
  },
};
