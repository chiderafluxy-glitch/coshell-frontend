# CoShell — AI Agent Handoff Document
**Version:** 1.0 | **Date:** May 2026 | **Prepared by:** Claude (Anthropic)

---

## What Is CoShell?

CoShell is a hosted terminal sharing SaaS for developers. Users install a small agent on their machine, generate a shareable link, and collaborators join their live terminal session from a browser — no SSH, no VPN, no setup.

**Workflow:** Landing → Signup → Pay (Stripe) → Onboarding (install agent) → Dashboard

**Stack:**
| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind, deploy to **Vercel** |
| Backend | Node.js + Express + WebSocket, deploy to **Outplane** |
| Database & Auth | **Supabase** (PostgreSQL + RLS) |
| Payments | **Stripe** (subscriptions + webhooks) |
| Recordings storage | **Cloudflare R2** (future) |
| Terminal engine | VibeTunnel fork (future integration) |

---

## What Has Already Been Built

### ✅ Supabase — DONE
- Project created: **`coshell`**
- Project ID: `fchfhdffpywwjehvvtwy`
- URL: `https://fchfhdffpywwjehvvtwy.supabase.co`
- Anon key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjaGZoZGZmcHl3d2plaHZ2dHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NzgzODksImV4cCI6MjA5NDM1NDM4OX0.WUYmCpzMg9Y50J9S83p-R8ysmcU6LBdnqP_rOtMAnZ4`
- Region: `us-east-1`

**Database schema deployed (all tables live):**
- `profiles` — user account, plan, trial, agent token, agent connection status
- `sessions` — terminal sessions with share tokens, expiry, access mode
- `recordings` — asciinema recordings metadata
- `snippets` — saved commands per user
- `notification_settings` — browser push, email, Slack webhook
- `team_members` — invites and roles
- `stripe_events` — webhook idempotency log

**Auth features enabled:** Email/password, GitHub OAuth, Google OAuth, email confirmation

**Auto-triggers:**
- On new user signup → auto-creates `profiles` row + `notification_settings` row
- On profile update → auto-updates `updated_at`
- Row Level Security (RLS) enabled on all tables

### ✅ Stripe — DONE
- Account connected
- Three products and prices already created:
  - Basic: `price_1TWTMNCBOoQTb0NpXBobljDE` ($15/mo)
  - Pro: `price_1TWTMRCBOoQTb0NpDMGtkrwm` ($25/mo)
  - Elite: `price_1TWTMVCBOoQTb0NpQjK4xZy3` ($50/mo)
- **7-day free trial** is applied at checkout session creation (not on the price object — this is intentional and correct)

### ✅ Frontend — DONE
Located in: `/coshell-build/` (root)

All pages and tabs fully wired with real API calls — no more mock data:
- **Landing page** — hero, features, testimonials, pricing preview, footer, all nav links working
- **Signup page** — real Supabase auth (email/password + GitHub + Google OAuth)
- **Login page** — real Supabase auth
- **Plan selection** — calls backend → Stripe Checkout with 7-day trial
- **Onboarding** — shows real agent token, polls backend every 3s for agent connection, unlocks dashboard only when agent actually connects
- **Dashboard** with 7 tabs, all real:
  - Sessions — create/kill/copy-link, live data
  - Recordings — list/delete
  - Snippets — create/copy/delete
  - Notifications — toggle browser push, email, Slack webhook + test
  - Team — invite/remove (Pro/Elite only, shows upgrade prompt on Basic)
  - Billing — shows plan + days left in trial, opens Stripe Customer Portal
  - Settings — edit name, regenerate agent token, sign out

**Key files:**
```
src/
  App.tsx               ← main app (all pages + dashboard tabs)
  hooks/useAuth.tsx     ← AuthProvider + useAuth hook (Supabase)
  lib/supabase.ts       ← Supabase client + TypeScript types
  lib/api.ts            ← all frontend→backend API calls
  components/
    MarketingPages.tsx  ← Features, How It Works, Pricing
    CompanyPages.tsx    ← Changelog, Docs
    LegalPages.tsx      ← Privacy, Terms, Security
