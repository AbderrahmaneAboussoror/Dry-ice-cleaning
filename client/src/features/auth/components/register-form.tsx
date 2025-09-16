import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Email from "@/components/icons/email";
import Lock from "@/components/icons/lock";
import Phone from "@/components/icons/phone";
import Position from "@/components/icons/position";
import Shield from "@/components/icons/shield";
import Star from "@/components/icons/star";
import UserPlus from "@/components/icons/user-plus";
import User from "@/components/icons/user";
import { Link } from "react-router-dom";
import paths from "@/config/paths";
import { authService } from "@/services/authService";

const RegisterForm = () => {
    const { t } = useTranslation('auth');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        address: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const validateForm = () => {
        if (!formData.firstName || !formData.lastName || !formData.email ||
            !formData.phoneNumber || !formData.password || !formData.address) {
            throw new Error(t('register.validation.fillAllFields'));
        }

        if (formData.password.length < 6) {
            throw new Error(t('register.validation.passwordTooShort'));
        }

        if (formData.password !== formData.confirmPassword) {
            throw new Error(t('register.validation.passwordsDontMatch'));
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            throw new Error(t('register.validation.invalidEmail'));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Validate form
            validateForm();

            // Call API
            const response = await authService.register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                password: formData.password,
                address: formData.address,
            });

            // Handle raw backend response: { message, user, token }
            if (response.user && response.token) {
                // Store token and user data manually
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));

                // Registration successful - redirect to home page
                navigate('/');
            } else {
                throw new Error(response.message || t('register.messages.registrationFailed'));
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : t('register.messages.registrationFailedRetry');
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5faff] flex items-center justify-center py-10 px-5">
            <div className="w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-cyan flex items-center justify-center mx-auto mb-4">
                        <UserPlus color="white" size="29" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">{t('register.title')}</h1>
                    <p className="text-gray-500">{t('register.subtitle')}</p>
                </div>

                {/* Form */}
                <div className="rounded-2xl border-0 bg-white shadow-[0px_8px_10px_rgba(0,0,0,0.1),0px_20px_25px_rgba(0,0,0,0.1)] p-10">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Names */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-gray-800 text-sm capitalize font-[500]">
                                    {t('register.fields.firstName')}
                                </label>
                                <div className="px-3 py-3 border border-gray-400 rounded-lg flex items-center justify-center gap-2">
                                    <User color="gray" size="15" />
                                    <input
                                        type="text"
                                        placeholder={t('register.placeholders.firstName')}
                                        value={formData.firstName}
                                        onChange={(e) =>
                                            handleInputChange("firstName", e.target.value)
                                        }
                                        className="w-full focus:outline-none text-sm text-gray-500 font-light"
                                        disabled={loading}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-gray-800 text-sm capitalize font-[500]">
                                    {t('register.fields.lastName')}
                                </label>
                                <div className="px-3 py-3 border border-gray-400 rounded-lg flex items-center justify-center gap-2">
                                    <User color="gray" size="15" />
                                    <input
                                        type="text"
                                        placeholder={t('register.placeholders.lastName')}
                                        value={formData.lastName}
                                        onChange={(e) =>
                                            handleInputChange("lastName", e.target.value)
                                        }
                                        className="w-full focus:outline-none text-sm text-gray-500 font-light"
                                        disabled={loading}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-gray-800 text-sm capitalize font-[500]">
                                {t('register.fields.email')}
                            </label>
                            <div className="px-3 py-3 border border-gray-400 rounded-lg flex items-center justify-center gap-2">
                                <Email color="gray" size="15" />
                                <input
                                    type="email"
                                    placeholder={t('register.placeholders.email')}
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    className="w-full focus:outline-none text-sm text-gray-500 font-light"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-1">
                            <label className="text-gray-800 text-sm capitalize font-[500]">
                                {t('register.fields.phone')}
                            </label>
                            <div className="px-3 py-3 border border-gray-400 rounded-lg flex items-center justify-center gap-2">
                                <Phone color="gray" size="15" />
                                <input
                                    type="tel"
                                    placeholder={t('register.placeholders.phone')}
                                    value={formData.phoneNumber}
                                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                    className="w-full focus:outline-none text-sm text-gray-500 font-light"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label className="text-gray-800 text-sm capitalize font-[500]">
                                {t('register.fields.password')}
                            </label>
                            <div className="px-3 py-3 border border-gray-400 rounded-lg flex items-center justify-center gap-2">
                                <Lock color="gray" size="15" />
                                <input
                                    type="password"
                                    placeholder={t('register.placeholders.password')}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                    className="w-full focus:outline-none text-sm text-gray-500 font-light"
                                    disabled={loading}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1">
                            <label className="text-gray-800 text-sm capitalize font-[500]">
                                {t('register.fields.confirmPassword')}
                            </label>
                            <div className="px-3 py-3 border border-gray-400 rounded-lg flex items-center justify-center gap-2">
                                <Lock color="gray" size="15" />
                                <input
                                    type="password"
                                    placeholder={t('register.placeholders.confirmPassword')}
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                    className="w-full focus:outline-none text-sm text-gray-500 font-light"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-1 pb-6">
                            <label className="text-gray-800 text-sm capitalize font-[500]">
                                {t('register.fields.address')}
                            </label>
                            <div className="px-3 py-3 border border-gray-400 rounded-lg flex items-start justify-center gap-2">
                                <Position color="gray" size="15" />
                                <textarea
                                    placeholder={t('register.placeholders.address')}
                                    value={formData.address}
                                    onChange={(e) => handleInputChange("address", e.target.value)}
                                    className="w-full focus:outline-none text-sm text-gray-500 font-light resize-none"
                                    rows={3}
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-cyan text-black font-[500] mt-10 text-sm py-3 rounded-md hover:bg-cyan-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                                    {t('register.buttons.creatingAccount')}
                                </>
                            ) : (
                                <>
                                    <UserPlus size="16" />
                                    {t('register.buttons.createAccount')}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Link */}
                    <div className="text-center mt-4 text-sm text-gray-600">
                        {t('register.links.alreadyHaveAccount')}{" "}
                        <Link to={paths.login.path}>
                            <p className="text-blue-500 font-semibold hover:text-blue-500 cursor-pointer relative inline-block after:block after:h-[1px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">
                                {t('register.links.signInHere')}
                            </p>
                        </Link>
                    </div>
                </div>

                {/* Footer Icons */}
                <div className="flex justify-center items-center gap-6 text-sm text-gray-500 mt-10">
                    <div className="flex items-center text-xs font-light gap-1">
                        <Shield size="16" />
                        <span>{t('common.security.secure')}</span>
                    </div>
                    <div className="flex items-center text-xs font-light gap-1">
                        <Lock size="16" />
                        <span>{t('common.security.encrypted')}</span>
                    </div>
                    <div className="flex items-center text-xs font-light gap-1">
                        <Star size="16" />
                        <span>{t('common.security.verified')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;