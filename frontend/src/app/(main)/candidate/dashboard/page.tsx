// src/app/candidate/dashboard/page.tsx
"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  Briefcase,
  Heart,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface DashboardData {
  applied_jobs: number;
  bookmarked_jobs: number;
}

const fetchDashboardData = async (): Promise<DashboardData> => {
  const response = await api.get("/candidate/dashboard");
  return response.data;
};

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["candidateDashboard"],
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome to Your Dashboard!
        </h1>
        <p className="text-gray-600">
          Track your job applications and bookmarks
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Applied Jobs */}
        <Link href="/candidate/applied-jobs">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Applied Jobs
              </h3>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-blue-600">
              {data.applied_jobs}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Jobs you have applied to
            </p>
          </div>
        </Link>

        {/* Bookmarked Jobs */}
        <Link href="/candidate/bookmarks">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-red-200 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Bookmarked Jobs
              </h3>
              <div className="p-3 bg-red-100 rounded-lg">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-red-600">
              {data.bookmarked_jobs}
            </p>
            <p className="text-sm text-gray-500 mt-2">Jobs saved for later</p>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/job-listing">
            <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              Browse Jobs
            </button>
          </Link>
          <Link href="/candidate/education">
            <button className="w-full px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Update Education
            </button>
          </Link>
          <Link href="/candidate/resume">
            <button className="w-full px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Upload Resume
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