```

### ✅ Backend — DONE
Located in: `/coshell-build/backend/`

Express server with all routes built:

| Route | What it does |
|---|---|
| `POST /api/billing/checkout` | Creates Stripe checkout with 7-day trial |
| `POST /api/billing/portal` | Opens Stripe Customer Portal |
| `GET /api/billing/subscription` | Returns user's plan & status |
| `POST /api/billing/webhook` | Handles all Stripe events (idempotent) |
| `GET /api/sessions` | List user's sessions |
| `POST /api/sessions` | Create session |
| `POST /api/sessions/:id/kill` | Kill session |
| `DELETE /api/sessions/:id` | Delete session |
| `GET /api/recordings` | List recordings |
| `DELETE /api/recordings/:id` | Delete recording |
| `GET /api/snippets` | List snippets |
| `POST /api/snippets` | Create snippet |
| `DELETE /api/snippets/:id` | Delete snippet |
| `GET /api/notifications/settings` | Get notification prefs |
| `PATCH /api/notifications/settings` | Update notification prefs |
| `POST /api/notifications/test/slack` | Send Slack test message |
| `GET /api/team` | List team members |
| `POST /api/team/invite` | Invite team member |
| `DELETE /api/team/:id` | Remove team member |
| `PATCH /api/profile` | Update profile name |
| `POST /api/profile/agent-token` | Regenerate agent token |
| `DELETE /api/profile` | Delete account |
| `GET /api/agent/status` | Check if agent connected (polled by onboarding) |
| `POST /api/agent/connect` | Agent phones home with token (no JWT needed) |
| `POST /api/agent/disconnect` | Agent signs off on shutdown |
| `GET /install.sh` | Publicly served install script |
| `GET /health` | Health check |

**Key files:**
```
backend/
  src/
    index.ts              ← Express server entry point
    middleware/auth.ts    ← JWT verification middleware
    lib/supabase.ts       ← Supabase admin client (service role)
    lib/stripe.ts         ← Stripe client + price ID map
    routes/
      billing.ts          ← Stripe checkout, portal, webhooks
      sessions.ts         ← Session CRUD
      agent.ts            ← Agent connect/disconnect/status + install script
      misc.ts             ← Recordings, snippets, notifications, team, profile
  .env.example            ← All required env vars listed
  package.json
  tsconfig.json
```

---

## What Still Needs To Be Done

### Step 1 — Deploy the Backend to Outplane
**Priority: MUST DO FIRST**

1. Create an account at [outplane.run](https://outplane.run)
2. Create a new Node.js service, connect it to the GitHub repo
3. Set the root directory to `backend/`
4. Set start command: `npm start` (or `npm run dev` for testing)
5. Add ALL environment variables from `backend/.env.example`:

```
SUPABASE_URL=https://fchfhdffpywwjehvvtwy.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<get from Supabase dashboard → Settings → API>
STRIPE_SECRET_KEY=<get from Stripe dashboard → Developers → API Keys>
STRIPE_WEBHOOK_SECRET=<create webhook in Stripe, copy secret — see Step 2>
STRIPE_PRICE_BASIC=price_1TWTMNCBOoQTb0NpXBobljDE
STRIPE_PRICE_PRO=price_1TWTMRCBOoQTb0NpDMGtkrwm
STRIPE_PRICE_ELITE=price_1TWTMVCBOoQTb0NpQjK4xZy3
PORT=4000
FRONTEND_URL=https://coshell.vercel.app
BACKEND_URL=https://<your-outplane-url>.outplane.run
```

6. Deploy. Note down your Outplane URL — you'll need it in every step below.

---

### Step 2 — Set Up Stripe Webhook
**Priority: MUST DO — without this, subscriptions don't activate after payment**

1. Go to Stripe Dashboard → Developers → Webhooks → Add endpoint
2. Endpoint URL: `https://<your-outplane-url>.outplane.run/api/billing/webhook`
3. Select these events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy the **Signing Secret** and set it as `STRIPE_WEBHOOK_SECRET` in Outplane

