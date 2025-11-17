// app/dashboard/UserDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

// Import types
import { DashboardSection, Topic, Meeting, ContentItem } from "./types";

// Import components
import UserSidebar from "./Sidebar";
import UserHeader from "./Header";
import OverviewSection from "./sections/OverviewSection";

export default function UserDashboard() {
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">Topics Section</h3>
                <p className="text-gray-500">Topics management coming soon...</p>
              </div>
            )}

            {activeSection === "currencies" && (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Currencies Section</h3>
                <p className="text-gray-500">Currency management coming soon...</p>
              </div>
            )}

            {activeSection === "meetings" && (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Meetings Section</h3>
                <p className="text-gray-500">Meeting management coming soon...</p>
              </div>
            )}

            {activeSection === "content" && (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Content Feed</h3>
                <p className="text-gray-500">Content feed coming soon...</p>
              </div>
            )}

            {activeSection === "settings" && (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Settings</h3>
                <p className="text-gray-500">Settings page coming soon...</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}