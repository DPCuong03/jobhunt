"use client";

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SkillForm from "@/components/SkillForm";
import api from "@/lib/api"; // Hàm gọi API của bạn

const createSkill = async (data: any) => {
  const response = await api.post("/candidate/skills/create", data);
  return response.data;
};

export default function CreateSkillPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      // Làm tươi danh sách để thấy dữ liệu mới
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Thêm thành công!");
      router.push("/candidate/skills");
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi thêm mới");
    },
  });

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/candidate/skills"
          className="text-gray-500 hover:text-blue-600"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-gray-800">Add New Skill</h1>
      </div>

      <SkillForm
        onSubmit={(data: any) => mutation.mutate(data)}
        isLoading={mutation.isPending}
      />
    </div>
  );
}
