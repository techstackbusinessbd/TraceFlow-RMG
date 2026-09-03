import apiClient from './apiClient';

export interface Role {
  id: number;
  name: string;
  slug?: string;
  guard_name: string;
  permissions?: { id: number; name: string }[];
  users_count?: number;
}

export interface UserItem {
  id: string;
  emp_id: string;
  username: string;
  name: string;
  email: string | null;
  phone: string | null;
  department: string | null;
  designation: string | null;
  is_active: boolean;
  default_dashboard_path: string | null;
  created_at: string;
  deleted_at?: string | null;
  roles: { id: number; name: string }[];
  permissions?: { id: number; name: string }[];
}

export interface UserFormData {
  emp_id: string;
  username: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  department: string;
  designation: string;
  role: string;
  is_active: boolean;
  default_dashboard_path?: string;
}

export interface UserListParams {
  search?: string;
  role?: string;
  department?: string;
  is_active?: string;
  has_overrides?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from?: number;
    to?: number;
    sort_by?: string;
    sort_direction?: string;
  };
}

export const userService = {
  // 1. List active users
  async getUsers(params: UserListParams = {}): Promise<PaginatedResponse<UserItem>> {
    const response = await apiClient.get<PaginatedResponse<UserItem>>('/v1/admin/users', { params });
    return response.data;
  },

  // 2. Get single user
  async getUser(id: string): Promise<UserItem> {
    const response = await apiClient.get<{ success: boolean; data: UserItem }>(`/v1/admin/users/${id}`);
    return response.data.data;
  },

  // 3. Create user
  async createUser(data: UserFormData): Promise<UserItem> {
    const response = await apiClient.post<{ success: boolean; data: UserItem }>('/v1/admin/users', data);
    return response.data.data;
  },

  // 4. Update user
  async updateUser(id: string, data: Partial<UserFormData>): Promise<UserItem> {
    const response = await apiClient.put<{ success: boolean; data: UserItem }>(`/v1/admin/users/${id}`, data);
    return response.data.data;
  },

  // 5. Tier-1 Soft Delete
  async softDeleteUser(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`/v1/admin/users/${id}`);
    return response.data;
  },

  // 6. List archived users
  async getArchivedUsers(page: number = 1): Promise<PaginatedResponse<UserItem>> {
    const response = await apiClient.get<PaginatedResponse<UserItem>>('/v1/admin/users/archived', {
      params: { page },
    });
    return response.data;
  },

  // 7. Restore archived user
  async restoreUser(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post(`/v1/admin/users/${id}/restore`);
    return response.data;
  },

  // 8. Tier-2 Permanent Purge (Super Admin Only)
  async forceDeleteUser(id: string, superAdminPassword: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`/v1/admin/users/${id}/force-delete`, {
      data: { super_admin_password: superAdminPassword },
    });
    return response.data;
  },

  // 9. Roles & Manifest
  async getRoles(): Promise<Role[]> {
    const response = await apiClient.get<{ success: boolean; data: Role[] }>('/v1/admin/roles');
    return response.data.data;
  },

  async getRole(id: string | number): Promise<Role> {
    const response = await apiClient.get<{ success: boolean; data: Role }>(`/v1/admin/roles/${id}`);
    return response.data.data;
  },

  async createRole(name: string, permissions: string[]): Promise<Role> {
    const response = await apiClient.post<{ success: boolean; data: Role }>('/v1/admin/roles', {
      name,
      permissions,
    });
    return response.data.data;
  },

  async updateRolePermissions(id: string | number, permissions: string[]): Promise<Role> {
    const response = await apiClient.put<{ success: boolean; data: Role }>(`/v1/admin/roles/${id}/permissions`, {
      permissions,
    });
    return response.data.data;
  },

  async deleteRole(id: string | number): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`/v1/admin/roles/${id}`);
    return response.data;
  },

  async getSystemManifest(): Promise<Record<string, Record<string, string>>> {
    const response = await apiClient.get<{ success: boolean; manifest: Record<string, Record<string, string>> }>(
      '/v1/admin/permissions/system-manifest'
    );
    return response.data.manifest;
  },

  // 10. User-Level Custom Permissions & Overrides
  async getUserPermissions(id: string): Promise<UserPermissionsData> {
    const response = await apiClient.get<{ success: boolean; data: UserPermissionsData }>(
      `/v1/admin/users/${id}/permissions`
    );
    return response.data.data;
  },

  async updateUserPermissions(id: string, permissions: string[]): Promise<UserPermissionsData> {
    const response = await apiClient.put<{ success: boolean; data: UserPermissionsData }>(
      `/v1/admin/users/${id}/permissions`,
      { permissions }
    );
    return response.data.data;
  },
};

export interface UserPermissionsData {
  user: {
    id: string;
    emp_id: string;
    name: string;
    username: string;
    department: string;
    designation: string;
    roles: string[];
  };
  direct_permissions: string[];
  role_permissions: string[];
  all_permissions: string[];
}
