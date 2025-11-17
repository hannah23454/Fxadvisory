// app/dashboard/Header.tsx
"use client";

import { Menu } from 'lucide-react';
import { DashboardSection } from "./types";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { useI18n } from "@/components/i18n/i18n";

interface HeaderProps {
  activeSection: DashboardSection;
  userName?: string;
  userId?: string;
  onMenuClick: () => void;
}

export default function UserHeader({ activeSection, userName, userId, onMenuClick }: HeaderProps) {
  const { t } = useI18n();

  const title = t(
    activeSection === 'overview' ? 'user_overview_title' :
    activeSection === 'topics' ? 'user_topics_title' :
    activeSection === 'currencies' ? 'user_currencies_title' :
    activeSection === 'meetings' ? 'user_meetings_title' :
    activeSection === 'content' ? 'user_content_title' :
    'user_settings_title'
  );
  const subtitle = t(
    activeSection === 'overview' ? 'user_overview_sub' :
    activeSection === 'topics' ? 'user_topics_sub' :
    activeSection === 'currencies' ? 'user_currencies_sub' :
    activeSection === 'meetings' ? 'user_meetings_sub' :
    activeSection === 'content' ? 'user_content_sub' :
    'user_settings_sub'
  );

  return (
    <header className="bg-[#12261f] border-b border-[#1a3a2f] text-white sticky top-0 z-30">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden text-[#dce5e1] hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                {title}
              </h1>
              <p className="text-sm text-[#dce5e1] hidden sm:block">
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