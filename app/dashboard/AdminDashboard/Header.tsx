// components/admin/Header.tsx
"use client";

import { Menu } from 'lucide-react';
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { TabType } from "./types";

interface HeaderProps {
  activeTab: TabType;
  adminName?: string;
  adminId?: string;
  onMenuClick: () => void;
}

const tabTitles: Record<TabType, { title: string; subtitle: string }> = {
  overview: {
    title: "Dashboard Overview",
    subtitle: "Welcome back"
  },
  meetings: {
    title: "Meeting Management",
    subtitle: "Review and manage user meeting requests"
  },
  topics: {
    title: "Topic Management",
    subtitle: "Manage topics that users can subscribe to"
  },
  users: {
    title: "User Management",
    subtitle: "View and manage registered users"
  },
  newsletters: {
    title: "Newsletter Management",
    subtitle: "Manage personalized newsletter campaigns"
  },
  performance: {
    title: "Performance Metrics",
    subtitle: "Monitor system performance and analytics"
  }
};

export default function Header({ activeTab, adminName, adminId, onMenuClick }: HeaderProps) {
  const { title, subtitle } = tabTitles[activeTab];
  const firstName = adminName?.split(" ")[0] || "Admin";

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {title}
              </h1>
              <p className="text-sm text-gray-500 hidden sm:block">
                {subtitle}, {firstName}
              </p>
            </div>
          </div>
          <NotificationDropdown userId={adminId} />
        </div>
      </div>
    </header>
  );
}