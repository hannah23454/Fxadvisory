// components/admin/tabs/MeetingsTab.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Check, XCircle } from 'lucide-react';
import { Meeting } from "../AdminDashboard/types";
import { useI18n } from "@/components/i18n/i18n";

interface MeetingsTabProps {
  meetings: Meeting[];
  onApproveMeeting: (meeting: Meeting) => void;
  onRejectMeeting: (meeting: Meeting) => void;
}

export default function MeetingsTab({
  meetings,
  onApproveMeeting,
  onRejectMeeting
}: MeetingsTabProps) {
  const { t } = useI18n();

  if (meetings.length === 0) {
    return (
      <Card className="p-12 text-center border border-[#dce5e1]">
        <Video className="w-16 h-16 text-[#dce5e1] mx-auto mb-4" />
        <h3 className="text-xl font-bold text-[#12261f] mb-2">{t('admin_no_meeting_requests_title')}</h3>
        <p className="text-[#4a5a55]">{t('admin_no_meeting_requests_desc')}</p>
      </Card>
    );
  }

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
      <div className="grid grid-cols-1 gap-4">
        {meetings.map((meeting) => (
          <Card key={meeting.id} className="p-6 border border-[#dce5e1]">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <h3 className="text-lg font-bold text-[#12261f]">{meeting.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    meeting.status === 'approved' ? 'bg-green-100 text-green-700' :
                    meeting.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-[#dce5e1] text-[#12261f]'
                  }`}>
                    {statusText(meeting.status)}
                  </span>
                </div>

                <p className="text-[#4a5a55] mb-4">{meeting.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-[#4a5a55] block mb-1">{t('admin_label_user')}</span>
                    <p className="font-medium text-[#12261f]">
                      {meeting.user?.user_metadata?.full_name}
                    </p>
                    <p className="text-xs text-[#4a5a55]">{meeting.user?.email}</p>
                  </div>
                  <div>
                    <span className="text-[#4a5a55] block mb-1">{t('admin_label_date')}</span>
                    <p className="font-medium text-[#12261f]">
                      {meeting.meeting_date ? new Date(meeting.meeting_date).toISOString().slice(0,10) : '—'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#4a5a55] block mb-1">{t('admin_label_time')}</span>
                    <p className="font-medium text-[#12261f]">{meeting.meeting_time}</p>
                  </div>
                  <div>
                    <span className="text-[#4a5a55] block mb-1">{t('admin_label_duration')}</span>
                    <p className="font-medium text-[#12261f]">{meeting.duration} {t('admin_minutes')}</p>
                  </div>
                </div>

                {meeting.status === 'approved' && meeting.loom_link && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-[#4a5a55] mb-1">{t('admin_loom_link')}</p>
                    <a 
                      href={meeting.loom_link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-green-700 hover:underline break-all"
                    >
                      {meeting.loom_link}
                    </a>
                  </div>
                )}

                {meeting.status === 'rejected' && meeting.rejected_reason && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-[#4a5a55] mb-1">{t('admin_rejection_reason')}</p>
                    <p className="text-sm text-red-700">{meeting.rejected_reason}</p>
                  </div>
                )}
              </div>

              {meeting.status === 'pending' && (
                <div className="flex gap-2 w-full lg:w-auto">
                  <Button
                    onClick={() => onApproveMeeting(meeting)}
                    className="flex-1 lg:flex-none bg-[#bd6908] hover:bg-[#a35a07] text-white"
                    size="sm"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    {t('admin_approve')}
                  </Button>
                  <Button
                    onClick={() => onRejectMeeting(meeting)}
                    variant="outline"
                    className="flex-1 lg:flex-none text-red-600 border-red-600 hover:bg-red-50"
                    size="sm"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    {t('admin_reject')}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}