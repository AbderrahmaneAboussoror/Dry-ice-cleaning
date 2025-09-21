import FullCalendar from "@/components/icons/full-calendar";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { userService, type UserAppointment } from "@/services/userService";
import { InfoModal } from "@/components/ui/info-modal";
import { useModal } from "@/hooks/useModal";

const Appointments = () => {
    const { t } = useTranslation('profile');
    const policyModal = useModal();

    // Helper function to format date
    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        const locale = t('appointments.dateLocale'); // 'en-US' or 'da-DK'
        return date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Helper function to format service type
    const formatServiceType = (serviceType: 'basic' | 'deluxe') => {
        return serviceType === 'basic' ? t('appointments.serviceTypes.basic') : t('appointments.serviceTypes.deluxe');
    };

    // Helper function to get status styling
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'confirmed':
                return {
                    statusColor: 'text-green-700',
                    bgColor: 'bg-green-200'
                };
            case 'pending':
                return {
                    statusColor: 'text-yellow-700',
                    bgColor: 'bg-yellow-200'
                };
            case 'in_progress':
                return {
                    statusColor: 'text-blue-700',
                    bgColor: 'bg-blue-200'
                };
            case 'cancelled':
                return {
                    statusColor: 'text-red-700',
                    bgColor: 'bg-red-200'
                };
            default:
                return {
                    statusColor: 'text-gray-700',
                    bgColor: 'bg-gray-200'
                };
        }
    };

    // Helper function to format status
    const formatStatus = (status: string) => {
        const statusKey = `appointments.statuses.${status}`;
        return t(statusKey);
    };

    const [appointments, setAppointments] = useState<UserAppointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const appointmentData = await userService.getUserAppointments();
            setAppointments(appointmentData);
        } catch (error: any) {
            console.error('Error loading appointments:', error);
            setError(error.message || t('appointments.errors.loadFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <section className="bg-white p-4 md:p-6 rounded-lg shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_3px_3px_rgba(0,0,0,0.1)]">
                <div className="animate-pulse">
                    <div className="flex items-center space-x-2 mb-6">
                        <div className="w-5 h-5 bg-gray-200 rounded"></div>
                        <div className="h-6 bg-gray-200 rounded w-48"></div>
                    </div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="bg-white p-4 md:p-6 rounded-lg shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_3px_3px_rgba(0,0,0,0.1)]">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div className="flex items-center space-x-2">
                        <FullCalendar size="18" color="#26687D" />
                        <span className="text-base md:text-lg text-gray-800 font-semibold capitalize">
                            {t('appointments.title')}
                        </span>
                    </div>
                    {!isLoading && (
                        <button
                            onClick={loadAppointments}
                            className="text-cyan hover:text-cyan-600 text-sm font-medium"
                        >
                            {t('appointments.buttons.refresh')}
                        </button>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4 flex items-center justify-between">
                        <span>{error}</span>
                        <button
                            onClick={loadAppointments}
                            className="text-red-600 hover:text-red-800 underline ml-4"
                        >
                            {t('appointments.buttons.retry')}
                        </button>
                    </div>
                )}

                {/* No Appointments Message */}
                {!error && appointments.length === 0 && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FullCalendar size="48" color="#9CA3AF" />
                        </div>
                        <p className="text-gray-500 mt-4">{t('appointments.empty.title')}</p>
                        <p className="text-gray-400 text-sm mt-1">{t('appointments.empty.subtitle')}</p>
                    </div>
                )}

                {/* Desktop Table View */}
                {appointments.length > 0 && (
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                            <tr className="border-b border-gray-200">
                                <th className="py-3 px-4 text-gray-700 font-normal text-sm">{t('appointments.table.date')}</th>
                                <th className="py-3 px-4 text-gray-700 font-normal text-sm">{t('appointments.table.time')}</th>
                                <th className="py-3 px-4 text-gray-700 font-normal text-sm">{t('appointments.table.service')}</th>
                                <th className="py-3 px-4 text-gray-700 font-normal text-sm">{t('appointments.table.location')}</th>
                                <th className="py-3 px-4 text-gray-700 font-normal text-sm">{t('appointments.table.points')}</th>
                                <th className="py-3 px-4 text-gray-700 font-normal text-sm">
                                    <div className="flex items-center space-x-2">
                                        <span>{t('appointments.table.status')}</span>
                                        <button
                                            onClick={policyModal.openModal}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                            title={t('appointments.policy.tooltip')}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {appointments.map((appointment) => {
                                const { statusColor, bgColor } = getStatusStyle(appointment.status);
                                return (
                                    <tr
                                        key={appointment.id}
                                        className="border-b border-gray-100 font-[500] text-sm"
                                    >
                                        <td className="py-3 px-4">
                                            {formatDate(appointment.appointmentDate)}
                                        </td>
                                        <td className="py-3 px-4">{appointment.timeSlot}</td>
                                        <td className="py-3 px-4">
                                            {formatServiceType(appointment.serviceType)}
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">{appointment.location}</td>
                                        <td className="py-3 px-4">{appointment.price}</td>
                                        <td className="py-3 px-4 text-start align-middle">
                                            <p
                                                className={`inline-block font-medium ${statusColor} ${bgColor} py-2 px-5 rounded-full`}
                                            >
                                                {formatStatus(appointment.status)}
                                            </p>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Mobile Card View */}
                {appointments.length > 0 && (
                    <div className="md:hidden space-y-4">
                        {/* Policy info for mobile - shown above cards */}
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <span className="text-sm text-gray-600">{t('appointments.policy.mobileLabel')}</span>
                            <button
                                onClick={policyModal.openModal}
                                className="text-[#26687D] hover:text-[#1e5a6b] text-sm font-medium flex items-center space-x-1"
                            >
                                <span>{t('appointments.policy.viewPolicy')}</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                        </div>

                        {appointments.map((appointment) => {
                            const { statusColor, bgColor } = getStatusStyle(appointment.status);
                            return (
                                <div
                                    key={appointment.id}
                                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-sm mb-1">
                                                {formatServiceType(appointment.serviceType)}
                                            </h3>
                                            <p className="text-gray-600 text-xs">{appointment.location}</p>
                                        </div>
                                        <span
                                            className={`inline-block font-medium text-xs ${statusColor} ${bgColor} py-1 px-3 rounded-full`}
                                        >
                                            {formatStatus(appointment.status)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                                        <div>
                                            <span className="text-gray-500 text-xs uppercase tracking-wide">
                                                {t('appointments.mobile.date')}
                                            </span>
                                            <p className="font-medium text-gray-900">
                                                {formatDate(appointment.appointmentDate)}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-xs uppercase tracking-wide">
                                                {t('appointments.mobile.time')}
                                            </span>
                                            <p className="font-medium text-gray-900">{appointment.timeSlot}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="text-gray-500 text-xs uppercase tracking-wide">
                                                {t('appointments.mobile.price')}
                                            </span>
                                            <p className="font-medium text-gray-900">{appointment.price}</p>
                                        </div>
                                        {appointment.notes && (
                                            <div className="text-right">
                                                <span className="text-gray-500 text-xs uppercase tracking-wide">
                                                    {t('appointments.mobile.notes')}
                                                </span>
                                                <p className="font-medium text-gray-900 text-xs max-w-32 truncate">
                                                    {appointment.notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Tablet Horizontal Scroll View */}
                {appointments.length > 0 && (
                    <div className="md:hidden sm:block hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[700px]">
                                <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 px-3 text-gray-700 font-normal text-sm whitespace-nowrap">{t('appointments.table.date')}</th>
                                    <th className="py-3 px-3 text-gray-700 font-normal text-sm whitespace-nowrap">{t('appointments.table.time')}</th>
                                    <th className="py-3 px-3 text-gray-700 font-normal text-sm whitespace-nowrap">{t('appointments.table.service')}</th>
                                    <th className="py-3 px-3 text-gray-700 font-normal text-sm whitespace-nowrap">{t('appointments.table.location')}</th>
                                    <th className="py-3 px-3 text-gray-700 font-normal text-sm whitespace-nowrap">{t('appointments.table.price')}</th>
                                    <th className="py-3 px-3 text-gray-700 font-normal text-sm whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <span>{t('appointments.table.status')}</span>
                                            <button
                                                onClick={policyModal.openModal}
                                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                                title={t('appointments.policy.tooltip')}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {appointments.map((appointment) => {
                                    const { statusColor, bgColor } = getStatusStyle(appointment.status);
                                    return (
                                        <tr
                                            key={appointment.id}
                                            className="border-b border-gray-100 font-[500] text-sm"
                                        >
                                            <td className="py-3 px-3 whitespace-nowrap">
                                                {formatDate(appointment.appointmentDate)}
                                            </td>
                                            <td className="py-3 px-3 whitespace-nowrap">{appointment.timeSlot}</td>
                                            <td className="py-3 px-3">
                                                {formatServiceType(appointment.serviceType)}
                                            </td>
                                            <td className="py-3 px-3 text-gray-600">{appointment.location}</td>
                                            <td className="py-3 px-3">${appointment.price}</td>
                                            <td className="py-3 px-3 text-start align-middle">
                                                <p
                                                    className={`inline-block font-medium ${statusColor} ${bgColor} py-1 px-3 rounded-full text-xs`}
                                                >
                                                    {formatStatus(appointment.status)}
                                                </p>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </section>

            {/* Policy Info Modal */}
            <InfoModal
                isOpen={policyModal.isOpen}
                onClose={policyModal.closeModal}
                title={t('appointments.policy.modalTitle')}
                content={t('appointments.policy.modalMessage')}
            />
        </>
    );
};

export default Appointments;