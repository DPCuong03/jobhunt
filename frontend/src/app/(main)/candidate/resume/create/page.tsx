"use client";

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ExperienceForm from "@/components/ExperienceForm";
import api from "@/lib/api"; 
import ResumeForm from "@/components/ResumeForms";

const createResume = async (data: any) => {
  const response = await api.post("/candidate/resume/create", data);
  return response.data;
};

export default function CreateResumePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createResume,
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("Add resume successfully!");
      router.push("/candidate/resume");
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi thêm mới");
    },
  });

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/candidate/resume"
          className="text-gray-500 hover:text-blue-600"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-gray-800">Add New Resume</h1>
      </div>

      <ResumeForm
        onSubmit={(data: any) => mutation.mutate(data)}
        isLoading={mutation.isPending}
      />
    </div>
  );
}
