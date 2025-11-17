"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { notifyAllUsers } from "@/lib/adminNotifications";

// Import types
import { Topic, Meeting, PerformanceMetrics, UserData, TabType } from "./types";

// Import components
import Sidebar from "./Sidebar";
import Header from "./Header";
import OverviewTab from "../tabs/OverviewTab";
import MeetingsTab from "../tabs/MeetingsTab";
import TopicsTab from "../tabs/TopicsTab";
import UsersTab from "../tabs/UsersTab";
import NewslettersTab from "../tabs/NewslettersTab";
import { TopicModal, MeetingModal } from "./Modals";

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

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

  useEffect(() => {
    fetchAdminData();
    fetchMeetings();
    fetchUsers();
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
        
        setPerformanceMetrics(prev => ({
          ...prev,
          active_topics: topicsWithCounts.filter((t: Topic) => t.is_active).length
        }));
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
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setMeetings(data as Meeting[]);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const mockUsers: UserData[] = [
        {
          id: '1',
          email: 'john.doe@company.com',
          full_name: 'John Doe',
          company: 'ABC Corp',
          topics_count: 5,
          currencies_count: 3,
          created_at: '2024-11-01',
          last_sign_in: '2024-11-17'
        },
        {
          id: '2',
          email: 'jane.smith@business.com',
          full_name: 'Jane Smith',
          company: 'XYZ Ltd',
          topics_count: 8,
          currencies_count: 5,
          created_at: '2024-11-05',
          last_sign_in: '2024-11-16'
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleSaveTopic = async (data: { name: string; category: string; is_active: boolean }) => {
    try {
      if (editingTopic) {
        const { error } = await supabase
          .from('topics')
          .update(data)
          .eq('id', editingTopic.id);

        if (!error) {
          alert('Topic updated successfully!');
          fetchAdminData();
          setEditingTopic(null);
        } else {
          alert('Error updating topic');
        }
      } else {
        const { error } = await supabase
          .from('topics')
          .insert({
            ...data,
            display_order: topics.length + 1
          });

        if (!error) {
          alert('Topic created successfully!');
          fetchAdminData();
        } else {
          alert('Error creating topic');
        }
      }
    } catch (error) {
      console.error('Error saving topic:', error);
      alert('Error saving topic');
    }
  };

  const handleDeleteTopic = async (id: string) => {
    if (!confirm("Are you sure you want to delete this topic? This action cannot be undone.")) return;

    try {
      const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', id);

      if (!error) {
        fetchAdminData();
        alert('Topic deleted successfully');
      } else {
        alert('Error deleting topic');
      }
    } catch (error) {
      console.error('Error deleting topic:', error);
      alert('Error deleting topic');
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
      } else {
        alert('Error updating topic status');
      }
    } catch (error) {
      console.error('Error toggling topic:', error);
      alert('Error updating topic status');
    }
  };

  const handleApproveMeeting = async (loomLink: string) => {
    if (!selectedMeeting) return;

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
        fetchMeetings();
      } else {
        alert('Error approving meeting');
      }
    } catch (error) {
      console.error('Error approving meeting:', error);
      alert('Error approving meeting');
    }
  };

  const handleRejectMeeting = async (reason: string) => {
    if (!selectedMeeting) return;

    try {
      const { error } = await supabase
        .from('meetings')
        .update({
          status: 'rejected',
          rejected_reason: reason,
          rejected_at: new Date().toISOString()
        })
        .eq('id', selectedMeeting.id);

      if (!error) {
        alert('Meeting rejected. User will be notified automatically.');
        setShowMeetingModal(false);
        setSelectedMeeting(null);
        fetchMeetings();
      } else {
        alert('Error rejecting meeting');
      }
    } catch (error) {
      console.error('Error rejecting meeting:', error);
      alert('Error rejecting meeting');
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
    } else {
      alert('Failed to send announcement');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bd6908] mx-auto"></div>
          <p className="mt-4 text-[#4a5a55]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#12261f] border-r border-[#1a3a2f] transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSidebarOpen={setSidebarOpen}
          admin={admin}
          pendingMeetingsCount={meetings.filter(m => m.status === 'pending').length}
          onSignOut={handleSignOut}
        />
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          adminName={admin?.user_metadata?.full_name}
          adminId={admin?.id}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-auto">
          <div className="px-4 sm:px-6 py-6">
            {activeTab === "overview" && (
              <OverviewTab
                metrics={performanceMetrics}
                meetings={meetings}
                topics={topics}
                onNavigate={setActiveTab}
                onSendAnnouncement={sendAnnouncement}
              />
            )}

            {activeTab === "meetings" && (
              <MeetingsTab
                meetings={meetings}
                onApproveMeeting={(meeting) => {
                  setSelectedMeeting(meeting);
                  setShowMeetingModal(true);
                }}
                onRejectMeeting={(meeting) => {
                  setSelectedMeeting(meeting);
                  setShowMeetingModal(true);
                }}
              />
            )}

            {activeTab === "topics" && (
              <TopicsTab
                topics={topics}
                onAddTopic={() => {
                  setEditingTopic(null);
                  setShowTopicModal(true);
                }}
                onEditTopic={(topic) => {
                  setEditingTopic(topic);
                  setShowTopicModal(true);
                }}
                onDeleteTopic={handleDeleteTopic}
                onToggleActive={handleToggleActive}
              />
            )}

            {activeTab === "users" && <UsersTab users={users} />}

            {activeTab === "newsletters" && (
              <NewslettersTab
                metrics={performanceMetrics}
                onCreateNewsletter={() => alert('Newsletter creation coming soon!')}
              />
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <TopicModal
        isOpen={showTopicModal}
        onClose={() => {
          setShowTopicModal(false);
          setEditingTopic(null);
        }}
        topic={editingTopic}
        onSave={handleSaveTopic}
      />

      <MeetingModal
        isOpen={showMeetingModal}
        onClose={() => {
          setShowMeetingModal(false);
          setSelectedMeeting(null);
        }}
        meeting={selectedMeeting}
        onApprove={handleApproveMeeting}
        onReject={handleRejectMeeting}
      />
    </div>
  );
}