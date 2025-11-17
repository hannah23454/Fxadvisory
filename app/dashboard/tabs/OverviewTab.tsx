// components/admin/tabs/OverviewTab.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, MessageSquare, Plus } from 'lucide-react';
import { Meeting, PerformanceMetrics, Topic, TabType } from "../types";

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
  const pendingCount = meetings.filter(m => m.status === 'pending').length;
  const activeTopicsCount = topics.filter(t => t.is_active).length;

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Users</h3>
          <div className="text-3xl font-bold text-gray-900">{metrics.total_users}</div>
          <p className="text-xs text-gray-500 mt-1">
            <span className="text-green-600 font-medium">+{metrics.new_users_this_week}</span> new this week
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Meetings</h3>
          <div className="text-3xl font-bold text-orange-600">{pendingCount}</div>
          <p className="text-xs text-gray-500 mt-1">Require your attention</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Active Topics</h3>
          <div className="text-3xl font-bold text-gray-900">{activeTopicsCount}</div>
          <p className="text-xs text-gray-500 mt-1">of {topics.length} total topics</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <Button
            onClick={() => onNavigate("meetings")}
            className="justify-start bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Video className="w-4 h-4 mr-2" />
            Review Meetings
            {pendingCount > 0 && (
              <span className="ml-auto bg-white text-orange-600 text-xs px-2 py-0.5 rounded-full font-semibold">
                {pendingCount}
              </span>
            )}
          </Button>

          <Button
            onClick={onSendAnnouncement}
            variant="outline"
            className="justify-start"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Send Announcement
          </Button>

          <Button
            onClick={() => onNavigate("topics")}
            variant="outline"
            className="justify-start"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Topic
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {meetings.slice(0, 5).map((meeting) => (
            <div key={meeting.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                meeting.status === 'approved' ? 'bg-green-500' :
                meeting.status === 'rejected' ? 'bg-red-500' :
                'bg-yellow-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{meeting.title}</p>
                <p className="text-xs text-gray-600">{meeting.user?.user_metadata?.full_name}</p>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(meeting.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}