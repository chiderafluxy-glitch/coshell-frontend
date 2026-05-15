import { supabase } from './supabase';

const API_BASE = import.meta.env.VITE_API_URL as string || 'http://localhost:4000';

async function authHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
  };
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'API error');
  }
  return res.json();
}

// ── Stripe / Billing ──────────────────────────────────────────
export const billing = {
  createCheckoutSession: (planId: 'basic' | 'pro' | 'elite') =>
    apiFetch('/api/billing/checkout', { method: 'POST', body: JSON.stringify({ planId }) }),

  createPortalSession: () =>
    apiFetch('/api/billing/portal', { method: 'POST' }),

  getSubscription: () =>
    apiFetch('/api/billing/subscription'),
};

// ── Sessions ──────────────────────────────────────────────────
export const sessions = {
  list: () => apiFetch('/api/sessions'),

  create: (data: { name?: string; expiry?: string; accessMode?: string; peekMode?: boolean }) =>
    apiFetch('/api/sessions', { method: 'POST', body: JSON.stringify(data) }),

  kill: (id: string) =>
    apiFetch(`/api/sessions/${id}/kill`, { method: 'POST' }),

  delete: (id: string) =>
    apiFetch(`/api/sessions/${id}`, { method: 'DELETE' }),

  getShareLink: (shareToken: string) =>
    `${API_BASE}/s/${shareToken}`,
};

// ── Recordings ────────────────────────────────────────────────
export const recordings = {
  list: () => apiFetch('/api/recordings'),

  delete: (id: string) =>
    apiFetch(`/api/recordings/${id}`, { method: 'DELETE' }),

  saveToGist: (id: string) =>
    apiFetch(`/api/recordings/${id}/gist`, { method: 'POST' }),
};

// ── Snippets ──────────────────────────────────────────────────
export const snippets = {
  list: () => apiFetch('/api/snippets'),

  create: (data: { name: string; command: string; tag?: string }) =>
    apiFetch('/api/snippets', { method: 'POST', body: JSON.stringify(data) }),

  delete: (id: string) =>
    apiFetch(`/api/snippets/${id}`, { method: 'DELETE' }),
};

// ── Notifications ─────────────────────────────────────────────
export const notifications = {
  getSettings: () => apiFetch('/api/notifications/settings'),

  updateSettings: (data: { browserPush?: boolean; emailUpdates?: boolean; slackWebhookUrl?: string }) =>
    apiFetch('/api/notifications/settings', { method: 'PATCH', body: JSON.stringify(data) }),

  testSlack: () =>
    apiFetch('/api/notifications/test/slack', { method: 'POST' }),
};

// ── Team ──────────────────────────────────────────────────────
export const team = {
  list: () => apiFetch('/api/team'),

  invite: (email: string, role: string) =>
    apiFetch('/api/team/invite', { method: 'POST', body: JSON.stringify({ email, role }) }),

  remove: (memberId: string) =>
    apiFetch(`/api/team/${memberId}`, { method: 'DELETE' }),
};

// ── Profile ───────────────────────────────────────────────────
export const profile = {
  update: (data: { fullName?: string; email?: string }) =>
    apiFetch('/api/profile', { method: 'PATCH', body: JSON.stringify(data) }),

  regenerateToken: () =>
    apiFetch('/api/profile/agent-token', { method: 'POST' }),

  deleteAccount: () =>
    apiFetch('/api/profile', { method: 'DELETE' }),
};

// ── Agent ─────────────────────────────────────────────────────
export const agent = {
  // Called by onboarding — polls until agent connects
  pollConnection: () => apiFetch('/api/agent/status'),
};
