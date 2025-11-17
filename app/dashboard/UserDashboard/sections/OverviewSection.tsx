// app/dashboard/sections/OverviewSection.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, DollarSign, Video, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { DashboardSection, Meeting, ContentItem } from "../types";
import { useI18n } from "@/components/i18n/i18n";

interface OverviewSectionProps {
  topicsCount: number;
  currenciesCount: number;
  meetings: Meeting[];
  recentContent: ContentItem[];
  onNavigate: (section: DashboardSection) => void;
}

export default function OverviewSection({
  topicsCount,
  currenciesCount,
  meetings,
  recentContent,
  onNavigate
}: OverviewSectionProps) {
  const { t } = useI18n();
  const pendingMeetings = meetings.filter(m => m.status === 'pending').length;
  const approvedMeetings = meetings.filter(m => m.status === 'approved').length;

  const statusText = (status: string) => {
    switch (status) {
      case 'approved':
        return t('status_approved');
      case 'rejected':
        return t('status_rejected');
      default:
        return t('status_pending');
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 border border-[#dce5e1]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#dce5e1] rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-[#12261f]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#12261f]">{topicsCount}</div>
              <div className="text-sm text-[#4a5a55]">{t('user_active_topics')}</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-[#dce5e1]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#dce5e1] rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#12261f]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#12261f]">{currenciesCount}</div>
              <div className="text-sm text-[#4a5a55]">{t('user_currencies')}</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-[#dce5e1]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#dce5e1] rounded-lg flex items-center justify-center">
              <Video className="w-6 h-6 text-[#bd6908]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#12261f]">{approvedMeetings}</div>
              <div className="text-sm text-[#4a5a55]">{t('user_meetings_scheduled')}</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-[#dce5e1]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#dce5e1] rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#12261f]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#12261f]">{recentContent.length}</div>
              <div className="text-sm text-[#4a5a55]">{t('user_new_updates')}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 border border-[#dce5e1]">
        <h3 className="text-lg font-bold text-[#12261f] mb-4">{t('user_quick_actions')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            onClick={() => onNavigate("topics")}
            variant="outline"
            className="justify-start h-auto py-4 border-[#12261f] text-[#12261f] hover:bg-[#12261f] hover:text-white"
          >
            <div className="flex flex-col items-start gap-1 w-full">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span className="font-semibold">{t('user_manage_topics')}</span>
              </div>
              <span className="text-xs text-[#4a5a55]">{t('user_add_or_remove_interests')}</span>
            </div>
          </Button>

          <Button
            onClick={() => onNavigate("currencies")}
            variant="outline"
            className="justify-start h-auto py-4 border-[#12261f] text-[#12261f] hover:bg-[#12261f] hover:text-white"
          >
            <div className="flex flex-col items-start gap-1 w-full">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span className="font-semibold">{t('user_add_currencies')}</span>
              </div>
              <span className="text-xs text-[#4a5a55]">{t('user_track_currency_pairs')}</span>
            </div>
          </Button>

          <Button
            onClick={() => onNavigate("meetings")}
            className="justify-start h-auto py-4 bg-[#bd6908] hover:bg-[#a35a07] text-white"
          >
            <div className="flex flex-col items-start gap-1 w-full">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                <span className="font-semibold">{t('user_request_meeting')}</span>
              </div>
              <span className="text-xs text-white/90">{t('user_schedule_with_team')}</span>
            </div>
          </Button>
        </div>
      </Card>

      {/* Recent Content */}
      <Card className="p-6 border border-[#dce5e1]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#12261f]">{t('user_recent_updates')}</h3>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-[#12261f] hover:bg-[#f5f7f6]"
            onClick={() => onNavigate("content")}
          >
            {t('view_all')}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="space-y-3">
          {recentContent.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#4a5a55]">{t('user_no_recent_updates')}</p>
              <p className="text-sm text-[#4a5a55] mt-1">{t('user_add_topics_hint')}</p>
            </div>
          ) : (
            recentContent.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-3 bg-[#f5f7f6] rounded-lg hover:bg-[#eef3f1] transition-colors cursor-pointer">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-[#12261f] mb-1">{item.title}</h4>
                  <p className="text-xs text-[#4a5a55] line-clamp-2">{item.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-[#4a5a55] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.published_at ? new Date(item.published_at).toISOString().slice(0,10) : '—'}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-[#dce5e1] text-[#12261f] rounded-full capitalize">
                      {item.content_type}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Meeting Status */}
      {meetings.length > 0 && (
        <Card className="p-6 border border-[#dce5e1]">
          <h3 className="text-lg font-bold text-[#12261f] mb-4">{t('user_meeting_status')}</h3>
          <div className="space-y-3">
            {meetings.slice(0, 3).map((meeting) => (
              <div key={meeting.id} className="flex items-center justify-between p-3 bg-[#f5f7f6] rounded-lg">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-[#12261f]">{meeting.title}</h4>
                  <p className="text-xs text-[#4a5a55]">
                    {meeting.meeting_date ? new Date(meeting.meeting_date).toISOString().slice(0,10) : '—'} at {meeting.meeting_time || '—'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  meeting.status === 'approved' ? 'bg-green-100 text-green-700' :
                  meeting.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-[#dce5e1] text-[#12261f]'
                }`}>
                  {statusText(meeting.status)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}