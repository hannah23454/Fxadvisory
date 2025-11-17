// components/admin/tabs/MeetingsTab.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Check, XCircle } from 'lucide-react';
import { Meeting } from "../types";

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
  if (meetings.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Meeting Requests</h3>
        <p className="text-gray-500">No users have requested meetings yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {meetings.map((meeting) => (
          <Card key={meeting.id} className="p-6">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <h3 className="text-lg font-bold text-gray-900">{meeting.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    meeting.status === 'approved' ? 'bg-green-100 text-green-700' :
                    meeting.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {meeting.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{meeting.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block mb-1">User:</span>
                    <p className="font-medium text-gray-900">
                      {meeting.user?.user_metadata?.full_name}
                    </p>
                    <p className="text-xs text-gray-500">{meeting.user?.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Date:</span>
                    <p className="font-medium text-gray-900">
                      {new Date(meeting.meeting_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Time:</span>
                    <p className="font-medium text-gray-900">{meeting.meeting_time}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Duration:</span>
                    <p className="font-medium text-gray-900">{meeting.duration} minutes</p>
                  </div>
                </div>

                {meeting.status === 'approved' && meeting.loom_link && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Loom Link:</p>
                    <a 
                      href={meeting.loom_link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-green-600 hover:underline break-all"
                    >
                      {meeting.loom_link}
                    </a>
                  </div>
                )}

                {meeting.status === 'rejected' && meeting.rejected_reason && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Rejection Reason:</p>
                    <p className="text-sm text-red-700">{meeting.rejected_reason}</p>
                  </div>
                )}
              </div>

              {meeting.status === 'pending' && (
                <div className="flex gap-2 w-full lg:w-auto">
                  <Button
                    onClick={() => onApproveMeeting(meeting)}
                    className="flex-1 lg:flex-none bg-green-500 hover:bg-green-600 text-white"
                    size="sm"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => onRejectMeeting(meeting)}
                    variant="outline"
                    className="flex-1 lg:flex-none text-red-600 border-red-600 hover:bg-red-50"
                    size="sm"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
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