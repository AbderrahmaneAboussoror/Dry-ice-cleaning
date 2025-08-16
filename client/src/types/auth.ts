// src/types/auth.ts
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    totalPoints: number;
    role: 'user' | 'admin';
}

export interface LoginCredentials {
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

// Backend response format (matches your actual backend)
export interface AuthResponse {
    message: string;
    user: User;
    token: string;
}

// Error response format
export interface ErrorResponse {
    error: string;
    details?: any[];
}

// Standard API response wrapper (for consistency)
export interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    message: string;
}