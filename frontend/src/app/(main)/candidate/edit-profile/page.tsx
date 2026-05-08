"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Loader2, Camera, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const fetchProfile = async () => {
  const res = await api.get("/candidate/profile");
  return res.data;
};

export default function EditProfileForm() {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    photo: "",
    biography: "",
    username: "",
    email: "",
    phone: "",
    country: "",
    address: "",
    state: "",
    city: "",
    zip_code: "",
    gender: "Male",
    marital_status: "Unmarried",
    date_of_birth: "",
    website: "",
  });

  // Fetch profile using React Query
  const {
    data: profileData,
    isLoading: profileLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["candidateProfile"],
    queryFn: fetchProfile,
  });

  // Update formData when profile is loaded
  useEffect(() => {
    if (profileData) {
      const formattedDate = profileData.date_of_birth
        ? new Date(profileData.date_of_birth).toISOString().split("T")[0]
        : "";
      setFormData({ ...profileData, date_of_birth: formattedDate });
    }
  }, [profileData]);

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await api.put(`/candidate/profile/update`, data);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
      className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-sm"
    >
      <h2 className="text-2xl font-bold mb-8 border-b pb-4">Edit Profile</h2>

      {/* Section: Photo */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-gray-700 mb-4">
          Existing Photo
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
              Format: candidate_photo_[timestamp].jpg
            </p>
          </div>
        </div>
      </div>

      {/* Section: Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-bold mb-2">Name *</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded p-2.5"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Designation</label>
          <input
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full border rounded p-2.5"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold mb-2">Biography</label>
        <textarea
          name="biography"
          value={formData.biography}
          onChange={handleChange}
          rows={5}
          className="w-full border rounded p-2.5"
        />
      </div>

      {/* Section: Detailed Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-bold mb-2">Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded p-2.5"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Email *</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded p-2.5 bg-gray-50"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border rounded p-2.5"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Marital Status</label>
          <select
            name="marital_status"
            value={formData.marital_status}
            onChange={handleChange}
            className="w-full border rounded p-2.5"
          >
            <option value="Unmarried">Unmarried</option>
            <option value="Married">Married</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="w-full border rounded p-2.5"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Country</label>
          <input
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full border rounded p-2.5"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">State</label>
          <input
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full border rounded p-2.5"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">City</label>
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border rounded p-2.5"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-bold mb-2">Address</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border rounded p-2.5"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Zip Code</label>
          <input
            name="zip_code"
            value={formData.zip_code}
            onChange={handleChange}
            className="w-full border rounded p-2.5"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Website</label>
          <input
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full border rounded p-2.5"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Username</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border rounded p-2.5"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={updateMutation.isPending || isUploading}
        className="bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700 flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
      >
        {updateMutation.isPending ? (
          <Loader2 className="animate-spin" size={18} />
        ) : null}
        Update Profile
      </button>
    </form>
  );
}
