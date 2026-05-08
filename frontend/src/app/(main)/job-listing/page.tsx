"use client";

import { useState } from "react";
import api from "../../../lib/api";
import JobCard from "../../../components/JobCard";
import { Job } from "@/types/job";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export default function JobListing() {
  // 1. Draft state: Changes immediately as user types/selects
  const [draftFilters, setDraftFilters] = useState<any>({
    title: "",
    category: "",
    location: "",
    type: "",
    experience: "",
    gender: "",
    salary: "",
  });

  // 2. Active state: Only changes when "Apply" or "Pagination" is clicked
  const [activeFilters, setActiveFilters] = useState<any>({
    ...draftFilters,
    page: 1,
    limit: 10,
  });

  // 3. Fetch Jobs - depends on activeFilters
  const {
    data: jobData,
    isLoading: isJobsLoading,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["jobs", activeFilters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
      const response = await api.get(`/job-listing?${params}`);
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  // 4. Fetch Filter Options
  const { data: options } = useQuery({
    queryKey: ["filterOptions"],
    queryFn: async () => {
      const [cat, loc, type, exp, gen, sal] = await Promise.all([
        api.get("/job-categories"),
        api.get("/job-locations"),
        api.get("/job-types"),
        api.get("/job-experiences"),
        api.get("/job-genders"),
        api.get("/job-salary-ranges"),
      ]);
      return {
        categories: cat.data,
        locations: loc.data,
        types: type.data,
        experiences: exp.data,
        genders: gen.data,
        salaryRanges: sal.data,
      };
    },
    staleTime: Infinity,
  });

  const jobs = jobData?.jobs || [];
  const pagination = jobData?.pagination || { page: 1, pages: 0 };

  const handleApplyFilters = () => {
    setActiveFilters({
      ...draftFilters,
      page: 1,
      limit: 10,
    });
  };

  const handlePageChange = (newPage: number) => {
    window.scrollTo({ top: 400, behavior: "smooth" });
    setActiveFilters((prev: any) => ({ ...prev, page: newPage }));
  };

  const clearFilters = () => {
    const reset = {
      title: "",
      category: "",
      location: "",
      type: "",
      experience: "",
      gender: "",
      salary: "",
    };
    setDraftFilters(reset);
    setActiveFilters({ ...reset, page: 1, limit: 10 });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner */}
      <div
        className="relative py-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/uploads/banner_job_listing.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container relative z-10 text-center text-white">
          <h2 className="text-4xl font-extrabold">Find Your Dream Job</h2>
          <p className="text-gray-200 mt-2">
            Explore the best opportunities in the market
          </p>
        </div>
      </div>

      <div className="py-12">
        <div className="container">
          <div className="row g-4">
            {/* Sidebar Filters */}
            <div className="col-md-4 col-lg-3">
              <div className="top-24  bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                  <i className="fas fa-filter text-blue-600"></i>
                  <h2 className="text-xl font-bold text-gray-800">
                    Search Filters
                  </h2>
                </div>

                <div className="space-y-5">
                  {/* Keyword Input */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Keywords
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      placeholder="Title, company..."
                      value={draftFilters.title}
                      onChange={(e) =>
                        setDraftFilters({
                          ...draftFilters,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Filter Selects Mapping */}
                  {[
                    {
                      label: "Category",
                      name: "category",
                      opts: options?.categories,
                    },
                    {
                      label: "Location",
                      name: "location",
                      opts: options?.locations,
                    },
                    { label: "Job Type", name: "type", opts: options?.types },
                    {
                      label: "Experience",
                      name: "experience",
                      opts: options?.experiences,
                    },
                    { label: "Gender", name: "gender", opts: options?.genders },
                    {
                      label: "Salary Range",
                      name: "salary",
                      opts: options?.salaryRanges,
                    },
                  ].map((f) => (
                    <div key={f.name}>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        {f.label}
                      </label>
                      <select
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm cursor-pointer"
                        value={draftFilters[f.name]}
                        onChange={(e) =>
                          setDraftFilters({
                            ...draftFilters,
                            [f.name]: e.target.value,
                          })
                        }
                      >
                        <option value="">
                          All{" "}
                          {f.label === "Category"
                            ? "Categories"
                            : `${f.label}s`}
                        </option>
                        {f.opts?.map((opt: any) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}

                  {/* Action Buttons */}
                  <div className="pt-4 space-y-3">
                    <button
                      onClick={handleApplyFilters}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-lg shadow-blue-200"
                    >
                      Apply Filters
                    </button>
                    <button
                      onClick={clearFilters}
                      className="w-full py-2 text-sm text-gray-500 hover:text-red-500 font-medium transition-colors"
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Job List Content */}
            <div className="col-md-8 col-lg-9">
              {isJobsLoading && !isPlaceholderData ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500">Finding your matches...</p>
                </div>
              ) : (
                <div
                  className={`transition-opacity duration-300 ${isPlaceholderData ? "opacity-50" : "opacity-100"}`}
                >
                  <div className="row g-4">
                    {jobs.length > 0 ? (
                      jobs.map((job: Job) => (
                        <div key={job.id} className="col-lg-6">
                          <JobCard job={job} />
                        </div>
                      ))
                    ) : (
                      <div className="col-12 text-center py-20 bg-white rounded-2xl border border-dashed">
                        <i className="fas fa-briefcase text-4xl text-gray-300 mb-4 block"></i>
                        <h3 className="text-xl font-bold text-gray-800">
                          No jobs found
                        </h3>
                        <p className="text-gray-500">
                          Try adjusting your filters.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="mt-12 flex justify-center">
                      <nav className="flex gap-2 p-2 bg-white rounded-2xl shadow-sm border">
                        {Array.from(
                          { length: pagination.pages },
                          (_, i) => i + 1,
                        ).map((pageNum) => (
                          <button
                            key={pageNum}
                            className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                              pageNum === pagination.page
                                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </nav>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
