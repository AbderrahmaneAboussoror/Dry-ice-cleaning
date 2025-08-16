// src/components/guards/AdminGuard.tsx
import { Navigate } from 'react-router-dom';
import { authService } from '../../services/authService';

interface AdminGuardProps {
    children: React.ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
    const isAuthenticated = authService.isAuthenticated();
    const isAdmin = authService.isAdmin();

    // Check if user is not logged in
    if (!isAuthenticated) {
        // Redirect to login page
        return <Navigate to="/login" replace />;
    }

    // Check if user is logged in but not an admin
    if (!isAdmin) {
        // Redirect to home page or show "Access Denied"
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600 mb-4">You don't have permission to access this area.</p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // User is authenticated and is admin - show the protected content
    return <>{children}</>;
};

export default AdminGuard;