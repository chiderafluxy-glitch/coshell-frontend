/**
 * CoShell - Fully wired frontend
 * Auth: Supabase | Payments: Stripe | Backend: Outplane
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SessionViewer from './pages/SessionViewer';
import React, { useState, useEffect } from 'react';
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
export const Btn = ({
  children, variant = 'primary', className = '', onClick, disabled = false, loading = false,
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'hero';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}) => {
  const base = "px-4 py-2 transition-all flex items-center justify-center gap-2 font-medium active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const v = {
    primary: "border border-chartreuse-zap text-cloud-white rounded-full hover:bg-chartreuse-zap hover:text-midnight-oil",
    secondary: "border border-cool-stone text-cloud-white rounded-full hover:bg-smokey-carbon",
    ghost: "text-silken-whisper hover:text-chartreuse-zap",
    danger: "border border-alert-red text-alert-red rounded-full hover:bg-alert-red hover:text-cloud-white",
    hero: "border border-chartreuse-zap text-cloud-white rounded-md px-8 hover:bg-chartreuse-zap hover:text-midnight-oil",
  };
  return (
    <button className={`${base} ${v[variant]} ${className}`} onClick={onClick} disabled={disabled || loading}>
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
    </button>
  );
};

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-smokey-carbon border border-cool-stone rounded-lg p-6 ${className}`}>{children}</div>
);

const Err = ({ msg }: { msg: string }) => (
  <div className="flex items-center gap-3 bg-alert-red/10 border border-alert-red/30 rounded-lg p-4 text-sm text-alert-red">
    <AlertCircle className="w-4 h-4 shrink-0" />{msg}
  </div>
);

const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
  <div onClick={onChange} className={`w-12 h-6 rounded-full p-1 relative cursor-pointer transition-colors ${on ? 'bg-chartreuse-zap' : 'bg-midnight-oil border border-cool-stone'}`}>
    <div className={`w-4 h-4 bg-midnight-oil rounded-full absolute top-1 transition-all duration-200 ${on ? 'right-1' : 'left-1'}`} />
  </div>
);

const Input = ({ label, ...props }: { label?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="space-y-2">
    {label && <label className="text-xs font-bold text-muted-ash uppercase">{label}</label>}
    <input {...props} className={`w-full bg-midnight-oil border border-cool-stone rounded p-3 text-cloud-white focus:border-chartreuse-zap outline-none text-sm ${props.className || ''}`} />
  </div>
);

const Select = ({ label, children, ...props }: { label?: string } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
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
const Nav = ({ setView, onLogin, onStart }: { setView: (v: View) => void; onLogin: () => void; onStart: () => void }) => (
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

// ── Landing Page ──────────────────────────────────────────────
const LandingPage = ({ setView }: { setView: (v: View) => void }) => {
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

      {/* Pain points */}
      <section className="px-6 py-24 bg-smokey-carbon">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          {[
            { icon: <ShieldCheck className="text-alert-red w-6 h-6" />, bg: 'bg-alert-red/10', title: 'SSH is a nightmare.', desc: 'Keys, configs, firewalls, NAT — just to let someone see your screen.' },
            { icon: <EyeOff className="text-chartreuse-zap w-6 h-6" />, bg: 'bg-chartreuse-zap/10', title: 'Screen sharing shows too much.', desc: 'Zoom shares your whole desktop. Your terminal deserves its own tool.' },
            { icon: <History className="text-cloud-white w-6 h-6" />, bg: 'bg-cloud-white/10', title: 'Nothing gets recorded.', desc: "When the session ends, it's gone. No replay, no record." },
          ].map((item, i) => (
            <div key={i} className="space-y-4">
              <div className={`h-12 w-12 ${item.bg} rounded-full flex items-center justify-center`}>{item.icon}</div>
              <h3 className="text-2xl font-bold">{item.title}</h3>
              <p className="text-silken-whisper leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16"><h2 className="text-4xl font-bold">Everything you need. Nothing you don't.</h2></div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Share2 />, title: "Instant Sharing", desc: "One click generates a shareable link. Anyone joins from their browser." },
            { icon: <Users />, title: "Multi-Viewer Sessions", desc: "Multiple people watch the same session live. Grant typing control at will." },
            { icon: <ShieldCheck />, title: "Command Whitelist", desc: "Define exactly which commands viewers can run. Block dangerous ones." },
            { icon: <EyeOff />, title: "Secret Redaction", desc: "API keys and passwords are automatically masked in the viewer's stream." },
            { icon: <PlayCircle />, title: "Session Replay", desc: "Every session is recorded automatically. Rewind and share recordings." },
            { icon: <Bell />, title: "Push Notifications", desc: "Get notified on Slack, email, or browser when long commands finish." },
          ].map((f, i) => (
            <Card key={i} className="hover:border-chartreuse-zap/50 transition-colors group">
              <div className="text-chartreuse-zap mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
              <h4 className="text-lg font-bold mb-2">{f.title}</h4>
              <p className="text-silken-whisper text-sm leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-24 bg-midnight-oil border-y border-cool-stone">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Developers love it.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "CoShell replaced our entire on-call SSH setup. We share sessions across the team in seconds.", author: "Marcus T.", role: "Senior DevOps Engineer" },
              { quote: "I show clients live progress without giving them any access to my infrastructure.", author: "Priya S.", role: "Freelance Developer" },
              { quote: "The command whitelist alone is worth the price. No more worrying about a junior dev running rm -rf.", author: "Daniel R.", role: "Engineering Lead" },
            ].map((t, i) => (
              <div key={i} className="space-y-4">
                <p className="text-xl text-cloud-white italic">"{t.quote}"</p>
                <div><p className="font-bold text-chartreuse-zap">{t.author}</p><p className="text-xs text-muted-ash">{t.role}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="px-6 py-24 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing.</h2>
          <p className="text-silken-whisper">Start free for 7 days. No card required.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Basic", price: "15", features: ["Single viewer", "7-day recording retention", "Chat sidebar", "Session replay"] },
            { name: "Pro", price: "25", popular: true, features: ["Up to 5 viewers", "30-day retention", "Command whitelist", "Secret redaction", "Push notifications"] },
            { name: "Elite", price: "50", features: ["Up to 20 viewers", "1-year retention", "Multi-session broadcast", "AI summaries", "SSO & Audit logs"] },
          ].map((plan, i) => (
            <Card key={i} className={`flex flex-col relative ${plan.popular ? 'border-chartreuse-zap ring-1 ring-chartreuse-zap' : ''}`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-chartreuse-zap text-midnight-oil text-[10px] font-bold px-3 py-1 rounded-full uppercase">Most Popular</div>}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1"><span className="text-4xl font-bold text-chartreuse-zap">${plan.price}</span><span className="text-muted-ash">/mo</span></div>
              </div>
              <ul className="flex-1 space-y-3 mb-8">{plan.features.map((f, j) => <li key={j} className="flex items-start gap-2 text-sm text-silken-whisper"><CheckCircle2 className="w-4 h-4 text-chartreuse-zap shrink-0 mt-0.5" />{f}</li>)}</ul>
              <Btn variant={plan.popular ? 'primary' : 'secondary'} className="w-full" onClick={() => go('SIGNUP')}>Get Started</Btn>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 bg-smokey-carbon border-t border-cool-stone text-center">
        <h2 className="text-4xl font-bold mb-8">Stop fighting your tools.<br />Start sharing your terminal.</h2>
        <Btn variant="hero" className="mx-auto mb-4 py-4 text-lg" onClick={() => go('SIGNUP')}>Start Free Trial</Btn>
        <p className="text-xs text-muted-ash">7-day free trial · No card required · Cancel anytime</p>
      </section>

      {/* Footer */}
      <footer className="px-6 py-16 bg-midnight-oil border-t border-cool-stone">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2"><TerminalSquare className="text-chartreuse-zap h-6 w-6" /><span className="text-lg font-bold">CoShell</span></div>
            <p className="text-silken-whisper max-w-xs">Zero-config terminal sharing for developers and remote teams.</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Product</h4>
            <div className="flex flex-col gap-2 text-sm text-silken-whisper">
              {(['FEATURES', 'HOW_IT_WORKS', 'PRICING', 'CHANGELOG', 'DOCS'] as View[]).map(v => (
                <button key={v} onClick={() => setView(v)} className="hover:text-chartreuse-zap text-left">{v === 'HOW_IT_WORKS' ? 'How It Works' : v[0] + v.slice(1).toLowerCase()}</button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Legal</h4>
            <div className="flex flex-col gap-2 text-sm text-silken-whisper">
              {(['PRIVACY', 'TERMS', 'SECURITY'] as View[]).map(v => (
                <button key={v} onClick={() => setView(v)} className="hover:text-chartreuse-zap text-left">{v[0] + v.slice(1).toLowerCase()}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-8 border-t border-cool-stone flex justify-between text-xs text-muted-ash">
          <span>© 2026 CoShell. All rights reserved.</span><span>Made for developers.</span>
        </div>
      </footer>
    </div>
  );
};

// ── Auth Pages ────────────────────────────────────────────────
const SignupPage = ({ setView }: { setView: (v: View) => void }) => {
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
    if (e) setError(e.message); else setSuccess(true);
  };

  if (success) return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
        <div className="bg-chartreuse-zap/10 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6"><Check className="w-10 h-10 text-chartreuse-zap" /></div>
        <h2 className="text-2xl font-bold mb-4">Check your email</h2>
        <p className="text-silken-whisper mb-8">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
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
          <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="Alex Rivera" />
          <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && submit()} />
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

const LoginPage = ({ setView }: { setView: (v: View) => void }) => {
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
          <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && submit()} />
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
const PlanSelectPage = ({ setView }: { setView: (v: View) => void }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const choose = async (planId: 'basic' | 'pro' | 'elite') => {
    setLoading(planId); setError('');
    try {
      const { url } = await billing.createCheckoutSession(planId);
      window.location.href = url;
    } catch (e: any) { setError(e.message); setLoading(null); }
  };

  const plans = [
    { id: 'basic' as const, name: 'Basic', price: '15', features: ['Single viewer', '7-day recording retention', 'Chat sidebar', 'Session replay', 'Snippet library'] },
    { id: 'pro' as const, name: 'Pro', price: '25', popular: true, features: ['Up to 5 viewers', '30-day retention', 'Command whitelist', 'Secret redaction', 'Push notifications', 'Peek mode'] },
    { id: 'elite' as const, name: 'Elite', price: '50', features: ['Up to 20 viewers', '1-year retention', 'Multi-session broadcast', 'AI summaries', 'SSO & Audit logs', 'Priority support'] },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <div className="cursor-pointer inline-block" onClick={() => setView('LANDING')}><TerminalSquare className="text-chartreuse-zap h-12 w-12 mx-auto mb-4" /></div>
          <h1 className="text-4xl font-bold mb-2">Choose your plan</h1>
          <p className="text-silken-whisper">7-day free trial on all plans. Cancel anytime.</p>
        </div>
        {error && <div className="mb-8 max-w-md mx-auto"><Err msg={error} /></div>}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map(p => (
            <Card key={p.id} className={`flex flex-col relative ${p.popular ? 'border-chartreuse-zap ring-1 ring-chartreuse-zap' : ''}`}>
              {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-chartreuse-zap text-midnight-oil text-[10px] font-bold px-3 py-1 rounded-full uppercase">Most Popular</div>}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">{p.name}</h3>
                <div className="flex items-baseline gap-1"><span className="text-4xl font-bold text-chartreuse-zap">${p.price}</span><span className="text-muted-ash">/mo</span></div>
                <p className="text-xs text-chartreuse-zap mt-1">7-day free trial included</p>
              </div>
              <ul className="flex-1 space-y-3 mb-8">{p.features.map((f, j) => <li key={j} className="flex items-start gap-2 text-sm text-silken-whisper"><CheckCircle2 className="w-4 h-4 text-chartreuse-zap shrink-0 mt-0.5" />{f}</li>)}</ul>
              <Btn variant={p.popular ? 'primary' : 'secondary'} className="w-full" onClick={() => choose(p.id)} loading={loading === p.id} disabled={!!loading}>Start Free Trial</Btn>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// ── Onboarding ────────────────────────────────────────────────
const OnboardingPage = ({ onComplete }: { onComplete: () => void }) => {
  const { profile, refreshProfile } = useAuth();
  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || 'https://api.coshell.dev';
  const cmd = `curl -fsSL ${apiUrl}/install.sh | TOKEN=${profile?.agent_token ?? 'loading...'} sh`;

  const copy = () => { navigator.clipboard.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  useEffect(() => {
    if (connected || !profile) return;
    const iv = setInterval(async () => {
      try { const s = await agentApi.pollConnection(); if (s.connected) { setConnected(true); await refreshProfile(); } } catch {}
    }, 3000);
    return () => clearInterval(iv);
  }, [connected, profile, refreshProfile]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-midnight-oil">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-2xl">
        <div className="flex items-center gap-2 mb-10"><TerminalSquare className="text-chartreuse-zap h-8 w-8" /><span className="text-xl font-bold">CoShell</span></div>
        <h1 className="text-4xl font-bold mb-3">Final Step: Install the Agent</h1>
        <p className="text-silken-whisper mb-10">The CoShell agent runs on your machine and handles the terminal connection.</p>
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-bold text-chartreuse-zap uppercase tracking-widest">1. Run this in your terminal</p>
            <div className="bg-smokey-carbon p-4 rounded-lg border border-cool-stone font-mono text-sm relative">
              <code className="text-cloud-white break-all pr-10 leading-relaxed">{cmd}</code>
              <button className="absolute right-4 top-4 text-muted-ash hover:text-chartreuse-zap transition-colors" onClick={copy}>
                {copied ? <Check className="w-4 h-4 text-chartreuse-zap" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-bold text-chartreuse-zap uppercase tracking-widest">2. Connection status</p>
            <Card className="flex items-center justify-between py-5">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${connected ? 'bg-[#50fa7b]' : 'bg-chartreuse-zap animate-pulse'}`} />
                <span className="text-sm font-medium">{connected ? 'Agent connected! ✓' : 'Waiting for agent...'}</span>
                {!connected && <Loader2 className="w-4 h-4 animate-spin text-muted-ash" />}
              </div>
              {connected && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <Btn onClick={onComplete}>Go to Dashboard <ChevronRight className="w-4 h-4" /></Btn>
                </motion.div>
              )}
            </Card>
          </div>
          <p className="text-xs text-muted-ash">Supports macOS, Linux, and Windows (WSL). <a href="#" className="text-chartreuse-zap hover:underline">View docs →</a></p>
        </div>
      </motion.div>
    </div>
  );
};

// ── Dashboard Tabs ────────────────────────────────────────────
const SessionsTab = () => {
  const [showModal, setShowModal] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', expiry: '24h', accessMode: 'read_only' });
  const [copied, setCopied] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL || '';

  useEffect(() => { sessionsApi.list().then(setList).catch(() => {}).finally(() => setLoading(false)); }, []);

  const create = async () => {
    setCreating(true);
    const s = await sessionsApi.create(form).catch(() => null);
    if (s) { setList(p => [s, ...p]); setShowModal(false); setForm({ name: '', expiry: '24h', accessMode: 'read_only' }); }
    setCreating(false);
  };

  const kill = async (id: string) => { await sessionsApi.kill(id); setList(p => p.map(s => s.id === id ? { ...s, status: 'killed' } : s)); };

  const copyLink = (token: string) => { navigator.clipboard.writeText(`${apiUrl}/s/${token}`); setCopied(token); setTimeout(() => setCopied(null), 2000); };

  const active = list.filter(s => s.status !== 'killed');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Sessions</h1>
        <Btn onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> New Session</Btn>
      </div>
      {loading ? <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-muted-ash" /></div>
        : active.length === 0 ? (
          <div className="py-24 text-center">
            <div className="bg-smokey-carbon p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6"><Terminal className="w-10 h-10 text-muted-ash" /></div>
            <h2 className="text-xl font-bold mb-2">No active sessions</h2>
            <p className="text-silken-whisper mb-8">Create a session to start sharing your terminal.</p>
            <Btn onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> Create First Session</Btn>
          </div>
        ) : (
          <div className="grid gap-4">
            {active.map(s => (
              <Card key={s.id} className="flex items-center justify-between py-4 hover:border-muted-ash/50 transition-all">
                <div className="flex items-center gap-5">
                  <div className={`w-2.5 h-2.5 rounded-full ${s.status === 'active' ? 'bg-[#50fa7b]' : 'bg-muted-ash'}`} />
                  <div><h3 className="font-bold">{s.name || 'Unnamed Session'}</h3><p className="text-xs text-muted-ash mt-0.5">{s.host_os || 'Unknown OS'} · {s.access_mode === 'read_only' ? 'Read Only' : 'Read/Write'}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-sm text-muted-ash"><Users className="w-4 h-4" />{s.viewer_count}</span>
                  <Btn variant="secondary" className="px-3 py-1.5 text-xs" onClick={() => copyLink(s.share_token)}>
                    {copied === s.share_token ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy Link</>}
                  </Btn>
                  <Btn variant="danger" className="px-3 py-1.5 text-xs" onClick={() => kill(s.id)}>Kill</Btn>
                </div>
              </Card>
            ))}
          </div>
        )}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-midnight-oil/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-smokey-carbon border border-cool-stone rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Create New Session</h2>
              <div className="space-y-5">
                <Input label="Session Name (Optional)" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Debugging Production" />
                <div className="grid grid-cols-2 gap-4">
                  <Select label="Expiry" value={form.expiry} onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))}>
                    <option value="1h">1 hour</option><option value="6h">6 hours</option><option value="24h">24 hours</option><option value="7d">7 days</option><option value="never">Never</option>
                  </Select>
                  <Select label="Access Mode" value={form.accessMode} onChange={e => setForm(f => ({ ...f, accessMode: e.target.value }))}>
                    <option value="read_only">Read Only</option><option value="read_write">Read/Write</option>
                  </Select>
                </div>
                <div className="flex gap-3 pt-2">
                  <Btn variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Btn>
                  <Btn variant="primary" className="flex-1" onClick={create} loading={creating}>Create Session</Btn>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RecordingsTab = () => {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { recordingsApi.list().then(setList).catch(() => {}).finally(() => setLoading(false)); }, []);
  const fmtB = (b: number) => !b ? '—' : b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`;
  const fmtD = (s: number) => !s ? '—' : s < 60 ? `${s}s` : `${Math.round(s / 60)}m`;
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Recordings</h1>
      <div className="relative mb-8"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-ash" /><input placeholder="Search recordings..." className="w-full bg-smokey-carbon border border-cool-stone rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:border-chartreuse-zap" /></div>
      {loading ? <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-muted-ash" /></div>
        : list.length === 0 ? <div className="py-24 text-center text-silken-whisper">No recordings yet. Sessions are recorded automatically.</div>
        : (
          <div className="space-y-1">
            {list.map(r => (
              <div key={r.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-smokey-carbon transition-all group">
                <div className="flex items-center gap-4"><PlayCircle className="w-5 h-5 text-muted-ash group-hover:text-chartreuse-zap transition-colors" /><div><h4 className="font-bold text-sm">{r.name || 'Unnamed Session'}</h4><p className="text-xs text-muted-ash">{new Date(r.created_at).toLocaleDateString()} · {fmtB(r.file_size_bytes)}</p></div></div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-ash">{fmtD(r.duration_seconds)}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Btn variant="ghost" className="p-2"><Download className="w-4 h-4" /></Btn>
                    <Btn variant="ghost" className="p-2 hover:text-alert-red" onClick={() => recordingsApi.delete(r.id).then(() => setList(p => p.filter(x => x.id !== r.id)))}><Trash2 className="w-4 h-4" /></Btn>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

const SnippetsTab = () => {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', command: '', tag: '' });
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => { snippetsApi.list().then(setList).catch(() => {}).finally(() => setLoading(false)); }, []);

  const save = async () => {
    if (!form.name || !form.command) return;
    setSaving(true);
    const s = await snippetsApi.create(form).catch(() => null);
    if (s) { setList(p => [s, ...p]); setShowForm(false); setForm({ name: '', command: '', tag: '' }); }
    setSaving(false);
  };

  const copy = (id: string, cmd: string) => { navigator.clipboard.writeText(cmd); setCopied(id); setTimeout(() => setCopied(null), 2000); };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8"><h1 className="text-4xl font-bold">Snippets</h1><Btn onClick={() => setShowForm(v => !v)}><Plus className="w-4 h-4" /> New Snippet</Btn></div>
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card className="mb-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Docker Clean" />
                <Input label="Tag" value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} placeholder="DevOps" />
              </div>
              <Input label="Command" value={form.command} onChange={e => setForm(f => ({ ...f, command: e.target.value }))} placeholder="docker system prune -a --volumes" className="font-mono" />
              <div className="flex gap-3"><Btn variant="secondary" onClick={() => setShowForm(false)}>Cancel</Btn><Btn onClick={save} loading={saving}>Save Snippet</Btn></div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      {loading ? <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-muted-ash" /></div>
        : list.length === 0 ? <div className="py-24 text-center text-silken-whisper">No snippets yet. Save frequently used commands here.</div>
        : (
          <div className="space-y-4">
            {list.map(s => (
              <Card key={s.id} className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold flex items-center gap-2">{s.name}{s.tag && <span className="text-[10px] bg-midnight-oil border border-cool-stone px-2 py-0.5 rounded text-muted-ash">{s.tag}</span>}</h3>
                  <div className="flex gap-1">
                    <button className="p-1.5 text-muted-ash hover:text-chartreuse-zap" onClick={() => copy(s.id, s.command)}>{copied === s.id ? <Check className="w-4 h-4 text-chartreuse-zap" /> : <Copy className="w-4 h-4" />}</button>
                    <button className="p-1.5 text-muted-ash hover:text-alert-red" onClick={() => snippetsApi.delete(s.id).then(() => setList(p => p.filter(x => x.id !== s.id)))}><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="bg-midnight-oil p-3 rounded font-mono text-sm text-chartreuse-zap"><code>{s.command}</code></div>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
};

const NotificationsTab = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [slackUrl, setSlackUrl] = useState('');
  const [savingSlack, setSavingSlack] = useState(false);
  const [testingSlack, setTestingSlack] = useState(false);

  useEffect(() => { notificationsApi.getSettings().then(s => { setSettings(s); setSlackUrl(s?.slack_webhook_url || ''); }).catch(() => {}).finally(() => setLoading(false)); }, []);

  const toggle = async (f: 'browser_push' | 'email_updates') => {
    const val = !settings[f];
    setSettings((s: any) => ({ ...s, [f]: val }));
    await notificationsApi.updateSettings({ [f === 'browser_push' ? 'browserPush' : 'emailUpdates']: val }).catch(() => {});
  };

  if (loading) return <div className="p-8 flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-muted-ash" /></div>;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Notifications</h1>
      <Card className="space-y-8 max-w-2xl">
        <div className="flex items-center justify-between"><div><p className="font-bold flex items-center gap-2"><Maximize2 className="w-4 h-4" /> Browser Push</p><p className="text-xs text-muted-ash mt-1">Desktop alerts when sessions start or commands finish.</p></div><Toggle on={!!settings?.browser_push} onChange={() => toggle('browser_push')} /></div>
        <div className="border-t border-cool-stone" />
        <div className="flex items-center justify-between"><div><p className="font-bold flex items-center gap-2"><Mail className="w-4 h-4" /> Email Updates</p><p className="text-xs text-muted-ash mt-1">Daily summaries and account alerts via email.</p></div><Toggle on={!!settings?.email_updates} onChange={() => toggle('email_updates')} /></div>
        <div className="border-t border-cool-stone" />
        <div className="space-y-3">
          <div className="flex items-center justify-between"><p className="font-bold flex items-center gap-2"><Slack className="w-4 h-4" /> Slack Webhook</p>
            <Btn variant="secondary" className="px-3 py-1 text-xs" onClick={async () => { setTestingSlack(true); await notificationsApi.testSlack().catch(() => {}); setTestingSlack(false); }} loading={testingSlack} disabled={!settings?.slack_webhook_url}>Test</Btn>
          </div>
          <div className="flex gap-2">
            <input value={slackUrl} onChange={e => setSlackUrl(e.target.value)} placeholder="https://hooks.slack.com/services/..." className="flex-1 bg-midnight-oil border border-cool-stone rounded p-3 text-xs outline-none focus:border-chartreuse-zap" />
            <Btn variant="secondary" onClick={async () => { setSavingSlack(true); await notificationsApi.updateSettings({ slackWebhookUrl: slackUrl }); setSavingSlack(false); }} loading={savingSlack}>Save</Btn>
          </div>
        </div>
      </Card>
    </div>
  );
};

const TeamTab = ({ plan }: { plan: string }) => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const isPro = plan === 'pro' || plan === 'elite';

  useEffect(() => { if (isPro) teamApi.list().then(setMembers).catch(() => {}).finally(() => setLoading(false)); else setLoading(false); }, [isPro]);

  const invite = async () => {
    if (!email) return;
    setInviting(true);
    const m = await teamApi.invite(email, 'viewer').catch(() => null);
    if (m) setMembers(p => [...p, m]);
    setEmail(''); setInviting(false);
  };

  if (!isPro) return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Team</h1>
      <div className="h-96 flex flex-col items-center justify-center text-center">
        <div className="bg-chartreuse-zap/10 p-6 rounded-full mb-6"><ShieldCheck className="w-12 h-12 text-chartreuse-zap" /></div>
        <h2 className="text-2xl font-bold mb-2">Upgrade for Team Features</h2>
        <p className="text-silken-whisper max-w-sm mb-8">Team management is available on Pro and Elite plans.</p>
        <Btn>Upgrade Now</Btn>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Team</h1>
      <div className="flex gap-2 mb-8">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="teammate@company.com" onKeyDown={e => e.key === 'Enter' && invite()} className="flex-1 bg-smokey-carbon border border-cool-stone rounded p-3 text-sm outline-none focus:border-chartreuse-zap" />
        <Btn onClick={invite} loading={inviting}><UserPlus className="w-4 h-4" /> Invite</Btn>
      </div>
      {loading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-ash" /></div>
        : members.length === 0 ? <div className="py-24 text-center text-silken-whisper">No team members yet. Invite someone above.</div>
        : (
          <div className="space-y-2">
            {members.map(m => (
              <div key={m.id} className="flex items-center justify-between p-4 bg-smokey-carbon rounded-lg border border-cool-stone">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-midnight-oil border border-cool-stone flex items-center justify-center font-bold text-chartreuse-zap text-sm">{(m.invited_email || '?')[0].toUpperCase()}</div>
                  <div><p className="font-bold text-sm">{m.invited_email}</p><p className="text-xs text-muted-ash capitalize">{m.status}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] bg-midnight-oil border border-cool-stone px-2 py-1 rounded-full uppercase font-bold text-muted-ash">{m.role}</span>
                  <button className="p-1 text-muted-ash hover:text-alert-red transition-colors" onClick={() => teamApi.remove(m.id).then(() => setMembers(p => p.filter(x => x.id !== m.id)))}><X className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

const BillingTab = ({ userProfile }: { userProfile: any }) => {
  const [loading, setLoading] = useState(false);
  const portal = async () => { setLoading(true); try { const { url } = await billing.createPortalSession(); window.location.href = url; } catch {} finally { setLoading(false); } };
  const daysLeft = userProfile?.trial_ends_at ? Math.max(0, Math.ceil((new Date(userProfile.trial_ends_at).getTime() - Date.now()) / 86400000)) : null;
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Billing</h1>
      <div className="space-y-6 max-w-2xl">
        <Card className="flex items-center justify-between">
          <div><p className="text-xs text-muted-ash font-bold uppercase mb-1">Current Plan</p><p className="text-2xl font-bold text-chartreuse-zap capitalize">{userProfile?.plan || 'Trial'}</p><p className="text-sm text-silken-whisper capitalize">{userProfile?.subscription_status || 'trialing'}</p>{daysLeft !== null && userProfile?.subscription_status === 'trialing' && <p className="text-xs text-chartreuse-zap mt-1">{daysLeft} days left in trial</p>}</div>
          <Btn onClick={portal} loading={loading}><ExternalLink className="w-4 h-4" /> Manage Billing</Btn>
        </Card>
        <Card><p className="text-sm text-silken-whisper">To change your plan, view invoices, or cancel — click <strong>Manage Billing</strong> above to access our secure Stripe portal.</p></Card>
      </div>
    </div>
  );
};

const SettingsTab = ({ userProfile, onSignOut }: { userProfile: any; onSignOut: () => void }) => {
  const { refreshProfile } = useAuth();
  const [name, setName] = useState(userProfile?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);

  const save = async () => { setSaving(true); await profileApi.update({ fullName: name }).catch(() => {}); await refreshProfile(); setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const regen = async () => {
    if (!confirm('Regenerate your agent token? Your current agent will disconnect.')) return;
    setRegenLoading(true); await profileApi.regenerateToken().catch(() => {}); await refreshProfile(); setRegenLoading(false);
  };

  return (
    <div className="p-8 pb-24">
      <h1 className="text-4xl font-bold mb-12">Settings</h1>
      <div className="max-w-2xl space-y-12">
        <section className="space-y-5">
          <h3 className="text-xs font-bold text-muted-ash uppercase border-b border-cool-stone pb-2 tracking-widest">Profile</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} />
            <Input label="Email" value={userProfile?.email || ''} disabled className="opacity-50 cursor-not-allowed" />
          </div>
          <Btn className="px-8" onClick={save} loading={saving}>{saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save Changes'}</Btn>
        </section>

        <section className="space-y-5">
          <h3 className="text-xs font-bold text-muted-ash uppercase border-b border-cool-stone pb-2 tracking-widest">Agent</h3>
          <Card className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${userProfile?.agent_connected_at ? 'bg-[#50fa7b]' : 'bg-muted-ash'}`} />
              <div><p className="font-bold text-sm">{userProfile?.agent_connected_at ? 'Connected' : 'Not connected'}</p>{userProfile?.agent_hostname && <p className="text-xs text-muted-ash">{userProfile.agent_hostname} · {userProfile.agent_os}</p>}</div>
            </div>
            <Btn variant="secondary" className="text-xs px-3 py-1.5" onClick={regen} loading={regenLoading}>Regenerate Token</Btn>
          </Card>
        </section>

        <section className="space-y-5">
          <h3 className="text-xs font-bold text-alert-red uppercase border-b border-alert-red/30 pb-2 tracking-widest">Danger Zone</h3>
          <Card className="flex items-center justify-between border-alert-red/20">
            <div><p className="font-bold text-sm">Sign Out</p><p className="text-xs text-muted-ash">Sign out of this device.</p></div>
            <Btn variant="secondary" className="text-xs px-3 py-1.5" onClick={onSignOut}>Sign Out</Btn>
          </Card>
        </section>
      </div>
    </div>
  );
};

// ── Dashboard Shell ───────────────────────────────────────────
const Dashboard = ({ setView }: { setView: (v: View) => void }) => {
  const { profile, signOut } = useAuth();
  const [tab, setTab] = useState<DashboardTab>('SESSIONS');

  const handleSignOut = async () => { await signOut(); setView('LANDING'); };

  const tabs: { id: DashboardTab; label: string; icon: React.ReactNode }[] = [
    { id: 'SESSIONS', label: 'Sessions', icon: <Terminal className="w-4 h-4" /> },
    { id: 'RECORDINGS', label: 'Recordings', icon: <History className="w-4 h-4" /> },
    { id: 'SNIPPETS', label: 'Snippets', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'NOTIFICATIONS', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'TEAM', label: 'Team', icon: <Users className="w-4 h-4" /> },
    { id: 'BILLING', label: 'Billing', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'SETTINGS', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="flex h-screen bg-midnight-oil overflow-hidden">
      <aside className="w-64 border-r border-cool-stone flex flex-col flex-shrink-0">
        <div className="px-6 py-5 border-b border-cool-stone flex items-center gap-2 cursor-pointer" onClick={() => setView('LANDING')}>
          <TerminalSquare className="text-chartreuse-zap h-7 w-7" /><span className="text-lg font-bold">CoShell</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${tab === t.id ? 'bg-chartreuse-zap/10 text-chartreuse-zap font-bold' : 'text-silken-whisper hover:text-cloud-white hover:bg-smokey-carbon'}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-cool-stone">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-chartreuse-zap/20 flex items-center justify-center text-xs font-bold text-chartreuse-zap">{(profile?.full_name || profile?.email || 'U')[0].toUpperCase()}</div>
            <div className="flex-1 min-w-0"><p className="text-sm font-bold truncate">{profile?.full_name || 'User'}</p><p className="text-[10px] text-muted-ash capitalize">{profile?.plan || 'trial'} plan</p></div>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            {tab === 'SESSIONS' && <SessionsTab />}
            {tab === 'RECORDINGS' && <RecordingsTab />}
            {tab === 'SNIPPETS' && <SnippetsTab />}
            {tab === 'NOTIFICATIONS' && <NotificationsTab />}
            {tab === 'TEAM' && <TeamTab plan={profile?.plan || 'trial'} />}
            {tab === 'BILLING' && <BillingTab userProfile={profile} />}
            {tab === 'SETTINGS' && <SettingsTab userProfile={profile} onSignOut={handleSignOut} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

// ── Root App ──────────────────────────────────────────────────
function AppInner() {
  const { user, profile, loading } = useAuth();
  const [view, setView] = useState<View>('LANDING');

  // Handle Stripe return
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get('session_id')) {
      window.history.replaceState({}, '', window.location.pathname);
      if (user) setView('ONBOARDING');
    }
  }, [user]);

  // Smart post-login redirect
  useEffect(() => {
    if (loading || !user || !profile) return;
    if (view === 'LOGIN' || view === 'SIGNUP') {
      if (!profile.stripe_subscription_id) setView('PLAN_SELECT');
      else if (!profile.agent_connected_at) setView('ONBOARDING');
      else setView('DASHBOARD');
    }
  }, [user, profile, loading]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-chartreuse-zap" /></div>;

  const navProps = { setView, onLogin: () => setView('LOGIN'), onStart: () => setView('SIGNUP') };

  const withNav = (child: React.ReactNode) => <><Nav {...navProps} />{child}</>;

  const publicViews: Partial<Record<View, React.ReactNode>> = {
    FEATURES: withNav(<FeaturesPage />),
    HOW_IT_WORKS: withNav(<HowItWorksPage />),
    PRICING: withNav(<PricingPage />),
    CHANGELOG: withNav(<ChangelogPage />),
    DOCS: withNav(<DocsPage />),
    PRIVACY: withNav(<PrivacyPolicyPage />),
    TERMS: withNav(<TermsOfServicePage />),
    SECURITY: withNav(<SecurityPage />),
  };

  if (publicViews[view]) return <AnimatePresence mode="wait"><motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{publicViews[view]}</motion.div></AnimatePresence>;

  return (
    <AnimatePresence mode="wait">
      <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
        {view === 'LANDING' && <LandingPage setView={setView} />}
        {view === 'SIGNUP' && <SignupPage setView={setView} />}
        {view === 'LOGIN' && <LoginPage setView={setView} />}
        {view === 'PLAN_SELECT' && <PlanSelectPage setView={setView} />}
        {view === 'ONBOARDING' && <OnboardingPage onComplete={() => setView('DASHBOARD')} />}
        {view === 'DASHBOARD' && (user ? <Dashboard setView={setView} /> : <LoginPage setView={setView} />)}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return <AuthProvider><AppInner /></AuthProvider>;
}
