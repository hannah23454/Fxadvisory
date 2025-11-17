"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { notifyAllUsers } from "@/lib/adminNotifications";
import { 
  Users, TrendingUp, Mail, Settings, Plus, Edit, Trash2, Eye, EyeOff, 
  Search, Download, Filter, BarChart3, DollarSign, Target, Activity, 
  Calendar, ChevronDown, ChevronUp, LogOut, Menu, X, MoreVertical, 
  Clock, ArrowUp, FileText, Video, MessageSquare, Globe, Zap, Check, XCircle 
} from 'lucide-react';

interface Topic {
  id: string;
  name: string;
  category: string;
  is_active: boolean;
  subscribers: number;
  created_at: string;
}

interface Meeting {
  id: string;
  user_id: string;
  title: string;
  description: string;
  meeting_date: string;
  meeting_time: string;
  duration: number;
  status: 'pending' | 'approved' | 'rejected';
  loom_link?: string;
  admin_notes?: string;
  rejected_reason?: string;
  created_at: string;
  user?: {
    email: string;
    user_metadata: {
      full_name?: string;
    };
  };
}

interface PerformanceMetrics {
  total_users: number;
  active_users: number;
  new_users_this_week: number;
  newsletter_subscribers: number;
  active_topics: number;
  api_response_time: number;
  uptime_percent: number;
  database_size: number;
}

