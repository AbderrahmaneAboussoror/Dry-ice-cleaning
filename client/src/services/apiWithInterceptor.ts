import API_CONFIG from '../config/api';

export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

class EnhancedApiService {
    private baseURL = API_CONFIG.baseURL;

    private getAuthHeaders(): Record<string, string> {
        const token = localStorage.getItem('authToken');
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    }

    private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
        // Handle 401 Unauthorized (token expired/invalid)
        if (response.status === 401) {
            this.handleAuthError();
            throw new Error('Authentication failed. Please login again.');
        }

        // Handle 403 Forbidden (insufficient permissions)
        if (response.status === 403) {
            throw new Error('Access denied. You do not have permission to perform this action.');
        }

        // Handle other errors
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    private handleAuthError(): void {
        // Clear stored auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');

        // Redirect to login page
        window.location.href = '/login';

        // Optional: Show notification
        console.warn('Session expired. Please login again.');
    }

    private isTokenExpired(): boolean {
        const token = localStorage.getItem('authToken');
        if (!token) return true;

        try {
            // Decode JWT payload (without verifying signature - client-side check only)
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);

            // Check if token is expired (with 5 minute buffer)
            return payload.exp < (currentTime + 300);
        } catch (error) {
            console.error('Error checking token expiry:', error);
            return true;
        }
    }

    private async makeRequest<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        // Check if token is expired before making request
        if (this.isTokenExpired()) {
            this.handleAuthError();
            throw new Error('Session expired. Please login again.');
        }

        const url = `${this.baseURL}${endpoint}`;

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...this.getAuthHeaders(),
                    ...options.headers,
                },
            });

            return await this.handleResponse<T>(response);
        } catch (error) {
            // Network errors or other issues
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Network error. Please check your connection.');
        }
    }

    async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
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

    async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.makeRequest<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.makeRequest<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.makeRequest<T>(endpoint, {
            method: 'DELETE',
        });
    }

    // Utility method to check auth status
    isAuthenticated(): boolean {
        const token = localStorage.getItem('authToken');
        return !!token && !this.isTokenExpired();
    }

    // Method to manually refresh auth status
    checkAuthStatus(): void {
        if (this.isTokenExpired()) {
            this.handleAuthError();
        }
    }
}

export const enhancedApiService = new EnhancedApiService();