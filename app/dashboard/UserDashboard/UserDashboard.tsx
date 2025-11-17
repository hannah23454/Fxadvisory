// app/dashboard/UserDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User } from "@supabase/supabase-js";
import { useI18n } from "@/components/i18n/i18n";

// Import types
import { DashboardSection, Topic, Meeting, ContentItem } from "./types";

// Import components
import UserSidebar from "./Sidebar";
import UserHeader from "./Header";
import OverviewSection from "./sections/OverviewSection";
import MeetingRequest from "./components/MeetingRequest";

export default function UserDashboard() {
  const { t } = useI18n();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<DashboardSection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data states
  const [userTopics, setUserTopics] = useState<string[]>([]);
  const [userCurrencies, setUserCurrencies] = useState<string[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [recentContent, setRecentContent] = useState<ContentItem[]>([]);

  useEffect(() => {
    fetchUserData();
    fetchMeetings();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.log("No user found");
        setLoading(false);
        return;
      }

      setUser(user);

      // Fetch user's topics
      const { data: topicsData } = await supabase
        .from('user_topics')
        .select('topic_id')
        .eq('user_id', user.id);

      if (topicsData) {
        setUserTopics(topicsData.map(t => t.topic_id));
      }

      // Fetch user's currencies
      const { data: currenciesData } = await supabase
        .from('user_currencies')
        .select('currency_code')
        .eq('user_id', user.id);

      if (currenciesData) {
        setUserCurrencies(currenciesData.map(c => c.currency_code));
      }

      // Fetch user's meetings
      const { data: meetingsData } = await supabase
        .from('meetings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (meetingsData) {
        setMeetings(meetingsData as Meeting[]);
      }

      // Mock recent content (replace with actual content fetch)
      setRecentContent([
        {
          id: '1',
          title: 'USD/EUR Market Update',
          description: 'Latest trends and forecasts for the EUR/USD pair',
          topic_id: 'market-analysis',
          currency_code: 'USD',
          published_at: new Date().toISOString(),
          content_type: 'analysis'
        },
        {
          id: '2',
          title: 'New Hedging Strategies for Q4',
          description: 'Explore effective hedging techniques for the upcoming quarter',
          topic_id: 'hedging',
          published_at: new Date().toISOString(),
          content_type: 'article'
        }
      ]);

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeetings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/meetings', { credentials: 'include', headers });
      const data = await res.json();
      if (res.ok) {
        setMeetings(data.meetings || []);
      }
    } catch (e) {
      console.error('Failed to load meetings', e);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bd6908] mx-auto"></div>
          <p className="mt-4 text-[#4a5a55]">{t('admin_loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#12261f] border-r border-[#1a3a2f] transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <UserSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          setSidebarOpen={setSidebarOpen}
          user={user}
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
        <UserHeader
          activeSection={activeSection}
          userName={user?.user_metadata?.full_name}
          userId={user?.id}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-auto">
          <div className="px-4 sm:px-6 py-6">
            {activeSection === "overview" && (
              <OverviewSection
                topicsCount={userTopics.length}
                currenciesCount={userCurrencies.length}
                meetings={meetings}
                recentContent={recentContent}
                onNavigate={setActiveSection}
              />
            )}

            {activeSection === "topics" && (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('user_topics_title')}</h3>
                <p className="text-gray-500">Topics management coming soon...</p>
              </div>
            )}

            {activeSection === "currencies" && (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('user_currencies_title')}</h3>
                <p className="text-gray-500">Currency management coming soon...</p>
              </div>
            )}

            {activeSection === "meetings" && (
              <div className="py-6 space-y-6">
                <h3 className="text-xl font-bold text-gray-900">{t('user_meetings_title')}</h3>
                <MeetingRequest
                  userId={user?.id}
                  onCreated={(m) => setMeetings((prev) => [m, ...prev])}
                />
                <div className="mt-4">
                  {meetings.length === 0 ? (
                    <p className="text-gray-500">{t('user_no_meetings_yet')}</p>
                  ) : (
                    <ul className="space-y-2">
                      {meetings.map((m) => (
                        <li key={m.id} className="p-3 border rounded bg-white">
                          <div className="font-medium">{m.title}</div>
                          <div className="text-sm text-gray-600">{m.description}</div>
                          {m.preferred_time && (
                            <div className="text-xs text-gray-500">{t('user_meeting_preferred_time_label')} {new Date(m.preferred_time).toISOString().replace('T',' ').slice(0,16)}</div>
                          )}
                          <div className="text-xs">Status: {statusText(m.status)}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {activeSection === "content" && (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('user_content_title')}</h3>
                <p className="text-gray-500">Content feed coming soon...</p>
              </div>
            )}

            {activeSection === "settings" && (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('user_settings_title')}</h3>
                <p className="text-gray-500">Settings page coming soon...</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}