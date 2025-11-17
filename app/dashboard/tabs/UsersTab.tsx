// components/admin/tabs/UsersTab.tsx
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Download, Filter, Users } from 'lucide-react';
import { UserData } from "../AdminDashboard/types";
import { useI18n } from "@/components/i18n/i18n";

interface UsersTabProps {
  users: UserData[];
}

export default function UsersTab({ users }: UsersTabProps) {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#12261f]">{t('admin_user_management_title')}</h2>
          <p className="text-[#4a5a55] mt-1">{t('admin_user_management_desc')}</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none border-[#12261f] text-[#12261f] hover:bg-[#12261f] hover:text-white">
            <Download className="w-4 h-4 mr-2" />
            {t('admin_export')}
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-none border-[#bd6908] text-[#bd6908] hover:bg-[#bd6908] hover:text-white">
            <Filter className="w-4 h-4 mr-2" />
            {t('admin_filter')}
          </Button>
        </div>
      </div>

      <Card className="p-6 border border-[#dce5e1]">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4a5a55] w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('admin_search_placeholder')}
              className="w-full pl-10 pr-4 py-2 border border-[#dce5e1] rounded-lg focus:ring-2 focus:ring-[#bd6908] focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#dce5e1]">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#4a5a55]">{t('admin_th_user')}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#4a5a55]">{t('admin_th_company')}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#4a5a55]">{t('admin_th_topics')}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#4a5a55]">{t('admin_th_currencies')}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#4a5a55]">{t('admin_th_joined')}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#4a5a55]">{t('admin_th_last_active')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <Users className="w-12 h-12 text-[#dce5e1] mx-auto mb-3" />
                    <p className="text-[#4a5a55]">
                      {searchQuery ? t('admin_no_users_found') : t('admin_no_users_yet')}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-[#f0f3f2] hover:bg-[#f5f7f6]">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-[#bd6908] to-[#d97b0a] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {user.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-[#12261f]">{user.full_name}</div>
                          <div className="text-sm text-[#4a5a55]">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[#12261f]">{user.company}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#bd6908] text-white">
                        {user.topics_count} {t('admin_topics_label')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#dce5e1] text-[#12261f]">
                        {user.currencies_count} {t('admin_currencies_label')}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[#4a5a55] text-sm">
                      {new Date(user.created_at).toISOString().slice(0,10)}
                    </td>
                    <td className="py-4 px-4 text-[#4a5a55] text-sm">
                      {new Date(user.last_sign_in).toISOString().slice(0,10)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}