// components/ExperienceForm.tsx
"use client";
import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ExperienceForm({
  initialData,
  onSubmit,
  isLoading,
}: any) {
  const [formData, setFormData] = React.useState(
    initialData || {
      company: "",
      designation: "",
      start_date: "",
      end_date: "",
    },
  );
  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company || "",
        designation: initialData.designation || "",
        start_date: initialData.start_date || "",
        end_date: initialData.end_date || "",
      });
    }
  }, [initialData]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-4 max-w-2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company*
          </label>
          <input
            name="company"
            required
            value={formData.company}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
            placeholder="e.g. Google"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Designation*
          </label>
          <input
            name="designation"
            required
            value={formData.designation}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
            placeholder="e.g. Software Engineer"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Start Date*
        </label>
        <input
          name="start_date"
          required
          value={formData.start_date}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
          placeholder="e.g. 01/2026"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          End Date*
        </label>
        <input
          name="end_date"
          required
          value={formData.end_date}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
          placeholder="e.g. 12/2028"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
      >
        {isLoading && <Loader2 className="animate-spin" size={18} />}
        Save Changes
      </button>
    </form>
  );
}
