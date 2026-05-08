"use client";

import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import SkillForm from "@/components/SkillForm";
import api from "@/lib/api";

// 1. Hàm lấy dữ liệu chi tiết theo ID
const fetchSkillById = async (id: string) => {
  const response = await api.get(`/candidate/skills/${id}`);
  return response.data;
};

// 2. Hàm gửi dữ liệu cập nhật
const editSkill = async ({ id, data }: { id: number; data: any }) => {
  const response = await api.put(`/candidate/skills/edit/${id}`, data);
  return response.data;
};

export default function EditSkillPage() {
  const router = useRouter();
  const { id } = useParams(); // Lấy ID từ URL (ví dụ: /skills/edit/1)
  const queryClient = useQueryClient();

  // 3. Sử dụng useQuery để lấy dữ liệu hiện tại từ DB
  const { data: skill, isLoading: isFetching } = useQuery({
    queryKey: ["skill", id],
    queryFn: () => fetchSkillById(id as string),
    enabled: !!id, // Chỉ chạy khi có ID
  });

  const mutation = useMutation({
    mutationFn: editSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      queryClient.invalidateQueries({ queryKey: ["skill", id] });
      toast.success("Update successfully!");
      router.push("/candidate/skills");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error updating skill record");
    },
  });

  // Hiển thị loading khi đang tải dữ liệu cũ
  if (isFetching) {
    return (
      <div className="flex justify-center items-center p-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/candidate/skills"
          className="text-gray-500 hover:text-blue-600"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-gray-800">Edit Skill</h1>
      </div>

      {/* 4. Truyền dữ liệu lấy được vào prop initialData */}
      <SkillForm
        initialData={skill}
        onSubmit={(formData: any) =>
          mutation.mutate({ id: Number(id), data: formData })
        }
        isLoading={mutation.isPending}
      />
    </div>
  );
}
