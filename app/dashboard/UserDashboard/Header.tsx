// app/dashboard/Header.tsx
"use client";

import { Menu, Bell } from 'lucide-react';
import { DashboardSection } from "./types";
import { NotificationDropdown } from "@/components/NotificationDropdown";

interface HeaderProps {
  activeSection: DashboardSection;
  userName?: string;
  userId?: string;
  onMenuClick: () => void;
}

const sectionTitles: Record<DashboardSection, { title: string; subtitle: string }> = {
  overview: {
    title: "Dashboard Overview",
    subtitle: "Your personalized FX insights"
  },
  topics: {
    title: "My Topics",
    subtitle: "Manage your areas of interest"
  },
  currencies: {
    title: "Currency Pairs",
    subtitle: "Track your selected currencies"
  },
  meetings: {
    title: "Meeting Requests",
    subtitle: "Schedule meetings with our team"
  },
  content: {
    title: "Content Feed",
    subtitle: "Personalized FX insights and updates"
  },
  settings: {
    title: "Settings",
    subtitle: "Manage your account preferences"
  }
};

export default function UserHeader({ activeSection, userName, userId, onMenuClick }: HeaderProps) {
  const { title, subtitle } = sectionTitles[activeSection];

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
                {subtitle}
              </p>
            </div>
          </div>
          <NotificationDropdown userId={userId} />
        </div>
      </div>
    </header>
  );
}