"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Loader2, Camera } from "lucide-react";
import { toast } from "react-hot-toast";

const fetchMetadata = async () => {
  const res = await api.get("/company/metadata");
  return res.data;
};

const fetchProfile = async () => {
  const res = await api.get("/company/profile");
  return res.data;
};

export default function CompanyEditProfilePage() {
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    person_name: "",
    phone: "",
    address: "",
    website: "",
    description: "",
    founded_on: "",
    logo: "",
    company_location_id: "",
    company_size_id: "",
    company_industry_id: "",
    oh_mon: "",
    oh_tue: "",
    oh_wed: "",
    oh_thu: "",
    oh_fri: "",
    oh_sat: "",
    oh_sun: "",
    map_code: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
  });

  const queryClient = useQueryClient();

  // Fetch metadata (locations, sizes, industries)
  const { data: metadata = {}, isLoading: metadataLoading } = useQuery({
    queryKey: ["companyMetadata"],
    queryFn: fetchMetadata,
  });

  // Fetch profile data
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["companyProfile"],
    queryFn: fetchProfile,
  });

  // Update formData when profile data is loaded
  useEffect(() => {
    if (profileData) {
      setFormData(profileData);
    }
  }, [profileData]);

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await api.put("/company/profile/update", data);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["companyProfile"] });
    },
    onError: () => {
      toast.error("Update failed");
    },
  });

  // Handle logo upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const data = new FormData();
    data.set("file", file);
    data.set("type", "logo");

    try {
      const res = await fetch("/api/upload-local", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (res.ok) {
        setFormData({ ...formData, logo: result.fileName });
        toast.success("Logo uploaded successfully");
      }
    } catch (error) {
      toast.error("Logo upload failed");
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

  const isLoading = profileLoading || metadataLoading;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-sm"
    >
      <h2 className="text-2xl font-bold mb-8 border-b pb-4">
        Edit Company Profile
      </h2>

      {/* Logo Section */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-gray-700 mb-4">
          Company Logo
        </label>
        <div className="flex items-start gap-6">
          <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-gray-50">
            {formData.logo ? (
              <img
                src={`/uploads/${formData.logo}`}
                className="w-full h-full object-cover"
                alt="Company Logo"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                No Logo
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" />
              </div>
            )}
          </div>
          <div>
            <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded border hover:bg-gray-200 inline-flex items-center gap-2 text-sm">
              <Camera size={16} />
              Upload Logo
              <input
                type="file"
                className="hidden"
                onChange={handleLogoUpload}
                accept="image/*"
              />
            </label>
            <p className="text-xs text-gray-400 mt-2">
              Recommended: Square image, 512x512px
            </p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold mb-2">
              Company Name *
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="Enter company name"
              className="w-full border rounded p-2.5"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">
              Contact Person Name *
            </label>
            <input
              type="text"
              name="person_name"
              value={formData.person_name}
              onChange={handleChange}
              placeholder="Enter contact person name"
              className="w-full border rounded p-2.5"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full border rounded p-2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full border rounded p-2.5"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter company address"
            className="w-full border rounded p-2.5"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter company description"
            rows={5}
            className="w-full border rounded p-2.5"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold mb-2">Founded On</label>
            <input
              type="text"
              name="founded_on"
              value={formData.founded_on}
              onChange={handleChange}
              className="w-full border rounded p-2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Map Code</label>
            <input
              type="text"
              name="map_code"
              value={formData.map_code}
              onChange={handleChange}
              placeholder="Google Maps embed code"
              className="w-full border rounded p-2.5"
            />
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">Business Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2">
              Company Location
            </label>
            <select
              name="company_location_id"
              value={formData.company_location_id}
              onChange={handleChange}
              className="w-full border rounded p-2.5"
            >
              <option value="">Select Location</option>
              {(metadata.locations || []).map((loc: any) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Company Size</label>
            <select
              name="company_size_id"
              value={formData.company_size_id}
              onChange={handleChange}
              className="w-full border rounded p-2.5"
            >
              <option value="">Select Size</option>
              {(metadata.sizes || []).map((size: any) => (
                <option key={size.id} value={size.id}>
                  {size.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Industry</label>
            <select
              name="company_industry_id"
              value={formData.company_industry_id}
              onChange={handleChange}
              className="w-full border rounded p-2.5"
            >
              <option value="">Select Industry</option>
              {(metadata.industries || []).map((ind: any) => (
                <option key={ind.id} value={ind.id}>
                  {ind.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Office Hours */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">Office Hours</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { key: "oh_mon", label: "Monday" },
            { key: "oh_tue", label: "Tuesday" },
            { key: "oh_wed", label: "Wednesday" },
            { key: "oh_thu", label: "Thursday" },
            { key: "oh_fri", label: "Friday" },
            { key: "oh_sat", label: "Saturday" },
            { key: "oh_sun", label: "Sunday" },
          ].map((day) => (
            <div key={day.key}>
              <label className="block text-sm font-bold mb-2">
                {day.label}
              </label>
              <input
                type="text"
                name={day.key}
                value={formData[day.key as keyof typeof formData]}
                onChange={handleChange}
                placeholder="e.g., 9:00 AM - 6:00 PM"
                className="w-full border rounded p-2.5"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Social Media */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">Social Media Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2">Facebook</label>
            <input
              type="url"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
              placeholder="https://facebook.com/..."
              className="w-full border rounded p-2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Twitter</label>
            <input
              type="url"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              placeholder="https://twitter.com/..."
              className="w-full border rounded p-2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/..."
              className="w-full border rounded p-2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Instagram</label>
            <input
              type="url"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="https://instagram.com/..."
              className="w-full border rounded p-2.5"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="px-6 py-2.5 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {updateMutation.isPending && (
            <Loader2 size={18} className="animate-spin" />
          )}
          {updateMutation.isPending ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </form>
  );
}
