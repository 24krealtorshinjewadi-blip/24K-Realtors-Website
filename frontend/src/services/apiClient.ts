/**
 * apiClient.ts — 24K Realtors CRM HTTP Client
 *
 * Single source of truth for all backend API calls.
 * - Auto-attaches JWT Bearer token from localStorage
 * - Auto-redirects to login on 401 (expired/invalid token)
 * - Auto-retries token refresh on 401 if refresh token exists
 * - Detects dev / LAN / production environment for correct base URL
 *
 * Usage:
 *   import { getApi, postApi } from './apiClient';
 *   const leads = await getApi('/leads', { page: 0, size: 20 });
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Base URL Detection
const RAILWAY_API = 'https://twentyfourk-backend-production.up.railway.app/api/v1';

export const getApiBaseUrl = (): string => {
  const hostname = window.location.hostname;
  const customUrl = localStorage.getItem('API_BASE_URL');
  if (customUrl) return customUrl;
  if (hostname === 'localhost' || hostname === '127.0.0.1') return 'http://localhost:8080/api/v1';
  if (hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.startsWith('172.')) {
    return `http://${hostname}:8080/api/v1`;
  }
  return RAILWAY_API;
};

// Axios Instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Request Interceptor: Attach JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 with Refresh -> Logout
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  failedQueue = [];
};

const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userFullName');
  localStorage.removeItem('username');
  window.location.hash = 'login';
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        clearSession();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers = { ...originalRequest.headers, Authorization: `Bearer ${token}` };
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(`${getApiBaseUrl()}/auth/refresh`, { refreshToken });
        const { token: newToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem('token', newToken);
        if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);

        processQueue(null, newToken);
        originalRequest.headers = { ...originalRequest.headers, Authorization: `Bearer ${newToken}` };
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearSession();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Typed REST Helpers - gradually replace direct fetch() calls in apiService.js
export const getApi = <T = unknown>(url: string, params?: Record<string, unknown>): Promise<T> =>
  apiClient.get<T>(url, { params }).then((r) => r.data);

export const postApi = <T = unknown>(url: string, data?: unknown): Promise<T> =>
  apiClient.post<T>(url, data).then((r) => r.data);

export const putApi = <T = unknown>(url: string, data?: unknown): Promise<T> =>
  apiClient.put<T>(url, data).then((r) => r.data);

export const patchApi = <T = unknown>(url: string, data?: unknown): Promise<T> =>
  apiClient.patch<T>(url, data).then((r) => r.data);

export const deleteApi = <T = unknown>(url: string): Promise<T> =>
  apiClient.delete<T>(url).then((r) => r.data);

export default apiClient;
