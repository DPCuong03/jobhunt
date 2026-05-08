"use client";
import React, { useState } from "react";
import api from "@/lib/api";
import { Lock, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function EditPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra mật khẩu khớp nhau ở client
    if (passwords.newPassword !== passwords.confirmPassword) {
      return alert("New password and confirmation do not match!");
    }

    setLoading(true);
    try {
      // Gọi API đổi mật khẩu (sẽ viết ở bước 2)
      await api.put("/candidate/editPassword", passwords);
      toast.success("Password updated successfully!");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-8 border-b pb-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <ShieldCheck size={24} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Current Password *
          </label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              name="currentPassword"
              required
              value={passwords.currentPassword}
              onChange={handleChange}
              className="w-full border rounded-lg p-2.5 pl-10 outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            New Password *
          </label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              name="newPassword"
              required
              value={passwords.newPassword}
              onChange={handleChange}
              className="w-full border rounded-lg p-2.5 pl-10 outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Confirm New Password *
          </label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              name="confirmPassword"
              required
              value={passwords.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded-lg p-2.5 pl-10 outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : null}
          Save Changes
        </button>
      </form>
    </div>
  );
}
