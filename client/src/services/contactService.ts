// src/services/contactService.ts
import { apiService } from './api';

export interface ContactFormData {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
}

export interface ContactFormResponse {
    success: boolean;
    message: string;
}

export const contactService = {
    // Submit contact form
    async submitContactForm(data: ContactFormData): Promise<ContactFormResponse> {
        try {
            const response = await apiService.post<ContactFormResponse>('/contact/submit', data);
            return response;
        } catch (error) {
            console.error('Contact form submission error:', error);
            throw error;
        }
    }
};