import {authService} from "@/services/authService";
import {Navigate} from "react-router-dom";

interface AdminRouteProps {
    children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
    const isAuthenticated = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Not admin - redirect to home
    if (currentUser?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};