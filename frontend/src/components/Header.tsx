"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/job-listing", label: "Find Jobs" },
  { href: "/company-listing", label: "Companies" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const Header = () => {
  const pathname = usePathname() ?? "";
  const [navOpen, setNavOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const logoSrc = "/uploads/logo.png";

  const toggleNav = () => setNavOpen((prev) => !prev);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href === "/blog") {
      return pathname === "/blog" || pathname.startsWith("/post/");
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="site-header relative z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-extrabold text-slate-900"
        >
          {!logoError ? (
            <img
              src={logoSrc}
              alt="Job Hunt"
              className="h-10 w-auto"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="text-2xl font-extrabold tracking-tight">
              Job<span className="text-emerald-600">Hunt</span>
            </span>
          )}
        </Link>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50 md:hidden"
          aria-expanded={navOpen}
          aria-label="Toggle navigation"
          onClick={toggleNav}
        >
          <span className="sr-only">Toggle menu</span>
          <span className="block h-0.5 w-6 bg-slate-700"></span>
          <span className="mt-1 block h-0.5 w-6 bg-slate-700"></span>
          <span className="mt-1 block h-0.5 w-6 bg-slate-700"></span>
        </button>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition ${
                isActive(href)
                  ? "text-emerald-600"
                  : "text-slate-700 hover:text-emerald-600"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div
        className={`${navOpen ? "block" : "hidden"} border-t border-slate-200 bg-white md:hidden`}
      >
        <div className="space-y-1 px-4 py-4">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setNavOpen(false)}
              className={`block rounded-md px-3 py-2 text-base font-medium transition ${
                isActive(href)
                  ? "bg-slate-100 text-emerald-600"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