---

### Step 3 — Deploy the Frontend to Vercel
**Priority: MUST DO**

1. Push the entire `coshell-build/` folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → import the repo
3. Set the **root directory** to `/` (the frontend root, NOT the backend folder)
4. Framework preset: **Vite**
5. Add these environment variables in Vercel:
```
VITE_SUPABASE_URL=https://fchfhdffpywwjehvvtwy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjaGZoZGZmcHl3d2plaHZ2dHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NzgzODksImV4cCI6MjA5NDM1NDM4OX0.WUYmCpzMg9Y50J9S83p-R8ysmcU6LBdnqP_rOtMAnZ4
VITE_API_URL=https://<your-outplane-url>.outplane.run
```
6. Deploy. Note the Vercel URL and update `FRONTEND_URL` in Outplane env.

---

### Step 4 — Configure Supabase OAuth (GitHub + Google)
**Priority: SHOULD DO before launch**

**GitHub OAuth:**
1. Go to GitHub → Settings → Developer Settings → OAuth Apps → New OAuth App
2. Homepage URL: `https://coshell.vercel.app`
3. Callback URL: `https://fchfhdffpywwjehvvtwy.supabase.co/auth/v1/callback`
4. Copy Client ID and Secret
5. Paste into Supabase dashboard → Authentication → Providers → GitHub

**Google OAuth:**
1. Go to Google Cloud Console → APIs & Services → Credentials → Create OAuth 2.0 Client
2. Authorized redirect URI: `https://fchfhdffpywwjehvvtwy.supabase.co/auth/v1/callback`
3. Copy Client ID and Secret
4. Paste into Supabase dashboard → Authentication → Providers → Google

---

### Step 5 — Configure Supabase Auth Redirect URLs
**Priority: MUST DO**

In Supabase Dashboard → Authentication → URL Configuration:
- **Site URL:** `https://coshell.vercel.app`
- **Redirect URLs (add all):**
  - `https://coshell.vercel.app/auth/callback`
  - `https://coshell.vercel.app/dashboard`
  - `http://localhost:3000/auth/callback` (for local dev)

---

### Step 6 — Set Up Stripe Customer Portal
**Priority: MUST DO**

1. Stripe Dashboard → Settings → Billing → Customer Portal
2. Enable it and configure:
   - Allow customers to cancel subscriptions: YES
   - Allow customers to update payment methods: YES
   - Allow customers to view invoices: YES
3. Save. (No URL needed — the backend creates portal sessions dynamically)

---

### Step 7 — VibeTunnel Terminal Engine Integration
**Priority: CORE PRODUCT — Required for sessions to actually work**

This is the most complex remaining step. The VibeTunnel repo is included in the project. Here's what needs to happen:

**What VibeTunnel provides:**
- PTY manager (spawns real terminal processes)
- Session manager (tracks active sessions)
- WebSocket server (streams terminal I/O)
- asciinema recording engine

**What needs to be built on top:**
1. **Agent binary** (`@coshell/agent` npm package) — this is what users install via the curl command. It needs to:
   - Accept a `--token` and `--server` flag
   - Call `POST /api/agent/connect` with the token on startup
   - Start the VibeTunnel WebSocket server locally
   - Proxy terminal I/O through the CoShell backend to viewers
   - Call `POST /api/agent/disconnect` on shutdown

2. **WebSocket proxy in backend** — when a viewer opens a session link, the backend needs to proxy the WebSocket connection from the viewer's browser to the agent running on the host machine

3. **Session viewer page** — a public page at `/s/:shareToken` that connects to the WebSocket and renders the terminal (xterm.js)

**Files to start from in VibeTunnel:**
- `web/src/server/pty/pty-manager.ts` — PTY spawning
- `web/src/server/pty/session-manager.ts` — session lifecycle
- `web/src/server/server.ts` — WebSocket server
- `web/src/server/recording/` — asciinema recording

