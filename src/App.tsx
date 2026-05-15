/**
 * CoShell - Fully wired frontend
 * Auth: Supabase | Payments: Stripe | Backend: Outplane
 */

import { useEffect, useState } from 'react';
import {
  Terminal, TerminalSquare, Share2, Users, ShieldCheck, EyeOff,
  PlayCircle, Bell, CheckCircle2, Copy, Plus, Search,
  Download, Trash2, LayoutDashboard, History, Settings, CreditCard,
  UserPlus, Loader2, AlertCircle, Check, ExternalLink, X,
  Slack, Mail, Maximize2, ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import {
  billing, sessions as sessionsApi, recordings as recordingsApi,
  snippets as snippetsApi, notifications as notificationsApi,
  team as teamApi, profile as profileApi, agent as agentApi,
} from './lib/api';
import { FeaturesPage, HowItWorksPage, PricingPage } from './components/MarketingPages';
import { ChangelogPage, DocsPage } from './components/CompanyPages';
import { PrivacyPolicyPage, TermsOfServicePage, SecurityPage } from './components/LegalPages';

// ── Types ─────────────────────────────────────────────────────
type View =
  | 'LANDING' | 'SIGNUP' | 'LOGIN' | 'PLAN_SELECT' | 'ONBOARDING' | 'DASHBOARD'
  | 'FEATURES' | 'HOW_IT_WORKS' | 'PRICING' | 'CHANGELOG' | 'DOCS'
  | 'PRIVACY' | 'TERMS' | 'SECURITY';
type DashboardTab = 'SESSIONS' | 'RECORDINGS' | 'SNIPPETS' | 'NOTIFICATIONS' | 'TEAM' | 'BILLING' | 'SETTINGS';

// ── Shared UI ─────────────────────────────────────────────────
export const Btn = (props: any) => {
  const { children, variant = 'primary', className = '', onClick, disabled = false, loading = false } = props;
  const base = "px-4 py-2 transition-all flex items-center justify-center gap-2 font-medium active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const v = {
    primary: "border border-chartreuse-zap text-cloud-white rounded-full hover:bg-chartreuse-zap hover:text-midnight-oil",
    secondary: "border border-cool-stone text-cloud-white rounded-full hover:bg-smokey-carbon",
    ghost: "text-silken-whisper hover:text-chartreuse-zap",
    danger: "border border-alert-red text-alert-red rounded-full hover:bg-alert-red hover:text-cloud-white",
    hero: "border border-chartreuse-zap text-cloud-white rounded-md px-8 hover:bg-chartreuse-zap hover:text-midnight-oil",
  };
  return (
    <button className={`${base} ${v[variant as keyof typeof v]} ${className}`} onClick={onClick} disabled={disabled || loading}>
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
    </button>
  );
};

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-smokey-carbon border border-cool-stone rounded-lg p-6 ${className}`}>{children}</div>
);

const Err = ({ msg }: any) => (
  <div className="flex items-center gap-3 bg-alert-red/10 border border-alert-red/30 rounded-lg p-4 text-sm text-alert-red">
    <AlertCircle className="w-4 h-4 shrink-0" />{msg}
  </div>
);

const Toggle = ({ on, onChange }: any) => (
  <div onClick={onChange} className={`w-12 h-6 rounded-full p-1 relative cursor-pointer transition-colors ${on ? 'bg-chartreuse-zap' : 'bg-midnight-oil border border-cool-stone'}`}>
    <div className={`w-4 h-4 bg-midnight-oil rounded-full absolute top-1 transition-all duration-200 ${on ? 'right-1' : 'left-1'}`} />
  </div>
);

const Input = ({ label, ...props }: any) => (
  <div className="space-y-2">
    {label && <label className="text-xs font-bold text-muted-ash uppercase">{label}</label>}
    <input {...props} className={`w-full bg-midnight-oil border border-cool-stone rounded p-3 text-cloud-white focus:border-chartreuse-zap outline-none text-sm ${props.className || ''}`} />
  </div>
);

const Select = ({ label, children, ...props }: any) => (
  <div className="space-y-2">
    {label && <label className="text-xs font-bold text-muted-ash uppercase">{label}</label>}
    <select {...props} className="w-full bg-midnight-oil border border-cool-stone rounded p-3 text-cloud-white focus:border-chartreuse-zap outline-none text-sm">
      {children}
    </select>
  </div>
);

// ── Animated Terminal Hero ────────────────────────────────────
const AnimatedTerminal = () => {
  const [phase, setPhase] = useState(0);
  const [t1, setT1] = useState('');
  const [t2, setT2] = useState('');
  const l1 = 'npm install @coshell/agent';
  const l2 = 'coshell start';

  useEffect(() => {
    let alive = true;
    const run = async () => {
      setPhase(0); setT1(''); setT2('');
      await new Promise(r => setTimeout(r, 1000));
      for (let i = 0; i <= l1.length; i++) {
        if (!alive) return;
        await new Promise(r => setTimeout(r, 40));
        setT1(l1.slice(0, i));
      }
      await new Promise(r => setTimeout(r, 600));
      if (!alive) return; setPhase(1);
      await new Promise(r => setTimeout(r, 900));
      for (let i = 0; i <= l2.length; i++) {
        if (!alive) return;
        await new Promise(r => setTimeout(r, 60));
        setT2(l2.slice(0, i));
      }
      await new Promise(r => setTimeout(r, 400));
      if (!alive) return; setPhase(2);
      await new Promise(r => setTimeout(r, 300));
      if (!alive) return; setPhase(3);
    };
    run();
    return () => { alive = false; };
  }, []);

  return (
    <div className="flex-1 p-6 font-mono text-sm bg-midnight-oil overflow-hidden">
      <div className="flex gap-2"><span className="text-chartreuse-zap">➜</span>
        <span className="text-cloud-white">{t1}{phase === 0 && <span className="inline-block w-2 h-4 bg-chartreuse-zap animate-pulse ml-0.5 translate-y-0.5" />}</span>
      </div>
      {phase >= 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="text-muted-ash mt-1 mb-3 text-xs">added 142 packages in 3s</div>
          <div className="flex gap-2"><span className="text-chartreuse-zap">➜</span>
            <span className="text-cloud-white">{t2}{phase === 1 && t2 && <span className="inline-block w-2 h-4 bg-chartreuse-zap animate-pulse ml-0.5 translate-y-0.5" />}</span>
          </div>
        </motion.div>
      )}
      {phase >= 2 && <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-[#50fa7b] mt-1 text-xs break-all">✓ Session active: https://coshell.dev/s/z8k2-m9pj</motion.div>}
      {phase >= 3 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-muted-ash mt-2 text-xs">Listening for viewers...<div className="mt-3 w-2 h-5 bg-chartreuse-zap animate-pulse" /></motion.div>}
    </div>
  );
};

// ── Shared Nav ────────────────────────────────────────────────
const Nav = (props: any) => {
  const { setView, onLogin, onStart } = props;
  return (
    <nav className="sticky top-0 z-50 bg-midnight-oil/90 backdrop-blur-md border-b border-cool-stone px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('LANDING')}>
        <TerminalSquare className="text-chartreuse-zap h-8 w-8" />
        <span className="text-xl font-bold tracking-tight">CoShell</span>
      </div>
      <div className="hidden md:flex items-center gap-8">
        {(['FEATURES', 'HOW_IT_WORKS', 'PRICING', 'DOCS', 'CHANGELOG'] as View[]).map(v => (
          <button key={v} onClick={() => setView(v)} className="text-silken-whisper hover:text-chartreuse-zap transition-colors text-sm">
            {v === 'HOW_IT_WORKS' ? 'How It Works' : v[0] + v.slice(1).toLowerCase()}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <Btn variant="ghost" onClick={onLogin}>Log In</Btn>
        <Btn onClick={onStart}>Start Free Trial</Btn>
      </div>
    </nav>
  );
};

// ── Landing Page ──────────────────────────────────────────────
const LandingPage = (props: any) => {
  const { setView } = props;
  const go = (v: View) => setView(v);
  return (
    <div className="flex flex-col min-h-screen">
      <Nav setView={setView} onLogin={() => go('LOGIN')} onStart={() => go('SIGNUP')} />

      {/* Hero */}
      <section className="px-6 py-24 flex flex-col items-center text-center max-w-6xl mx-auto w-full">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
          Your terminal. Anywhere.<br />With anyone.
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-silken-whisper max-w-2xl mb-10">
          CoShell lets you share a live terminal session instantly — no SSH keys, no VPNs, no setup.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col md:flex-row gap-4 mb-2">
          <Btn variant="hero" onClick={() => go('SIGNUP')} className="text-lg py-4">Start Free Trial</Btn>
          <Btn variant="secondary" className="px-8 py-4 text-lg"><PlayCircle className="w-5 h-5" /> Watch Demo</Btn>
        </motion.div>
        <p className="text-xs text-muted-ash mb-16">7-day free trial · No card required</p>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="w-full border border-cool-stone rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-smokey-carbon px-4 py-3 flex items-center justify-between border-b border-cool-stone">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-alert-red" />
              <div className="w-3 h-3 rounded-full bg-chartreuse-zap opacity-60" />
              <div className="w-3 h-3 rounded-full bg-[#50fa7b]" />
            </div>
            <div className="bg-midnight-oil/60 px-3 py-1 rounded text-xs font-mono text-muted-ash">coshell.dev/s/z8k2-m9pj</div>
            <div className="flex items-center gap-1 text-xs text-muted-ash"><Users className="w-3 h-3" /> 3 viewers</div>
          </div>
          <div className="flex h-80 md:h-96">
            <AnimatedTerminal />
            <div className="w-56 border-l border-cool-stone bg-smokey-carbon hidden lg:flex flex-col">
              <div className="px-4 py-3 border-b border-cool-stone text-[10px] font-bold text-muted-ash uppercase tracking-widest">Session Chat</div>
              <div className="flex-1 p-4"><p className="text-[10px] text-chartreuse-zap font-bold mb-1">MARCUS</p><p className="text-xs text-cloud-white bg-midnight-oil p-2 rounded">Can you run the migration?</p></div>
              <div className="p-3 border-t border-cool-stone"><div className="bg-midnight-oil rounded p-2 text-[11px] text-muted-ash">Type a message...</div></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 py-24 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16"><h2 className="text-4xl font-bold">Everything you need. Nothing you don't.</h2></div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Share2 />, title: "Instant Sharing", desc: "One click generates a shareable link." },
            { icon: <Users />, title: "Multi-Viewer", desc: "Multiple people watch live." },
            { icon: <ShieldCheck />, title: "Security", desc: "Command whitelist & control." },
          ].map((f, i) => (
            <Card key={i} className="hover:border-chartreuse-zap/50 transition-colors">
              <div className="text-chartreuse-zap mb-4">{f.icon}</div>
              <h4 className="text-lg font-bold mb-2">{f.title}</h4>
              <p className="text-silken-whisper text-sm">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-24 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Basic", price: "15" },
            { name: "Pro", price: "25", popular: true },
            { name: "Elite", price: "50" },
          ].map((plan, i) => (
            <Card key={i} className={plan.popular ? 'border-chartreuse-zap ring-1 ring-chartreuse-zap' : ''}>
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1"><span className="text-4xl font-bold text-chartreuse-zap">${plan.price}</span><span className="text-muted-ash">/mo</span></div>
              <Btn variant={plan.popular ? 'primary' : 'secondary'} className="w-full mt-6" onClick={() => go('SIGNUP')}>Get Started</Btn>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-16 bg-midnight-oil border-t border-cool-stone">
        <div className="max-w-6xl mx-auto text-center text-xs text-muted-ash">
          <span>© 2026 CoShell. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

// ── Auth Pages ────────────────────────────────────────────────
const SignupPage = (props: any) => {
  const { setView } = props;
  const { signUp, signInWithGithub, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    if (!email || !password) { setError('Email and password are required'); return; }
    setLoading(true); setError('');
    const { error: e } = await signUp(email, password, name);
    setLoading(false);
    if (e) setError(e.message);
    else setSuccess(true);
  };

  if (success) return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
        <div className="bg-chartreuse-zap/10 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6"><Check className="w-10 h-10 text-chartreuse-zap" /></div>
        <h2 className="text-2xl font-bold mb-4">Check your email</h2>
        <p className="text-silken-whisper mb-8">We sent a confirmation link to <strong>{email}</strong>.</p>
        <Btn onClick={() => setView('LOGIN')}>Go to Login</Btn>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="cursor-pointer inline-block" onClick={() => setView('LANDING')}><TerminalSquare className="text-chartreuse-zap h-12 w-12 mx-auto mb-4" /></div>
          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="text-silken-whisper mt-2">7-day free trial. No card required.</p>
        </div>
        <Card className="space-y-4">
          {error && <Err msg={error} />}
          <Input label="Full Name" value={name} onChange={(e: any) => setName(e.target.value)} placeholder="Alex Rivera" />
          <Input label="Email Address" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="you@example.com" />
          <Input label="Password" type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={(e: any) => e.key === 'Enter' && submit()} />
          <Btn className="w-full py-3 mt-2" onClick={submit} loading={loading}>Create Account</Btn>
          <div className="relative py-3 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-cool-stone" /></div>
            <span className="relative bg-smokey-carbon px-2 text-[10px] uppercase text-muted-ash">Or continue with</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Btn variant="secondary" className="w-full" onClick={async () => { setOauthLoading('github'); await signInWithGithub(); setOauthLoading(null); }} loading={oauthLoading === 'github'}>GitHub</Btn>
            <Btn variant="secondary" className="w-full" onClick={async () => { setOauthLoading('google'); await signInWithGoogle(); setOauthLoading(null); }} loading={oauthLoading === 'google'}>Google</Btn>
          </div>
        </Card>
        <p className="text-center text-sm text-silken-whisper mt-6">Already have an account? <button className="text-chartreuse-zap hover:underline" onClick={() => setView('LOGIN')}>Log in</button></p>
      </motion.div>
    </div>
  );
};

const LoginPage = (props: any) => {
  const { setView } = props;
  const { signIn, signInWithGithub, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!email || !password) { setError('Email and password are required'); return; }
    setLoading(true); setError('');
    const { error: e } = await signIn(email, password);
    setLoading(false);
    if (e) setError(e.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="cursor-pointer inline-block" onClick={() => setView('LANDING')}><TerminalSquare className="text-chartreuse-zap h-12 w-12 mx-auto mb-4" /></div>
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-silken-whisper mt-2">Log in to your CoShell account.</p>
        </div>
        <Card className="space-y-4">
          {error && <Err msg={error} />}
          <Input label="Email Address" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="you@example.com" />
          <Input label="Password" type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={(e: any) => e.key === 'Enter' && submit()} />
          <Btn className="w-full py-3 mt-2" onClick={submit} loading={loading}>Log In</Btn>
          <div className="relative py-3 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-cool-stone" /></div>
            <span className="relative bg-smokey-carbon px-2 text-[10px] uppercase text-muted-ash">Or continue with</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Btn variant="secondary" className="w-full" onClick={async () => { setOauthLoading('github'); await signInWithGithub(); }} loading={oauthLoading === 'github'}>GitHub</Btn>
            <Btn variant="secondary" className="w-full" onClick={async () => { setOauthLoading('google'); await signInWithGoogle(); }} loading={oauthLoading === 'google'}>Google</Btn>
          </div>
        </Card>
        <p className="text-center text-sm text-silken-whisper mt-6">No account? <button className="text-chartreuse-zap hover:underline" onClick={() => setView('SIGNUP')}>Start free trial</button></p>
      </motion.div>
    </div>
  );
};

// ── Plan Selection ────────────────────────────────────────────
const PlanSelectPage = (props: any) => {
  const { setView } = props;
  const [loading, setLoading] = useState<string | null>(null);

  const choose = async (planId: 'basic' | 'pro' | 'elite') => {
    setLoading(planId);
    try {
      const { url } = await billing.createCheckoutSession(planId);
      window.location.href = url;
    } catch {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <TerminalSquare className="text-chartreuse-zap h-12 w-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Choose your plan</h1>
          <p className="text-silken-whisper">7-day free trial on all plans.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { id: 'basic' as const, name: 'Basic', price: '15' },
            { id: 'pro' as const, name: 'Pro', price: '25', popular: true },
            { id: 'elite' as const, name: 'Elite', price: '50' },
          ].map(p => (
            <Card key={p.id} className={p.popular ? 'border-chartreuse-zap ring-1 ring-chartreuse-zap' : ''}>
              <h3 className="text-xl font-bold mb-2">{p.name}</h3>
              <div className="flex items-baseline gap-1"><span className="text-4xl font-bold text-chartreuse-zap">${p.price}</span><span className="text-muted-ash">/mo</span></div>
              <Btn variant={p.popular ? 'primary' : 'secondary'} className="w-full mt-6" onClick={() => choose(p.id)} loading={loading === p.id} disabled={!!loading}>Start Free Trial</Btn>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// ── Onboarding ────────────────────────────────────────────────
const OnboardingPage = (props: any) => {
  const { onComplete } = props;
  const { profile, refreshProfile } = useAuth();
  const [connected, setConnected] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || 'https://api.coshell.dev';
  const cmd = `curl -fsSL ${apiUrl}/install.sh | TOKEN=${profile?.agent_token ?? 'loading...'} sh`;

  useEffect(() => {
    if (connected || !profile) return;
    const iv = setInterval(async () => {
      try {
        const s = await agentApi.pollConnection();
        if (s.connected) { setConnected(true); await refreshProfile(); }
      } catch { }
    }, 3000);
    return () => clearInterval(iv);
  }, [connected, profile, refreshProfile]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-midnight-oil">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-3">Final Step: Install the Agent</h1>
        <p className="text-silken-whisper mb-10">Run this command on your machine.</p>
        <div className="space-y-8">
          <div className="bg-smokey-carbon p-4 rounded-lg border border-cool-stone font-mono text-sm">
            <code className="text-cloud-white break-all">{cmd}</code>
          </div>
          <Card className="flex items-center justify-between py-5">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${connected ? 'bg-[#50fa7b]' : 'bg-chartreuse-zap animate-pulse'}`} />
              <span className="text-sm font-medium">{connected ? 'Agent connected! ✓' : 'Waiting for agent...'}</span>
            </div>
            {connected && (
              <Btn onClick={onComplete}>Go to Dashboard <ChevronRight className="w-4 h-4" /></Btn>
            )}
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

