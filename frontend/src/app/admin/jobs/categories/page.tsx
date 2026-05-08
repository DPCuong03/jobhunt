"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";

interface JobCategory {
  id: string;
  name: string;
  createdAt: string;
}

interface JobCategoryListResponse {
  jobCategories: JobCategory[];
  total: number;
}

type SortField = "name" | "createdAt";
type SortDir = "asc" | "desc";

const fetchJobCategories = async (): Promise<JobCategoryListResponse> => {
  const res = await api.get("/admin/job-categories");
  return res.data;
};

const deleteJobCategory = async (id: string): Promise<void> => {
  await api.delete(`/admin/job-categories/${id}`);
};

function SortIcon({
  field,
  sortField,
  sortDir,
}: {
  field: SortField;
  sortField: SortField;
  sortDir: SortDir;
}) {
  if (sortField !== field)
    return <ChevronsUpDown size={13} className="text-gray-300 ml-1 inline" />;
  return sortDir === "asc" ? (
    <ChevronUp size={13} className="text-[#1a1a2e] ml-1 inline" />
  ) : (
    <ChevronDown size={13} className="text-[#1a1a2e] ml-1 inline" />
  );
}

export default function AdminJobCategoriesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["adminJobCategories"],
    queryFn: fetchJobCategories,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJobCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminJobCategories"] });
      setDeleteId(null);
      setDeleteConfirm(false);
    },
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteId) deleteMutation.mutate(deleteId);
  };

  // Filter + sort + paginate client-side
  const jobCategories = data?.jobCategories ?? [];

  const filtered = jobCategories
    .filter((jc) => jc.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const valA = a[sortField] ?? "";
      const valB = b[sortField] ?? "";
      return sortDir === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / entries));
  const paginated = filtered.slice((page - 1) * entries, page * entries);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] gap-3 text-gray-500">
        <Loader2 className="animate-spin" size={22} />
        <span className="text-sm">Loading Job Categories...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-5 text-red-700">
        <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-sm">Failed to load Job Categories</p>
          <p className="text-xs text-red-500 mt-0.5">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[20px] font-semibold text-[#1a1a2e] tracking-tight">
            Job Categories
          </h2>
          <p className="text-[13px] text-gray-400 mt-0.5">
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"}{" "}
            total
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/jobs/categories/create")}
          className="flex items-center gap-2 px-4 h-9 bg-[#1a1a2e] text-white rounded-lg text-[13px] font-medium hover:bg-[#2a2a4e] transition-colors"
        >
          <Plus size={15} />
          Add New
        </button>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-[#e5e2db] overflow-hidden">
        {/* Controls */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0ede8]">
          <div className="flex items-center gap-2 text-[13px] text-gray-500">
            Show
            <select
              value={entries}
              onChange={(e) => {
                setEntries(Number(e.target.value));
                setPage(1);
              }}
              className="border border-[#e5e2db] rounded-lg px-2 py-1 text-[13px] text-gray-700 bg-[#f9f8f6] outline-none focus:border-[#1a1a2e] transition-colors"
            >
              {[5, 10, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            entries
          </div>

          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search job categories..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-8 pr-4 py-1.5 border border-[#e5e2db] rounded-lg text-[13px] bg-[#f9f8f6] outline-none focus:border-[#1a1a2e] transition-colors w-56"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f9f8f6] border-b border-[#e5e2db]">
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-gray-500 w-16">
                  <button
                    className="flex items-center gap-1 hover:text-[#1a1a2e] transition-colors"
                    onClick={() => handleSort("createdAt")}
                  >
                    SL
                    <SortIcon
                      field="createdAt"
                      sortField={sortField}
                      sortDir={sortDir}
                    />
                  </button>
                </th>
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-gray-500">
                  <button
                    className="flex items-center gap-1 hover:text-[#1a1a2e] transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    Name
                    <SortIcon
                      field="name"
                      sortField={sortField}
                      sortDir={sortDir}
                    />
                  </button>
                </th>
                <th className="text-right px-5 py-3 text-[12px] font-semibold text-gray-500 w-32">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-12 text-[13px] text-gray-400"
                  >
                    {search ? "No results found." : "No job categories yet."}
                  </td>
                </tr>
              ) : (
                paginated.map((jobCategory, idx) => (
                  <tr
                    key={jobCategory.id}
                    className="border-b border-[#f0ede8] last:border-0 hover:bg-[#fafaf9] transition-colors"
                  >
                    <td className="px-5 py-3.5 text-[13px] text-gray-400 font-mono">
                      {(page - 1) * entries + idx + 1}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-700">
                      {jobCategory.name}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            router.push(
                              `/admin/jobs/categories/edit/${jobCategory.id}`,
                            )
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-[#e6f1fb] text-[#185fa5] hover:bg-[#b5d4f4] transition-colors"
                        >
                          <Pencil size={12} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(jobCategory.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-[#fcebeb] text-[#a32d2d] hover:bg-[#f7c1c1] transition-colors"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#f0ede8]">
          <p className="text-[12px] text-gray-400">
            Showing{" "}
            <span className="text-gray-600 font-medium">
              {filtered.length === 0 ? 0 : (page - 1) * entries + 1}
            </span>{" "}
            to{" "}
            <span className="text-gray-600 font-medium">
              {Math.min(page * entries, filtered.length)}
            </span>{" "}
            of{" "}
            <span className="text-gray-600 font-medium">{filtered.length}</span>{" "}
            entries
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-[12px] rounded-lg border border-[#e5e2db] text-gray-500 hover:bg-[#f9f8f6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
              )
              .reduce<(number | "...")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="px-2 text-gray-400 text-[12px]"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-8 h-8 text-[12px] rounded-lg border transition-colors ${
                      page === p
                        ? "bg-[#1a1a2e] text-white border-[#1a1a2e]"
                        : "border-[#e5e2db] text-gray-500 hover:bg-[#f9f8f6]"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-[12px] rounded-lg border border-[#e5e2db] text-gray-500 hover:bg-[#f9f8f6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-[#e5e2db] w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <Trash2 size={18} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#1a1a2e]">
                  Delete Job Category
                </h3>
                <p className="text-[13px] text-gray-400 mt-0.5">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button
                onClick={() => {
                  setDeleteConfirm(false);
                  setDeleteId(null);
                }}
                className="px-4 py-2 text-[13px] rounded-lg border border-[#e5e2db] text-gray-600 hover:bg-[#f9f8f6] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 text-[13px] rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {deleteMutation.isPending && (
                  <Loader2 size={13} className="animate-spin" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
