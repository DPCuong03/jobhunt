"use client";

import { useState } from "react";
import api from "../../../lib/api";
import CompanyCard from "../../../components/CompanyCard";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Search, MapPin, Building2, Filter } from "lucide-react";

export default function CompanyListing() {
  // 1. Draft state: Changes as user types
  const [draftFilters, setDraftFilters] = useState<any>({
    name: "",
    industry: "",
    location: "",
    size: "",
    foundedOn: "",
  });

  // 2. Active state: Triggers the actual search
  const [activeFilters, setActiveFilters] = useState<any>({
    ...draftFilters,
    page: 1,
    limit: 10,
  });

  // 3. Fetch Companies - depends on activeFilters
  const {
    data: companyData,
    isLoading,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["companies", activeFilters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
      const response = await api.get(`/company-listing?${params}`);
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });
  //4.Fetch Filter Options
  const { data: options } = useQuery({
    queryKey: ["filterOptions"],
    queryFn: async () => {
      const [ind, loc, size, fou] = await Promise.all([
        api.get("/company-industries"),
        api.get("/company-locations"),
        api.get("/company-sizes"),
        api.get("/company-founded"),
      ]);
      return {
        industries: ind.data,
        locations: loc.data,
        sizes: size.data,
        foundedOn: fou.data,
      };
    },

    staleTime: Infinity,
  });
  const companies = companyData?.data || [];
  const pagination = companyData?.pagination || { page: 1, pages: 0 };

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
      name: "",
      industry: "",
      location: "",
      size: "",
      foundedOn: "",
    };
    setDraftFilters(reset);
    setActiveFilters({ ...reset, page: 1, limit: 10 });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Professional Banner (Matching Job Listing) */}
      <div
        className="relative py-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/uploads/banner_job_listing.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h2 className="text-4xl font-extrabold tracking-tight">
            Browse Companies
          </h2>
          <p className="text-gray-200 mt-2 text-lg">
            Discover top employers and your future workplace
          </p>
        </div>
      </div>

      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-1/4">
              <div className=" top-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                  <Filter className="text-blue-600" size={20} />
                  <h2 className="text-xl font-bold text-gray-800">
                    Search Filters
                  </h2>
                </div>

                <div className="space-y-5">
                  {/* Company Name Input */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Company Name
                    </label>
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-3 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                        placeholder="e.g. Google, FPT..."
                        value={draftFilters.name}
                        onChange={(e) =>
                          setDraftFilters({
                            ...draftFilters,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  {/* Filter Selects Mapping */}
                  {[
                    {
                      label: "Industry",
                      name: "industry",
                      opts: options?.industries,
                    },
                    {
                      label: "Location",
                      name: "location",
                      opts: options?.locations,
                    },
                    { label: "Size", name: "size", opts: options?.sizes },
                    {
                      label: "Founded On",
                      name: "foundedOn",
                      opts: options?.foundedOn,
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
                          {f.label === "Founded On"
                            ? "Founded Dates"
                            : f.label === "Industry"
                              ? "Industries"
                              : `${f.label}s`}
                        </option>
                        {f.name === "foundedOn"
                          ? // Nếu là filter Founded On
                            options?.foundedOn?.map((opt: any) => (
                              <option
                                key={opt.founded_on}
                                value={opt.founded_on}
                              >
                                {opt.founded_on}
                              </option>
                            ))
                          : // Các filter khác dùng id và name
                            f.opts?.map((opt: any) => (
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
                      Search Companies
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
            </aside>

            {/* Company List Content */}
            <main className="w-full lg:w-3/4">
              {isLoading && !isPlaceholderData ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
                  <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500 font-medium">
                    Loading companies...
                  </p>
                </div>
              ) : (
                <div
                  className={`transition-opacity duration-300 ${isPlaceholderData ? "opacity-50" : "opacity-100"}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {companies.length > 0 ? (
                      companies.map((company: any) => (
                        <CompanyCard key={company.id} company={company} />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <Building2
                          className="mx-auto text-gray-300 mb-4"
                          size={48}
                        />
                        <h3 className="text-xl font-bold text-gray-800">
                          No companies found
                        </h3>
                        <p className="text-gray-500">
                          Try adjusting your keywords or location.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="mt-12 flex justify-center">
                      <nav className="flex gap-2 p-2 bg-white rounded-2xl shadow-sm border border-gray-100">
                        {Array.from(
                          { length: pagination.pages },
                          (_, i) => i + 1,
                        ).map((pageNum) => (
                          <button
                            key={pageNum}
                            className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                              pageNum === activeFilters.page
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
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
