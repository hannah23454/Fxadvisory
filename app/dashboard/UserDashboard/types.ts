// app/dashboard/types.ts
import type { User } from "@supabase/supabase-js";

export interface Topic {
  id: string;
  name: string;
  category: string;
  is_active: boolean;
  subscribers: number;
  created_at: string;
  display_order?: number;
}

export interface Meeting {
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
  approved_at?: string;
  rejected_at?: string;
  user?: {
    email: string;
    user_metadata: {
      full_name?: string;
    };
  };
}

export interface PerformanceMetrics {
  total_users: number;
  active_users: number;
  new_users_this_week: number;
  newsletter_subscribers: number;
  active_topics: number;
  api_response_time: number;
  uptime_percent: number;
  database_size: number;
}

export interface UserData {
  id: string;
  email: string;
  full_name: string;
  company: string;
  topics_count: number;
  currencies_count: number;
  created_at: string;
  last_sign_in: string;
}

export interface Newsletter {
  name: string;
  status: 'Scheduled' | 'Sent' | 'Draft';
  date: string;
  recipients: number;
  openRate: number | null;
}

export type TabType = "overview" | "topics" | "users" | "meetings" | "newsletters" | "performance";