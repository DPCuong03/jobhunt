// components/EducationForm.tsx
"use client";
import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function EducationForm({
  initialData,
  onSubmit,
  isLoading,
}: any) {
  const [formData, setFormData] = React.useState(
    initialData || {
      level: "",
      institute: "",
      degree: "",
      passing_year: "",
    },
  );
  useEffect(() => {
    if (initialData) {
      setFormData({
        level: initialData.level || "",
        institute: initialData.institute || "",
        degree: initialData.degree || "",
        passing_year: initialData.passing_year || "",
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
            Education Level*
          </label>
          <input
            name="level"
            required
            value={formData.level}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
            placeholder="e.g. Higher Secondary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Degree*
          </label>
          <input
            name="degree"
            required
            value={formData.degree}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
            placeholder="e.g. H.S.C"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Institute*
        </label>
        <input
          name="institute"
          required
          value={formData.institute}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
          placeholder="e.g. FHJ College, NYC"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Passing Year*
        </label>
        <input
          name="passing_year"
          required
          value={formData.passing_year}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
          placeholder="e.g. 2018"
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
