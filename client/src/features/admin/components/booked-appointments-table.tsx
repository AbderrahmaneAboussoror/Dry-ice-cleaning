import { useState, useEffect } from 'react';
import { adminService, Appointment, AppointmentsParams } from "@/services/adminService";
// import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Modal } from "@/components/ui/modal";
import FloatingInput from "@/components/ui/floating-input";

// Transform Appointment data for the table component
interface TableAppointment {
    id: string;
    user: {
        name: string;
        avatar: string;
        email: string;
        phone: string;
    };
    service: string;
    dateTime: {
        date: string;
        time: string;
    };
    location: string;
    status: string;
    statusColor: string;
    price: number;
    notes?: string;
}

// Enhanced BookedAppointmentsTable with backend integration
interface BookedAppointmentsTableProps {
    appointments: TableAppointment[];
    showActions?: boolean;
    onCancel: (appointmentId: string) => void;
    onViewDetails: (appointmentId: string) => void;
}

const FunctionalBookedAppointmentsTable = ({
                                               appointments,
                                               showActions = false,
                                               onCancel,
                                               onViewDetails
                                           }: BookedAppointmentsTableProps) => {
    if (appointments.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Booked Appointments</h3>
                </div>
                <p className="text-gray-500 mt-4">No appointments found</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Booked Appointments</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        {showActions && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        )}
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {appointments.map((appointment) => (
                        <tr key={appointment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <img
                                        src={appointment.user.avatar}
                                        alt={appointment.user.name}
                                        className="w-8 h-8 rounded-full mr-3"
                                    />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {appointment.user.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {appointment.user.email}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 capitalize">{appointment.service}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{appointment.dateTime.date}</div>
                                <div className="text-xs text-gray-500">{appointment.dateTime.time}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{appointment.location}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-green-600">
                                    {appointment.price} DKK
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${appointment.statusColor}`}>
                                        {appointment.status}
                                    </span>
                            </td>
                            {showActions && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => onViewDetails(appointment.id)}
                                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                        >
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            View
                                        </button>
                                        {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                                            <button
                                                onClick={() => onCancel(appointment.id)}
                                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 transition-colors"
                                            >
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Hook for appointments management logic
export const useAppointmentsManagement = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'>('all');
    const [serviceTypeFilter, setServiceTypeFilter] = useState<'all' | 'basic' | 'deluxe'>('all');
    const [dateFilter, setDateFilter] = useState('');
    const [weekFilter, setWeekFilter] = useState(false);

    // Modals
    const [showCancelModal, setCancelModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [cancelReason, setCancelReason] = useState('');

    // Stats calculation
    const getAppointmentStats = () => {
        return {
            total: appointments.length,
            confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
            pending: appointments.filter(apt => apt.status === 'pending').length,
            inProgress: appointments.filter(apt => apt.status === 'in_progress').length,
            completed: appointments.filter(apt => apt.status === 'completed').length,
            cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
        };
    };

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError(null);

            const params: AppointmentsParams = {};

            if (statusFilter !== 'all') {
                params.status = statusFilter;
            }

            if (serviceTypeFilter !== 'all') {
                params.serviceType = serviceTypeFilter;
            }

            if (dateFilter) {
                params.date = dateFilter;
            }

            if (weekFilter) {
                params.week = true;
            }

            const response = await adminService.getUpcomingAppointments(params);
            setAppointments(response.data);
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError('Failed to load appointments. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const generateAvatarUrl = (firstName: string, lastName: string) => {
        const first = firstName?.charAt(0)?.toUpperCase() || 'U';
        const last = lastName?.charAt(0)?.toUpperCase() || 'U';
        const initials = `${first}${last}`;
        return `https://ui-avatars.com/api/?name=${initials}&background=2563eb&color=fff&size=128`;
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'in_progress':
                return 'bg-purple-100 text-purple-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const transformAppointmentsForTable = (appointments: Appointment[]): TableAppointment[] => {
        return appointments.map(appointment => ({
            id: appointment._id,
            user: {
                name: `${appointment.userId.firstName} ${appointment.userId.lastName}`,
                avatar: generateAvatarUrl(appointment.userId.firstName, appointment.userId.lastName),
                email: appointment.userId.email,
                phone: appointment.userId.phoneNumber
            },
            service: appointment.serviceType,
            dateTime: {
                date: formatDate(appointment.appointmentDate),
                time: appointment.timeSlot
            },
            location: appointment.location,
            status: appointment.status.replace('_', ' '),
            statusColor: getStatusColor(appointment.status),
            price: appointment.price,
            notes: appointment.notes
        }));
    };

    const handleCancelAppointment = async () => {
        if (!selectedAppointment) return;

        try {
            setLoading(true);
            await adminService.cancelAppointment(selectedAppointment._id, cancelReason);

            setCancelModal(false);
            setSelectedAppointment(null);
            setCancelReason('');

            await fetchAppointments();
            console.log('Appointment cancelled successfully');
        } catch (err) {
            console.error('Error cancelling appointment:', err);
            setError(err instanceof Error ? err.message : 'Failed to cancel appointment');
        } finally {
            setLoading(false);
        }
    };

    const openCancelModal = (appointmentId: string) => {
        const appointment = appointments.find(a => a._id === appointmentId);
        if (appointment) {
            setSelectedAppointment(appointment);
            setCancelModal(true);
        }
    };

    const openDetailsModal = (appointmentId: string) => {
        const appointment = appointments.find(a => a._id === appointmentId);
        if (appointment) {
            setSelectedAppointment(appointment);
            setShowDetailsModal(true);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [statusFilter, serviceTypeFilter, dateFilter, weekFilter]);

    return {
        // Data
        appointments: transformAppointmentsForTable(appointments),
        loading,
        error,

        // Stats
        stats: getAppointmentStats(),

        // Filters
        statusFilter,
        setStatusFilter,
        serviceTypeFilter,
        setServiceTypeFilter,
        dateFilter,
        setDateFilter,
        weekFilter,
        setWeekFilter,

        // Actions
        openCancelModal,
        openDetailsModal,
        fetchAppointments,
        setError,

        // Modal states and handlers
        showCancelModal,
        showDetailsModal,
        selectedAppointment,
        cancelReason,
        setCancelReason,
        handleCancelAppointment,
        setCancelModal,
        setShowDetailsModal,
    };
};

// Modals component
export const AppointmentsManagementModals = ({
                                                 showCancelModal,
                                                 showDetailsModal,
                                                 selectedAppointment,
                                                 cancelReason,
                                                 setCancelReason,
                                                 handleCancelAppointment,
                                                 setCancelModal,
                                                 setShowDetailsModal,
                                             }: any) => {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'in_progress':
                return 'bg-purple-100 text-purple-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            {/* Cancel Appointment Modal */}
            {showCancelModal && selectedAppointment && (
                <Modal
                    isOpen={showCancelModal}
                    onClose={() => setCancelModal(false)}
                    title="Cancel Appointment"
                >
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Appointment Details:</h4>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p><span className="font-medium">Customer:</span> {selectedAppointment.userId.firstName} {selectedAppointment.userId.lastName}</p>
                                <p><span className="font-medium">Service:</span> {selectedAppointment.serviceType}</p>
                                <p><span className="font-medium">Date:</span> {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}</p>
                                <p><span className="font-medium">Time:</span> {selectedAppointment.timeSlot}</p>
                                <p><span className="font-medium">Location:</span> {selectedAppointment.location}</p>
                            </div>
                        </div>

                        <FloatingInput
                            id="cancelReason"
                            label="Cancellation Reason (Optional)"
                            type="area"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                        />

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-sm text-yellow-800">
                                <strong>Note:</strong> The customer will be automatically notified via email about this cancellation.
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                onClick={() => setCancelModal(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Keep Appointment
                            </button>
                            <button
                                onClick={handleCancelAppointment}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Cancel Appointment
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Appointment Details Modal */}
            {showDetailsModal && selectedAppointment && (
                <Modal
                    isOpen={showDetailsModal}
                    onClose={() => setShowDetailsModal(false)}
                    title="Appointment Details"
                    size="lg"
                >
                    <div className="space-y-6">
                        {/* Customer Information */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Name</p>
                                    <p className="text-sm text-gray-900">{selectedAppointment.userId.firstName} {selectedAppointment.userId.lastName}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Email</p>
                                    <p className="text-sm text-gray-900">{selectedAppointment.userId.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Phone</p>
                                    <p className="text-sm text-gray-900">{selectedAppointment.userId.phoneNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Total Points</p>
                                    <p className="text-sm text-blue-600 font-medium">{selectedAppointment.userId.totalPoints} pts</p>
                                </div>
                            </div>
                        </div>

                        {/* Appointment Information */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-3">Appointment Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Service Type</p>
                                    <p className="text-sm text-gray-900 capitalize">{selectedAppointment.serviceType}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Price</p>
                                    <p className="text-sm text-green-600 font-medium">{selectedAppointment.price} DKK</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Date</p>
                                    <p className="text-sm text-gray-900">{new Date(selectedAppointment.appointmentDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Time Slot</p>
                                    <p className="text-sm text-gray-900">{selectedAppointment.timeSlot}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm font-medium text-gray-700">Location</p>
                                    <p className="text-sm text-gray-900">{selectedAppointment.location}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm font-medium text-gray-700">Status</p>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedAppointment.status)}`}>
                                        {selectedAppointment.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        {selectedAppointment.notes && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedAppointment.notes}</p>
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default FunctionalBookedAppointmentsTable;