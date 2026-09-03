import apiClient from './apiClient';

export interface AuditVaultItem {
  id: string;
  user_id: string | null;
  emp_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  user?: {
    id: string;
    name: string;
    username: string;
    emp_id: string;
  };
}

export interface AuditVaultQueryParams {
  search?: string;
  action?: string;
  entity_type?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface AuditVaultResponse {
  status: string;
  data: AuditVaultItem[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
  };
  metrics: {
    total_logs: number;
    auth_events: number;
    mutation_events: number;
    purge_events: number;
  };
  filters: {
    actions: string[];
    entity_types: string[];
  };
}

export const auditVaultService = {
  getLogs: async (params?: AuditVaultQueryParams): Promise<AuditVaultResponse> => {
    const response = await apiClient.get<AuditVaultResponse>('/v1/admin/audit-vault', { params });
    return response.data;
  },

  getLogDetails: async (id: string): Promise<AuditVaultItem> => {
    const response = await apiClient.get<{ status: string; data: AuditVaultItem }>(`/v1/admin/audit-vault/${id}`);
    return response.data.data;
  },
};
