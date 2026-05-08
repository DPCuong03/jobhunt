// src/app/candidate/layout.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link"; // Nhập Link từ next/link
import { useUserStore } from "@/stores/useUserStore";
import {
  Briefcase,
  Star,
  BookOpen,
  Settings,
  FileText,
  User,
  Lock,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    icon: <Briefcase size={18} />,
    path: "/candidate/dashboard",
  },
  {
    name: "Applied Jobs",
    icon: <Briefcase size={18} />,
    path: "/candidate/applied-jobs",
  },
  {
    name: "Bookmarked Jobs",
    icon: <Star size={18} />,
    path: "/candidate/bookmarks",
  },
  {
    name: "Education",
    icon: <BookOpen size={18} />,
    path: "/candidate/education",
  },
  { name: "Skills", icon: <Settings size={18} />, path: "/candidate/skills" },
  {
    name: "Work Experience",
    icon: <Briefcase size={18} />,
    path: "/candidate/experience",
  },
  {
    name: "Resume Upload",
    icon: <FileText size={18} />,
    path: "/candidate/resume",
  },
  {
    name: "Edit Profile",
    icon: <User size={18} />,
    path: "/candidate/edit-profile",
  },
  {
    name: "Edit Password",
    icon: <Lock size={18} />,
    path: "/candidate/edit-password",
  },
];

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useUserStore();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault(); // Chặn hành vi chuyển trang mặc định của thẻ Link
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-48 bg-slate-800 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" />
        <h1 className="relative text-4xl font-bold text-white z-10">
          Dashboard
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="bg-white border border-gray-200 rounded-lg overflow-hidden h-fit shadow-sm">
          <nav className="flex flex-col">
            {/* Map các menu items bình thường */}
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium border-b border-gray-100 last:border-none transition-all
                    ${isActive ? "bg-[#5cb85c] text-white" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}

            {/* Riêng Logout vẫn giữ nút bấm hoặc Link với onClick */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-all text-left"
            >
              <LogOut size={18} />
              Logout
            </button>
          </nav>
        </aside>

        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  );
}
