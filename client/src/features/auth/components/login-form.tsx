import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Email from "@/components/icons/email";
import Lock from "@/components/icons/lock";
import Shield from "@/components/icons/shield";
import Star from "@/components/icons/star";
import User from "@/components/icons/user";
import { Link } from "react-router-dom";
import paths from "@/config/paths";
import { authService } from "@/services/authService";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form
      if (!formData.email || !formData.password) {
        throw new Error("Please fill in all fields");
      }

      console.log("🚀 Attempting login with:", { email: formData.email });

      // Call API
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      console.log("✅ Login response:", response);

      // Handle raw backend response: { message, user, token }
      if (response.user && response.token) {
        console.log("🚀 Login successful, redirecting...");

        // Store token and user data manually
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        const user = response.user;
        console.log("👤 User data:", user);
        console.log("👤 User role:", user.role);

        if (user.role === 'admin') {
          console.log("📋 Redirecting to admin dashboard");
          navigate('/admin/dashboard');
        } else {
          console.log("🏠 Redirecting to home page");
          navigate('/');
        }
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen px-5 bg-[#f5faff] flex items-center justify-center py-10">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-cyan flex items-center justify-center mx-auto mb-4">
              <User color="white" size="29" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Sign In to Your Account
            </h1>
            <p className="text-gray-500">
              Welcome back! Please enter your details
            </p>
          </div>

          {/* Form */}
          <div className="rounded-2xl border-0 bg-white shadow-[0px_8px_10px_rgba(0,0,0,0.1),0px_20px_25px_rgba(0,0,0,0.1)] p-10">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
              )}

              {/* Email */}
              <div className="space-y-1">
                <label className="text-gray-800 text-sm capitalize font-[500]">
                  email
                </label>
                <div className="px-3 py-3 border border-gray-400 rounded-lg flex items-center justify-center gap-2">
                  <Email color="gray" size="15" />
                  <input
                      type="email"
                      placeholder="john.doe@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full focus:outline-none text-sm text-gray-500 font-light"
                      disabled={loading}
                      required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1 pb-5">
                <label className="text-gray-800 text-sm capitalize font-[500]">
                  password
                </label>
                <div className="px-3 py-3 border border-gray-400 rounded-lg flex items-center justify-center gap-2">
                  <Lock color="gray" size="15" />
                  <input
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                          handleInputChange("password", e.target.value)
                      }
                      className="w-full focus:outline-none text-sm text-gray-500 font-light"
                      disabled={loading}
                      required
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-cyan capitalize text-black font-[500] mt-10 text-sm py-3 rounded-md hover:bg-cyan-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                      signing in...
                    </>
                ) : (
                    <>
                      <User size="16" />
                      sign in
                    </>
                )}
              </button>
            </form>

            {/* Link */}
            <div className="text-center mt-4 text-sm text-gray-600 capitalize">
              new here?{" "}
              <Link to={paths.register.path}>
                <p className="text-blue-500 font-semibold hover:text-blue-500 cursor-pointer relative inline-block after:block after:h-[1px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">
                  Sign up here
                </p>
              </Link>
            </div>
          </div>

          {/* Footer Icons */}
          <div className="flex justify-center items-center gap-6 text-sm text-gray-500 mt-10">
            <div className="flex items-center text-xs font-light gap-1">
              <Shield size="16" />
              <span>Secure</span>
            </div>
            <div className="flex items-center text-xs font-light gap-1">
              <Lock size="16" />
              <span>Encrypted</span>
            </div>
            <div className="flex items-center text-xs font-light gap-1">
              <Star size="16" />
              <span>Verified</span>
            </div>
          </div>
        </div>
      </div>
  );
};

export default LoginForm;