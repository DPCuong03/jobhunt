"use client";

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EducationForm from "@/components/EducationForm";
import api from "@/lib/api"; // Hàm gọi API của bạn

const createEducation = async (data: any) => {
  const response = await api.post("/candidate/education/create", data);
  return response.data;
};

export default function CreateEducationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createEducation,
    onSuccess: () => {
      // Làm tươi danh sách để thấy dữ liệu mới
      queryClient.invalidateQueries({ queryKey: ["educations"] });
      toast.success("Thêm thành công!");
      router.push("/candidate/education");
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi thêm mới");
    },
  });

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/candidate/education"
          className="text-gray-500 hover:text-blue-600"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-gray-800">Add New Education</h1>
      </div>

      <EducationForm
        onSubmit={(data: any) => mutation.mutate(data)}
        isLoading={mutation.isPending}
      />
    </div>
  );
}
