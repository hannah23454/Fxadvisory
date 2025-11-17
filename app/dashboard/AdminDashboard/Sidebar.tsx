// components/admin/Sidebar.tsx
"use client";

import { User } from "@supabase/supabase-js";
import { TabType } from "./types";
import { 
  BarChart3, Video, Target, Users, Mail, LogOut 
} from 'lucide-react';

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
  const navItems = [
    { id: "overview" as TabType, label: "Overview", icon: BarChart3 },
    { id: "meetings" as TabType, label: "Meetings", icon: Video, badge: pendingMeetingsCount },
    { id: "topics" as TabType, label: "Topics", icon: Target },
    { id: "users" as TabType, label: "Users", icon: Users },
    { id: "newsletters" as TabType, label: "Newsletters", icon: Mail },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Admin Panel</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => { 
                setActiveTab(item.id); 
                setSidebarOpen(false); 
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id 
                  ? "bg-orange-50 text-orange-600" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
              {item.badge && item.badge > 0 && (
                <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
          <div className="w-10 h-10 bg-gradient from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {admin?.user_metadata?.full_name?.charAt(0) || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {admin?.user_metadata?.full_name || "Admin"}
            </div>
            <div className="text-xs text-white bg-orange-500 px-2 py-0.5 rounded inline-block mt-0.5">
              ADMIN
            </div>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors mt-1"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </div>
  );
}