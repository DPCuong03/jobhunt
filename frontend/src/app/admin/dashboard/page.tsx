// src/app/admin/dashboard/page.tsx
"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  Users,
  Building2,
  Briefcase,
  TrendingUp,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface DashboardStats {
  total_companies: number;
  total_candidates: number;
  total_jobs: number;
}

const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

export default function AdminDashboardPage() {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-gray-600 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-red-900">Failed to load dashboard</h3>
          <p className="text-red-700 text-sm">
            {error instanceof Error ? error.message : "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Companies",
      value: stats.total_companies,
      icon: <Building2 size={32} />,
      bgColor: "bg-blue-500",
      lightBg: "bg-blue-100",
    },
    {
      title: "Total Candidates",
      value: stats.total_candidates,
      icon: <Users size={32} />,
      bgColor: "bg-red-500",
      lightBg: "bg-red-100",
    },
    {
      title: "Total Jobs",
      value: stats.total_jobs,
      icon: <Briefcase size={32} />,
      bgColor: "bg-amber-500",
      lightBg: "bg-amber-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's your platform overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${card.lightBg} p-4 rounded-lg text-white`}>
                <div className={`${card.bgColor} p-3 rounded-lg inline-flex`}>
                  {card.icon}
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium">{card.title}</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Manage Your Platform</h3>
              <p className="text-blue-100">
                Use the sidebar to manage companies, candidates, jobs, and more.
              </p>
            </div>
            <TrendingUp size={48} className="opacity-20" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          <p className="text-gray-600 text-sm italic">
            No recent activity yet.
          </p>
        </div>
      </div>
    </div>
  );
}
