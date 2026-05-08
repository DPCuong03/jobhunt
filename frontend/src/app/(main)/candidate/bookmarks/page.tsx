"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { Eye, Loader2, AlertCircle } from "lucide-react";

import Link from "next/link";

import api from "@/lib/api";

const fetchBookmarkJobs = async () => {
  try {
    const response = await api.get("/candidate/bookmarks");

    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Could not fetch bookmarked jobs";

    throw new Error(message);
  }
};

export default function BookmarkPage() {
  const {
    data: bookmarks,

    isLoading,

    isFetching, // Thêm isFetching để theo dõi cập nhật ngầm

    isError,

    error,
  } = useQuery({
    queryKey: ["bookmarks"],

    queryFn: fetchBookmarkJobs,

    staleTime: 1000 * 60 * 5,

    gcTime: 1000 * 60 * 10,

    placeholderData: keepPreviousData, // Giữ dữ liệu cũ hiển thị trong khi fetch mới
  });

  // CHỈ hiện màn hình loading khi THỰC SỰ không có dữ liệu nào (lần đầu tiên vào trang)

  if (isLoading && !bookmarks) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 bg-white rounded-lg border border-gray-100">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />

        <p className="text-gray-500 font-medium">Getting bookmarked jobs...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
      {/* Hiện thanh loading nhỏ ở trên cùng nếu đang update ngầm (UX chuyên nghiệp) */}

      {isFetching && !isLoading && (
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/20">
          <div className="h-full bg-blue-500 animate-progress origin-left"></div>
        </div>
      )}

      <div className="p-5 border-b border-gray-100 bg-white flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Bookmarked Jobs</h1>

        {isFetching && (
          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th className="p-4 font-bold text-sm text-gray-700 w-20 text-center">
                ID
              </th>
              <th className="p-4 font-bold text-sm text-gray-700">Job Title</th>
              <th className="p-4 w-1/3 font-bold text-sm text-gray-700">
                Company
              </th>
              <th className="p-4 font-bold text-sm text-gray-700 w-32 text-center">
                Detail
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookmarks && bookmarks.length > 0 ? (
              bookmarks.map((bookmark: any, index: number) => (
                <tr
                  key={bookmark.id}
                  className="hover:bg-blue-50/40 transition-all group"
                >
                  <td className="p-4 text-sm text-gray-500 text-center font-medium">
                    {String(index + 1).padStart(2, "0")}
                  </td>

                  <td className="p-4 text-sm  text-gray-900 group-hover:text-blue-600 transition-colors">
                    {bookmark.jobs?.title}
                  </td>

                  <td className="p-4 text-sm text-gray-600">
                    {bookmark.jobs?.companies?.company_name}
                  </td>

                  <td className="p-4 text-center">
                    {/* SỬA TẠI ĐÂY: Dùng Link của Next.js */}

                    <Link
                      href={`/job-detail/${bookmark.job_id}`}
                      className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow-sm transition-all active:scale-90 inline-flex items-center justify-center"
                    >
                      <Eye size={16} />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-20 text-center">
                  <p className="text-gray-400 text-sm italic">
                    You have not bookmarked any jobs yet.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
