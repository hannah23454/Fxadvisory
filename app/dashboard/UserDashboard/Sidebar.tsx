// app/dashboard/Sidebar.tsx
"use client";

import { User } from "@supabase/supabase-js";
import { DashboardSection } from "./types";
import { 
  LayoutDashboard, Target, DollarSign, Video, FileText, Settings, LogOut 
} from 'lucide-react';

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
  const navItems = [
    { id: "overview" as DashboardSection, label: "Overview", icon: LayoutDashboard },
    { id: "topics" as DashboardSection, label: "My Topics", icon: Target },
    { id: "currencies" as DashboardSection, label: "Currencies", icon: DollarSign },
    { id: "meetings" as DashboardSection, label: "Meetings", icon: Video },
    { id: "content" as DashboardSection, label: "Content Feed", icon: FileText },
    { id: "settings" as DashboardSection, label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">FX Dashboard</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => { 
                setActiveSection(item.id); 
                setSidebarOpen(false); 
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeSection === item.id 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
          <div className="w-10 h-10 bg-gradient from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {user?.user_metadata?.full_name || "User"}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {user?.email}
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