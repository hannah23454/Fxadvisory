// app/dashboard/sections/OverviewSection.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, DollarSign, Video, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { DashboardSection, Meeting, ContentItem } from "../types";

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
  const pendingMeetings = meetings.filter(m => m.status === 'pending').length;
  const approvedMeetings = meetings.filter(m => m.status === 'approved').length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{topicsCount}</div>
              <div className="text-sm text-gray-600">Active Topics</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{currenciesCount}</div>
              <div className="text-sm text-gray-600">Currencies</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Video className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{approvedMeetings}</div>
              <div className="text-sm text-gray-600">Meetings Scheduled</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{recentContent.length}</div>
              <div className="text-sm text-gray-600">New Updates</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            onClick={() => onNavigate("topics")}
            variant="outline"
            className="justify-start h-auto py-4"
          >
            <div className="flex flex-col items-start gap-1 w-full">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span className="font-semibold">Manage Topics</span>
              </div>
              <span className="text-xs text-gray-500">Add or remove interests</span>
            </div>
          </Button>

          <Button
            onClick={() => onNavigate("currencies")}
            variant="outline"
            className="justify-start h-auto py-4"
          >
            <div className="flex flex-col items-start gap-1 w-full">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span className="font-semibold">Add Currencies</span>
              </div>
              <span className="text-xs text-gray-500">Track currency pairs</span>
            </div>
          </Button>

          <Button
            onClick={() => onNavigate("meetings")}
            variant="outline"
            className="justify-start h-auto py-4"
          >
            <div className="flex flex-col items-start gap-1 w-full">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                <span className="font-semibold">Request Meeting</span>
              </div>
              <span className="text-xs text-gray-500">Schedule with our team</span>
            </div>
          </Button>
        </div>
      </Card>

      {/* Recent Content */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Recent Updates</h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate("content")}
          >
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="space-y-3">
          {recentContent.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No recent updates</p>
              <p className="text-sm text-gray-400 mt-1">Add topics to see personalized content</p>
            </div>
          ) : (
            recentContent.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.published_at).toLocaleDateString()}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full capitalize">
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
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Meeting Status</h3>
          <div className="space-y-3">
            {meetings.slice(0, 3).map((meeting) => (
              <div key={meeting.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900">{meeting.title}</h4>
                  <p className="text-xs text-gray-600">
                    {new Date(meeting.meeting_date).toLocaleDateString()} at {meeting.meeting_time}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  meeting.status === 'approved' ? 'bg-green-100 text-green-700' :
                  meeting.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {meeting.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}