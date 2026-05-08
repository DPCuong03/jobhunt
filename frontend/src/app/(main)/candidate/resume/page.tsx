"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import api from "@/lib/api";

const fetchResumes = async () => {
  try {
    const response = await api.get("/candidate/resume");
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Could not fetch resume records";
    throw new Error(message);
  }
};

const deleteResume = async (id: number) => {
  try {
    const response = await api.delete(`/candidate/resume/delete/${id}`);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Could not delete resume record";
    throw new Error(message);
  }
};

export default function ResumePage() {
  const queryClient = useQueryClient();

  const {
    data: resumes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["resumes"],
    queryFn: fetchResumes,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("Resume deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this resume record?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 bg-white rounded-lg border border-gray-100">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium">Loading resumes...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 bg-white rounded-lg border border-red-100">
        <AlertCircle className="w-10 h-10 text-red-600" />
        <p className="text-red-600 font-medium">
          {error instanceof Error ? error.message : "Failed to load resumes"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Resumes</h1>
        <Link
          href="/candidate/resume/create"
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
              <th className="p-4 font-bold text-sm text-gray-700">Name</th>
              <th className="p-4 font-bold text-sm text-gray-700">File</th>

              <th className="p-4 w-32 text-center font-bold text-sm text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {resumes?.map((item: any, index: number) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-center text-sm text-gray-900">
                  {String(index + 1).padStart(2, "0")}
                </td>
                <td className="p-4 text-sm text-gray-900">{item.name}</td>
                <td className="p-4 text-sm text-blue-600">
                  <a
                    href={`/uploads/${item.file}`} // Nối lại đường dẫn để trình duyệt tìm thấy file
                    target="_blank"
                    className="hover:underline"
                  >
                    {item.file} {/* Hiển thị đúng tên file như trong ảnh mẫu */}
                  </a>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
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
