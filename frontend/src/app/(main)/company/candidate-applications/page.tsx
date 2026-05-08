"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { Eye, Loader2, AlertCircle, FileText, CheckCircle2, XCircle, Download } from "lucide-react";
import api from "@/lib/api";
import { useState } from "react";

interface Resume {
  id: number;
  name: string;
  file: string;
  created_at: string;
}

interface Application {
  id: number;
  status: string;
  cover_letter: string;
  created_at: string;
  job_id: number;
  candidate_id: number;
  jobs: {
    title: string;
  };
  candidates: {
    name: string;
    email: string;
  };
}

const fetchApplications = async () => {
  try {
    const response = await api.get("/company/applications");
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Could not fetch applications";
    throw new Error(message);
  }
};

const fetchCandidateResume = async (candidateId: number) => {
  try {
    const response = await api.get(`/company/resume/${candidateId}`);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Could not fetch resume";
    throw new Error(message);
  }
};

const updateApplicationStatus = async ({
  applicationId,
  status,
}: {
  applicationId: number;
  status: string;
}) => {
  try {
    const response = await api.put(`/company/applications/${applicationId}/status`, {
      status,
    });
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Could not update application";
    throw new Error(message);
  }
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "applied":
      return "bg-blue-100 text-blue-800";
    case "approved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "shortlisted":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function CandidateApplicationsPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(
    null
  );
  const queryClient = useQueryClient();

  const {
    data: applications,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["candidateApplications"],
    queryFn: fetchApplications,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    placeholderData: keepPreviousData,
  });

  const { data: resumes, isLoading: resumeLoading } = useQuery({
    queryKey: ["candidateResume", selectedCandidateId],
    queryFn: () => fetchCandidateResume(selectedCandidateId!),
    enabled: !!selectedCandidateId,
  });

  const statusMutation = useMutation({
    mutationFn: updateApplicationStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateApplications"] });
    },
  });

  const handleApprove = (applicationId: number) => {
    statusMutation.mutate({
      applicationId,
      status: "Approved",
    });
  };

  const handleDecline = (applicationId: number) => {
    statusMutation.mutate({
      applicationId,
      status: "Rejected",
    });
  };

  const handleDownloadResume = async (resumeName: string, fileName: string) => {
    try {
      // Construct the path from public folder
      const fileUrl = `/uploads/${resumeName}`;
      const response = await fetch(fileUrl);
      
      if (!response.ok) {
        throw new Error("File not found");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || resumeName || "resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback to direct link
      window.open(`/uploads/${resumeName}`, "_blank");
    }
  };

  const handleViewResume = (candidateId: number) => {
    setSelectedCandidateId(candidateId);
    setResumeModalOpen(true);
  };

  if (isLoading && !applications) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 bg-white rounded-lg border border-gray-100">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium">Getting applications...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 bg-white rounded-lg border border-red-100">
        <AlertCircle className="w-10 h-10 text-red-600" />
        <p className="text-red-600 font-medium">
          {error?.message || "Error loading applications"}
        </p>
      </div>
    );
  }

  const emptyState = !applications || applications.length === 0;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
        {/* Loading bar */}
        {isFetching && !isLoading && (
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/20">
            <div className="h-full bg-blue-500 animate-progress origin-left"></div>
          </div>
        )}

        {/* Header */}
        <div className="p-5 border-b border-gray-100 bg-white flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">
            Candidate Applications
          </h1>
          {isFetching && (
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          )}
        </div>

        {/* Empty state */}
        {emptyState ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">
              No applications received yet
            </p>
            <p className="text-gray-400 text-sm">
              Applications from candidates will appear here
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="p-4 w-16 text-center font-bold text-sm text-gray-700">
                    ID
                  </th>
                  <th className="p-4 font-bold text-sm text-gray-700">
                    Job Title
                  </th>
                  <th className="p-4 font-bold text-sm text-gray-700">
                    Candidate Name
                  </th>
                  <th className="p-4 font-bold text-sm text-gray-700">Email</th>
                  <th className="p-4 w-28 font-bold text-sm text-gray-700 text-center">
                    Status
                  </th>
                  <th className="p-4 font-bold text-sm text-gray-700 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications?.map((app: Application) => (
                  <React.Fragment key={app.id}>
                    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-center text-sm font-medium text-gray-600">
                        #{app.id}
                      </td>
                      <td className="p-4 text-sm text-gray-700 font-medium">
                        {app.jobs.title}
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {app.candidates.name}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {app.candidates.email}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex gap-2 justify-center flex-wrap">
                          <button
                            onClick={() => handleViewResume(app.candidate_id)}
                            title="View Resume"
                            className="inline-flex items-center gap-1 px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                          >
                            <FileText size={16} />
                          </button>
                          <button
                            onClick={() =>
                              setExpandedId(expandedId === app.id ? null : app.id)
                            }
                            title="View Cover Letter"
                            className="inline-flex items-center gap-1 px-2 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleApprove(app.id)}
                            disabled={
                              statusMutation.isPending ||
                              app.status === "Approved"
                            }
                            title="Approve"
                            className="inline-flex items-center gap-1 px-2 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {statusMutation.isPending ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <CheckCircle2 size={16} />
                            )}
                          </button>
                          <button
                            onClick={() => handleDecline(app.id)}
                            disabled={
                              statusMutation.isPending ||
                              app.status === "Rejected"
                            }
                            title="Decline"
                            className="inline-flex items-center gap-1 px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {statusMutation.isPending ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <XCircle size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === app.id && app.cover_letter && (
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <td colSpan={6} className="p-6">
                          <div className="space-y-3">
                            <div>
                              <h3 className="text-sm font-bold text-gray-700 mb-2">
                                Cover Letter
                              </h3>
                              <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-700 max-h-40 overflow-y-auto">
                                {app.cover_letter}
                              </div>
                            </div>
                            <button
                              onClick={() => setExpandedId(null)}
                              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Collapse
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resume Modal */}
      {resumeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Candidate Resume</h2>
              <button
                onClick={() => {
                  setResumeModalOpen(false);
                  setSelectedCandidateId(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {resumeLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : resumes && resumes.length > 0 ? (
                <div className="space-y-4">
                  {resumes.map((resume: Resume) => (
                    <div
                      key={resume.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-gray-800">
                            {resume.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(resume.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleDownloadResume(resume.file, resume.name)
                          }
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <Download size={16} />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No resume available</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setResumeModalOpen(false);
                  setSelectedCandidateId(null);
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
