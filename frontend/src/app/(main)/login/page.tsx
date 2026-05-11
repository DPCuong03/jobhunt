"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUserStore } from "../../../stores/useUserStore";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const { login, loading } = useUserStore();

  // Initial state for the login form
  const initialFormState = {
    email: "",
    password: "",
    userRole: "candidate", // Default role
  };

  const [formData, setFormData] = useState(initialFormState);

  // Logic: Reset form and switch role when clicking tabs
  const handleTabChange = (role: "candidate" | "company") => {
    setFormData({
      ...initialFormState,
      userRole: role,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await login(formData.email, formData.password);

    if (result && result.id) {
      const targetPath =
        result.role === "candidate"
          ? "/candidate/dashboard"
          : "/company/dashboard";
      router.replace(targetPath);
    } else {
      console.log("4. Login thất bại hoặc result không có ID");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Top Banner */}
      <div
        className="relative py-16 bg-cover bg-center"
        style={{ backgroundImage: "url('/uploads/banner_login.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl font-bold text-white">Login</h2>
        </div>
      </div>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
            {/* Tab Navigation */}
            <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => handleTabChange("candidate")}
                className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-md transition-all font-medium ${
                  formData.userRole === "candidate"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <i className="far fa-user mr-2"></i>
                Candidate
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("company")}
                className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-md transition-all font-medium ${
                  formData.userRole === "company"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <i className="fas fa-briefcase mr-2"></i>
                Company
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5">
                {/* Email Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <Link
                      href={
                        formData.userRole === "company"
                          ? "/forget-password-company"
                          : "/forget-password-candidate"
                      }
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>

                {/* Login Button */}
                <div className="mt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md disabled:opacity-50"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </div>
              </div>
            </form>

            {/* Switch to Signup */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
