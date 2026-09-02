import { create } from 'zustand';

export interface UserProfile {
  id: string;
  emp_id: string;
  username: string;
  name: string;
  email: string | null;
  department?: string;
  designation?: string;
  primary_role: string;
  roles: string[];
  default_dashboard_path: string;
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  setAuth: (token: string, user: UserProfile) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hasRole: (roleName: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('traceflow_token'),
  user: (() => {
    const cached = localStorage.getItem('traceflow_user');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  })(),

  setAuth: (token: string, user: UserProfile) => {
    localStorage.setItem('traceflow_token', token);
    localStorage.setItem('traceflow_user', JSON.stringify(user));
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem('traceflow_token');
    localStorage.removeItem('traceflow_user');
    set({ token: null, user: null });
  },

  isAuthenticated: () => !!get().token,

  hasRole: (roleName: string) => {
    const user = get().user;
    if (!user) return false;
    return user.roles.includes(roleName) || user.primary_role === roleName;
  },
}));
