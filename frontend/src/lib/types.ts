export interface Url {
  id: string;
  shortId: string;
  shortUrl: string;
  originalUrl: string;
  title?: string;
  tags: string[];
  clicks: number;
  createdAt: string;
  updatedAt: string;
  lastAccessedAt: string | null;
  isActive: boolean;
}

export interface UrlStats {
  id: string;
  shortId: string;
  shortUrl: string;
  originalUrl: string;
  title?: string;
  totalClicks: number;
  createdAt: string;
  lastAccessedAt: string | null;
  isActive: boolean;
}

export interface CreateUrlRequest {
  originalUrl: string;
  title?: string;
  tags?: string[];
}

export interface UpdateUrlRequest {
  originalUrl?: string;
  title?: string;
  tags?: string[];
  isActive?: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface User {
  id: string;
  email: string;
  role?: 'user' | 'admin';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface AdminUrl {
  id: string;
  shortId: string;
  shortUrl: string;
  originalUrl: string;
  ownerEmail: string;
  clicks: number;
  createdAt: string;
  isActive: boolean;
}

