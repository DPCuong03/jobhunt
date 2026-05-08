"use client";

import { useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/stores/useUserStore";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const { login, loading } = useUserStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await login(formData.email, formData.password);

      if (result && result.id) {
        // Check if user has admin role
        if (result.role === "admin") {
          router.replace("/admin/dashboard");
        } else {
          setError(
            "You don't have admin access. Please use the appropriate login page.",
          );
          // Logout if non-admin user tried to access admin
          setFormData({ email: "", password: "" });
        }
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Admin Header Banner */}
      <div className="relative py-16 bg-gradient-to-r from-blue-700 to-indigo-800">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-blue-100">Secure Administration Access</p>
        </div>
      </div>

      {/* Login Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 md:p-10">
            {/* Admin Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Admin Login
            </h2>
            <p className="text-center text-gray-500 text-sm mb-8">
              Enter your credentials to access the admin dashboard
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5">
                {/* Email Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <Link
                      href="/admin/forgot-password"
                      className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>

                {/* Remember Me (Optional) */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 text-sm text-gray-600"
                  >
                    Remember me on this device
                  </label>
                </div>

                {/* Login Button */}
                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Logging in...
                      </span>
                    ) : (
                      "Login to Admin Panel"
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Security Notice */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-600">
                  <span className="font-semibold text-blue-700">
                    Security Notice:
                  </span>{" "}
                  This is a secure admin portal. Do not share your credentials.
                </p>
              </div>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-blue-600 font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
