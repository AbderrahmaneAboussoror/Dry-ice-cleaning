// src/services/api.ts
import API_CONFIG from '../config/api';

export interface ApiResponse<T = any> {
    success?: boolean;
    data?: T;
    message?: string;
    error?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
    // Auth response format
    user?: any;
    token?: string;
    // Allow for other properties that might come from backend
    [key: string]: any;
}

class ApiService {
    private baseURL = API_CONFIG.baseURL;
    private publicEndpoints = ['/auth/login', '/auth/register', '/packs'];

    private getAuthHeaders(): Record<string, string> {
        const token = localStorage.getItem('authToken');
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    }

    private isTokenExpired(): boolean {
        const token = localStorage.getItem('authToken');
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            return payload.exp < (currentTime + 300); // 5 minute buffer
        } catch (error) {
            console.error('Token validation error:', error);
            return true;
        }
    }

    private handleAuthError(): void {
        console.log('Handling auth error - clearing storage');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');

        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        let responseData: any;

        try {
            responseData = await response.json();
        } catch (error) {
            console.error('Error parsing response JSON:', error);
            throw new Error('Invalid response format from server');
        }

        // Handle 401 Unauthorized
        if (response.status === 401) {
            console.log('401 Unauthorized - handling auth error');
            this.handleAuthError();
            throw new Error(responseData.message || 'Authentication failed. Please login again.');
        }

        // Handle 403 Forbidden
        if (response.status === 403) {
            throw new Error(responseData.message || 'Access denied. You do not have permission to perform this action.');
        }

        // Handle other HTTP errors
        if (!response.ok) {
            const errorMessage = responseData.message ||
                responseData.error ||
                `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }

        return responseData as T;
    }

    private async makeRequest<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        // Check token expiry before request (except for public endpoints)
        if (!this.publicEndpoints.includes(endpoint) && this.isTokenExpired()) {
            console.log('Token expired - handling auth error');
            this.handleAuthError();
            throw new Error('Session expired. Please login again.');
        }

        const url = `${this.baseURL}${endpoint}`;
        console.log(`Making ${options.method || 'GET'} request to:`, url);

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...this.getAuthHeaders(),
                    ...options.headers,
                },
            });

            const result = await this.handleResponse<T>(response);
            console.log('Request successful:', result);
            return result;
        } catch (error) {
            console.error('Request failed:', error);

            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Network error. Please check your connection.');
        }
    }

    async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
        let url = endpoint;

        if (params) {
            const searchParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    searchParams.append(key, params[key].toString());
                }
            });
            url += `?${searchParams.toString()}`;
        }

        return this.makeRequest<T>(url, {
            method: 'GET',
        });
    }

    async post<T>(endpoint: string, data?: any): Promise<T> {
        return this.makeRequest<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T>(endpoint: string, data?: any): Promise<T> {
        return this.makeRequest<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T>(endpoint: string, data?: any): Promise<T> {
        return this.makeRequest<T>(endpoint, {
            method: 'DELETE',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    // Utility methods
    isAuthenticated(): boolean {
        const token = localStorage.getItem('authToken');
        return !!token && !this.isTokenExpired();
    }

    checkAuthStatus(): void {
        if (this.isTokenExpired()) {
            this.handleAuthError();
        }
    }

    // Method to clear auth data without redirect (useful for logout)
    clearAuthData(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    }
}

export const apiService = new ApiService();