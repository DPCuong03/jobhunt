"use client";
import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle2, FileText, X, UploadCloud } from "lucide-react";

export default function ResumeForm({ initialData, onSubmit, isLoading }: any) {
  const [formData, setFormData] = useState(
    initialData || { name: "", file: "" },
  );
  const [isUploading, setIsUploading] = useState(false);

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

  // Xử lý upload file cục bộ
  const handleLocalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const data = new FormData();
    data.set("file", file);

    try {
      const res = await fetch("/api/upload-local", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        // Cập nhật state chỉ với tên file (Ví dụ: resume_123.pdf)
        setFormData({ ...formData, file: result.fileName });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
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
            placeholder="Ví dụ: CV Tiếng Anh..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            File Upload (Local)*
          </label>

          {!formData.file ? (
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.jpg,.png"
                onChange={handleLocalUpload}
                className="hidden"
                id="local-file-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="local-file-upload"
                className={`w-full border-2 border-dashed border-gray-300 rounded-xl py-8 px-4 flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
              >
                <div className="p-3 bg-blue-100 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                  {isUploading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <UploadCloud size={28} />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {isUploading
                    ? "Uploading to local folder..."
                    : "Click to select file"}
                </span>
                <span className="text-xs text-gray-400">
                  PDF, JPG, PNG (Saved to /public/uploads)
                </span>
              </label>
            </div>
          ) : (
            <div className="relative group w-full max-w-[240px] aspect-[3/4] border rounded-lg overflow-hidden bg-gray-50 shadow-md flex flex-col items-center justify-center p-4">
              {/* Nếu là ảnh thì hiện ảnh, nếu là PDF thì hiện icon */}
              {formData.file.match(/\.(jpg|jpeg|png)$/i) ? (
                <img
                  src={formData.file}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <FileText size={64} />
                  <span className="text-xs font-medium truncate w-full text-center px-2">
                    {formData.file.split("/").pop()}
                  </span>
                </div>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, file: "" })}
                  className="bg-white text-red-600 p-2 rounded-full hover:bg-red-50 shadow-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-[10px] py-1 flex items-center justify-center gap-1">
                <CheckCircle2 size={12} /> Local file ready
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          disabled={
            isLoading || isUploading || !formData.file || !formData.name
          }
          className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300 transition-all flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            "Save Resume"
          )}
        </button>
      </div>
    </form>
  );
}
