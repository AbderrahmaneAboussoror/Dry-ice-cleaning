import Phone from "@/components/icons/phone";
import Email from "@/components/icons/email";
import Location from "@/components/icons/location";
import User from "@/components/icons/user";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { userService, type UpdateProfileData } from "@/services/userService";

const PersonalInformation = () => {
    const { t } = useTranslation('profile');
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Load user data on component mount
    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Try to get user from localStorage first for faster loading
            const cachedUser = userService.getCurrentUser();
            console.log('Cached user:', cachedUser); // Debug log

            if (cachedUser) {
                setFormData({
                    firstName: cachedUser.firstName || "",
                    lastName: cachedUser.lastName || "",
                    email: cachedUser.email || "",
                    phoneNumber: cachedUser.phoneNumber || "",
                    address: cachedUser.address || "",
                });
                setIsLoading(false); // Don't show loading if we have cached data
            }

            // Then fetch fresh data from API
            console.log('Fetching fresh user data...'); // Debug log
            const user = await userService.getProfile();
            console.log('Fresh user data:', user); // Debug log

            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
                address: user.address || "",
            });
        } catch (error) {
            console.error('Error loading user data:', error);

            // More specific error messages
            if (error instanceof Error) {
                if (error.message.includes('401')) {
                    setError(t('personal.errors.sessionExpired'));
                } else if (error.message.includes('404')) {
                    setError(t('personal.errors.profileNotFound'));
                } else if (error.message.includes('Failed to fetch')) {
                    setError(t('personal.errors.connectionError'));
                } else {
                    setError(t('personal.errors.generalError', { message: error.message }));
                }
            } else {
                setError(t('personal.errors.loadFailed'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Clear messages when user starts typing
        if (error) setError(null);
        if (successMessage) setSuccessMessage(null);
    };

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancel editing - reload original data
            loadUserData();
        }
        setIsEditing(!isEditing);
        setError(null);
        setSuccessMessage(null);
    };

    const handleSaveProfile = async () => {
        try {
            setIsSaving(true);
            setError(null);
            setSuccessMessage(null);

            // Prepare update data (only send fields that might have changed)
            const updateData: UpdateProfileData = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                phoneNumber: formData.phoneNumber.trim(),
                address: formData.address.trim(),
            };

            const response = await userService.updateProfile(updateData);

            setSuccessMessage(response.message || t('personal.messages.updateSuccess'));
            setIsEditing(false);

            // Auto-hide success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);

        } catch (error: any) {
            console.error('Error updating profile:', error);
            setError(error.message || t('personal.messages.updateFailed'));
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <section className="bg-white p-6 rounded-lg shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_3px_3px_rgba(0,0,0,0.1)]">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                                <div className="h-12 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white p-6 rounded-lg space-y-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_3px_3px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <User size="16" color="#26687D" />
                    <span className="text-lg text-gray-800 font-semibold capitalize">
              {t('personal.title')}
            </span>
                </div>
                {!isEditing && (
                    <button
                        onClick={handleEditToggle}
                        className="text-cyan hover:text-cyan-600 text-sm font-medium"
                    >
                        {t('personal.buttons.edit')}
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm flex items-center justify-between">
                    <span>{error}</span>
                    <button
                        onClick={loadUserData}
                        className="text-red-600 hover:text-red-800 underline ml-4"
                    >
                        {t('personal.buttons.retry')}
                    </button>
                </div>
            )}

            {/* Success Message */}
            {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                    {successMessage}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-1">
                    <label className="text-gray-800 text-sm capitalize font-[500]">
                        {t('personal.fields.firstName')}
                    </label>
                    <div className={`px-3 py-3 border rounded-lg flex items-center gap-2 ${
                        isEditing ? 'border-gray-400' : 'border-gray-200 bg-gray-50'
                    }`}>
                        <User color="gray" size="15" />
                        <input
                            type="text"
                            placeholder={t('personal.placeholders.firstName')}
                            value={formData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            disabled={!isEditing}
                            className={`w-full focus:outline-none text-sm font-light ${
                                isEditing ? 'text-gray-700' : 'text-gray-500 bg-transparent'
                            }`}
                        />
                    </div>
                </div>

                {/* Last Name */}
                <div className="space-y-1">
                    <label className="text-gray-800 text-sm capitalize font-[500]">
                        {t('personal.fields.lastName')}
                    </label>
                    <div className={`px-3 py-3 border rounded-lg flex items-center gap-2 ${
                        isEditing ? 'border-gray-400' : 'border-gray-200 bg-gray-50'
                    }`}>
                        <User color="gray" size="15" />
                        <input
                            type="text"
                            placeholder={t('personal.placeholders.lastName')}
                            value={formData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            disabled={!isEditing}
                            className={`w-full focus:outline-none text-sm font-light ${
                                isEditing ? 'text-gray-700' : 'text-gray-500 bg-transparent'
                            }`}
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label className="text-gray-800 text-sm capitalize font-[500]">
                        {t('personal.fields.email')}
                    </label>
                    <div className={`px-3 py-3 border rounded-lg flex items-center gap-2 ${
                        isEditing ? 'border-gray-400' : 'border-gray-200 bg-gray-50'
                    }`}>
                        <Email color="gray" size="15" />
                        <input
                            type="email"
                            placeholder={t('personal.placeholders.email')}
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            disabled={!isEditing}
                            className={`w-full focus:outline-none text-sm font-light ${
                                isEditing ? 'text-gray-700' : 'text-gray-500 bg-transparent'
                            }`}
                        />
                    </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                    <label className="text-gray-800 text-sm capitalize font-[500]">
                        {t('personal.fields.phone')}
                    </label>
                    <div className={`px-3 py-3 border rounded-lg flex items-center gap-2 ${
                        isEditing ? 'border-gray-400' : 'border-gray-200 bg-gray-50'
                    }`}>
                        <Phone color="gray" size="15" />
                        <input
                            type="tel"
                            placeholder={t('personal.placeholders.phone')}
                            value={formData.phoneNumber}
                            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                            disabled={!isEditing}
                            className={`w-full focus:outline-none text-sm font-light ${
                                isEditing ? 'text-gray-700' : 'text-gray-500 bg-transparent'
                            }`}
                        />
                    </div>
                </div>

                {/* Address */}
                <div className="space-y-1 md:col-span-2">
                    <label className="text-gray-800 text-sm capitalize font-[500]">
                        {t('personal.fields.address')}
                    </label>
                    <div className={`px-3 py-3 border rounded-lg flex items-start gap-2 ${
                        isEditing ? 'border-gray-400' : 'border-gray-200 bg-gray-50'
                    }`}>
                        <Location color="gray" size="15" className="mt-1" />
                        <textarea
                            placeholder={t('personal.placeholders.address')}
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            disabled={!isEditing}
                            className={`w-full focus:outline-none text-sm font-light resize-none ${
                                isEditing ? 'text-gray-700' : 'text-gray-500 bg-transparent'
                            }`}
                            rows={3}
                        />
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
                <div className="flex items-center justify-end gap-3 pt-4">
                    <button
                        onClick={handleEditToggle}
                        disabled={isSaving}
                        className="text-gray-600 hover:text-gray-800 text-sm px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                        {t('personal.buttons.cancel')}
                    </button>
                    <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="bg-cyan hover:bg-cyan-600 text-black text-sm px-8 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                {t('personal.buttons.saving')}
                            </>
                        ) : (
                            t('personal.buttons.saveChanges')
                        )}
                    </button>
                </div>
            )}
        </section>
    );
};

export default PersonalInformation;