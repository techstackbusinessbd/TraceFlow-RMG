import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor: Attach Sanctum Bearer Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('traceflow_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Centralized 401 / 422 handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('traceflow_token');
      localStorage.removeItem('traceflow_user');
      if (window.location.pathname !== '/login') {
        const currentPath = encodeURIComponent(window.location.pathname);
        window.location.href = `/login?redirect_to=${currentPath}`;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
