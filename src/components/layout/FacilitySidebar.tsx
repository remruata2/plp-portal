"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

interface FacilitySidebarProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

export default function FacilitySidebar({
  sidebarOpen,
  setSidebarOpen,
}: FacilitySidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const baseLinkClasses =
    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors";
  const activeLinkClasses = "bg-gray-100 text-gray-900";
  const inactiveLinkClasses =
    "text-gray-600 hover:text-gray-900 hover:bg-gray-50";

  return (
    <div className="flex flex-col h-full min-h-screen flex-1 min-h-0 h-screen overflow-hidden bg-white border-r border-gray-200">
      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {session?.user?.username?.charAt(0).toUpperCase() || "F"}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {session?.user?.username || "Facility User"}
            </p>
            <p className="text-xs text-gray-500">Facility Staff</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <Link
          href="/facility/dashboard"
          onClick={() => setSidebarOpen && setSidebarOpen(false)}
          className={`${baseLinkClasses} ${
            pathname.startsWith("/facility/dashboard")
              ? activeLinkClasses
              : inactiveLinkClasses
          }`}
        >
          <svg
            className="mr-3 h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
            />
          </svg>
          Dashboard
        </Link>

        <Link
          href="/facility/health-data"
          onClick={() => setSidebarOpen && setSidebarOpen(false)}
          className={`${baseLinkClasses} ${
            pathname.startsWith("/facility/health-data")
              ? activeLinkClasses
              : inactiveLinkClasses
          }`}
        >
          <svg
            className="mr-3 h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          PLP Submissions
        </Link>

        <Link
          href="/facility/workers"
          onClick={() => setSidebarOpen && setSidebarOpen(false)}
          className={`${baseLinkClasses} ${
            pathname.startsWith("/facility/workers")
              ? activeLinkClasses
              : inactiveLinkClasses
          }`}
        >
          <svg
            className="mr-3 h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
          Facility Employees
        </Link>

        <Link
          href="/facility/reports"
          onClick={() => setSidebarOpen && setSidebarOpen(false)}
          className={`${baseLinkClasses} ${
            pathname.startsWith("/facility/reports")
              ? activeLinkClasses
              : inactiveLinkClasses
          }`}
        >
          <svg
            className="mr-3 h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V9a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-2a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2z"
            />
          </svg>
          Performance Reports
        </Link>

        <Link
          href="/facility/profile"
          onClick={() => setSidebarOpen && setSidebarOpen(false)}
          className={`${baseLinkClasses} ${
            pathname.startsWith("/facility/profile")
              ? activeLinkClasses
              : inactiveLinkClasses
          }`}
        >
          <svg
            className="mr-3 h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Profile
        </Link>
      </nav>

      {/* Sign Out Button */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          onClick={() => signOut()}
          className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        >
          <svg
            className="mr-3 h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Sign out
        </Button>
      </div>
    </div>
  );
}
