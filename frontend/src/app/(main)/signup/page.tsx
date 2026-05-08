"use client";

import { useState } from "react";
import Link from "next/link";
import { useUserStore } from "../../../stores/useUserStore";

export default function Signup() {
  // Trạng thái ban đầu của form
  const initialFormState = {
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    userRole: "candidate",
  };

  const [formData, setFormData] = useState(initialFormState);
  const { signup, loading } = useUserStore();

  // Logic: Khi đổi tab, reset toàn bộ form và gán role mới
  const handleTabChange = (role: "candidate" | "company") => {
    setFormData({
      ...initialFormState, // Xóa sạch dữ liệu cũ
      userRole: role, // Gán role của tab mới
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Top Banner */}
      <div
        className="relative py-16 bg-cover bg-center"
        style={{ backgroundImage: "url('/uploads/banner_signup.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl font-bold text-white">Sign Up</h2>
        </div>
      </div>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
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

            {/* Form đăng ký */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {formData.userRole === "candidate"
                      ? "Full Name"
                      : "Company Name"}
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder={
                      formData.userRole === "candidate"
                        ? "John Doe"
                        : "Capi Agency"
                    }
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="johndoe123"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>

                {/* Email */}
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Password
                  </label>
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

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Nút đăng ký */}
                <div className="mt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md disabled:opacity-50"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                </div>
              </div>
            </form>

            {/* Chuyển sang trang Login */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
