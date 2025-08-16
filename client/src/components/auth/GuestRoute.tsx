import {authService} from "@/services/authService";
import {Navigate} from "react-router-dom";

interface GuestRouteProps {
    children: React.ReactNode;
}

export const GuestRoute = ({ children }: GuestRouteProps) => {
    const isAuthenticated = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    // If authenticated, redirect based on role
    if (isAuthenticated && currentUser) {
        if (currentUser.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        } else {
            return <Navigate to="/" replace />;
        }
    }

    return <>{children}</>;
};