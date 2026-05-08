"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/stores/useUserStore";
import {
  LayoutDashboard,
  Settings,
  FileText,
  Briefcase,
  Building2,
  Users,
  MessageSquare,
  HelpCircle,
  Box,
  Menu,
  X,
  LogOut,
  User,
  ChevronRight,
  Bell,
  Search,
  ExternalLink,
  Activity,
} from "lucide-react";

interface SubMenuItem {
  name: string;
  path: string;
}

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  path: string;
  section: string;
  submenu?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={16} />,
    path: "/admin/dashboard",
    section: "Main",
  },
  {
    name: "Settings",
    icon: <Settings size={16} />,
    path: "/admin/settings",
    section: "Main",
  },
  {
    name: "Page Settings",
    icon: <FileText size={16} />,
    path: "/admin/page-settings",
    section: "Content",
    submenu: [
      { name: "Banners", path: "/admin/page-settings/banners" },
      { name: "Advertisements", path: "/admin/page-settings/advertisements" },
    ],
  },
  {
    name: "Job Section",
    icon: <Briefcase size={16} />,
    path: "/admin/jobs",
    section: "Content",
    submenu: [
      { name: "All Jobs", path: "/admin/jobs/list" },
      { name: "Job Categories", path: "/admin/jobs/categories" },
      { name: "Job Attributes", path: "/admin/jobs/attributes" },
    ],
  },
  {
    name: "Company Section",
    icon: <Building2 size={16} />,
    path: "/admin/companies",
    section: "Content",
    submenu: [
      { name: "All Companies", path: "/admin/companies/list" },
      { name: "Company Sizes", path: "/admin/companies/sizes" },
      { name: "Company Industries", path: "/admin/companies/industries" },
    ],
  },
  {
    name: "Subscribers",
    icon: <Users size={16} />,
    path: "/admin/subscribers",
    section: "Content",
  },
  {
    name: "Company Profile",
    icon: <Building2 size={16} />,
    path: "/admin/company-profile",
    section: "Profiles",
  },
  {
    name: "Candidate Profile",
    icon: <User size={16} />,
    path: "/admin/candidate-profile",
    section: "Profiles",
  },
  {
    name: "Testimonials",
    icon: <MessageSquare size={16} />,
    path: "/admin/testimonials",
    section: "Content",
  },
  {
    name: "Posts",
    icon: <FileText size={16} />,
    path: "/admin/posts",
    section: "Content",
  },
  {
    name: "FAQ",
    icon: <HelpCircle size={16} />,
    path: "/admin/faqs",
    section: "Content",
  },
  {
    name: "Package",
    icon: <Box size={16} />,
    path: "/admin/packages",
    section: "Content",
  },
];

// Group menu items by section
const groupedMenu = menuItems.reduce(
  (acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  },
  {} as Record<string, MenuItem[]>,
);

const sectionOrder = ["Main", "Content", "Profiles"];

// Get initials from name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Get page title from pathname
function getPageTitle(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean).pop() || "dashboard";
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useUserStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
    router.push("/admin/login");
  };

  const toggleSubmenu = (path: string) => {
    setExpandedMenu(expandedMenu === path ? null : path);
  };

  const userName = user?.name || "Admin";
  const initials = getInitials(userName);
  const pageTitle = getPageTitle(pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f2ef]">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-56" : "w-0"
        } flex-shrink-0 bg-[#1a1a2e] flex flex-col overflow-hidden transition-all duration-300`}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/[0.08]">
          <div className="text-white font-semibold text-[15px] tracking-tight">
            JobHunt
          </div>
          <div className="text-white/30 text-[10px] font-mono mt-0.5 tracking-widest">
            ADMIN PANEL
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 scrollbar-none">
          {sectionOrder.map((section) => {
            const items = groupedMenu[section];
            if (!items) return null;
            return (
              <div key={section}>
                <div className="px-5 pt-4 pb-1.5 text-[10px] font-semibold text-white/25 tracking-[0.08em] uppercase">
                  {section}
                </div>
                {items.map((item) => {
                  const isActive =
                    pathname === item.path ||
                    pathname.startsWith(item.path + "/");
                  const hasSubmenu = item.submenu && item.submenu.length > 0;
                  const isExpanded = expandedMenu === item.path;

                  return (
                    <div key={item.path}>
                      <div
                        onClick={() => {
                          if (hasSubmenu) {
                            toggleSubmenu(item.path);
                          } else {
                            router.push(item.path);
                          }
                        }}
                        className={`relative flex items-center justify-between px-5 py-2 cursor-pointer transition-all duration-150 ${
                          isActive
                            ? "text-white bg-white/[0.08]"
                            : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1 bottom-1 w-[3px] bg-[#6399ca] rounded-r-full" />
                        )}
                        <div className="flex items-center gap-2.5">
                          <span className="flex-shrink-0">{item.icon}</span>
                          <span className="text-[13px] font-medium whitespace-nowrap">
                            {item.name}
                          </span>
                        </div>
                        {hasSubmenu && (
                          <ChevronRight
                            size={14}
                            className={`transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                          />
                        )}
                      </div>

                      {/* Submenu */}
                      {hasSubmenu && isExpanded && (
                        <div className="bg-black/10">
                          {item.submenu!.map((subitem) => {
                            const isSubActive = pathname === subitem.path;
                            return (
                              <Link
                                key={subitem.path}
                                href={subitem.path}
                                className={`flex items-center gap-2.5 pl-11 pr-5 py-2 text-[12px] transition-all ${
                                  isSubActive
                                    ? "text-[#85b7eb] font-medium"
                                    : "text-white/35 hover:text-white/60"
                                }`}
                              >
                                <span className="w-1 h-1 rounded-full bg-current flex-shrink-0" />
                                {subitem.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* User block */}
        <div className="px-4 py-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#6399ca]/40 flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-semibold text-white">
                {initials}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-white text-[13px] font-medium truncate">
                {userName}
              </div>
              <div className="text-white/35 text-[11px]">Administrator</div>
            </div>
            <button
              onClick={handleLogout}
              className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0"
              title="Logout"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-[#e5e2db] h-14 px-6 flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="text-[13px] text-gray-400">
            Admin /{" "}
            <span className="text-[#1a1a2e] font-medium">{pageTitle}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Search */}
            <button className="w-[34px] h-[34px] rounded-lg border border-[#e5e2db] bg-[#f9f8f6] flex items-center justify-center text-gray-400 hover:bg-[#f0ede8] transition-colors">
              <Search size={15} />
            </button>

            {/* Notifications */}
            <button className="relative w-[34px] h-[34px] rounded-lg border border-[#e5e2db] bg-[#f9f8f6] flex items-center justify-center text-gray-400 hover:bg-[#f0ede8] transition-colors">
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
            </button>

            {/* Status indicator */}
            <div className="flex items-center gap-1.5 px-3 h-[34px] rounded-lg border border-[#e5e2db] bg-[#f9f8f6] text-[12px] text-gray-500">
              <Activity size={13} className="text-green-500" />
              <span>All systems up</span>
            </div>

            {/* Front End button */}
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 h-[34px] bg-[#1a1a2e] text-white rounded-lg text-[12px] font-medium hover:bg-[#2a2a4e] transition-colors"
            >
              <ExternalLink size={13} />
              Front End
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return <AdminShell>{children}</AdminShell>;
}
