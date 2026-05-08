"use client";
import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle2, FileText, X } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

export default function ResumeForm({ initialData, onSubmit, isLoading }: any) {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      file: "",
    },
  );

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        file: initialData.file || "",
      });
    }
  }, [initialData]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý sau khi upload thành công
  const handleUploadSuccess = (result: any) => {
    if (result.info && typeof result.info !== "string") {
      setFormData({
        ...formData,
        file: result.info.secure_url, // Lưu URL bảo mật từ Cloudinary
      });
    }
  };

  const removeFile = () => {
    setFormData({ ...formData, file: "" });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-6 max-w-2xl bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Input Tên Resume */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Resume Name*
          </label>
          <input
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            placeholder="Ví dụ: CV Tiếng Anh, Chứng chỉ IT..."
          />
        </div>

        {/* Khu vực Upload & Preview */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            File Upload*
          </label>

          {!formData.file ? (
            <CldUploadWidget
              signatureEndpoint="/api/sign-cloudinary-params" // Đường dẫn API đã sửa
              onSuccess={handleUploadSuccess}
            >
              {({ open }) => (
                <button
                  type="button" // Ngăn tự động submit form
                  onClick={() => open()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl py-8 px-4 flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition-all group"
                >
                  <div className="p-3 bg-blue-100 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                    <FileText size={28} />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    Click to upload your resume
                  </span>
                  <span className="text-xs text-gray-400">
                    PDF, JPG, PNG (Max 5MB)
                  </span>
                </button>
              )}
            </CldUploadWidget>
          ) : (
            /* Phần hiển thị Preview ảnh */
            <div className="relative group w-full max-w-[240px] aspect-[3/4] border rounded-lg overflow-hidden bg-gray-100 shadow-md">
              <img
                src={formData.file}
                alt="Resume Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={removeFile}
                  className="bg-white text-red-600 p-2 rounded-full hover:bg-red-50 shadow-lg"
                  title="Remove file"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-[10px] py-1 flex items-center justify-center gap-1">
                <CheckCircle2 size={12} /> Ready to save
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nút Save chính của Form */}
      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          disabled={isLoading || !formData.file || !formData.name}
          className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Saving...
            </>
          ) : (
            "Save Resume"
          )}
        </button>
      </div>
    </form>
  );
}
