import AdminLayout from "@/features/admin/components/admin-layout";
import FunctionalUsersManagementTable, {
    useUsersManagement,
    UsersManagementModals
} from "@/features/admin/components/users-management-table";

const UsersPage = () => {
    const {
        users,
        loading,
        error,
        currentPage,
        totalPages,
        setCurrentPage,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        openEditModal,
        openDeleteModal,
        openPointsModal,
        setShowCreateModal,
        fetchUsers,
        setError,
        // Modal props
        ...modalProps
    } = useUsersManagement();

    if (loading && users.length === 0) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading users...</span>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-600">Manage registered users and their accounts</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Create New User
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Users</option>
                                <option value="active">Active Only</option>
                                <option value="inactive">Inactive Only</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setCurrentPage(1);
                                    fetchUsers();
                                }}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
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
                            className="mt-2 text-sm text-red-800 underline">
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Users Table */}
                <FunctionalUsersManagementTable
                    users={users}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                    onUpdatePoints={openPointsModal}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="px-3 py-2 text-gray-700">
                           Page {currentPage} of {totalPages}
                       </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* All Modals */}
                <UsersManagementModals {...modalProps} />
            </div>
        </AdminLayout>
    );
};

export default UsersPage;