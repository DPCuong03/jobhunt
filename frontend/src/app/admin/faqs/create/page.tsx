"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  Loader2,
  AlertCircle,
  Save,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface FaqData {
  question: string;
  answer: string;
}

const createFaq = async (data: FaqData): Promise<FaqData> => {
  const res = await api.post("/admin/faqs", data);
  return res.data;
};

// Minimal rich text toolbar — no external editor dependency
const RichEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) => {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const initialized = React.useRef(false);

  React.useEffect(() => {
    if (editorRef.current && !initialized.current && value) {
      editorRef.current.innerHTML = value;
      initialized.current = true;
    }
  }, [value]);

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const formatBlock = (e: React.ChangeEvent<HTMLSelectElement>) => {
    exec("formatBlock", e.target.value);
  };

  const PARAGRAPH_OPTIONS = [
    { value: "p", label: "Paragraph" },
    { value: "h2", label: "Heading 2" },
    { value: "h3", label: "Heading 3" },
    { value: "h4", label: "Heading 4" },
  ];

  return (
    <div className="border border-[#e5e2db] rounded-xl overflow-hidden focus-within:border-[#1a1a2e] transition-colors">
      {/* Menu bar */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-[#f0ede8] bg-[#fafaf9] text-[13px] text-gray-500">
        {["File", "Edit", "View", "Format"].map((m) => (
          <span
            key={m}
            className="cursor-default select-none hover:text-gray-700 transition-colors"
          >
            {m}
          </span>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[#f0ede8] bg-[#fafaf9] flex-wrap">
        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => exec("undo")}
          className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:bg-[#e5e2db] transition-colors text-[13px]"
          title="Undo"
        >
          ↩
        </button>
        <button
          type="button"
          onClick={() => exec("redo")}
          className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:bg-[#e5e2db] transition-colors text-[13px]"
          title="Redo"
        >
          ↪
        </button>

        <div className="w-px h-5 bg-[#e5e2db]" />

        {/* Paragraph select */}
        <select
          onChange={formatBlock}
          className="border border-[#e5e2db] rounded-lg px-2 py-1 text-[12px] bg-white text-gray-600 outline-none focus:border-[#1a1a2e] transition-colors"
        >
          {PARAGRAPH_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <div className="w-px h-5 bg-[#e5e2db]" />

        {/* Bold / Italic / Underline */}
        <button
          type="button"
          onClick={() => exec("bold")}
          className="w-7 h-7 flex items-center justify-center rounded text-gray-600 hover:bg-[#e5e2db] transition-colors text-[13px] font-bold"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => exec("italic")}
          className="w-7 h-7 flex items-center justify-center rounded text-gray-600 hover:bg-[#e5e2db] transition-colors text-[13px] italic"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => exec("underline")}
          className="w-7 h-7 flex items-center justify-center rounded text-gray-600 hover:bg-[#e5e2db] transition-colors text-[13px] underline"
          title="Underline"
        >
          U
        </button>

        <div className="w-px h-5 bg-[#e5e2db]" />

        {/* Align */}
        <button
          type="button"
          onClick={() => exec("justifyLeft")}
          title="Align left"
          className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:bg-[#e5e2db] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="1" y="2" width="12" height="1.5" rx="0.75" />
            <rect x="1" y="6" width="8" height="1.5" rx="0.75" />
            <rect x="1" y="10" width="12" height="1.5" rx="0.75" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => exec("justifyCenter")}
          title="Align center"
          className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:bg-[#e5e2db] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="1" y="2" width="12" height="1.5" rx="0.75" />
            <rect x="3" y="6" width="8" height="1.5" rx="0.75" />
            <rect x="1" y="10" width="12" height="1.5" rx="0.75" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => exec("justifyRight")}
          title="Align right"
          className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:bg-[#e5e2db] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="1" y="2" width="12" height="1.5" rx="0.75" />
            <rect x="5" y="6" width="8" height="1.5" rx="0.75" />
            <rect x="1" y="10" width="12" height="1.5" rx="0.75" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => exec("justifyFull")}
          title="Justify"
          className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:bg-[#e5e2db] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="1" y="2" width="12" height="1.5" rx="0.75" />
            <rect x="1" y="6" width="12" height="1.5" rx="0.75" />
            <rect x="1" y="10" width="12" height="1.5" rx="0.75" />
          </svg>
        </button>

        <div className="w-px h-5 bg-[#e5e2db]" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => exec("insertUnorderedList")}
          title="Bullet list"
          className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:bg-[#e5e2db] transition-colors text-[13px]"
        >
          ☰
        </button>
        <button
          type="button"
          onClick={() => exec("insertOrderedList")}
          title="Numbered list"
          className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:bg-[#e5e2db] transition-colors text-[13px]"
        >
          1≡
        </button>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => {
          if (editorRef.current) onChange(editorRef.current.innerHTML);
        }}
        className="min-h-[220px] px-5 py-4 text-[14px] text-gray-700 outline-none leading-relaxed"
        style={{ fontFamily: "inherit" }}
      />

      {/* Status bar */}
      <div className="flex items-center justify-between px-5 py-1.5 border-t border-[#f0ede8] bg-[#fafaf9]">
        <span className="text-[11px] text-gray-400 font-mono">p</span>
        <span className="text-[11px] text-gray-300 tracking-widest">
          RICH TEXT EDITOR
        </span>
      </div>
    </div>
  );
};

const CreateFAQPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("active");
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const createMutation = useMutation({
    mutationFn: createFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminFaqs"] });
      setSuccess(true);

      toast.success("Create FAQ successfully!");
      setTimeout(() => router.push("/admin/faq"), 1200);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create FAQ. Please try again.";

      setFormError(errorMessage);

      // Show error toast
      toast.error(error.message || "Error creating FAQ");
    },
  });

  const isPending = createMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!question.trim()) {
      setFormError("Question is required.");
      return;
    }
    if (!answer.trim() || answer === "<br>") {
      setFormError("Answer is required.");
      return;
    }

    createMutation.mutate({ question, answer });
  };

  return (
    <>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[20px] font-semibold text-[#1a1a2e] tracking-tight">
            Add New FAQ
          </h2>
          <p className="text-[13px] text-gray-400 mt-0.5">
            Create a new FAQ entry.
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/faq")}
          className="flex items-center gap-2 px-4 h-9 border border-[#e5e2db] text-gray-600 rounded-lg text-[13px] font-medium hover:bg-[#f9f8f6] transition-colors"
        >
          <ArrowLeft size={14} />
          View All
        </button>
      </div>

      {/* Success banner */}
      {success && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-3 mb-5 text-green-700">
          <CheckCircle2 size={16} />
          <span className="text-[13px] font-medium">
            FAQ created! Redirecting...
          </span>
        </div>
      )}

      {/* Error banner */}
      {formError && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-3 mb-5 text-red-700">
          <AlertCircle size={16} />
          <span className="text-[13px] font-medium">{formError}</span>
        </div>
      )}

      {/* Form card */}
      <div className="bg-white rounded-xl border border-[#e5e2db] p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question */}
          <div>
            <label className="block text-[13px] font-medium text-[#1a1a2e] mb-2">
              Question <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter the FAQ question..."
              className="w-full border border-[#e5e2db] rounded-xl px-4 py-3 text-[14px] text-gray-700 outline-none focus:border-[#1a1a2e] placeholder:text-gray-300 transition-colors bg-[#fafaf9] focus:bg-white"
            />
          </div>

          {/* Answer */}
          <div>
            <label className="block text-[13px] font-medium text-[#1a1a2e] mb-2">
              Answer <span className="text-red-400">*</span>
            </label>
            <RichEditor value={answer} onChange={setAnswer} />
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-6 h-10 bg-[#1a1a2e] text-white rounded-lg text-[13px] font-medium hover:bg-[#2a2a4e] disabled:opacity-60 transition-colors"
            >
              {isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              Create FAQ
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/faq")}
              className="px-6 h-10 border border-[#e5e2db] text-gray-600 rounded-lg text-[13px] font-medium hover:bg-[#f9f8f6] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateFAQPage;
