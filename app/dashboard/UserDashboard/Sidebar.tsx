// app/dashboard/Sidebar.tsx
"use client";

import { User } from "@supabase/supabase-js";
import { DashboardSection } from "./types";
import { 
  LayoutDashboard, Target, DollarSign, Video, FileText, Settings, LogOut 
} from 'lucide-react';
import { useI18n } from "@/components/i18n/i18n";

interface SidebarProps {
  activeSection: DashboardSection;
  setActiveSection: (section: DashboardSection) => void;
  setSidebarOpen: (open: boolean) => void;
  user: User | null;
  onSignOut: () => void;
}

export default function UserSidebar({
  activeSection,
  setActiveSection,
  setSidebarOpen,
  user,
  onSignOut
}: SidebarProps) {
  const { t } = useI18n();
  const navItems = [
    { id: "overview" as DashboardSection, label: t('user_nav_overview'), icon: LayoutDashboard },
    { id: "topics" as DashboardSection, label: t('user_nav_topics'), icon: Target },
    { id: "currencies" as DashboardSection, label: t('user_nav_currencies'), icon: DollarSign },
    { id: "meetings" as DashboardSection, label: t('user_nav_meetings'), icon: Video },
    { id: "content" as DashboardSection, label: t('user_nav_content'), icon: FileText },
    { id: "settings" as DashboardSection, label: t('user_nav_settings'), icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full bg-[#12261f] text-white border-r border-[#1a3a2f]">
      <div className="p-6 border-b border-[#1a3a2f]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#bd6908] rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold">{t('user_dashboard_title')}</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { 
                setActiveSection(item.id); 
                setSidebarOpen(false); 
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors border ${
                isActive 
                  ? "bg-[#0f201a] border-[#bd6908] text-white" 
                  : "border-transparent text-[#dce5e1] hover:bg-[#0f201a] hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#1a3a2f]">
        <div className="flex items-center gap-3 mb-3 p-2 rounded-lg">
          <div className="w-10 h-10 bg-[#bd6908] rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {user?.user_metadata?.full_name || "User"}
            </div>
            <div className="text-xs text-[#dce5e1] truncate">
              {user?.email}
            </div>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-4 py-2 text-[#dce5e1] hover:bg-[#0f201a] rounded-lg text-sm font-medium transition-colors mt-1"
        >
          <LogOut className="w-4 h-4" />
          {t('logout')}
        </button>
      </div>
    </div>
  );
}