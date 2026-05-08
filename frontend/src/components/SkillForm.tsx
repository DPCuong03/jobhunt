// components/SkillForm.tsx
"use client";
import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function SkillForm({ initialData, onSubmit, isLoading }: any) {
  const [formData, setFormData] = React.useState(
    initialData || {
      name: "",
      percentage: "",
    },
  );
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        percentage: initialData.percentage || "",
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
            Skill Name*
          </label>
          <input
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
            placeholder="e.g. Photoshop"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Percentage*
          </label>
          <input
            name="percentage"
            required
            value={formData.percentage}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
            placeholder="e.g. 85"
          />
        </div>
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
