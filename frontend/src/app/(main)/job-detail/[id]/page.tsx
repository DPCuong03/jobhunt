"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  MapPin,
  CalendarDays,
  DollarSign,
  LayoutGrid,
  FileText,
  CheckCircle2,
  Bookmark,
  Clock3,
} from "lucide-react";
import { Job } from "@/types/job";
import { useUserStore } from "@/stores/useUserStore";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

// Import only the relative time function
import { formatDate } from "@/lib/utils/date";

export default function JobDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useUserStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/job-detail/${id}`,
        );
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJob();
  }, [id]);

  const handleApplyNow = async () => {
    // Check if user is logged in
    if (!user) {
      toast.error("Please login to apply for this job");
      router.push("/login");
      return;
    }

    // Check if user is candidate
    if (user.role !== "candidate") {
      toast.error("Only candidates can apply for jobs");
      return;
    }

    // Show cover letter modal
    setShowCoverLetterModal(true);
  };

  const handleSubmitApplication = async () => {
    if (!coverLetter.trim()) {
      toast.error("Please write a cover letter");
      return;
    }

    setIsApplying(true);
    try {
      const response = await api.post("/candidate/apply-job", {
        jobId: id,
        coverLetter: coverLetter.trim(),
      });
      toast.success("Successfully applied for the job!");
      console.log("Apply response:", response.data);
      setShowCoverLetterModal(false);
      setCoverLetter("");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to apply for job";
      toast.error(errorMessage);
      console.error("Apply error:", error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleCancelApplication = () => {
    setShowCoverLetterModal(false);
    setCoverLetter("");
  };

  const handleBookmark = async () => {
    // Check if user is logged in
    if (!user) {
      toast.error("Please login to bookmark this job");
      router.push("/login");
      return;
    }

    // Check if user is candidate
    if (user.role !== "candidate") {
      toast.error("Only candidates can bookmark jobs");
      return;
    }

    setIsBookmarking(true);
    try {
      if (isBookmarked) {
        // Remove bookmark
        await api.post("/candidate/remove-bookmark", {
          jobId: id,
        });
        setIsBookmarked(false);
        toast.success("Removed from bookmarks");
      } else {
        // Add bookmark
        const response = await api.post("/candidate/bookmark-job", {
          jobId: id,
        });
        setIsBookmarked(true);
        toast.success("Added to bookmarks!");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update bookmark";
      toast.error(errorMessage);
      console.error("Bookmark error:", error);
    } finally {
      setIsBookmarking(false);
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center text-gray-500">Loading vacancy...</div>
    );
  if (!data?.job) return <div className="p-20 text-center">Job not found.</div>;

  const { job } = data;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* HEADER SECTION */}
      <div
        className="relative pt-5 pb-5 text-white bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url('/uploads/banner_job_listing.jpg')`,
        }}
      >
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-8 p-10">
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center p-2 overflow-hidden shadow-sm">
              <img
                src={
                  job.companies.logo
                    ? `/uploads/${job.companies.logo}`
                    : "/uploads/logo-placeholder.png"
                }
                alt={job.companies.company_name}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
                {job.title}, {job.companies?.company_name}
              </h2>
              {/* Container chính với giới hạn chiều rộng tối đa (max-width) */}
              <div className="grid grid-cols-2 gap-y-4 mt-6 text-gray-300 text-sm max-w-sm">
                {/* 1. Category */}
                <div className="flex items-center gap-3">
                  <Briefcase size={18} className="text-gray-400" />
                  <span className="font-medium whitespace-nowrap">
                    {job.job_categories?.name}
                  </span>
                </div>

                {/* 2. Location */}
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-gray-400" />
                  <span className="font-medium whitespace-nowrap">
                    {job.job_locations?.name}
                  </span>
                </div>

                {/* 3. Time */}
                <div className="flex items-center gap-3">
                  <Clock3 size={18} className="text-gray-400" />
                  <span className="font-medium whitespace-nowrap">
                    {formatDate(job.created_at)}
                  </span>
                </div>

                {/* 4. Salary */}
                <div className="flex items-center gap-3">
                  <DollarSign size={18} className="text-gray-400" />
                  <span className="font-medium whitespace-nowrap">
                    {job.job_salary_ranges?.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={handleApplyNow}
                disabled={isApplying}
                className="flex-1 md:flex-none px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition shadow-lg shadow-blue-900/20"
              >
                {isApplying ? "Applying..." : "Apply Now"}
              </button>
              <button
                onClick={handleBookmark}
                disabled={isBookmarking}
                className={`px-6 py-4 rounded-xl border transition ${
                  isBookmarked
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white/5 hover:bg-white/10 text-white border-white/10"
                }`}
              >
                <Bookmark
                  size={20}
                  fill={isBookmarked ? "currentColor" : "none"}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BODY SECTION */}
      <div className="container -mt-10">
        <div className="row g-5">
          {/* DESCRIPTION */}
          <div className="col-lg-8">
            <div className="pt-8">
              {" "}
              <div className="flex items-center gap-3 border-b border-gray-600 pb-3 mb-6 h-[40px]">
                <FileText className="text-blue-600" size={22} />
                <h3 className="text-xl font-bold text-gray-800 leading-none">
                  Description
                </h3>
              </div>
              <div
                className="prose prose-slate max-w-none text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>
          </div>

          {/*JOB SUMMARY */}
          <div className="col-lg-4">
            <div className="pt-8 sticky top-24">
              {" "}
              <div className="flex items-center gap-3 border-b border-gray-600 pb-3 mb-6 h-[40px]">
                <FileText className="text-blue-600" size={22} />
                <h4 className="text-xl font-bold text-gray-800 leading-none">
                  Job Summary
                </h4>
              </div>
              {/* Summary Table */}
              <div className="overflow-hidden border-2 border-black rounded-lg">
                <table className="w-full text-left table-fixed border-collapse">
                  <tbody>
                    {[
                      {
                        label: "Published On:",
                        value: formatDate(job.created_at),
                      },
                      { label: "Deadline:", value: formatDate(job.deadline) },
                      { label: "Vacancy:", value: "1" },
                      { label: "Category:", value: job.job_categories?.name },
                      { label: "Location:", value: job.job_locations?.name },
                      { label: "Type:", value: job.job_types?.name },
                    ].map((item, index) => (
                      <tr
                        key={index}
                        className="border-b-2 border-black last:border-0"
                      >
                        <th className="px-4 py-4 text-gray-900 font-bold text-sm w-1/2 border-r-2 border-black">
                          {item.label}
                        </th>
                        <td className="px-4 py-4 text-gray-700 text-sm">
                          {item.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COVER LETTER MODAL */}
      {showCoverLetterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Write Your Cover Letter
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {job.title} at {job.companies?.company_name}
                </p>
              </div>
              <button
                onClick={handleCancelApplication}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Dear Hiring Manager,

Write a compelling cover letter explaining why you're interested in this position and why you're a great fit for the role.

Please include:
- Your interest in the role
- Relevant skills and experience
- Why you want to join this company
- How you can contribute to the team

Best regards,
[Your Name]"
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              />
              <div className="mt-2 text-sm text-gray-500">
                {coverLetter.length} characters
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={handleCancelApplication}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitApplication}
                disabled={isApplying || !coverLetter.trim()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition font-medium"
              >
                {isApplying ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