interface PerformanceHistory {
  date: string;
  users: number;
  active: number;
  uptime: number;
}

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "topics" | "users" | "meetings" | "newsletters" | "performance"
  >("overview");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [loomLink, setLoomLink] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  
  const [newTopic, setNewTopic] = useState({
    name: "",
    category: "hedging",
    is_active: true,
  });
  const [loading, setLoading] = useState(true);

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    total_users: 1247,
    active_users: 892,
    new_users_this_week: 34,
    newsletter_subscribers: 1108,
    active_topics: 6,
    api_response_time: 145,
    uptime_percent: 99.98,
    database_size: 256.5,
  });

  const [performanceHistory, setPerformanceHistory] = useState<PerformanceHistory[]>([
    { date: "Nov 10", users: 1200, active: 850, uptime: 99.95 },
    { date: "Nov 11", users: 1220, active: 868, uptime: 99.98 },
    { date: "Nov 12", users: 1235, active: 880, uptime: 99.97 },
    { date: "Nov 13", users: 1240, active: 885, uptime: 99.99 },
    { date: "Nov 14", users: 1245, active: 890, uptime: 99.98 },
    { date: "Nov 15", users: 1247, active: 892, uptime: 99.98 },
  ]);

  useEffect(() => {
    fetchAdminData();
    fetchMeetings();
  }, []);

  const fetchAdminData = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.log("No admin user found");
        setLoading(false);
        return;
      }

      setAdmin(user);

      const { data: topicsData } = await supabase
        .from('topics')
        .select('*')
        .order('display_order');

      if (topicsData) {
        const topicsWithCounts = await Promise.all(
          topicsData.map(async (topic: any) => {
            const { count } = await supabase
              .from('user_topics')
              .select('*', { count: 'exact', head: true })
              .eq('topic_id', topic.id);

            return {
              ...topic,
              subscribers: count || 0,
            };
          })
        );
        setTopics(topicsWithCounts as Topic[]);
      }

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeetings = async () => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select(`
          *,
          user:user_id (
            email,
            raw_user_meta_data
          )
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const formattedMeetings = data.map((meeting: any) => ({
          ...meeting,
          user: {
            email: meeting.user?.email || 'Unknown',
            user_metadata: {
              full_name: meeting.user?.raw_user_meta_data?.full_name || 'Unknown User'
            }
          }
        }));
        setMeetings(formattedMeetings as Meeting[]);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  const handleApproveMeeting = async () => {
    if (!selectedMeeting || !loomLink.trim()) {
      alert("Please enter a Loom meeting link");
      return;
    }

    try {
      const { error } = await supabase
        .from('meetings')
        .update({
          status: 'approved',
          loom_link: loomLink,
          approved_at: new Date().toISOString()
        })
        .eq('id', selectedMeeting.id);

      if (!error) {
        alert('Meeting approved! User will be notified automatically.');
        setShowMeetingModal(false);
        setSelectedMeeting(null);
        setLoomLink("");
        fetchMeetings();
      } else {
        alert('Error approving meeting');
      }
    } catch (error) {
      console.error('Error approving meeting:', error);
      alert('Error approving meeting');
    }
  };

  const handleRejectMeeting = async () => {
    if (!selectedMeeting) return;

    try {
      const { error } = await supabase
        .from('meetings')
        .update({
          status: 'rejected',
          rejected_reason: rejectionReason || 'Not available at this time',
          rejected_at: new Date().toISOString()
        })
        .eq('id', selectedMeeting.id);

      if (!error) {
        alert('Meeting rejected. User will be notified automatically.');
        setShowMeetingModal(false);
        setSelectedMeeting(null);
        setRejectionReason("");
        fetchMeetings();
      } else {
        alert('Error rejecting meeting');
      }
    } catch (error) {
      console.error('Error rejecting meeting:', error);
      alert('Error rejecting meeting');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleAddTopic = async () => {
    if (!newTopic.name.trim()) return;

    try {
      const { error } = await supabase
        .from('topics')
        .insert({
          name: newTopic.name,
          category: newTopic.category,
          is_active: newTopic.is_active,
        });

      if (!error) {
        setNewTopic({ name: "", category: "hedging", is_active: true });
        setShowAddTopic(false);
        fetchAdminData();
      }
    } catch (error) {
      console.error('Error adding topic:', error);
    }
  };

  const handleDeleteTopic = async (id: string) => {
    if (!confirm("Are you sure you want to delete this topic?")) return;

    try {
      const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', id);

      if (!error) {
        fetchAdminData();
      }
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('topics')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (!error) {
        fetchAdminData();
      }
    } catch (error) {
      console.error('Error toggling topic:', error);
    }
  };

  const sendAnnouncement = async () => {
    const result = await notifyAllUsers(
      'New Market Analysis Available 📊',
      'Check out our latest FX market analysis and forecasts.',
      'announcement',
      '/market-commentary'
    );

    if (result.success) {
      alert(`Notification sent to ${result.count} users!`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
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
            <button
              onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "overview" ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Overview
            </button>

            <button
              onClick={() => { setActiveTab("meetings"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "meetings" ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Video className="w-5 h-5" />
              Meetings
              {meetings.filter(m => m.status === 'pending').length > 0 && (
                <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {meetings.filter(m => m.status === 'pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab("topics"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "topics" ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Target className="w-5 h-5" />
              Topics
            </button>

            <button
              onClick={() => { setActiveTab("users"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "users" ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Users className="w-5 h-5" />
              Users
            </button>

            <button
              onClick={() => { setActiveTab("newsletters"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "newsletters" ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Mail className="w-5 h-5" />
              Newsletters
            </button>
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
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors mt-1"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-gray-600 hover:text-gray-900"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {activeTab === "overview" && "Dashboard Overview"}
                    {activeTab === "meetings" && "Meeting Management"}
                    {activeTab === "topics" && "Topic Management"}
                    {activeTab === "users" && "User Management"}
                    {activeTab === "newsletters" && "Newsletter Management"}
                  </h1>
                  <p className="text-sm text-gray-500 hidden sm:block">
                    Welcome back, {admin?.user_metadata?.full_name?.split(" ")[0] || "Admin"}
                  </p>
                </div>
              </div>
              <NotificationDropdown userId={admin?.id} />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="px-4 sm:px-6 py-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="p-6">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Total Users</h3>
                    <div className="text-3xl font-bold text-gray-900">{performanceMetrics.total_users}</div>
                    <p className="text-xs text-gray-500 mt-1">{performanceMetrics.new_users_this_week} new this week</p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Meetings</h3>
                    <div className="text-3xl font-bold text-orange-600">{meetings.filter(m => m.status === 'pending').length}</div>
                    <p className="text-xs text-gray-500 mt-1">Require your attention</p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Active Topics</h3>
                    <div className="text-3xl font-bold text-gray-900">{topics.filter(t => t.is_active).length}</div>
                    <p className="text-xs text-gray-500 mt-1">Available to users</p>
                  </Card>
                </div>

                <Card className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button
                      onClick={() => setActiveTab("meetings")}
                      className="justify-start bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Review Meetings
                    </Button>
                    <Button
                      onClick={sendAnnouncement}
                      variant="outline"
                      className="justify-start"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Announcement
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "meetings" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Meeting Requests</h2>
                    <p className="text-gray-500 mt-1">Review and manage user meeting requests</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {meetings.length === 0 ? (
                    <Card className="p-12 text-center">
                      <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Meeting Requests</h3>
                      <p className="text-gray-500">No users have requested meetings yet</p>
                    </Card>
                  ) : (
                    meetings.map((meeting) => (
                      <Card key={meeting.id} className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">{meeting.title}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                meeting.status === 'approved' ? 'bg-green-100 text-green-700' :
                                meeting.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {meeting.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{meeting.description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">User:</span>
                                <p className="font-medium text-gray-900">{meeting.user?.user_metadata?.full_name}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Date:</span>
                                <p className="font-medium text-gray-900">{new Date(meeting.meeting_date).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Time:</span>
                                <p className="font-medium text-gray-900">{meeting.meeting_time}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Duration:</span>
                                <p className="font-medium text-gray-900">{meeting.duration} min</p>
                              </div>
                            </div>
                          </div>
                          {meeting.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                onClick={() => {
                                  setSelectedMeeting(meeting);
                                  setShowMeetingModal(true);
                                }}
                                className="bg-green-500 hover:bg-green-600 text-white"
                                size="sm"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                onClick={() => {
                                  setSelectedMeeting(meeting);
                                  setShowMeetingModal(true);
                                }}
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                size="sm"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "topics" && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Topics</h3>
                  <Button onClick={() => setShowAddTopic(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Topic
                  </Button>
                </div>
                <div className="text-center py-8">
                  <p className="text-gray-600">Topics management coming soon</p>
                </div>
              </Card>
            )}

            {(activeTab === "users" || activeTab === "newsletters") && (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {activeTab === "users" ? <Users className="w-8 h-8 text-orange-500" /> : <Mail className="w-8 h-8 text-orange-500" />}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Coming Soon</h3>
                <p className="text-gray-500">This section is under development</p>
              </Card>
            )}
          </div>
        </main>
      </div>

      {showMeetingModal && selectedMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedMeeting.status === 'pending' ? 'Review Meeting Request' : 'Meeting Details'}
                </h2>
                <button
                  onClick={() => {
                    setShowMeetingModal(false);
                    setSelectedMeeting(null);
                    setLoomLink("");
                    setRejectionReason("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loom Meeting Link (for approval)
                  </label>
                  <input
                    type="url"
                    value={loomLink}
                    onChange={(e) => setLoomLink(e.target.value)}
                    placeholder="https://loom.com/share/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason (optional)
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter reason for rejection..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleApproveMeeting}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve Meeting
                  </Button>
                  <Button
                    onClick={handleRejectMeeting}
                    variant="outline"
                    className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Meeting
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}