---

### Step 8 — Custom Domain (Optional but recommended before launch)
1. Buy `coshell.dev` (or your chosen domain)
2. In Vercel → Project → Domains → add your domain
3. In Outplane → add `api.coshell.dev` pointing to your backend
4. Update `FRONTEND_URL` and `BACKEND_URL` env vars

---

## Credentials & Keys Reference

| Service | Where to Find |
|---|---|
| Supabase Service Role Key | Supabase Dashboard → Project Settings → API → `service_role` key |
| Stripe Secret Key | Stripe Dashboard → Developers → API Keys → Secret key |
| Stripe Webhook Secret | Stripe Dashboard → Developers → Webhooks → your endpoint → Signing secret |
| Supabase Anon Key | Already in `.env.example` (public key, safe to expose) |

---

## Test Checklist (Run After Each Deployment)

- [ ] Visit homepage — loads without errors
- [ ] Click "Start Free Trial" → reaches Signup page
- [ ] Sign up with email → receives confirmation email
- [ ] Confirm email → redirected to login
- [ ] Log in → redirected to Plan Selection
- [ ] Select a plan → redirected to Stripe Checkout with 7-day trial shown
- [ ] Complete checkout (use Stripe test card `4242 4242 4242 4242`) → redirected to Onboarding
- [ ] Onboarding shows real agent token in curl command
- [ ] Copy command, run in terminal → agent installs and calls `/api/agent/connect`
- [ ] Onboarding page detects connection and shows "Agent connected! ✓"
- [ ] Click "Go to Dashboard" → Dashboard loads
- [ ] Create a session → appears in list with share link
- [ ] Copy share link → opens in new tab (viewer page — Step 7)
- [ ] Kill session → disappears from active list
- [ ] Go to Billing tab → shows correct plan name and trial days
- [ ] Click "Manage Billing" → opens Stripe portal
- [ ] Go to Settings → sign out → returns to landing page

---

## Architecture Diagram

```
Browser (Vercel)
      │
      │ HTTPS API calls
      ▼
Backend API (Outplane)
      │          │
      │          │ service role
      ▼          ▼
  Stripe      Supabase
              (PostgreSQL)

Agent (user's machine)
      │
      │ POST /api/agent/connect  (phone home)
      │ WebSocket (terminal I/O) ← Step 7
      ▼
Backend API (Outplane)
      │
      │ WebSocket proxy ← Step 7
      ▼
Viewer's browser
```

---

## File Structure

```
coshell-build/
├── src/                        ← Frontend (React + Vite)
│   ├── App.tsx                 ← All pages + dashboard
│   ├── hooks/useAuth.tsx       ← Supabase auth hook
│   ├── lib/
│   │   ├── api.ts              ← API client
│   │   └── supabase.ts         ← Supabase client + types
│   └── components/
│       ├── MarketingPages.tsx
│       ├── CompanyPages.tsx
│       └── LegalPages.tsx
├── backend/                    ← Backend (Node.js + Express)
│   ├── src/
│   │   ├── index.ts            ← Server entry point
│   │   ├── middleware/auth.ts  ← JWT auth middleware
│   │   ├── lib/
│   │   │   ├── supabase.ts     ← Admin client
│   │   │   └── stripe.ts       ← Stripe client
│   │   └── routes/
│   │       ├── billing.ts      ← Stripe routes + webhook
│   │       ├── sessions.ts     ← Sessions CRUD
│   │       ├── agent.ts        ← Agent handshake + install script
│   │       └── misc.ts         ← Recordings, snippets, notifications, team, profile
│   ├── .env.example            ← All required backend env vars
│   ├── package.json
│   └── tsconfig.json
├── .env.example                ← All required frontend env vars
├── package.json
└── vite.config.ts
```

---

*Document prepared by Claude · CoShell v1.0 · May 2026*
