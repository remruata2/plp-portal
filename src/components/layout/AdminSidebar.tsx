"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@/generated/prisma";
import { useState } from "react";

interface AdminSidebarProps {
  setSidebarOpen?: (open: boolean) => void;
}

export default function AdminSidebar({ setSidebarOpen }: AdminSidebarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    indicators:
      pathname.startsWith("/admin/indicators") ||
      pathname.startsWith("/admin/fields"),
    reports: pathname.startsWith("/admin/reports"),
  });

  const baseLinkClasses =
    "flex items-center px-3 py-2 text-sm font-medium rounded-md";
  const activeLinkClasses = "bg-gray-200 text-gray-900";
  const inactiveLinkClasses =
    "text-gray-700 hover:bg-gray-100 hover:text-gray-900";
  const subLinkClasses =
    "flex items-center px-6 py-2 text-sm font-medium rounded-md";
  const subActiveLinkClasses = "bg-gray-100 text-gray-900";
  const subInactiveLinkClasses =
    "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="mt-6 mb-2">
      <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
    </div>
  );

  return (
    // This is the actual sidebar panel content
    <div className="flex flex-col h-full w-full bg-white shadow-xl overflow-y-auto">
      {/* User info */}
      <div className="flex-shrink-0 flex items-center px-4 py-4 border-b border-gray-200">
        <div className="flex-shrink-0 group block">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {session?.user.username?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {session?.user.username || "User"}
              </p>
              <p className="text-xs font-medium text-gray-500">
                {session?.user.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {/* Main Dashboard */}
        <Link
          href="/admin"
          onClick={() => setSidebarOpen && setSidebarOpen(false)}
          className={`${baseLinkClasses} ${
            pathname === "/admin" ? activeLinkClasses : inactiveLinkClasses
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
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Dashboard
        </Link>

        {/* Data Management Section */}
        <SectionHeader title="Data Management" />

        <Link
          href="/admin/health-data"
          onClick={() => setSidebarOpen && setSidebarOpen(false)}
          className={`${baseLinkClasses} ${
            pathname.startsWith("/admin/health-data")
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
          href="/admin/field-mappings"
          onClick={() => setSidebarOpen && setSidebarOpen(false)}
          className={`${baseLinkClasses} ${
            pathname.startsWith("/admin/field-mappings")
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
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          Field Mappings
        </Link>

        {/* Reports Section with Submenu */}
        <div>
          <button
            onClick={() => toggleSection("reports")}
            className={`${baseLinkClasses} w-full justify-between ${
              pathname.startsWith("/admin/reports")
                ? activeLinkClasses
                : inactiveLinkClasses
            }`}
          >
            <div className="flex items-center">
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
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Reports
            </div>
            {expandedSections.reports ? (
              <svg
                className="h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>

          {expandedSections.reports && (
            <div className="mt-1 space-y-1">
              <Link
                href="/admin/reports"
                onClick={() => setSidebarOpen && setSidebarOpen(false)}
                className={`${subLinkClasses} ${
                  pathname === "/admin/reports"
                    ? subActiveLinkClasses
                    : subInactiveLinkClasses
                }`}
              >
                <svg
                  className="mr-3 h-4 w-4 text-gray-500"
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
                PLP Submissions Report
              </Link>
              <Link
                href="/admin/reports/facilities"
                onClick={() => setSidebarOpen && setSidebarOpen(false)}
                className={`${subLinkClasses} ${
                  pathname === "/admin/reports/facilities"
                    ? subActiveLinkClasses
                    : subInactiveLinkClasses
                }`}
              >
                <svg
                  className="mr-3 h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Facilities List
              </Link>
              <Link
                href="/admin/reports/field-mappings"
                onClick={() => setSidebarOpen && setSidebarOpen(false)}
                className={`${subLinkClasses} ${
                  pathname === "/admin/reports/field-mappings"
                    ? subActiveLinkClasses
                    : subInactiveLinkClasses
                }`}
              >
                <svg
                  className="mr-3 h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                Field Mappings
              </Link>
              <Link
                href="/admin/reports/users"
                onClick={() => setSidebarOpen && setSidebarOpen(false)}
                className={`${subLinkClasses} ${
                  pathname === "/admin/reports/users"
                    ? subActiveLinkClasses
                    : subInactiveLinkClasses
                }`}
              >
                <svg
                  className="mr-3 h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                Users List
              </Link>
            </div>
          )}
        </div>

        {session?.user.role === UserRole.admin && (
          <>
            {/* System Configuration Section */}
            <SectionHeader title="System Configuration" />

            <Link
              href="/admin/districts"
              onClick={() => setSidebarOpen && setSidebarOpen(false)}
              className={`${baseLinkClasses} ${
                pathname.startsWith("/admin/districts")
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Districts
            </Link>

            <Link
              href="/admin/facility-types"
              onClick={() => setSidebarOpen && setSidebarOpen(false)}
              className={`${baseLinkClasses} ${
                pathname.startsWith("/admin/facility-types")
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Facility Types
            </Link>

            <Link
              href="/admin/facilities"
              onClick={() => setSidebarOpen && setSidebarOpen(false)}
              className={`${baseLinkClasses} ${
                pathname.startsWith("/admin/facilities")
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Facilities
            </Link>

            <Link
              href="/admin/settings"
              onClick={() => setSidebarOpen && setSidebarOpen(false)}
              className={`${baseLinkClasses} ${
                pathname.startsWith("/admin/settings")
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              System Settings
            </Link>

            {/* User Management Section */}
            <SectionHeader title="User Management" />

            <Link
              href="/admin/users"
              onClick={() => setSidebarOpen && setSidebarOpen(false)}
              className={`${baseLinkClasses} ${
                pathname.startsWith("/admin/users")
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              User Management
            </Link>

            <Link
              href="/admin/health-workers"
              onClick={() => setSidebarOpen && setSidebarOpen(false)}
              className={`${baseLinkClasses} ${
                pathname.startsWith("/admin/health-workers")
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Health Workers
            </Link>

            {/* Performance & Analytics Section */}
            <SectionHeader title="Performance & Analytics" />

            {/* Indicators Section with Submenu */}
            <div>
              <button
                onClick={() => toggleSection("indicators")}
                className={`${baseLinkClasses} w-full justify-between ${
                  pathname.startsWith("/admin/indicators") ||
                  pathname.startsWith("/admin/fields")
                    ? activeLinkClasses
                    : inactiveLinkClasses
                }`}
              >
                <div className="flex items-center">
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
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  Indicators & Formulas
                </div>
                {expandedSections.indicators ? (
                  <svg
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </button>

              {expandedSections.indicators && (
                <div className="mt-1 space-y-1">
                  <Link
                    href="/admin/indicators"
                    onClick={() => setSidebarOpen && setSidebarOpen(false)}
                    className={`${subLinkClasses} ${
                      pathname === "/admin/indicators"
                        ? subActiveLinkClasses
                        : subInactiveLinkClasses
                    }`}
                  >
                    <svg
                      className="mr-3 h-4 w-4 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    Indicators
                  </Link>
                  <Link
                    href="/admin/fields"
                    onClick={() => setSidebarOpen && setSidebarOpen(false)}
                    className={`${subLinkClasses} ${
                      pathname === "/admin/fields"
                        ? subActiveLinkClasses
                        : subInactiveLinkClasses
                    }`}
                  >
                    <svg
                      className="mr-3 h-4 w-4 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                    Manage Fields
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/admin/targets"
              onClick={() => setSidebarOpen && setSidebarOpen(false)}
              className={`${baseLinkClasses} ${
                pathname.startsWith("/admin/targets")
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
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14l1 1V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2h-4z"
                />
              </svg>
              Target Management
            </Link>

            {/* Financial Management Section */}
            <SectionHeader title="Financial Management" />

            <Link
              href="/admin/incentives"
              onClick={() => setSidebarOpen && setSidebarOpen(false)}
              className={`${baseLinkClasses} ${
                pathname.startsWith("/admin/incentives")
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Incentives
            </Link>
          </>
        )}
      </nav>

      {/* Sign Out Button */}
      <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg
            className="mr-2 h-5 w-5"
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
        </button>
      </div>
    </div>
  );
}
