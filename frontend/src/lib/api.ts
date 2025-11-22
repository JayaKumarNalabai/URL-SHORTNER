import axios, { AxiosError } from 'axios';
import {
  Url,
  UrlStats,
  CreateUrlRequest,
  UpdateUrlRequest,
  PaginatedResponse,
  ApiResponse,
  User,
  AuthResponse,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Clear invalid token
        localStorage.removeItem('auth_token');
        window.location.href = '/auth/login';
      }
      const message =
        (error.response.data as any)?.message || 'An error occurred';
      throw new Error(message);
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
);

// Auth API methods
export const login = async (
  email: string,
  password: string
): Promise<ApiResponse<AuthResponse>> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
    email,
    password,
  });
  return response.data;
};

export const register = async (
  email: string,
  password: string
): Promise<ApiResponse<AuthResponse>> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', {
    email,
    password,
  });
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<ApiResponse<User>>('/auth/me');
  return response.data.data;
};

export const getUrls = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedResponse<Url>> => {
  const response = await api.get<PaginatedResponse<Url>>('/urls', { params });
  return response.data;
};

export const createUrl = async (
  data: CreateUrlRequest
): Promise<ApiResponse<Url>> => {
  const response = await api.post<ApiResponse<Url>>('/urls', data);
  return response.data;
};

export const getUrlById = async (id: string): Promise<ApiResponse<Url>> => {
  const response = await api.get<ApiResponse<Url>>(`/urls/${id}`);
  return response.data;
};

export const getUrlStats = async (id: string): Promise<ApiResponse<UrlStats>> => {
  const response = await api.get<ApiResponse<UrlStats>>(`/urls/${id}/stats`);
  return response.data;
};

export const updateUrl = async (
  id: string,
  data: UpdateUrlRequest
): Promise<ApiResponse<Url>> => {
  const response = await api.patch<ApiResponse<Url>>(`/urls/${id}`, data);
  return response.data;
};

export const deleteUrl = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete<{ success: boolean; message: string }>(`/urls/${id}`);
  return response.data;
};

// Admin API methods
export const getAdminUsers = async (): Promise<ApiResponse<Array<{ id: string; email: string; role: string; createdAt: string }>>> => {
  const response = await api.get<ApiResponse<Array<{ id: string; email: string; role: string; createdAt: string }>>>('/admin/users');
  return response.data;
};

export const getAdminUrls = async (): Promise<ApiResponse<Array<{ id: string; shortId: string; shortUrl: string; originalUrl: string; ownerEmail: string; clicks: number; createdAt: string; isActive: boolean }>>> => {
  const response = await api.get<ApiResponse<Array<{ id: string; shortId: string; shortUrl: string; originalUrl: string; ownerEmail: string; clicks: number; createdAt: string; isActive: boolean }>>>('/admin/urls');
  return response.data;
};

