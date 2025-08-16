import { useState, useEffect } from 'react';
import { adminService, User, CreateUserData, UpdateUserData, UpdatePointsData } from "@/services/adminService";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Modal } from "@/components/ui/modal";
import FloatingInput from "@/components/ui/floating-input";

// Transform User data for the table component
interface TableUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalPoints: string;
    avatar: string;
    joinDate: string;
    status: string;
}

// Enhanced UsersManagementTable with backend integration
interface UsersManagementTableProps {
    users: TableUser[];
    onEdit: (userId: string) => void;
    onDelete: (userId: string) => void;
    onUpdatePoints: (userId: string) => void;
}

const FunctionalUsersManagementTable = ({ users, onEdit, onDelete, onUpdatePoints }: UsersManagementTableProps) => {
    const getStatusBadgeColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-gray-100 text-gray-800';
            case 'suspended':
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

    if (users.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500">No users found</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        <div className="text-sm text-gray-500">ID: {user.id.slice(-8)}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{user.email}</div>
                                <div className="text-sm text-gray-500">{user.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-blue-600">{user.totalPoints}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{formatDate(user.joinDate)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(user.status)}`}>
                                        {user.status}
                                    </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => onEdit(user.id)}
                                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onUpdatePoints(user.id)}
                                        className="inline-flex items-center px-3 py-1 border border-blue-300 text-xs font-medium rounded text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                                    >
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                        Points
                                    </button>
                                    <button
                                        onClick={() => onDelete(user.id)}
                                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 transition-colors"
                                    >
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Hook for users management logic
export const useUsersManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination & Search
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPointsModal, setShowPointsModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Form data
    const [createFormData, setCreateFormData] = useState<CreateUserData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: '',
        totalPoints: 0
    });

    const [editFormData, setEditFormData] = useState<UpdateUserData>({});

    const [pointsFormData, setPointsFormData] = useState<UpdatePointsData>({
        points: 0,
        operation: 'add',
        reason: ''
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const isActiveFilter = statusFilter === 'all' ? undefined : statusFilter === 'active';

            const response = await adminService.getAllUsers({
                page: currentPage,
                limit: 20,
                search: searchTerm || undefined,
                isActive: isActiveFilter
            });

            setUsers(response.data);
            setTotalPages(response.pagination?.pages || 1);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users. Please try again.');
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

    const transformUsersForTable = (users: User[]): TableUser[] => {
        return users.map(user => ({
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phoneNumber,
            totalPoints: `${user.totalPoints} pts`,
            avatar: generateAvatarUrl(user.firstName, user.lastName),
            joinDate: user.createdAt,
            status: user.isActive ? 'Active' : 'Inactive'
        }));
    };

    const handleCreateUser = async () => {
        try {
            setLoading(true);
            await adminService.createUser(createFormData);

            setShowCreateModal(false);
            setCreateFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                phoneNumber: '',
                address: '',
                totalPoints: 0
            });

            await fetchUsers();
            console.log('User created successfully');
        } catch (err) {
            console.error('Error creating user:', err);
            setError(err instanceof Error ? err.message : 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = async () => {
        if (!selectedUser) return;

        try {
            setLoading(true);
            await adminService.updateUser(selectedUser._id, editFormData);

            setShowEditModal(false);
            setSelectedUser(null);
            setEditFormData({});

            await fetchUsers();
            console.log('User updated successfully');
        } catch (err) {
            console.error('Error updating user:', err);
            setError(err instanceof Error ? err.message : 'Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;

        try {
            setLoading(true);
            await adminService.deleteUser(selectedUser._id);

            setShowDeleteModal(false);
            setSelectedUser(null);

            await fetchUsers();
            console.log('User deleted successfully');
        } catch (err) {
            console.error('Error deleting user:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete user');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePoints = async () => {
        if (!selectedUser) return;

        try {
            setLoading(true);
            await adminService.updateUserPoints(selectedUser._id, pointsFormData);

            setShowPointsModal(false);
            setSelectedUser(null);
            setPointsFormData({ points: 0, operation: 'add', reason: '' });

            await fetchUsers();
            console.log('Points updated successfully');
        } catch (err) {
            console.error('Error updating points:', err);
            setError(err instanceof Error ? err.message : 'Failed to update points');
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (userId: string) => {
        const user = users.find(u => u._id === userId);
        if (user) {
            setSelectedUser(user);
            setEditFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                address: user.address,
                isActive: user.isActive
            });
            setShowEditModal(true);
        }
    };

    const openDeleteModal = (userId: string) => {
        const user = users.find(u => u._id === userId);
        if (user) {
            setSelectedUser(user);
            setShowDeleteModal(true);
        }
    };

    const openPointsModal = (userId: string) => {
        const user = users.find(u => u._id === userId);
        if (user) {
            setSelectedUser(user);
            setShowPointsModal(true);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchTerm, statusFilter]);

    return {
        // Data
        users: transformUsersForTable(users),
        loading,
        error,

        // Pagination
        currentPage,
        totalPages,
        setCurrentPage,

        // Search & Filter
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,

        // Actions
        openEditModal,
        openDeleteModal,
        openPointsModal,
        setShowCreateModal,
        fetchUsers,
        setError,

        // Modal states and handlers
        showCreateModal,
        showEditModal,
        showDeleteModal,
        showPointsModal,
        selectedUser,
        createFormData,
        setCreateFormData,
        editFormData,
        setEditFormData,
        pointsFormData,
        setPointsFormData,
        handleCreateUser,
        handleEditUser,
        handleDeleteUser,
        handleUpdatePoints,
        setShowEditModal,
        setShowDeleteModal,
        setShowPointsModal,
    };
};

// Modals component
export const UsersManagementModals = ({
                                          showCreateModal,
                                          showEditModal,
                                          showDeleteModal,
                                          showPointsModal,
                                          selectedUser,
                                          createFormData,
                                          setCreateFormData,
                                          editFormData,
                                          setEditFormData,
                                          pointsFormData,
                                          setPointsFormData,
                                          handleCreateUser,
                                          handleEditUser,
                                          handleDeleteUser,
                                          handleUpdatePoints,
                                          setShowCreateModal,
                                          setShowEditModal,
                                          setShowDeleteModal,
                                          setShowPointsModal,
                                      }: any) => {
    return (
        <>
            {/* Create User Modal */}
            {showCreateModal && (
                <Modal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    title="Create New User"
                >
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FloatingInput
                                id="firstName"
                                label="First Name"
                                value={createFormData.firstName}
                                onChange={(e) => setCreateFormData((prev: CreateUserData) => ({ ...prev, firstName: e.target.value }))}
                                required
                            />
                            <FloatingInput
                                id="lastName"
                                label="Last Name"
                                value={createFormData.lastName}
                                onChange={(e) => setCreateFormData((prev: CreateUserData) => ({ ...prev, lastName: e.target.value }))}
                                required
                            />
                        </div>
                        <FloatingInput
                            id="email"
                            label="Email"
                            type="email"
                            value={createFormData.email}
                            onChange={(e) => setCreateFormData((prev: CreateUserData) => ({ ...prev, email: e.target.value }))}
                            required
                        />
                        <FloatingInput
                            id="password"
                            label="Password"
                            type="text"
                            value={createFormData.password}
                            onChange={(e) => setCreateFormData((prev: CreateUserData) => ({ ...prev, password: e.target.value }))}
                            required
                        />
                        <FloatingInput
                            id="phoneNumber"
                            label="Phone Number"
                            value={createFormData.phoneNumber}
                            onChange={(e) => setCreateFormData((prev: CreateUserData) => ({ ...prev, phoneNumber: e.target.value }))}
                            required
                        />
                        <FloatingInput
                            id="address"
                            label="Address"
                            type="area"
                            value={createFormData.address}
                            onChange={(e) => setCreateFormData((prev: CreateUserData) => ({ ...prev, address: e.target.value }))}
                            required
                        />
                        <FloatingInput
                            id="totalPoints"
                            label="Initial Points"
                            type="text"
                            value={createFormData.totalPoints?.toString() || '0'}
                            onChange={(e) => setCreateFormData((prev: CreateUserData) => ({ ...prev, totalPoints: parseInt(e.target.value) || 0 }))}
                        />
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateUser}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Create User
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <Modal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    title={`Edit ${selectedUser.firstName} ${selectedUser.lastName}`}
                >
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FloatingInput
                                id="editFirstName"
                                label="First Name"
                                value={editFormData.firstName || ''}
                                onChange={(e) => setEditFormData((prev: UpdateUserData) => ({ ...prev, firstName: e.target.value }))}
                            />
                            <FloatingInput
                                id="editLastName"
                                label="Last Name"
                                value={editFormData.lastName || ''}
                                onChange={(e) => setEditFormData((prev: UpdateUserData) => ({ ...prev, lastName: e.target.value }))}
                            />
                        </div>
                        <FloatingInput
                            id="editEmail"
                            label="Email"
                            type="email"
                            value={editFormData.email || ''}
                            onChange={(e) => setEditFormData((prev: UpdateUserData) => ({ ...prev, email: e.target.value }))}
                        />
                        <FloatingInput
                            id="editPhoneNumber"
                            label="Phone Number"
                            value={editFormData.phoneNumber || ''}
                            onChange={(e) => setEditFormData((prev: UpdateUserData) => ({ ...prev, phoneNumber: e.target.value }))}
                        />
                        <FloatingInput
                            id="editAddress"
                            label="Address"
                            type="area"
                            value={editFormData.address || ''}
                            onChange={(e) => setEditFormData((prev: UpdateUserData) => ({ ...prev, address: e.target.value }))}
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={editFormData.isActive ? 'active' : 'inactive'}
                                onChange={(e) => setEditFormData((prev: UpdateUserData) => ({ ...prev, isActive: e.target.value === 'active' }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditUser}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Update User
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Update Points Modal */}
            {showPointsModal && selectedUser && (
                <Modal
                    isOpen={showPointsModal}
                    onClose={() => setShowPointsModal(false)}
                    title={`Update Points for ${selectedUser.firstName} ${selectedUser.lastName}`}
                >
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">Current Points: <span className="font-semibold text-blue-600">{selectedUser.totalPoints}</span></p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Operation</label>
                            <select
                                value={pointsFormData.operation}
                                onChange={(e) => setPointsFormData((prev: UpdatePointsData) => ({ ...prev, operation: e.target.value as 'add' | 'subtract' | 'set' }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="add">Add Points</option>
                                <option value="subtract">Subtract Points</option>
                                <option value="set">Set Points</option>
                            </select>
                        </div>
                        <FloatingInput
                            id="pointsAmount"
                            label="Points Amount"
                            type="text"
                            value={pointsFormData.points.toString()}
                            onChange={(e) => setPointsFormData((prev: UpdatePointsData) => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                            required
                        />
                        <FloatingInput
                            id="pointsReason"
                            label="Reason (Optional)"
                            type="area"
                            value={pointsFormData.reason || ''}
                            onChange={(e) => setPointsFormData((prev: UpdatePointsData) => ({ ...prev, reason: e.target.value }))}
                        />
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                onClick={() => setShowPointsModal(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdatePoints}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Update Points
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedUser && (
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteUser}
                    title="Delete User"
                    message={`Are you sure you want to delete ${selectedUser.firstName} ${selectedUser.lastName}? This action cannot be undone.`}
                    confirmText="Delete"
                    type="error"
                />
            )}
        </>
    );
};

export default FunctionalUsersManagementTable;