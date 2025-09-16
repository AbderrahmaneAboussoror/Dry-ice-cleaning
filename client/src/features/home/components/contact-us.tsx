// src/features/home/components/contact-us.tsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import FloatingInput from "@/components/ui/floating-input";
import { contactService, ContactFormData } from "@/services/contactService";

const ContactUs = () => {
    const { t } = useTranslation('home');
    const [formData, setFormData] = useState<ContactFormData>({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{
        type: 'success' | 'error' | null;
        message: string;
    }>({
        type: null,
        message: ''
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear status when user starts typing
        if (submitStatus.type) {
            setSubmitStatus({ type: null, message: '' });
        }
    };

    const validateForm = (): string[] => {
        const errors: string[] = [];

        if (!formData.firstName.trim()) {
            errors.push(t('contact.validation.firstNameRequired'));
        } else if (formData.firstName.trim().length < 2) {
            errors.push(t('contact.validation.firstNameTooShort'));
        }

        if (!formData.lastName.trim()) {
            errors.push(t('contact.validation.lastNameRequired'));
        } else if (formData.lastName.trim().length < 2) {
            errors.push(t('contact.validation.lastNameTooShort'));
        }

        if (!formData.email.trim()) {
            errors.push(t('contact.validation.emailRequired'));
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            errors.push(t('contact.validation.emailInvalid'));
        }

        if (!formData.message.trim()) {
            errors.push(t('contact.validation.messageRequired'));
        } else if (formData.message.trim().length < 10) {
            errors.push(t('contact.validation.messageTooShort'));
        } else if (formData.message.trim().length > 1000) {
            errors.push(t('contact.validation.messageTooLong'));
        }

        return errors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        const errors = validateForm();
        if (errors.length > 0) {
            setSubmitStatus({
                type: 'error',
                message: errors[0] // Show first error
            });
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus({ type: null, message: '' });

        try {
            const response = await contactService.submitContactForm(formData);

            if (response.success) {
                setSubmitStatus({
                    type: 'success',
                    message: response.message || t('contact.messages.successDefault')
                });

                // Reset form
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    message: "",
                });
            } else {
                setSubmitStatus({
                    type: 'error',
                    message: t('contact.messages.sendFailed')
                });
            }
        } catch (error: any) {
            console.error('Contact form error:', error);
            setSubmitStatus({
                type: 'error',
                message: error.message || t('contact.messages.sendFailedRetry')
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="py-10 flex flex-col items-center justify-center gap-3 px-5">
            <p className="text-4xl font-semibold capitalize">{t('contact.title')}</p>
            <p className="text-lg font-light text-center">
                {t('contact.subtitle')}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3 w-full md:w-2/4 mt-10">
                <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                    <FloatingInput
                        id="firstName"
                        name="firstName"
                        label={t('contact.form.firstName')}
                        value={formData.firstName}
                        onChange={handleChange}
                        type="text"
                        required
                    />
                    <FloatingInput
                        id="lastName"
                        name="lastName"
                        label={t('contact.form.lastName')}
                        value={formData.lastName}
                        onChange={handleChange}
                        type="text"
                        required
                    />
                </div>

                <FloatingInput
                    id="email"
                    name="email"
                    label={t('contact.form.email')}
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    required
                />

                <FloatingInput
                    id="message"
                    name="message"
                    label={t('contact.form.message')}
                    value={formData.message}
                    onChange={handleChange}
                    type="area"
                    required
                />

                {/* Status Message */}
                {submitStatus.type && (
                    <div className={`p-4 rounded-lg text-sm ${
                        submitStatus.type === 'success'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                        {submitStatus.message}
                    </div>
                )}

                <div className="w-full flex items-center justify-start">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-3 rounded-xl capitalize text-sm font-medium transition-all duration-200 ${
                            isSubmitting
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-cyan/25 border border-gray-300 text-gray-700 hover:bg-cyan/40 hover:text-gray-800 hover:border-gray-400'
                        }`}
                    >
                        {isSubmitting ? t('contact.form.sending') : t('contact.form.submit')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactUs;