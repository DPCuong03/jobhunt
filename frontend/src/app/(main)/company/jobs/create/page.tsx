// app/jobs/create/page.jsx
"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreateJobPage() {
  const router = useRouter();

  const { data: metadata, isLoading: isMetaLoading } = useQuery({
    queryKey: ["jobMetadata"],
    queryFn: async () => {
      const res = await api.get("/metadata/job-info");
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (newJob) => {
      const res = await api.post("/company/jobs/create", newJob);
      return res.data;
    },
    onSuccess: () => {
      alert("Create job successfully!");
      router.push("/company/jobs/all-jobs");
    },
    onError: (err) => alert("Error: " + err.message),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const finalData = {
      // Các trường văn bản
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
    mutation.mutate(finalData as any);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add new job</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 shadow rounded-xl"
      >
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            name="title"
            placeholder="Job title..."
            required
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <textarea
            name="description"
            placeholder="Describe the job in detail, including company culture, team environment..."
            rows={4}
            className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Responsibilities
          </label>
          <textarea
            name="responsibility"
            placeholder="Describe the specific responsibilities of the candidate..."
            rows={4}
            className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Skills & Requirements
          </label>
          <textarea
            name="skill"
            placeholder="List the required skills and qualifications (e.g., ReactJS, Node.js...)"
            rows={4}
            className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Education
          </label>
          <textarea
            name="education"
            placeholder="List the required education and qualifications..."
            rows={4}
            className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Benefits
          </label>
          <textarea
            name="benefit"
            placeholder="List the benefits and perks offered..."
            rows={4}
            className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">
              Deadline (yyyy-mm-dd)
            </label>
            <input
              name="deadline"
              placeholder="2026-05-30"
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
              type="number"
              min="1"
              required
              className="w-full border p-2 rounded mt-1"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isUrgent" /> Urgent Hiring
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isFeatured" /> Featured
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium">Job Category</label>
          <select
            name="jobCategory"
            required
            className="w-full border p-2 rounded mt-1 bg-white"
            disabled={isMetaLoading}
          >
            <option value="">-- Select Category --</option>
            {metadata?.categories?.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/*Job Location */}
        <div>
          <label className="block text-sm font-medium">Location</label>
          <select
            name="jobLocation"
            required
            className="w-full border p-2 rounded mt-1 bg-white"
            disabled={isMetaLoading}
          >
            <option value="">-- Select Location --</option>
            {metadata?.locations?.map((loc: any) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
        {/*Job Type */}
        <div>
          <label className="block text-sm font-medium">Job Type</label>
          <select
            name="jobType"
            required
            className="w-full border p-2 rounded mt-1 bg-white"
            disabled={isMetaLoading}
          >
            <option value="">-- Select Job Type --</option>
            {metadata?.types?.map((type: any) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        {/*Job Experience */}
        <div>
          <label className="block text-sm font-medium">Experience</label>
          <select
            name="jobExperience"
            required
            className="w-full border p-2 rounded mt-1 bg-white"
            disabled={isMetaLoading}
          >
            <option value="">-- Select Experience --</option>
            {metadata?.experiences?.map((exp: any) => (
              <option key={exp.id} value={exp.id}>
                {exp.name}
              </option>
            ))}
          </select>
        </div>
        {/*Job Gender */}
        <div>
          <label className="block text-sm font-medium">Gender</label>
          <select
            name="jobGender"
            required
            className="w-full border p-2 rounded mt-1 bg-white"
            disabled={isMetaLoading}
          >
            <option value="">-- Select Gender --</option>
            {metadata?.genders?.map((gender: any) => (
              <option key={gender.id} value={gender.id}>
                {gender.name}
              </option>
            ))}
          </select>
        </div>
        {/*Job Salary Range */}
        <div>
          <label className="block text-sm font-medium">Salary Range</label>
          <select
            name="jobSalaryRange"
            required
            className="w-full border p-2 rounded mt-1 bg-white"
            disabled={isMetaLoading}
          >
            <option value="">-- Select Salary Range --</option>
            {metadata?.salaryRanges?.map((range: any) => (
              <option key={range.id} value={range.id}>
                {range.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {mutation.isPending ? "Saving..." : "Post Job"}
        </button>
      </form>
    </div>
  );
}
