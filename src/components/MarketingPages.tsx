import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Terminal, 
  Share2, 
  Users, 
  ShieldCheck, 
  EyeOff, 
  PlayCircle, 
  Bell, 
  ChevronRight,
  Code,
  Layers,
  Lock,
  Cpu,
  Monitor,
  Zap,
  Check,
  Slack
} from 'lucide-react';
import { Button, Card } from '../App';

export const FeaturesPage = () => {
  const sections = [
    {
      title: "Sharing",
      features: [
        {
          name: "Instant Terminal Sharing",
          desc: "One click on the host machine generates a unique shareable URL. Anyone with that link can open your terminal in their browser instantly. No SSH keys. No port forwarding. No VPN. No firewall rules. Just a link."
        },
        {
          name: "Read-Only and Read-Write Links",
          desc: "Choose the permission level when creating a session. Read-only means viewers watch; read-write means they interact. Change permissions at any time without ending the session."
        },
        {
          name: "Auto-Expiring Sessions",
          desc: "Set expiry from 1 hour to 7 days. When it expires, all viewers are disconnected and recording stops. Kill session manually at any time."
        }
      ]
    },
    {
      title: "Collaboration",
      features: [
        {
          name: "Multi-Viewer Sessions",
          desc: "Everyone sees the same output in real time. The host decides who can type. Total viewer count is always visible."
        },
        {
          name: "Two-Cursor Collaboration",
          desc: "Viewers drop a colored cursor to point at lines. Host sees all cursors. Feels like pointing over someone’s shoulder."
        },
        {
          name: "Built-In Chat Sidebar",
          desc: "Every session has a chat panel. Messages are saved with the recording for full context during replay."
        }
      ]
    }
  ];

  return (
    <div className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-24">
        <h1 className="text-5xl font-basier font-bold mb-6">Built for developers who move fast.</h1>
        <p className="text-xl text-shadow-white">Every feature in CoShell exists to solve a real problem. No bloat, no fluff.</p>
      </div>

      <div className="space-y-32">
        {sections.map((section, idx) => (
          <div key={idx}>
            <h2 className="text-3xl font-basier font-bold mb-12 border-b border-cool-stone pb-4 text-chartreuse-zap inline-block">{section.title}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {section.features.map((f, i) => (
                <div key={i} className="space-y-4">
                  <h3 className="text-xl font-bold text-cloud-white">{f.name}</h3>
                  <p className="text-silken-whisper leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <section className="space-y-12">
            <h2 className="text-3xl font-basier font-bold mb-12 border-b border-cool-stone pb-4 text-chartreuse-zap inline-block">Safety</h2>
            <div className="grid md:grid-cols-2 gap-12">
                <Card className="hover:border-chartreuse-zap transition-all">
                    <ShieldCheck className="w-8 h-8 text-chartreuse-zap mb-4" />
                    <h3 className="text-xl font-bold mb-3">Command Whitelist & Blacklist</h3>
                    <p className="text-silken-whisper">Define allowed or blocked commands. The agent intercepts and blocks dangerous commands like rm -rf before they execute.</p>
                </Card>
                <Card className="hover:border-chartreuse-zap transition-all">
                    <EyeOff className="w-8 h-8 text-chartreuse-zap mb-4" />
                    <h3 className="text-xl font-bold mb-3">Automatic Secret Redaction</h3>
                    <p className="text-silken-whisper">Masks AWS keys, GitHub tokens, and passwords automatically. Viewers see asterisks while the host sees real output.</p>
                </Card>
            </div>
        </section>

        <section>
            <h2 className="text-3xl font-basier font-bold mb-12 border-b border-cool-stone pb-4 text-chartreuse-zap inline-block">Recording</h2>
            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-cloud-white">Automatic Session Recording</h3>
                    <p className="text-silken-whisper leading-relaxed">Recorded automatically from the start. Stored in asciinema format in cloud storage. Play back, download, or share as a replay link.</p>
                </div>
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-cloud-white">Session Replay & Bookmarks</h3>
                    <p className="text-silken-whisper leading-relaxed">Video-like player for terminal output. Drop bookmarks during live sessions to flag important moments for easy navigation during replay.</p>
                </div>
            </div>
        </section>

        <section>
            <h2 className="text-3xl font-basier font-bold mb-12 border-b border-cool-stone pb-4 text-chartreuse-zap inline-block">Notifications</h2>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="p-6 bg-smokey-carbon rounded-xl border border-cool-stone">
                    <Bell className="w-6 h-6 text-chartreuse-zap mb-4" />
                    <h4 className="font-bold mb-2">Command Completion</h4>
                    <p className="text-sm text-silken-whisper">Get notified when a long-running command finishes. Works via browser, email, or Slack.</p>
                </div>
                <div className="p-6 bg-smokey-carbon rounded-xl border border-cool-stone">
                    <Slack className="w-6 h-6 text-chartreuse-zap mb-4" />
                    <h4 className="font-bold mb-2">Slack Integration</h4>
                    <p className="text-sm text-silken-whisper">Connect your workspace. Choose events like viewer joins or session expiry to trigger messages.</p>
                </div>
                <div className="p-6 bg-smokey-carbon rounded-xl border border-cool-stone">
                    <Monitor className="w-6 h-6 text-chartreuse-zap mb-4" />
                    <h4 className="font-bold mb-2">Browser Push</h4>
                    <p className="text-sm text-silken-whisper">Enable alerts even when the CoShell tab is in the background. Works on desktop and mobile.</p>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
};

export const HowItWorksPage = () => {
  const steps = [
    { title: "Create your account", desc: "Sign up with email, GitHub, or Google. Your account is ready immediately with a 7-day free trial." },
    { title: "Install the agent", desc: "Run a single curl command to install the lightweight daemon. Works on macOS, Linux, and Windows.", code: "curl -sSL https://get.coshell.io | bash" },
    { title: "Create a session", desc: "Click 'New Session' in your dashboard. Set your expiry and permissions. Get a unique URL instantly." },
    { title: "Share and Collaborate", desc: "Send the link out. Your team joins via browser. No installs or accounts needed on their end." }
  ];

  return (
    <div className="py-24 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-24">
        <h1 className="text-5xl font-basier font-bold mb-6">From zero to sharing in under 60 seconds.</h1>
        <p className="text-xl text-shadow-white">CoShell is designed to get out of your way.</p>
      </div>

      <div className="space-y-24">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-12 group">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-2 border-chartreuse-zap flex items-center justify-center font-basier font-bold text-chartreuse-zap text-xl group-hover:bg-chartreuse-zap group-hover:text-midnight-oil transition-all shrink-0">
                {i + 1}
              </div>
              {i < steps.length - 1 && <div className="w-px flex-1 bg-cool-stone my-4" />}
            </div>
            <div className="pb-12 space-y-4">
              <h3 className="text-2xl font-basier font-bold">{step.title}</h3>
              <p className="text-silken-whisper text-lg leading-relaxed">{step.desc}</p>
              {step.code && (
                <div className="bg-smokey-carbon p-4 rounded border border-cool-stone font-mono text-chartreuse-zap">
                  {step.code}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 pt-24 border-t border-cool-stone grid md:grid-cols-3 gap-8">
          <div className="flex gap-4">
              <Monitor className="text-chartreuse-zap shrink-0" />
              <div>
                  <h4 className="font-bold mb-1">macOS</h4>
                  <p className="text-xs text-muted-ash">Intel & Apple Silicon. macOS 12+.</p>
              </div>
          </div>
          <div className="flex gap-4">
              <Cpu className="text-chartreuse-zap shrink-0" />
              <div>
                  <h4 className="font-bold mb-1">Linux</h4>
                  <p className="text-xs text-muted-ash">Any modern distro. VPS, ARM, Docker.</p>
              </div>
          </div>
          <div className="flex gap-4">
              <Zap className="text-chartreuse-zap shrink-0" />
              <div>
                  <h4 className="font-bold mb-1">Windows</h4>
                  <p className="text-xs text-muted-ash">Windows 10+. Native & WSL.</p>
              </div>
          </div>
      </div>
    </div>
  );
};

export const PricingPage = () => {
    const [isAnnual, setIsAnnual] = React.useState(false);
    return (
        <div className="py-24 px-6 max-w-6xl mx-auto">
             <div className="text-center mb-16">
                <h2 className="text-5xl font-basier font-bold mb-4">Simple, transparent pricing.</h2>
                <p className="text-shadow-white mb-8">Start free for 7 days. No card required.</p>
                <div className="flex items-center justify-center gap-4">
                    <span className={!isAnnual ? 'text-cloud-white' : 'text-muted-ash'}>Monthly</span>
                    <button 
                        onClick={() => setIsAnnual(!isAnnual)}
                        className="w-12 h-6 bg-muted-ash rounded-full p-1 relative"
                    >
                        <motion.div 
                            animate={{ x: isAnnual ? 24 : 0 }}
                            className="w-4 h-4 bg-chartreuse-zap rounded-full shadow-[0_0_8px_rgba(250,255,105,0.5)]" 
                        />
                    </button>
                    <span className={isAnnual ? 'text-cloud-white' : 'text-muted-ash'}>Annual <span className="text-[10px] bg-chartreuse-zap text-midnight-oil px-1.5 py-0.5 rounded ml-1 font-bold">SAVE 10%</span></span>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { name: "Basic", price: isAnnual ? 13.5 : 15, features: ["1 viewer / session", "7-day recording retention", "Chat sidebar", "60-second instant replay", "Save to Gist", "Browser push"] },
                    { name: "Pro", price: isAnnual ? 22.5 : 25, popular: true, features: ["Up to 5 viewers", "30-day recording retention", "Command whitelist", "Secret redaction", "Two-cursor collaboration", "Slack & Email alerts"] },
                    { name: "Elite", price: isAnnual ? 45 : 50, features: ["Up to 20 viewers", "1-year recording retention", "Multi-session broadcast", "AI session summaries", "SSO / SAML", "Audit logs"] }
                ].map((plan, i) => (
                    <Card key={i} className={`flex flex-col relative ${plan.popular ? 'border-chartreuse-zap ring-1 ring-chartreuse-zap' : ''}`}>
                        {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-chartreuse-zap text-midnight-oil text-[10px] font-bold px-3 py-1 rounded-full uppercase">Most Popular</div>}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold font-basier text-chartreuse-zap">${plan.price}</span>
                                <span className="text-muted-ash">/month</span>
                            </div>
                        </div>
                        <ul className="flex-1 space-y-3 mb-8">
                            {plan.features.map((f, j) => (
                                <li key={j} className="flex items-start gap-2 text-sm text-shadow-white">
                                    <Check className="w-4 h-4 text-chartreuse-zap mt-0.5 shrink-0" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <Button variant={plan.popular ? 'primary' : 'secondary'} className="w-full py-4">Get Started</Button>
                    </Card>
                ))}
            </div>
            <div className="mt-24 bg-smokey-carbon p-12 rounded-2xl border border-cool-stone text-center max-w-4xl mx-auto">
                <h3 className="text-3xl font-basier font-bold mb-4">Enterprise</h3>
                <p className="text-silken-whisper mb-8">Need something beyond Elite? We offer custom contracts, dedicated infrastructure, on-premise deployment, and white-glove onboarding.</p>
                <Button className="mx-auto px-12 py-4">Talk to Us</Button>
            </div>

            <div className="mt-32 max-w-4xl mx-auto">
                <h3 className="text-3xl font-basier font-bold mb-12 text-center">Frequently Asked Questions</h3>
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                    {[
                        { q: "What happens when my trial ends?", a: "Your account pauses. You keep access to your recordings but cannot create new sessions until you pick a plan." },
                        { q: "Can I change plans anytime?", a: "Yes. Upgrade or downgrade at any time. Upgrades take effect immediately; downgrades at the end of your billing cycle." },
                        { q: "What count as a viewer?", a: "A viewer is anyone who connects to your shared session link. The viewer limit applies per session, not per account." },
                        { q: "Do you offer student discounts?", a: "Reach out to us and we'll see what we can do." }
                    ].map((item, i) => (
                        <div key={i} className="space-y-2">
                            <h4 className="font-bold text-chartreuse-zap">{item.q}</h4>
                            <p className="text-sm text-silken-whisper tracking-tight">{item.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
