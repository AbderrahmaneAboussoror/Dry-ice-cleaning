// src/features/home/components/contact-us.tsx
import React, { useState } from "react";
import FloatingInput from "@/components/ui/floating-input";
import { contactService, ContactFormData } from "@/services/contactService";

const ContactUs = () => {
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
      errors.push("First name is required");
    } else if (formData.firstName.trim().length < 2) {
      errors.push("First name must be at least 2 characters");
    }

    if (!formData.lastName.trim()) {
      errors.push("Last name is required");
    } else if (formData.lastName.trim().length < 2) {
      errors.push("Last name must be at least 2 characters");
    }

    if (!formData.email.trim()) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.push("Please enter a valid email address");
    }

    if (!formData.message.trim()) {
      errors.push("Message is required");
    } else if (formData.message.trim().length < 10) {
      errors.push("Message must be at least 10 characters");
    } else if (formData.message.trim().length > 1000) {
      errors.push("Message must not exceed 1000 characters");
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
          message: response.message || 'Thank you for your message! We will get back to you soon.'
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
          message: 'Failed to send message. Please try again.'
        });
      }
    } catch (error: any) {
      console.error('Contact form error:', error);
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Failed to send message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="py-10 flex flex-col items-center justify-center gap-3 px-5">
        <p className="text-4xl font-semibold capitalize">get in touch</p>
        <p className="text-lg font-light text-center">
          Reach out to us for any inquiries or to schedule a service.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 w-full md:w-2/4 mt-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3">
            <FloatingInput
                id="firstName"
                name="firstName"
                label="first name"
                value={formData.firstName}
                onChange={handleChange}
                type="text"
                required
            />
            <FloatingInput
                id="lastName"
                name="lastName"
                label="last name"
                value={formData.lastName}
                onChange={handleChange}
                type="text"
                required
            />
          </div>

          <FloatingInput
              id="email"
              name="email"
              label="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              required
          />

          <FloatingInput
              id="message"
              name="message"
              label="message"
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
              {isSubmitting ? 'sending...' : 'submit'}
            </button>
          </div>
        </form>
      </div>
  );
};

export default ContactUs;