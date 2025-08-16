import { apiService } from './api';

// Types based on your backend models and validation
export interface BookAppointmentRequest {
    serviceType: 'basic' | 'deluxe';
    appointmentDate: string; // ISO8601 format (YYYY-MM-DD)
    location: string;
    notes?: string;
}

export interface Appointment {
    id: string;
    serviceType: 'basic' | 'deluxe';
    appointmentDate: string;
    timeSlot: string;
    location: string;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    price: number;
    notes?: string;
    createdAt: string;
}

export interface PriceBreakdown {
    basePrice: number;
    rushFee?: number;
    weekendFee?: number;
    totalPrice: number;
    appliedDiscounts?: string[];
}

export interface BookAppointmentResponse {
    message: string;
    appointment: Appointment;
    userPointsRemaining: number;
    priceBreakdown: PriceBreakdown;
}

export interface GetAppointmentsResponse {
    appointments: Appointment[];
}

export interface CancelAppointmentResponse {
    message: string;
    refundedPoints: number;
}

export interface ApiError {
    error: string;
    details?: any[];
    required?: number;
    available?: number;
    shortfall?: number;
    suggestion?: string;
}

class AppointmentService {
    private readonly BASE_URL = '/appointments';

    /**
     * Book a new appointment
     */
    async bookAppointment(appointmentData: BookAppointmentRequest): Promise<BookAppointmentResponse> {
        try {
            // Your backend returns: { message, appointment: {...}, userPointsRemaining, priceBreakdown }
            const response = await apiService.post<BookAppointmentResponse>(
                `${this.BASE_URL}/`,
                appointmentData
            );
            return response;
        } catch (error: any) {
            // Handle specific error cases based on error message
            const errorMessage = error.message || 'Failed to book appointment. Please try again.';

            // Custom error handling for different scenarios
            if (errorMessage.includes('Maximum appointment limit')) {
                throw new Error('You have reached the maximum limit of 3 active appointments.');
            }

            if (errorMessage.includes('Insufficient points')) {
                // Extract point information if available in error message
                throw new Error('Insufficient points to book this appointment.');
            }

            if (errorMessage.includes('No available time slots')) {
                throw new Error('No available time slots for this date. Please try another date.');
            }

            if (errorMessage.includes('Validation failed')) {
                throw new Error(`Validation failed: Please check your input data.`);
            }

            if (errorMessage.includes('Cannot book appointments in the past')) {
                throw new Error('Cannot book appointments in the past. Please select a future date.');
            }

            if (errorMessage.includes('within the next 3 months')) {
                throw new Error('Please choose a date within the next 3 months.');
            }

            throw new Error(errorMessage);
        }
    }

    /**
     * Get all user appointments
     */
    async getUserAppointments(): Promise<Appointment[]> {
        try {
            // Your backend returns: { appointments: [...] }
            const response = await apiService.get<GetAppointmentsResponse>(this.BASE_URL);
            return response.appointments;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to fetch appointments. Please try again.');
        }
    }

    /**
     * Cancel an appointment
     */
    async cancelAppointment(appointmentId: string): Promise<CancelAppointmentResponse> {
        try {
            // Your backend expects DELETE method for cancellation
            const response = await apiService.delete<CancelAppointmentResponse>(
                `${this.BASE_URL}/${appointmentId}`
            );
            return response;
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to cancel appointment. Please try again.';

            if (errorMessage.includes('not found')) {
                throw new Error('Appointment not found.');
            }

            if (errorMessage.includes('already cancelled')) {
                throw new Error('This appointment has already been cancelled.');
            }

            if (errorMessage.includes('Cannot cancel completed')) {
                throw new Error('Cannot cancel a completed appointment.');
            }

            throw new Error(errorMessage);
        }
    }

    /**
     * Get upcoming appointments (helper method)
     */
    async getUpcomingAppointments(): Promise<Appointment[]> {
        try {
            const appointments = await this.getUserAppointments();
            const now = new Date();

            return appointments.filter(appointment => {
                const appointmentDate = new Date(appointment.appointmentDate);
                return appointmentDate >= now &&
                    ['pending', 'confirmed', 'in_progress'].includes(appointment.status);
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get past appointments (helper method)
     */
    async getPastAppointments(): Promise<Appointment[]> {
        try {
            const appointments = await this.getUserAppointments();
            const now = new Date();

            return appointments.filter(appointment => {
                const appointmentDate = new Date(appointment.appointmentDate);
                return appointmentDate < now ||
                    ['completed', 'cancelled'].includes(appointment.status);
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get appointments by status (helper method)
     */
    async getAppointmentsByStatus(status: Appointment['status']): Promise<Appointment[]> {
        try {
            const appointments = await this.getUserAppointments();
            return appointments.filter(appointment => appointment.status === status);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Check if user can book more appointments (helper method)
     */
    async canBookMoreAppointments(): Promise<{ canBook: boolean; activeCount: number; limit: number }> {
        try {
            const appointments = await this.getUserAppointments();
            const activeAppointments = appointments.filter(appointment =>
                ['pending', 'confirmed', 'in_progress'].includes(appointment.status)
            );

            const limit = 3;
            const activeCount = activeAppointments.length;

            return {
                canBook: activeCount < limit,
                activeCount,
                limit
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Format appointment date for display (helper method)
     */
    formatAppointmentDate(dateString: string): string {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }

    /**
     * Get service type display name (helper method)
     */
    getServiceTypeDisplayName(serviceType: 'basic' | 'deluxe'): string {
        const serviceNames = {
            basic: 'Basic Cleaning',
            deluxe: 'Deluxe Cleaning'
        };
        return serviceNames[serviceType] || serviceType;
    }

    /**
     * Get status display info (helper method)
     */
    getStatusDisplayInfo(status: Appointment['status']): { label: string; color: string; icon: string } {
        const statusInfo = {
            pending: { label: 'Pending', color: 'orange', icon: '⏳' },
            confirmed: { label: 'Confirmed', color: 'green', icon: '✅' },
            in_progress: { label: 'In Progress', color: 'blue', icon: '🔄' },
            completed: { label: 'Completed', color: 'gray', icon: '✓' },
            cancelled: { label: 'Cancelled', color: 'red', icon: '❌' }
        };
        return statusInfo[status] || { label: status, color: 'gray', icon: '?' };
    }
}

// Export singleton instance
export const appointmentService = new AppointmentService();