// ── Minimal Dashboard ────────────────────────────────────────────
const Dashboard = (props: any) => {
  const { setView } = props;
  const { profile, signOut } = useAuth();
  const [tab, setTab] = useState<DashboardTab>('SESSIONS');

  const handleSignOut = async () => { await signOut(); setView('LANDING'); };

  return (
    <div className="flex h-screen bg-midnight-oil overflow-hidden">
      <aside className="w-64 border-r border-cool-stone flex flex-col flex-shrink-0">
        <div className="px-6 py-5 border-b border-cool-stone flex items-center gap-2 cursor-pointer" onClick={() => setView('LANDING')}>
          <TerminalSquare className="text-chartreuse-zap h-7 w-7" /><span className="text-lg font-bold">CoShell</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {[
            { id: 'SESSIONS' as const, label: 'Sessions', icon: <Terminal className="w-4 h-4" /> },
            { id: 'RECORDINGS' as const, label: 'Recordings', icon: <History className="w-4 h-4" /> },
            { id: 'SNIPPETS' as const, label: 'Snippets', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'BILLING' as const, label: 'Billing', icon: <CreditCard className="w-4 h-4" /> },
            { id: 'SETTINGS' as const, label: 'Settings', icon: <Settings className="w-4 h-4" /> },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${tab === t.id ? 'bg-chartreuse-zap/10 text-chartreuse-zap font-bold' : 'text-silken-whisper hover:text-cloud-white'}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-cool-stone text-center">
          <p className="text-sm font-bold">{profile?.full_name || 'User'}</p>
          <p className="text-xs text-muted-ash capitalize mt-1">{profile?.plan || 'trial'} plan</p>
          <Btn variant="ghost" className="w-full text-xs mt-3" onClick={handleSignOut}>Sign Out</Btn>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-4xl font-bold mb-8 capitalize">{tab.toLowerCase()}</h1>
        <Card><p className="text-center text-muted-ash">Tab content coming soon.</p></Card>
      </main>
    </div>
  );
};

// ── Root App ──────────────────────────────────────────────────
function AppInner() {
  const { user, profile, loading } = useAuth();
  const [view, setView] = useState<View>('LANDING');

  // Detect if we're on auth callback URL and stay on LOGIN
  useEffect(() => {
    const isAuthCallback = window.location.pathname.includes('auth/callback');
    if (isAuthCallback && view === 'LANDING') {
      setView('LOGIN');
    }
  }, []);

  // Smart post-login redirect - NOW WITH view in dependency array!
  useEffect(() => {
    if (loading || !user || !profile || !view) return;
    
    // Only redirect if on auth pages
    if (view === 'LOGIN' || view === 'SIGNUP') {
      // Determine which page to go to
      if (!profile.stripe_subscription_id) {
        setView('PLAN_SELECT');
      } else if (!profile.agent_connected_at) {
        setView('ONBOARDING');
      } else {
        setView('DASHBOARD');
      }
    }
  }, [user, profile, loading, view]); // FIXED: added view to dependency array

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-midnight-oil">
      <Loader2 className="w-8 h-8 animate-spin text-chartreuse-zap" />
    </div>
  );

  const navProps = { setView, onLogin: () => setView('LOGIN'), onStart: () => setView('SIGNUP') };

  return (
    <AnimatePresence mode="wait">
      <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
        {view === 'LANDING' && <LandingPage setView={setView} />}
        {view === 'SIGNUP' && <SignupPage setView={setView} />}
        {view === 'LOGIN' && <LoginPage setView={setView} />}
        {view === 'PLAN_SELECT' && <PlanSelectPage setView={setView} />}
        {view === 'ONBOARDING' && <OnboardingPage onComplete={() => setView('DASHBOARD')} />}
        {view === 'DASHBOARD' && (user ? <Dashboard setView={setView} /> : <LoginPage setView={setView} />)}
        {view === 'FEATURES' && <div><Nav {...navProps} /><p className="p-12">Features page coming soon</p></div>}
        {view === 'HOW_IT_WORKS' && <div><Nav {...navProps} /><p className="p-12">How it works coming soon</p></div>}
        {view === 'PRICING' && <div><Nav {...navProps} /><p className="p-12">Pricing page coming soon</p></div>}
        {view === 'DOCS' && <div><Nav {...navProps} /><p className="p-12">Docs coming soon</p></div>}
        {view === 'CHANGELOG' && <div><Nav {...navProps} /><p className="p-12">Changelog coming soon</p></div>}
        {view === 'PRIVACY' && <div><Nav {...navProps} /><p className="p-12">Privacy policy coming soon</p></div>}
        {view === 'TERMS' && <div><Nav {...navProps} /><p className="p-12">Terms coming soon</p></div>}
        {view === 'SECURITY' && <div><Nav {...navProps} /><p className="p-12">Security coming soon</p></div>}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return <AuthProvider><AppInner /></AuthProvider>;
}
