// components/admin/Sidebar.tsx
"use client";

import { User } from "@supabase/supabase-js";
import { TabType } from "./types";
import { BarChart3, Video, Target, Users, Mail, LogOut } from 'lucide-react';
import { useI18n } from "@/components/i18n/i18n";

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  setSidebarOpen: (open: boolean) => void;
  admin: User | null;
  pendingMeetingsCount: number;
  onSignOut: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  setSidebarOpen,
  admin,
  pendingMeetingsCount,
  onSignOut
}: SidebarProps) {
  const { t } = useI18n();
  const navItems = [
    { id: "overview" as TabType, label: t('admin_nav_overview'), icon: BarChart3 },
    { id: "meetings" as TabType, label: t('admin_nav_meetings'), icon: Video, badge: pendingMeetingsCount },
    { id: "topics" as TabType, label: t('admin_nav_topics'), icon: Target },
    { id: "users" as TabType, label: t('admin_nav_users'), icon: Users },
    { id: "newsletters" as TabType, label: t('admin_nav_newsletters'), icon: Mail },
  ];

  return (
    <div className="flex flex-col h-full bg-[#12261f] text-white border-r border-[#1a3a2f]">
      <div className="p-6 border-b border-[#1a3a2f]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#bd6908] rounded-lg flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold">{t('admin_panel')}</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { 
                setActiveTab(item.id); 
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
              {item.badge && item.badge > 0 && (
                <span className="ml-auto bg-[#bd6908] text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#1a3a2f]">
        <div className="flex items-center gap-3 mb-3 p-2 rounded-lg">
          <div className="w-10 h-10 bg-[#bd6908] rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {admin?.user_metadata?.full_name?.charAt(0) || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {admin?.user_metadata?.full_name || t('admin_badge_admin')}
            </div>
            <div className="text-xs bg-[#bd6908] text-white px-2 py-0.5 rounded inline-block mt-0.5">
              {t('admin_badge_admin')}
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