// app/jobs/page.jsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";

export default function AllJobsPage() {
  const queryClient = useQueryClient();

  // 1. Fetch dữ liệu trực tiếp bằng useQuery
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const response = await api.get("/company/jobs/all-jobs");
      return response.data;
    },
  });

  // 2. Logic xóa trực tiếp bằng useMutation
  const deleteMutation = useMutation({
    mutationFn: async (jobId) => {
      await api.delete(`/company/jobs/delete/${jobId}`);
    },
    onSuccess: () => {
      // Làm mới danh sách sau khi xóa thành công
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      alert("Đã xóa công việc!");
    },
    onError: (err) => {
      alert("Lỗi khi xóa: " + err.message);
    },
  });

  if (isLoading)
    return (
      <div className="p-10 text-center font-medium">Loading job list...</div>
    );
  if (isError)
    return (
      <div className="p-10 text-center text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Job list</h1>
          <p className="text-gray-500 mt-1">Manage your job postings</p>
        </div>
        <Link
          href="/company/jobs/create"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-sm"
        >
          + Create new job
        </Link>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Job Information
              </th>
              <th className="p-4 text-sm font-semibold text-gray-700 uppercase tracking-wider text-center">
                Deadline
              </th>
              <th className="p-4 text-sm font-semibold text-gray-700 uppercase tracking-wider text-center">
                Featured
              </th>
              <th className="p-4 text-sm font-semibold text-gray-700 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.jobs?.map((job: any) => (
              <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-gray-900">{job.title}</div>
                  <div className="text-sm text-gray-500">
                    {job.job_categories?.name} • {job.job_locations?.name}
                  </div>
                </td>
                <td className="p-4 text-center text-sm text-gray-600">
                  <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200">
                    {job.deadline}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    {job.is_urgent === 1 && (
                      <span className="bg-red-50 text-red-600 px-2.5 py-0.5 rounded-full text-xs font-bold border border-red-100">
                        GẤP
                      </span>
                    )}
                    {job.is_featured === 1 && (
                      <span className="bg-amber-50 text-amber-600 px-2.5 py-0.5 rounded-full text-xs font-bold border border-amber-100">
                        NỔI BẬT
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-left space-x-4">
                  <Link
                    href={`/company/jobs/edit/${job.id}`}
                    className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to delete this job posting?",
                        )
                      ) {
                        deleteMutation.mutate(job.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    className="text-red-500 hover:text-red-700 font-medium text-sm disabled:opacity-50"
                  >
                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}

            {(!data?.jobs || data.jobs.length === 0) && (
              <tr>
                <td
                  colSpan={4}
                  className="p-10 text-center text-gray-400 italic"
                >
                  No jobs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
