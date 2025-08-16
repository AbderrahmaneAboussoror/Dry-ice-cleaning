// /app/routes/pages/admin/appointments.tsx
import AdminLayout from "@/features/admin/components/admin-layout";
import FunctionalBookedAppointmentsTable, {
    useAppointmentsManagement,
    AppointmentsManagementModals
} from "@/features/admin/components/booked-appointments-table";

const AppointmentsPage = () => {
    const {
        appointments,
        loading,
        error,
        stats,
        statusFilter,
        setStatusFilter,
        serviceTypeFilter,
        setServiceTypeFilter,
        dateFilter,
        setDateFilter,
        weekFilter,
        setWeekFilter,
        openCancelModal,
        openDetailsModal,
        fetchAppointments,
        setError,
        // Modal props
        ...modalProps
    } = useAppointmentsManagement();

    if (loading && appointments.length === 0) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading appointments...</span>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Appointments Management</h1>
                    <p className="text-gray-600 mt-1">View and manage all appointments</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600">Total</div>
                        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600">Confirmed</div>
                        <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600">Pending</div>
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600">In Progress</div>
                        <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                            <select
                                value={serviceTypeFilter}
                                onChange={(e) => setServiceTypeFilter(e.target.value as any)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Services</option>
                                <option value="basic">Basic</option>
                                <option value="deluxe">Deluxe</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={weekFilter}
                                    onChange={(e) => setWeekFilter(e.target.checked)}
                                    className="mr-2"
                                />
                                <span className="text-sm text-gray-700">This Week Only</span>
                            </label>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={fetchAppointments}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors w-full"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={() => setError(null)}
                            className="mt-2 text-sm text-red-800 underline"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Appointments Table */}
                <FunctionalBookedAppointmentsTable
                    appointments={appointments}
                    showActions={true}
                    onCancel={openCancelModal}
                    onViewDetails={openDetailsModal}
                />

                {/* All Modals */}
                <AppointmentsManagementModals {...modalProps} />
            </div>
        </AdminLayout>
    );
};

export default AppointmentsPage;