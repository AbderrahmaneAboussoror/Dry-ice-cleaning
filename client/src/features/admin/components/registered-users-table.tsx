import { User } from '../../../services/adminService';

interface RegisteredUsersTableProps {
    users: User[];
}

const RegisteredUsersTable = ({ users }: RegisteredUsersTableProps) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const generateAvatarUrl = (firstName?: string, lastName?: string) => {
        const first = firstName?.charAt(0)?.toUpperCase() || 'U';
        const last = lastName?.charAt(0)?.toUpperCase() || 'U';
        const initials = `${first}${last}`;
        return `https://ui-avatars.com/api/?name=${initials}&background=2563eb&color=fff&size=128`;
    };

    // Add safety check for users array
    if (!users || users.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Registered Users</h3>
                </div>
                <div className="px-6 py-4 text-center text-gray-500">
                    No users found
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Registered Users</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Points
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Join Date
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <img
                                        src={generateAvatarUrl(user.firstName, user.lastName)}
                                        alt={`${user.firstName || 'User'} ${user.lastName || ''}`}
                                        className="w-8 h-8 rounded-full mr-3"
                                    />
                                    <div className="text-sm font-medium text-gray-900">
                                        {user.firstName || 'Unknown'} {user.lastName || 'User'}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{user.phoneNumber}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-blue-600">
                                    {user.totalPoints} pts
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                    {formatDate(user.createdAt)}
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

export default RegisteredUsersTable;