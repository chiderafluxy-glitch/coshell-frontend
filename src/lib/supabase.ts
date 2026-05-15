import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  plan: 'trial' | 'basic' | 'pro' | 'elite' | 'paused';
  trial_ends_at: string;
  stripe_customer_id: string | null;
  subscription_status: string;
  agent_token: string;
  agent_connected_at: string | null;
  agent_version: string | null;
  agent_os: string | null;
  agent_hostname: string | null;
  created_at: string;
};

export type Session = {
  id: string;
  user_id: string;
  name: string | null;
  status: 'active' | 'idle' | 'expired' | 'killed';
  access_mode: 'read_only' | 'read_write';
  share_token: string;
  expires_at: string | null;
  peek_mode: boolean;
  viewer_count: number;
  host_os: string | null;
  vt_session_id: string | null;
  created_at: string;
};

export type Recording = {
  id: string;
  user_id: string;
  session_id: string | null;
  name: string | null;
  duration_seconds: number | null;
  file_size_bytes: number | null;
  storage_path: string;
  expires_at: string | null;
  gist_url: string | null;
  replay_token: string;
  created_at: string;
};

export type Snippet = {
  id: string;
  user_id: string;
  name: string;
  command: string;
  tag: string | null;
  created_at: string;
};

export type NotificationSettings = {
  id: string;
  user_id: string;
  browser_push: boolean;
  email_updates: boolean;
  slack_webhook_url: string | null;
};

export type TeamMember = {
  id: string;
  owner_id: string;
  member_id: string;
  role: 'admin' | 'contributor' | 'viewer';
  invited_email: string | null;
  status: 'pending' | 'active';
  created_at: string;
};
