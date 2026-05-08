// src/app/admin/edit-profile/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Loader2, Camera, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const fetchAdminProfile = async () => {
  const res = await api.get("/admin/profile");
  return res.data;
};

export default function AdminEditProfilePage() {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photo: "",
    phone: "",
  });

  // Fetch profile using React Query
  const {
    data: profileData,
    isLoading: profileLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["adminProfile"],
    queryFn: fetchAdminProfile,
  });

  // Update formData when profile is loaded
  useEffect(() => {
    if (profileData) {
      setFormData(profileData);
    }
  }, [profileData]);

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await api.put(`/admin/profile/update`, data);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminProfile"] });
    },
    onError: () => {
      toast.error("Update failed");
    },
  });

  // Handle photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const data = new FormData();
    data.set("file", file);
    data.set("type", "photo");

    try {
      const res = await fetch("/api/upload-local", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (res.ok) {
        setFormData({ ...formData, photo: result.fileName });
        toast.success("Photo uploaded successfully");
      }
    } catch (error) {
      toast.error("Photo upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 bg-white rounded-lg border border-gray-100">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium">Loading profile...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 bg-white rounded-lg border border-red-100">
        <AlertCircle className="w-10 h-10 text-red-600" />
        <p className="text-red-600 font-medium">
          {error instanceof Error ? error.message : "Failed to load profile"}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl bg-white p-8 rounded-lg shadow-sm border border-gray-200"
    >
      <h2 className="text-2xl font-bold mb-8 border-b pb-4">Edit Profile</h2>

      {/* Photo Section */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-gray-700 mb-4">
          Profile Photo
        </label>
        <div className="flex items-start gap-6">
          <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-gray-50">
            {formData.photo ? (
              <img
                src={`/uploads/${formData.photo}`}
                className="w-full h-full object-cover"
                alt="Profile"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                No Photo
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" />
              </div>
            )}
          </div>
          <div>
            <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded border hover:bg-gray-200 inline-block text-sm">
              Choose File
              <input
                type="file"
                className="hidden"
                onChange={handlePhotoUpload}
                accept="image/*"
              />
            </label>
            <p className="text-xs text-gray-400 mt-2">
              Recommended: Square image (500x500px)
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold mb-2">Name *</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Email *</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={updateMutation.isPending || isUploading}
        className="mt-8 bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700 flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
      >
        {updateMutation.isPending ? (
          <Loader2 className="animate-spin" size={18} />
        ) : null}
        Update Profile
      </button>
    </form>
  );
}
