---
name: testing-coshell-frontend
description: Test the CoShell React+Vite frontend locally. Use when verifying routing, auth flow, or UI changes.
---

# Testing CoShell Frontend

## Prerequisites

- Node.js installed
- `npm install` completed

## Devin Secrets Needed

- `VITE_SUPABASE_URL` — Supabase project URL (for full auth testing)
- `VITE_SUPABASE_ANON_KEY` — Supabase anon key (for full auth testing)
- For routing-only tests, dummy values work: set them in `.env.local`

## Local Dev Setup

1. Create `.env.local` in repo root with:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_API_URL=http://localhost:4000
   ```
   For routing-only tests, dummy values are fine — the app will load but auth calls will fail silently.

2. Run `npm run dev` — starts Vite on port 3000 (may increment if port is busy).

3. The Vercel preview deployment might be behind Vercel SSO. If you can't access the preview, test locally instead.

## Key Routes to Test

| Route | Expected (unauthenticated) |
|---|---|
| `/` | Landing page with "Your terminal. Anywhere." hero |
| `/auth/callback` | Redirects to `/` (no session) or `/plan-selection` (with session) |
| `/plan-selection` | "Choose your plan" page with Basic/Pro/Elite cards |
| `/onboarding` | Onboarding flow |
| `/dashboard` | Login form ("Welcome back") when unauthenticated |
| `/login` | Login form |
| `/signup` | Signup form |

## Architecture Notes

- The app uses a hybrid routing approach: `react-router-dom` handles URL-based routing, while internal navigation uses a `view` state system.
- `pathToView()` maps URL paths to view state on initial load. `viewToPath()` keeps the URL in sync when the view changes internally.
- The `AuthCallback` component at `/auth/callback` checks `useAuth()` for session state and redirects accordingly.
- OAuth redirect URLs are configured in `src/hooks/useAuth.tsx` — both Google and GitHub OAuth redirect to `${window.location.origin}/auth/callback`.

## Lint / Typecheck

```bash
npm run lint  # runs tsc --noEmit
```

Note: There may be pre-existing type errors for `import.meta.env` (missing `vite/client` types in tsconfig) and `stripe_subscription_id` (not on the Profile type). These are known issues.

## Build

```bash
npm run build
```
