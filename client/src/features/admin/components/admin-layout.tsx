import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import User from "@/components/icons/user";
import FullCalendar from "@/components/icons/full-calendar";
import CreditCard from "@/components/icons/credit-card";
import { authService, UserProfile } from "@/services/authService";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        // Get current user on component mount
        const user = authService.getStoredUser();
        setCurrentUser(user);

        // Redirect if not admin
        if (!user || user.role !== 'admin') {
            console.warn('Access denied: Admin role required');
            navigate('/login');
            return;
        }
    }, [navigate]);

    const navigationItems = [
        {
            name: "Dashboard",
            href: "/admin/dashboard",
            icon: (
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
                        fill="currentColor"
                    />
                </svg>
            ),
        },
        {
            name: "Users",
            href: "/admin/users",
            icon: <User size="20" />,
        },
        {
            name: "Appointments",
            href: "/admin/appointments",
            icon: <FullCalendar size="20" />,
        },
        {
            name: "Packs",
            href: "/admin/packs",
            icon: <CreditCard size="20" />,
        },
    ];

    const isActive = (href: string) => location.pathname === href;

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            // Clear auth data
            authService.logout();

            // Show success message (optional)
            console.log('Logged out successfully');

            // Redirect to login
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Even if there's an error, still redirect to login
            navigate('/login');
        } finally {
            setIsLoggingOut(false);
        }
    };

    const generateAvatarUrl = (firstName?: string, lastName?: string) => {
        const first = firstName?.charAt(0)?.toUpperCase() || 'A';
        const last = lastName?.charAt(0)?.toUpperCase() || 'D';
        const initials = `${first}${last}`;
        return `https://ui-avatars.com/api/?name=${initials}&background=2563eb&color=fff&size=128`;
    };

    const getPageTitle = () => {
        const currentPath = location.pathname;
        switch (currentPath) {
            case '/admin/dashboard':
                return 'Dashboard';
            case '/admin/users':
                return 'User Management';
            case '/admin/appointments':
                return 'Appointments';
            case '/admin/packs':
                return 'Service Packs';
            default:
                return 'Admin Panel';
        }
    };

    // Show loading state while checking auth
    if (!currentUser) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading...</span>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo/Header */}
                    <div className="flex items-center px-6 py-4 border-b">
                        <h1 className="text-lg font-semibold text-gray-900">
                            Dry Ice Cleaning Admin
                        </h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                    isActive(item.href)
                                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <span className="mr-3">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* User Info & Logout */}
                    <div className="px-4 py-4 border-t">
                        {/* Current User Info */}
                        <div className="flex items-center px-4 py-3 mb-2 bg-gray-50 rounded-lg">
                            <img
                                src={generateAvatarUrl(currentUser.firstName, currentUser.lastName)}
                                alt={`${currentUser.firstName} ${currentUser.lastName}`}
                                className="w-8 h-8 rounded-full mr-3"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {currentUser.firstName} {currentUser.lastName}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">
                                    {currentUser.role}
                                </p>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoggingOut ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-3"></div>
                                    Logging out...
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="mr-3 w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                    </svg>
                                    Logout
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile sidebar overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile header */}
                <header className="bg-white shadow-sm border-b lg:hidden">
                    <div className="flex items-center justify-between px-4 py-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
                        <img
                            src={generateAvatarUrl(currentUser.firstName, currentUser.lastName)}
                            alt="Admin"
                            className="w-8 h-8 rounded-full"
                        />
                    </div>
                </header>

                {/* Desktop header with dynamic user info */}
                <header className="hidden lg:flex items-center justify-between px-6 py-4 bg-white border-b">
                    <h1 className="text-2xl font-semibold text-gray-900">{getPageTitle()}</h1>

                    {/* User Profile */}
                    <div className="flex items-center space-x-3">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                                {currentUser.firstName} {currentUser.lastName}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                                {currentUser.role}
                            </p>
                        </div>
                        <img
                            src={generateAvatarUrl(currentUser.firstName, currentUser.lastName)}
                            alt={`${currentUser.firstName} ${currentUser.lastName}`}
                            className="w-10 h-10 rounded-full border-2 border-gray-200"
                        />
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;