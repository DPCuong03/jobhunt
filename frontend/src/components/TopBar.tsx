"use client";

import Link from "next/link";
import { useUserStore } from "@/stores/useUserStore";
import { useEffect, useState, useRef } from "react";

export default function TopBar() {
  const { user, checkAuth } = useUserStore();
  const [mounted, setMounted] = useState(false);
  const hasCheckedAuth = useRef(false);

  const getDashboardHref = () => {
    if (!user) return "/login";

    switch (user.role) {
      case "admin":
        return "/admin/dashboard";
      case "company":
        return "/company/dashboard";
      case "candidate":
        return "/candidate/dashboard";
      default:
        return "/dashboard";
    }
  };

  // Check auth only once on mount
  useEffect(() => {
    setMounted(true);
    if (!hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      checkAuth();
    }
  }, []); // Empty dependency array - only run once on mount

  // Prevent the server from rendering the wrong state
  if (!mounted) return null;

  return (
    <div className="top">
      <div className="container">
        <div className="row">
          <div className="col-md-6 left-side">
            <ul>
              <li className="phone-text">+123 456 7890</li>
              <li className="email-text">info@jobhunt.com</li>
            </ul>
          </div>
          <div className="col-md-6 right-side">
            <ul className="right">
              {/* Only render if user is strictly NULL */}
              {!user ? (
                <>
                  <li className="menu">
                    <Link href="/login">
                      <i className="fas fa-sign-in-alt"></i> Login
                    </Link>
                  </li>
                  <li className="menu">
                    <Link href={"/signup"}>
                      <i className="fas fa-user"></i> Sign Up
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="menu">
                    <Link href={getDashboardHref()}>
                      <i className="fas fa-sign-in-alt"></i> Dashboard
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
