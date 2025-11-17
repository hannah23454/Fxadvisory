// components/admin/Header.tsx
"use client";

import { Menu } from 'lucide-react';
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { TabType } from "./types";
import { useI18n } from "@/components/i18n/i18n";

interface HeaderProps {
  activeTab: TabType;
  adminName?: string;
  adminId?: string;
  onMenuClick: () => void;
}

export default function Header({ activeTab, adminName, adminId, onMenuClick }: HeaderProps) {
  const { locale, setLocale, t } = useI18n();

  const title = t(
    activeTab === 'overview' ? 'admin_overview_title' :
    activeTab === 'meetings' ? 'admin_meetings_title' :
    activeTab === 'topics' ? 'admin_topics_title' :
    activeTab === 'users' ? 'admin_users_title' :
    activeTab === 'newsletters' ? 'admin_newsletters_title' : 'admin_overview_title'
  );
  const subtitle = t(
    activeTab === 'overview' ? 'admin_overview_sub' :
    activeTab === 'meetings' ? 'admin_meetings_sub' :
    activeTab === 'topics' ? 'admin_topics_sub' :
    activeTab === 'users' ? 'admin_users_sub' :
    activeTab === 'newsletters' ? 'admin_newsletters_sub' : 'admin_overview_sub'
  );

  const firstName = adminName?.split(" ")[0] || t('admin_badge_admin');

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
                {subtitle}, {firstName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as any)}
              className="text-sm rounded px-2 py-1 border bg-transparent text-white border-[#dce5e1]"
            >
              <option value="en" className="text-black">English</option>
              <option value="zh" className="text-black">中文</option>
            </select>
            <NotificationDropdown userId={adminId} />
          </div>
        </div>
      </div>
    </header>
  );
}