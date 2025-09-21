import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Calender from "@/components/icons/calender";
import Ssd from "@/components/icons/ssd";
import Location from "@/components/icons/location";
import CustomSelect from "@/components/ui/select";
import FloatingInput from "@/components/ui/floating-input";
import FloatingTextarea from "@/components/ui/floating-textarea";
import { appointmentService } from "@/services/appointmentService";
import { authService } from "@/services/authService";
import paths from "@/config/paths";
import {useModal} from "@/hooks/useModal";
import {ConfirmationModal} from "@/components/ui/confirmation-modal";
import {SuccessModal} from "@/components/ui/success-modal";

interface OptionType {
    value: string;
    label: string;
}

interface ValidationErrors {
    service?: string;
    date?: string;
    location?: string;
    notes?: string;
}

const BookAppointment = () => {
    const { t } = useTranslation('home');
    const navigate = useNavigate();
    const authModal = useModal();
    const successModal = useModal();
    const errorModal = useModal();
    const [selectedService, setSelectedService] = useState<OptionType | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [successData, setSuccessData] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Updated service options to match backend enum ('basic' | 'deluxe')
    const serviceOptions: OptionType[] = [
        { value: "basic", label: t('booking.services.basic') },
        { value: "deluxe", label: t('booking.services.deluxe') },
    ];

    // Service pricing (you can adjust these values or fetch from API)
    const servicePricing = {
        basic: {
            basePrice: 1000,
            description: t('booking.pricing.extraCharges')
        },
        deluxe: {
            basePrice: 1500,
            description: t('booking.pricing.extraCharges')
        }
    };

    // Helper function to get service price and info
    const getServiceInfo = (serviceType: string) => {
        return servicePricing[serviceType as keyof typeof servicePricing];
    };

    // Helper function to get minimum date (tomorrow)
    const getMinDate = (): string => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    // Helper function to get maximum date (3 months from now)
    const getMaxDate = (): string => {
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        return maxDate.toISOString().split('T')[0];
    };

    // Clear specific field error when user starts typing/selecting
    const clearFieldError = (field: keyof ValidationErrors) => {
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    // Validation function
    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        // Service validation
        if (!selectedService) {
            newErrors.service = t('booking.validation.serviceRequired');
        }

        // Date validation
        if (!selectedDate) {
            newErrors.date = t('booking.validation.dateRequired');
        } else {
            const selectedDateObj = new Date(selectedDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDateObj < today) {
                newErrors.date = t('booking.validation.futureDate');
            }
        }

        // Location validation
        if (!location.trim()) {
            newErrors.location = t('booking.validation.locationRequired');
        } else if (location.trim().length < 5) {
            newErrors.location = t('booking.validation.locationTooShort');
        } else if (location.trim().length > 200) {
            newErrors.location = t('booking.validation.locationTooLong');
        }

        // Notes validation
        if (notes.length > 500) {
            newErrors.notes = t('booking.validation.notesTooLong');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Authentication check with popup
    const checkAuthentication = async (): Promise<boolean> => {
        if (!authService.isAuthenticated()) {
            authModal.openModal();
            return false;
        }
        return true;
    };

    const handleAuthConfirm = () => {
        authModal.closeModal();
        navigate(paths.login.path);
    };

    const handleConfirmAppointment = async () => {
        const isAuthenticated = await checkAuthentication();
        if (!isAuthenticated) {
            return;
        }

        setErrors({});
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const appointmentData = {
                serviceType: selectedService!.value as 'basic' | 'deluxe',
                appointmentDate: selectedDate,
                location: location.trim(),
                ...(notes.trim() && { notes: notes.trim() })
            };

            const result = await appointmentService.bookAppointment(appointmentData);

            const currentUser = authService.getCurrentUser();
            if (currentUser && result.userPointsRemaining !== undefined) {
                const updatedUser = {
                    ...currentUser,
                    totalPoints: result.userPointsRemaining
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            // Set success data and show modal
            setSuccessData({
                service: result.appointment.serviceType === 'basic' ? t('booking.services.basic') : t('booking.services.deluxe'),
                date: new Date(result.appointment.appointmentDate).toLocaleDateString(),
                time: result.appointment.timeSlot,
                location: result.appointment.location,
                pointsRemaining: result.userPointsRemaining
            });

            successModal.openModal();

            // Reset form
            setSelectedService(null);
            setSelectedDate("");
            setLocation("");
            setNotes("");
            setErrors({});

        } catch (error: any) {
            setErrorMessage(error.message || t('booking.messages.bookingError'));
            errorModal.openModal();
            console.error("Booking error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-10 px-5">
                <p className="text-4xl font-semibold capitalize">{t('booking.title')}</p>

                <div className="w-full max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {/* Service Selection */}
                        <div className="flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-5 py-3">
                            <Ssd size="25" />
                            <div className="flex flex-col items-start justify-center min-w-0 flex-1">
                                <p className="text-sm capitalize mb-1">{t('booking.fields.selectService')} *</p>
                                <CustomSelect
                                    options={serviceOptions}
                                    placeholder={t('booking.placeholders.chooseService')}
                                    value={selectedService}
                                    onChange={(value) => {
                                        setSelectedService(value);
                                        clearFieldError('service');
                                    }}
                                />
                                {errors.service && (
                                    <p className="text-red-500 text-xs mt-1">{errors.service}</p>
                                )}
                                {!errors.service && selectedService && (
                                    <div className="mt-1">
                                        <p className="text-green-600 text-xs font-medium">
                                            💰 {t('booking.pricing.price')}: {getServiceInfo(selectedService.value).basePrice} {t('booking.pricing.points')}
                                        </p>
                                        <p className="text-gray-500 text-xs">
                                            {getServiceInfo(selectedService.value).description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Date Selection - Now using HTML5 date input */}
                        <div className="flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-5 py-3">
                            <Calender size="25" />
                            <div className="flex flex-col items-start justify-center min-w-0 flex-1">
                                <p className="text-sm capitalize mb-1">{t('booking.fields.selectDate')} *</p>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => {
                                        setSelectedDate(e.target.value);
                                        clearFieldError('date');
                                    }}
                                    min={getMinDate()}
                                    max={getMaxDate()}
                                    className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#26687D] focus:border-transparent ${
                                        errors.date ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.date && (
                                    <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                                )}
                                {!errors.date && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {t('booking.hints.dateRange')}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Location Input - Now spans 2 columns on large screens */}
                        <div className="lg:col-span-2 flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-5 py-3">
                            <Location size="25" />
                            <div className="flex flex-col items-start justify-center min-w-0 flex-1">
                                <p className="text-sm capitalize mb-1">{t('booking.fields.serviceLocation')} *</p>
                                <FloatingInput
                                    id="location"
                                    label={t('booking.placeholders.enterAddress')}
                                    type="text"
                                    value={location}
                                    onChange={(e) => {
                                        setLocation(e.target.value);
                                        clearFieldError('location');
                                    }}
                                />
                                {errors.location && (
                                    <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                                )}
                                {!errors.location && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {t('booking.hints.locationInfo')}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Notes Section - Full width */}
                    <div className="mt-5 border border-gray-300 rounded-lg px-5 py-3">
                        <div className="flex flex-col items-start justify-center">
                            <p className="text-sm capitalize mb-1">{t('booking.fields.additionalNotes')}</p>
                            <FloatingTextarea
                                id="notes"
                                label={t('booking.placeholders.specialInstructions')}
                                value={notes}
                                onChange={(e) => {
                                    setNotes(e.target.value);
                                    clearFieldError('notes');
                                }}
                            />
                            {errors.notes && (
                                <p className="text-red-500 text-xs mt-1">{errors.notes}</p>
                            )}
                            <p className={`text-xs mt-1 ${
                                notes.length > 450 ? 'text-orange-500' :
                                    notes.length > 500 ? 'text-red-500' : 'text-gray-500'
                            }`}>
                                {notes.length}/500 {t('booking.hints.characters')}
                            </p>
                        </div>
                    </div>

                    {/* Cancellation Policy Disclaimer */}
                    <div className="mt-5 mb-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <div>
                                <h4 className="text-sm font-semibold text-amber-800 mb-1">
                                    {t('booking.policy.title')}
                                </h4>
                                <p className="text-sm text-amber-700">
                                    {t('booking.policy.noShowFee')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Book Button */}
                    <div className="mt-5 flex justify-center">
                        <button
                            onClick={handleConfirmAppointment}
                            disabled={isLoading}
                            className={`px-8 py-3 text-white rounded-md capitalize text-sm transition-colors min-w-[200px] ${
                                isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-[#26687D] hover:bg-[#1e5a6b]'
                            }`}
                        >
                            {isLoading ? t('booking.buttons.booking') : t('booking.buttons.bookAppointment')}
                        </button>
                    </div>

                    {/* Information Text */}
                    <div className="mt-5 text-center text-sm text-gray-600">
                        <p>{t('booking.info.requiredFields')}</p>
                        <p className="mt-1">{t('booking.info.mobileTeam')}</p>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={authModal.isOpen}
                onClose={authModal.closeModal}
                onConfirm={handleAuthConfirm}
                title={t('booking.auth.title')}
                message={t('booking.auth.message')}
                confirmText={t('booking.auth.signIn')}
                cancelText={t('common:cancel')}
                type="info"
                icon={
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                }
            />

            {/* Success Modal */}
            <SuccessModal
                isOpen={successModal.isOpen}
                onClose={successModal.closeModal}
                title={t('booking.success.title')}
                details={successData ? [
                    { label: t('booking.success.service'), value: successData.service },
                    { label: t('booking.success.date'), value: successData.date },
                    { label: t('booking.success.time'), value: successData.time },
                    { label: t('booking.success.location'), value: successData.location },
                    { label: t('booking.success.pointsRemaining'), value: successData.pointsRemaining.toString() }
                ] : []}
                message={t('booking.policy.successReminder')}

            />

            <ConfirmationModal
                isOpen={errorModal.isOpen}
                onClose={errorModal.closeModal}
                onConfirm={errorModal.closeModal}
                title={t('booking.error.title')}
                message={errorMessage}
                confirmText={t('booking.error.tryAgain')}
                cancelText={t('common:cancel')}
                type="error"
            />
        </>
    );
};

export default BookAppointment;