import { enhancedApiService as apiService, ApiResponse } from './apiWithInterceptor';

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    totalPoints: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    role: 'user' | 'admin';
    resetPasswordToken?: string;
    resetPasswordExpiry?: string;
}

export interface Appointment {
    _id: string;
    userId: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
    };
    serviceType: 'basic' | 'deluxe';
    appointmentDate: string; // Date string (YYYY-MM-DD)
    timeSlot: string; // "14:00-16:00" format
    startTime: string; // Full datetime ISO string
    endTime: string; // Full datetime ISO string
    location: string;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    price: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: string;
    totalPoints?: number;
}

export interface UpdateUserData {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    isActive?: boolean;
}

export interface UpdatePointsData {
    points: number;
    operation: 'add' | 'subtract' | 'set';
    reason?: string;
}

export interface UsersParams {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean; // Should be boolean, not string
}

export interface AppointmentsParams {
    week?: boolean;
    status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    serviceType?: 'basic' | 'deluxe';
    date?: string; // YYYY-MM-DD format
}

export interface UsersResponse {
    success: boolean;
    data: User[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface AppointmentsResponse {
    success: boolean;
    data: Appointment[];
    count: number;
    filters: {
        week?: boolean;
        status?: string;
        serviceType?: string;
        date?: string;
    };
}

class AdminService {
    // ========== USER MANAGEMENT ==========

    async getAllUsers(params?: UsersParams): Promise<UsersResponse> {
        // Convert boolean to string for API call
        const queryParams = params ? {
            ...params,
            isActive: params.isActive !== undefined ? params.isActive.toString() : undefined
        } : undefined;

        return apiService.get<User[]>('/admin/users', queryParams) as Promise<UsersResponse>;
    }

    async createUser(userData: CreateUserData): Promise<ApiResponse<User>> {
        // Validate required fields
        if (!userData.firstName || !userData.lastName || !userData.email ||
            !userData.password || !userData.phoneNumber || !userData.address) {
            throw new Error('All required fields must be provided');
        }

        return apiService.post<User>('/admin/users', userData);
    }

    async updateUser(userId: string, userData: UpdateUserData): Promise<ApiResponse<User>> {
        if (!userId) {
            throw new Error('User ID is required');
        }

        return apiService.put<User>(`/admin/users/${userId}`, userData);
    }

    async deleteUser(userId: string): Promise<ApiResponse<void>> {
        if (!userId) {
            throw new Error('User ID is required');
        }

        return apiService.delete<void>(`/admin/users/${userId}`);
    }

    async updateUserPoints(userId: string, pointsData: UpdatePointsData): Promise<ApiResponse<User>> {
        if (!userId) {
            throw new Error('User ID is required');
        }

        // Fixed validation to match backend
        if (pointsData.points < 1) {
            throw new Error('Points must be a positive integer');
        }

        if (!['add', 'subtract', 'set'].includes(pointsData.operation)) {
            throw new Error('Operation must be one of: add, subtract, set');
        }

        return apiService.put<User>(`/admin/users/${userId}/points`, pointsData);
    }

    // ========== APPOINTMENT MANAGEMENT ==========

    async getUpcomingAppointments(params?: AppointmentsParams): Promise<AppointmentsResponse> {
        // Convert boolean to string for API call
        const queryParams = params ? {
            ...params,
            week: params.week !== undefined ? params.week.toString() : undefined
        } : undefined;

        return apiService.get<Appointment[]>('/admin/appointments', queryParams) as Promise<AppointmentsResponse>;
    }

    async cancelAppointment(appointmentId: string, reason?: string): Promise<ApiResponse<any>> {
        if (!appointmentId) {
            throw new Error('Appointment ID is required');
        }

        return apiService.put<any>(`/admin/appointments/${appointmentId}/cancel`, { reason });
    }

    // ========== DASHBOARD STATS ==========

    async getDashboardStats(): Promise<{
        totalUsers: number;
        activeAppointments: number;
        pendingAppointments: number;
        totalServicePacks: number;
    }> {
        try {
            // Get users and appointments to calculate stats
            const [usersResponse, appointmentsResponse] = await Promise.all([
                this.getAllUsers({ limit: 1000 }),
                this.getUpcomingAppointments()
            ]);

            const users = usersResponse.data;
            const appointments = appointmentsResponse.data;

            return {
                totalUsers: users.length,
                activeAppointments: appointments.filter(apt =>
                    apt.status === 'confirmed' || apt.status === 'in_progress'
                ).length,
                pendingAppointments: appointments.filter(apt =>
                    apt.status === 'pending'
                ).length,
                totalServicePacks: 3, // You might want to create an endpoint for this
            };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            // Return fallback data
            return {
                totalUsers: 0,
                activeAppointments: 0,
                pendingAppointments: 0,
                totalServicePacks: 3,
            };
        }
    }

    // ========== HELPER METHODS ==========

    // Transform User data for components that expect different format
    transformUserForManagement(user: User): {
        id: string;
        name: string;
        email: string;
        phone: string;
        totalPoints: string;
        avatar: string;
        joinDate: string;
        status: string;
    } {
        const generateAvatarUrl = (firstName: string, lastName: string) => {
            const first = firstName?.charAt(0)?.toUpperCase() || 'U';
            const last = lastName?.charAt(0)?.toUpperCase() || 'U';
            const initials = `${first}${last}`;
            return `https://ui-avatars.com/api/?name=${initials}&background=2563eb&color=fff&size=128`;
        };

        return {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phoneNumber,
            totalPoints: `${user.totalPoints} pts`,
            avatar: generateAvatarUrl(user.firstName, user.lastName),
            joinDate: user.createdAt,
            status: user.isActive ? 'Active' : 'Inactive'
        };
    }
}

export const adminService = new AdminService();