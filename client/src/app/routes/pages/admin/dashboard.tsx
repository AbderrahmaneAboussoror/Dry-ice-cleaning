import { useState, useEffect } from 'react';
import AdminLayout from "@/features/admin/components/admin-layout";
import StatsCard from "@/features/admin/components/stats-card";
import RegisteredUsersTable from "@/features/admin/components/registered-users-table";
// import BookedAppointmentsTable from "@/features/admin/components/booked-appointments-table";
import User from "@/components/icons/user";
import FullCalendar from "@/components/icons/full-calendar";
import Clock from "@/components/icons/clock";
import CreditCard from "@/components/icons/credit-card";
import { adminService, User as UserType, Appointment } from "@/services/adminService";

const AdminDashboard = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeAppointments: 0,
        pendingAppointments: 0,
        totalServicePacks: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch all data in parallel
            const [usersResponse, appointmentsResponse, statsData] = await Promise.all([
                adminService.getAllUsers({ limit: 10 }), // Get first 10 users for the table
                adminService.getUpcomingAppointments({ week: true }), // Get this week's appointments
                adminService.getDashboardStats()
            ]);

            setUsers(usersResponse.data);
            setAppointments(appointmentsResponse.data);
            setStats(statsData);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const statsData = [
        {
            title: "Total Users",
            value: stats.totalUsers.toString(),
            icon: <User size="24" color="#3B82F6" />,
            bgColor: "bg-blue-50",
        },
        {
            title: "Active Appointments",
            value: stats.activeAppointments.toString(),
            icon: <FullCalendar size="24" color="#10B981" />,
            bgColor: "bg-green-50",
        },
        {
            title: "Pending",
            value: stats.pendingAppointments.toString(),
            icon: <Clock size="24" color="#F59E0B" />,
            bgColor: "bg-yellow-50",
        },
        {
            title: "Service Packs",
            value: stats.totalServicePacks.toString(),
            icon: <CreditCard size="24" color="#8B5CF6" />,
            bgColor: "bg-purple-50",
        },
    ];

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading dashboard...</span>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error</h3>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                            <button
                                onClick={fetchDashboardData}
                                className="mt-2 text-sm text-red-800 underline hover:text-red-600"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Welcome to your admin dashboard</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsData.map((stat, index) => (
                        <StatsCard
                            key={index}
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            bgColor={stat.bgColor}
                        />
                    ))}
                </div>

                {/* Registered Users Table */}
                <RegisteredUsersTable users={users} />

                {/* Booked Appointments Table */}
                {/*<BookedAppointmentsTable appointments={appointments} showActions={false} />*/}

                {/* Refresh Button */}
                <div className="flex justify-end">
                    <button
                        onClick={fetchDashboardData}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Refresh Data
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;