"use client";
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import api from "@/lib/api";

const fetchExperiences = async () => {
  try {
    const response = await api.get("/candidate/experience");
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Could not fetch experience records";
    throw new Error(message);
  }
};

const deleteExperience = async (id: number) => {
  try {
    const response = await api.delete(`/candidate/experience/delete/${id}`);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Could not delete experience record";
    throw new Error(message);
  }
};

export default function ExperiencePage() {
  const queryClient = useQueryClient();

  const {
    data: experiences,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["experiences"],
    queryFn: fetchExperiences,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      toast.success("Experience deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this experience record?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 bg-white rounded-lg border border-gray-100">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium">Loading experiences...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 bg-white rounded-lg border border-red-100">
        <AlertCircle className="w-10 h-10 text-red-600" />
        <p className="text-red-600 font-medium">
          {error instanceof Error
            ? error.message
            : "Failed to load experiences"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Experiences</h1>
        <Link
          href="/candidate/experience/create"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
        >
          <Plus size={18} /> Add Item
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-200">
              <th className="p-4 w-16 text-center font-bold text-sm text-gray-700">
                ID
              </th>
              <th className="p-4 font-bold text-sm text-gray-700">Company</th>
              <th className="p-4 font-bold text-sm text-gray-700">
                Designation
              </th>
              <th className="p-4 font-bold text-sm text-gray-700">
                Start Date
              </th>
              <th className="p-4 font-bold text-sm text-gray-700">End Date</th>
              <th className="p-4 w-32 text-center font-bold text-sm text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {experiences?.map((item: any, index: number) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-center text-sm text-gray-900">
                  {String(index + 1).padStart(2, "0")}
                </td>
                <td className="p-4 text-sm text-gray-900">{item.company}</td>
                <td className="p-4 text-sm text-gray-900">
                  {item.designation}
                </td>
                <td className="p-4 text-sm text-gray-900">{item.start_date}</td>
                <td className="p-4 text-sm text-gray-900">{item.end_date}</td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <Link
                      href={`/candidate/experience/edit/${item.id}`}
                      className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded transition-all"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition-all"
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
