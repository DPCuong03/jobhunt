"use client";

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ExperienceForm from "@/components/ExperienceForm";
import api from "@/lib/api"; // Hàm gọi API của bạn

const createExperience = async (data: any) => {
  const response = await api.post("/candidate/experience/create", data);
  return response.data;
};

export default function CreateExperiencePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createExperience,
    onSuccess: () => {
      // Làm tươi danh sách để thấy dữ liệu mới
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      toast.success("Add experience successfully!");
      router.push("/candidate/experience");
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi thêm mới");
    },
  });

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/candidate/experience"
          className="text-gray-500 hover:text-blue-600"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-gray-800">Add New Experience</h1>
      </div>

      <ExperienceForm
        onSubmit={(data: any) => mutation.mutate(data)}
        isLoading={mutation.isPending}
      />
    </div>
  );
}
