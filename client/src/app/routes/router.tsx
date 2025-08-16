import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminGuard from "@/components/guards/AdminGuard";
import paths from "@/config/paths";
import Home from "./pages/home";
import Profile from "@/app/routes/pages/profile";
import Register from "@/app/routes/pages/auth/register";
import Login from "@/app/routes/pages/auth/login";
import AdminDashboard from "@/app/routes/pages/admin/dashboard";
import AdminUsers from "@/app/routes/pages/admin/users";
import AdminAppointments from "@/app/routes/pages/admin/appointments";
import AdminPacks from "@/app/routes/pages/admin/packs";
import {GuestRoute} from "@/components/auth/GuestRoute";
import {ProtectedRoute} from "@/components/auth/ProtectedRoute";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={paths.home.path} element={<Home />} />

        {/* Guest-only routes (redirect if logged in) */}
        <Route path={paths.login.path} element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        } />
        <Route path={paths.register.path} element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        } />

        {/* Protected user routes */}
        <Route path={paths.profile.path} element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/admin/*" element={
          <AdminGuard>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="packs" element={<AdminPacks />} />
            </Routes>
          </AdminGuard>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
