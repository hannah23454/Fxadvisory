// components/admin/tabs/OverviewTab.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, MessageSquare, Plus } from 'lucide-react';
import { PerformanceMetrics, Meeting, Topic, TabType } from "../AdminDashboard/types";
import { useI18n } from "@/components/i18n/i18n";

interface OverviewTabProps {
  metrics: PerformanceMetrics;
  meetings: Meeting[];
  topics: Topic[];
  onNavigate: (tab: TabType) => void;
  onSendAnnouncement: () => void;
}

export default function OverviewTab({
  metrics,
  meetings,
  topics,
  onNavigate,
  onSendAnnouncement
}: OverviewTabProps) {
  const { t } = useI18n();
  const pendingCount = meetings.filter(m => m.status === 'pending').length;
  const activeTopicsCount = topics.filter(t => t.is_active).length;

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6 border border-[#dce5e1]">
          <h3 className="text-sm font-medium text-[#4a5a55] mb-2">{t('admin_metrics_total_users')}</h3>
          <div className="text-3xl font-bold text-[#12261f]">{metrics.total_users}</div>
          <p className="text-xs text-[#4a5a55] mt-1">
            <span className="text-green-600 font-medium">+{metrics.new_users_this_week}</span> {t('admin_metrics_new_this_week')}
          </p>
        </Card>

        <Card className="p-6 border border-[#dce5e1]">
          <h3 className="text-sm font-medium text-[#4a5a55] mb-2">{t('admin_metrics_pending_meetings')}</h3>
          <div className="text-3xl font-bold text-[#bd6908]">{pendingCount}</div>
          <p className="text-xs text-[#4a5a55] mt-1">{t('admin_metrics_require_attention')}</p>
        </Card>

        <Card className="p-6 border border-[#dce5e1]">
          <h3 className="text-sm font-medium text-[#4a5a55] mb-2">{t('admin_metrics_active_topics')}</h3>
          <div className="text-3xl font-bold text-[#12261f]">{activeTopicsCount}</div>
          <p className="text-xs text-[#4a5a55] mt-1">{t('admin_of')} {topics.length} {t('admin_total_topics')}</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 border border-[#dce5e1]">
        <h3 className="text-lg font-bold text-[#12261f] mb-4">{t('admin_quick_actions')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <Button
            onClick={() => onNavigate("meetings")}
            className="justify-start bg-[#bd6908] hover:bg-[#a35a07] text-white"
          >
            <Video className="w-4 h-4 mr-2" />
            {t('admin_review_meetings')}
            {pendingCount > 0 && (
              <span className="ml-auto bg-white text-[#bd6908] text-xs px-2 py-0.5 rounded-full font-semibold">
                {pendingCount}
              </span>
            )}
          </Button>

          <Button
            onClick={onSendAnnouncement}
            variant="outline"
            className="justify-start border-[#bd6908] text-[#bd6908] hover:bg-[#bd6908] hover:text-white"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {t('admin_send_announcement')}
          </Button>

          <Button
            onClick={() => onNavigate("topics")}
            variant="outline"
            className="justify-start border-[#12261f] text-[#12261f] hover:bg-[#12261f] hover:text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('admin_add_new_topic')}
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6 border border-[#dce5e1]">
        <h3 className="text-lg font-bold text-[#12261f] mb-4">{t('admin_recent_activity')}</h3>
        <div className="space-y-3">
          {meetings.slice(0, 5).map((meeting) => (
            <div key={meeting.id} className="flex items-center gap-3 p-3 bg-[#f5f7f6] rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                meeting.status === 'approved' ? 'bg-green-500' :
                meeting.status === 'rejected' ? 'bg-red-500' :
                'bg-yellow-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#12261f] truncate">{meeting.title}</p>
                <p className="text-xs text-[#4a5a55]">{meeting.user?.user_metadata?.full_name}</p>
              </div>
              <span className="text-xs text-[#4a5a55]">
                {new Date(meeting.created_at).toISOString().slice(0,10)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}