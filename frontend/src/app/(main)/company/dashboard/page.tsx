// src/app/company/dashboard/page.tsx
"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Briefcase, Zap, Star, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface DashboardData {
  company: {
    id: string;
    company_name: string;
    person_name: string;
    email: string;
    status: string;
  };
  stats: {
    totalJobs: number;
    urgentJobs: number;
    featuredJobs: number;
  };
}

const fetchDashboardData = async (): Promise<DashboardData> => {
  const response = await api.get("/company/dashboard");
  return response.data;
};

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["companyDashboard"],
    queryFn: fetchDashboardData,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600">
            Failed to load dashboard data. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const { company, stats } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome back, {company.person_name}!
        </h1>
        <p className="text-gray-600">
          {company.company_name} • {company.email}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Jobs */}
        <Link href="/company/jobs/all-jobs">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Jobs
              </h3>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-blue-600">
              {stats.totalJobs}
            </p>
            <p className="text-sm text-gray-500 mt-2">Jobs posted</p>
          </div>
        </Link>

        {/* Urgent Jobs */}
        <Link href="/company/jobs/all-jobs">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-red-200 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Urgent Jobs
              </h3>
              <div className="p-3 bg-red-100 rounded-lg">
                <Zap className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-red-600">
              {stats.urgentJobs}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Need immediate attention
            </p>
          </div>
        </Link>

        {/* Featured Jobs */}
        <Link href="/company/jobs/all-jobs">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-amber-200 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Featured Jobs
              </h3>
              <div className="p-3 bg-amber-100 rounded-lg">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-amber-600">
              {stats.featuredJobs}
            </p>
            <p className="text-sm text-gray-500 mt-2">Highlighted positions</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
