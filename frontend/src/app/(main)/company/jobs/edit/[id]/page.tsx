"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useRouter, useParams } from "next/navigation";

export default function EditJobPage() {
  const router = useRouter();
  const { id } = useParams();

  // 1. Fetch Metadata
  const { data: metadata, isLoading: isMetaLoading } = useQuery({
    queryKey: ["jobMetadata"],
    queryFn: async () => {
      const res = await api.get("/metadata/job-info");
      return res.data;
    },
  });

  // 2. Fetch dữ liệu của công việc - Đã sửa để khớp với cấu trúc API của bạn
  const { data: response, isLoading: isJobLoading } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const res = await api.get(`/company/jobs/${id}`);
      return res.data; // Trả về { job: { ... } }
    },
    enabled: !!id,
  });

  // Trích xuất dữ liệu job thực tế để dùng cho gọn
  const jobData = response?.job;

  // 3. Mutation để cập nhật job
  const mutation = useMutation({
    mutationFn: async (updatedJob) => {
      const res = await api.put(`/company/jobs/edit/${id}`, updatedJob);
      return res.data;
    },
    onSuccess: () => {
      alert("Update job successfully!");
      router.push("/company/jobs/all-jobs");
    },
    onError: (err: any) => {
      // Improved error logging
      console.error("XHR Error Detail:", err.response?.data || err.message);
      alert(`Error: ${err.response?.data?.message || err.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const finalData = {
      title: data.title?.toString(),
      description: data.description?.toString(),
      responsibility: data.responsibility?.toString(),
      skill: data.skill?.toString(),
      education: data.education?.toString(),
      benefit: data.benefit?.toString(),
      deadline: data.deadline?.toString(),

      vacancy: Number(data.vacancy) || 0,
      jobCategory: Number(data.jobCategory) || 0,
      jobLocation: Number(data.jobLocation) || 0,
      jobType: Number(data.jobType) || 0,
      jobExperience: Number(data.jobExperience) || 0,
      jobGender: Number(data.jobGender) || 0,
      jobSalaryRange: Number(data.jobSalaryRange) || 0,

      isFeatured: formData.get("isFeatured") === "on" ? 1 : 0,
      isUrgent: formData.get("isUrgent") === "on" ? 1 : 0,
    };

    if (finalData.vacancy < 1) {
      alert("Vacancy must be at least 1");
      return;
    }

    mutation.mutate(finalData as any);
  };

  if (isJobLoading || isMetaLoading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading job data...</div>
    );
  }

  // Sử dụng key={jobData?.id} để ép Form render lại khi dữ liệu load xong
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit job: {jobData?.title}</h1>
      <form
        key={jobData?.id}
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 shadow rounded-xl"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            name="title"
            defaultValue={jobData?.title}
            required
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <textarea
            name="description"
            defaultValue={jobData?.description}
            rows={4}
            className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Responsibilities */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Responsibilities
          </label>
          <textarea
            name="responsibility"
            defaultValue={jobData?.responsibility}
            rows={4}
            className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Các trường Select - Đã đổi thành jobData */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Gender</label>
            <select
              name="jobGender"
              defaultValue={jobData?.job_gender_id || ""}
              className="w-full border p-2 rounded mt-1 bg-white"
            >
              {metadata?.genders?.map((g: any) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Salary Range</label>
            <select
              name="jobSalaryRange"
              defaultValue={jobData?.job_salary_range_id || ""}
              className="w-full border p-2 rounded mt-1 bg-white"
            >
              {metadata?.salaryRanges?.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">
              Deadline (yyyy-mm-dd)
            </label>
            <input
              name="deadline"
              placeholder="2026-05-30"
              defaultValue={jobData?.deadline}
              type="text"
              pattern="\d{4}-\d{2}-\d{2}"
              required
              className="w-full border p-2 rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Vacancy</label>
            <input
              name="vacancy"
              defaultValue={jobData?.vacancy}
              type="number"
              min="1"
              required
              className="w-full border p-2 rounded mt-1"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isUrgent"
              defaultChecked={!!jobData?.is_urgent}
            />{" "}
            Urgent Hiring
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isFeatured"
              defaultChecked={!!jobData?.is_featured}
            />{" "}
            Featured
          </label>
        </div>

        {/* Metadata Selects */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Job Category</label>
            <select
              name="jobCategory"
              defaultValue={jobData?.job_category_id || ""}
              className="w-full border p-2 rounded mt-1 bg-white"
            >
              {metadata?.categories?.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Location</label>
            <select
              name="jobLocation"
              defaultValue={jobData?.job_location_id || ""}
              className="w-full border p-2 rounded mt-1 bg-white"
            >
              {metadata?.locations?.map((loc: any) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 mt-6"
        >
          {mutation.isPending ? "Updating..." : "Update Job"}
        </button>
      </form>
    </div>
  );
}
