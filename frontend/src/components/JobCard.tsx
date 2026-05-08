import React from "react";
import Link from "next/link";
import { MapPin, Briefcase, Clock, DollarSign, Zap, Star } from "lucide-react";

interface JobCardProps {
  job: {
    id: number;
    title: string;
    companies: {
      company_name: string;
      logo: string;
    };
    job_categories: { name: string };
    job_locations: { name: string };
    job_types: { name: string };
    job_salary_ranges: { name: string };
    created_at: string;
    is_featured: number;
    is_urgent: number;
  };
}

const JobCard = ({ job }: JobCardProps) => {
  // Hàm tính thời gian giả lập (hoặc dùng hàm formatDate của bạn)
  const timeAgo = "15 months ago";

  return (
    <div className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col h-full relative overflow-hidden">
      {/* Badge Featured/Urgent ở góc */}
      <div className="flex gap-2 mb-4 h-7">
        {job.is_featured === 1 && (
          <span className="flex items-center gap-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase px-2 py-1 rounded-md">
            <Star size={12} fill="currentColor" /> Featured
          </span>
        )}
        {job.is_urgent === 1 && (
          <span className="flex items-center gap-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase px-2 py-1 rounded-md">
            <Zap size={12} fill="currentColor" /> Urgent
          </span>
        )}
      </div>

      <div className="flex items-start gap-4 mb-4">
        {/* Logo Công ty */}
        <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center p-2 flex-shrink-0 group-hover:scale-105 transition-transform">
          <img
            src={
              job.companies.logo
                ? `/uploads/${job.companies.logo}`
                : "/uploads/logo-placeholder.png"
            }
            alt={job.companies.company_name}
            className="max-w-full max-h-full object-contain text-[10px]"
          />
        </div>

        {/* Tiêu đề & Công ty */}
        <div className="flex-1 min-w-0">
          <Link href={`/job-detail/${job.id}`}>
            <h3 className="text-lg font-bold text-gray-900 leading-snug hover:text-blue-600 transition-colors truncate">
              {job.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 font-medium truncate">
            {job.companies.company_name}
          </p>
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-5 flex-1">
        <div className="flex items-center gap-1.5 text-gray-400 text-sm">
          <Briefcase size={16} className="text-blue-500" />
          <span className="truncate">{job.job_categories.name}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-400 text-sm">
          <MapPin size={16} className="text-red-500" />
          <span className="truncate">{job.job_locations.name}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-400 text-sm">
          <Clock size={16} className="text-orange-500" />
          <span>{timeAgo}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-600 text-sm font-semibold">
          <DollarSign size={16} className="text-green-500" />
          <span>{job.job_salary_ranges.name}</span>
        </div>
      </div>

      {/* Footer Card */}
      <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
          {job.job_types.name}
        </span>
        <Link
          href={`/job-detail/${job.id}`}
          className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
