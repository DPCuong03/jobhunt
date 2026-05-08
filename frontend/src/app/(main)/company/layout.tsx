// src/app/company/layout.tsx
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
    path: "/company/dashboard",
  },
  {
    name: "Make Payment",
    icon: <Briefcase size={18} />,
    path: "/company/make-payment",
  },
  {
    name: "Orders",
    icon: <Star size={18} />,
    path: "/company/orders",
  },
  {
    name: "Jobs",
    icon: <Settings size={18} />,
    path: "/company/jobs/all-jobs",
  },
  {
    name: "Candidate Applications",
    icon: <Briefcase size={18} />,
    path: "/company/candidate-applications",
  },
  {
    name: "Edit Profile",
    icon: <FileText size={18} />,
    path: "/company/edit-profile",
  },
  {
    name: "Edit Password",
    icon: <Lock size={18} />,
    path: "/company/edit-password",
  },
];

export default function CompanyLayout({
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
