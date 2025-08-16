// src/services/authService.ts
import { apiService } from './api';
import { User } from "@/types/auth";

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    address: string;
}

export interface UserProfile {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    totalPoints: number;
    role: 'user' | 'admin';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: UserProfile;
    token: string;
    message?: string;
}

class AuthService {
    async login(loginData: LoginData): Promise<AuthResponse> {
        try {
            // Make the API call
            const response = await apiService.post<AuthResponse>('/auth/login', loginData);

            console.log('Raw API response:', response);

            // Your backend returns { message: "Login successful", user: {...}, token: "..." }
            // Handle the direct response format
            if (response.user && response.token) {
                // Store authentication data
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));

                console.log('Auth data stored successfully');
                return response;
            } else {
                // Handle error response format
                throw new Error(response.message|| 'Invalid response format');
            }
        } catch (error) {
            console.error('Login service error:', error);

            // Clean up any partial data
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');

            // Re-throw the error for the component to handle
            throw error;
        }
    }

    async register(registerData: RegisterData): Promise<AuthResponse> {
        try {
            const response = await apiService.post<AuthResponse>('/auth/register', registerData);

            // Your backend returns { message: "User registered successfully", user: {...}, token: "..." }
            if (response.user && response.token) {
                // Store authentication data
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                return response;
            } else {
                throw new Error(response.message || 'Invalid response format');
            }
        } catch (error) {
            console.error('Register service error:', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            throw error;
        }
    }

    async getProfile(): Promise<UserProfile> {
        try {
            const response = await apiService.get<{ user: UserProfile }>('/auth/profile');

            // Your backend returns { user: {...} }
            if (response.user) {
                return response.user;
            } else {
                throw new Error('Invalid profile response format');
            }
        } catch (error) {
            console.error('Get profile error:', error);
            throw error;
        }
    }

    async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
        try {
            const response = await apiService.put<{ user: UserProfile }>('/auth/profile', profileData);

            // Your backend returns { message: "Profile updated successfully", user: {...} }
            if (response.user) {
                // Update stored user
                localStorage.setItem('user', JSON.stringify(response.user));
                return response.user;
            } else {
                throw new Error('Invalid profile update response format');
            }
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    }

    logout(): void {
        try {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            console.log('User logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    getStoredUser(): UserProfile | null {
        try {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Error parsing stored user:', error);
            // Clean up corrupted data
            localStorage.removeItem('user');
            return null;
        }
    }

    getStoredToken(): string | null {
        try {
            return localStorage.getItem('authToken');
        } catch (error) {
            console.error('Error getting stored token:', error);
            return null;
        }
    }

    isAuthenticated(): boolean {
        return apiService.isAuthenticated();
    }

    isAdmin(): boolean {
        const user = this.getStoredUser();
        return user?.role === 'admin';
    }

    getCurrentUser(): User | null {
        return this.getStoredUser() as User | null;
    }

    // Helper method to check if user data is valid
    isUserDataValid(user: any): user is UserProfile {
        return user &&
            typeof user._id === 'string' &&
            typeof user.firstName === 'string' &&
            typeof user.lastName === 'string' &&
            typeof user.email === 'string' &&
            typeof user.role === 'string' &&
            (user.role === 'user' || user.role === 'admin');
    }
}

export const authService = new AuthService();