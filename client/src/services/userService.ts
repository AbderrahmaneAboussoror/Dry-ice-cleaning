// src/services/userService.ts
import { apiService } from './api';
import type { User } from '@/types/auth';

// Types based on your backend models
export interface UpdateProfileData {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}

export interface ChangeEmailData {
    newEmail: string;
    password: string;
}

export interface DeleteAccountData {
    password: string;
}

export interface UpdatePointsData {
    points: number;
    operation: 'add' | 'subtract' | 'set';
    reason?: string;
}

export interface Purchase {
    _id: string;
    userId: string;
    packId: {
        _id: string;
        name: string;
        description: string;
        freeServices: string[];
    };
    amount: number;
    currency: string;
    status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled';
    pointsAwarded: number;
    bonusPointsAwarded: number;
    serviceCreditsAwarded: {
        serviceType: 'basic' | 'deluxe';
        quantity: number;
    }[];
    createdAt: string;
    updatedAt: string;
}

export interface Appointment {
    _id: string;
    userId: string;
    serviceType: 'basic' | 'deluxe';
    appointmentDate: string;
    timeSlot: string;
    startTime: string;
    endTime: string;
    location: string;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    price: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserAppointment {
    id: string;
    serviceType: 'basic' | 'deluxe';
    appointmentDate: Date;
    timeSlot: string;
    location: string;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    price: number;
    notes?: string;
    createdAt: Date;
}

// Backend response types (actual structures from your backend)
export interface BackendUserProfileResponse {
    user: User;
}

export interface BackendUpdateProfileResponse {
    message: string;
    user: User;
}

export interface BackendChangePasswordResponse {
    message: string;
}

export interface BackendChangeEmailResponse {
    message: string;
    user: User;
}

export interface BackendDeleteAccountResponse {
    message: string;
}

export interface BackendPurchasesResponse {
    success: boolean;
    data: Purchase[];
}

export interface BackendBookingsResponse {
    success: boolean;
    data: Appointment[];
    count: number;
}

export interface BackendUserAppointmentsResponse {
    appointments: UserAppointment[];
}

export interface PointsTransactionResponse {
    message: string;
    pointsTransaction: {
        operation: string;
        pointsChanged: number;
        reason: string;
        previousBalance: number;
        newBalance: number;
    };
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        totalPoints: number;
    };
}

export const userService = {
    // Get user profile
    async getProfile(): Promise<User> {
        // Your backend returns: { user: {...} }
        const response = await apiService.get<BackendUserProfileResponse>('/user/profile');
        return response.user;
    },

    // Update user profile
    async updateProfile(data: UpdateProfileData): Promise<{ message: string; user: User }> {
        // Your backend returns: { message: "Profile updated successfully", user: {...} }
        const response = await apiService.put<BackendUpdateProfileResponse>('/user/profile', data);

        // Update localStorage with new user data
        if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
        }

        return {
            message: response.message,
            user: response.user
        };
    },

    // Change password
    async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
        // Your backend returns: { message: "Password changed successfully" }
        const response = await apiService.put<BackendChangePasswordResponse>('/user/change-password', data);
        return { message: response.message };
    },

    // Change email
    async changeEmail(data: ChangeEmailData): Promise<{ message: string; user: User }> {
        // Your backend returns: { message: "Email changed successfully", user: {...} }
        const response = await apiService.put<BackendChangeEmailResponse>('/user/change-email', data);

        // Update localStorage with new user data
        if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
        }

        return {
            message: response.message,
            user: response.user
        };
    },

    // Delete account (soft delete)
    async deleteAccount(data: DeleteAccountData): Promise<{ message: string }> {
        // Your backend returns: { message: "Account deleted successfully" }
        const response = await apiService.delete<BackendDeleteAccountResponse>('/user/account', data);

        // Clear localStorage after account deletion
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');

        return { message: response.message };
    },

    // Update user points
    async updatePoints(data: UpdatePointsData): Promise<PointsTransactionResponse> {
        // Your backend returns: { message, pointsTransaction: {...}, user: {...} }
        const response = await apiService.put<PointsTransactionResponse>('/user/points', data);

        // Update localStorage with new user data
        if (response.user) {
            // Get current user data and update points
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = {
                ...currentUser,
                totalPoints: response.user.totalPoints
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        return response;
    },

    // Get user's purchase history
    async getPurchases(): Promise<Purchase[]> {
        // Your backend returns: { success: true, data: [...] }
        const response = await apiService.get<BackendPurchasesResponse>('/user/purchases');
        return response.data;
    },

    // Get user's current/upcoming appointments
    async getUserAppointments(): Promise<UserAppointment[]> {
        // Your backend returns: { appointments: [...] }
        const response = await apiService.get<BackendUserAppointmentsResponse>('/appointments');
        return response.appointments;
    },

    // Get user's booking history (completed appointments)
    async getBookings(): Promise<{ appointments: Appointment[]; count: number }> {
        // Your backend returns: { success: true, data: [...], count: X }
        const response = await apiService.get<BackendBookingsResponse>('/user/bookings');
        return {
            appointments: response.data,
            count: response.count
        };
    },

    // Helper method to refresh user data in localStorage
    async refreshUserData(): Promise<User> {
        try {
            const user = await this.getProfile();
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error) {
            console.error('Error refreshing user data:', error);
            throw error;
        }
    },

    // Helper method to get current user from localStorage
    getCurrentUser(): User | null {
        try {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    },
};