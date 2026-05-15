import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  ExternalLink, 
  ChevronRight,
  BookOpen,
  Terminal,
  Shield,
  Layers,
  Monitor,
  Zap,
  Lock,
  Cloud
} from 'lucide-react';
import { Card } from '../App';

export const ChangelogPage = () => {
    return (
        <div className="py-24 px-6 max-w-4xl mx-auto">
            <div className="text-center mb-24">
                <h1 className="text-5xl font-basier font-bold mb-6">What’s new in CoShell.</h1>
                <p className="text-xl text-shadow-white mb-8">We ship every week. Here’s what we’ve been building.</p>
                <div className="flex max-w-md mx-auto items-center">
                    <input placeholder="Get notified when we ship" className="flex-1 bg-smokey-carbon border border-cool-stone rounded-l-full py-3 px-6 outline-none focus:border-chartreuse-zap" />
                    <button className="bg-chartreuse-zap text-midnight-oil px-6 py-3 rounded-r-full font-bold">Subscribe</button>
                </div>
            </div>

            <div className="space-y-16">
                {[
                    { version: "v1.2.4", date: "October 14, 2026", title: "Two-Cursor Collaboration & Custom Redaction", items: ["Added visual cursors for viewers in read-write sessions.", "Introducing support for custom regex patterns in secret redaction.", "Improved terminal resize performance on high-latency connections."] },
                    { version: "v1.2.3", date: "October 7, 2026", title: "Slack Webhook Enhancements", items: ["Added toggle for specific Slack event notifications.", "Fixed bug where agent would occasionally disconnect during sleep.", "New 'Peek Mode' visual indicator in terminal viewer."] }
                ].map((entry, idx) => (
                    <div key={idx} className="relative pl-12 border-l border-cool-stone">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-chartreuse-zap border-4 border-midnight-oil shadow-[0_0_10px_rgba(250,255,105,0.5)]" />
                        <div className="space-y-2 mb-4">
                            <span className="text-xs font-bold text-chartreuse-zap bg-chartreuse-zap/10 px-2 py-0.5 rounded">{entry.version}</span>
                            <span className="text-xs text-muted-ash ml-3">{entry.date}</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-4">{entry.title}</h3>
                        <ul className="space-y-3">
                            {entry.items.map((item, i) => (
                                <li key={i} className="text-silken-whisper flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-cool-stone rounded-full mt-2 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const DocsPage = () => {
    const sections = [
        { title: "Getting Started", items: ["Welcome", "Quick Start", "Installing the Agent", "Creating Your First Session", "Sharing a Link"] },
        { title: "Agent", items: ["Installation", "Configuration", "Auto-Updates", "Docker Support", "Running on VPS"] },
        { title: "Collaboration", items: ["Multi-Viewer", "Granting Control", "Chat", "Request Control"] }
    ];

    return (
        <div className="flex min-h-screen">
            {/* Sidebar Docs */}
            <aside className="w-64 border-r border-cool-stone p-8 hidden lg:block sticky top-20 h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar">
                <nav className="space-y-10">
                    {sections.map((sec, i) => (
                        <div key={i}>
                            <h4 className="text-[10px] font-black text-muted-ash uppercase tracking-widest mb-4">{sec.title}</h4>
                            <ul className="space-y-2">
                                {sec.items.map((item, j) => (
                                    <li key={j}>
                                        <a href="#" className="text-sm text-silken-whisper hover:text-chartreuse-zap transition-colors">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Content Docs */}
            <main className="flex-1 p-8 lg:p-16 max-w-4xl">
                 <div className="mb-16">
                     <h1 className="text-5xl font-basier font-bold mb-6">Documentation</h1>
                     <p className="text-xl text-shadow-white">Everything you need to install, configure, and get the most out of CoShell.</p>
                 </div>

                 <div className="grid md:grid-cols-2 gap-6 mb-16">
                     <Card className="hover:border-chartreuse-zap cursor-pointer">
                         <Zap className="text-chartreuse-zap w-6 h-6 mb-4" />
                         <h3 className="font-bold mb-2">Quick Start</h3>
                         <p className="text-xs text-muted-ash">Go from account creation to first shared session in under a minute.</p>
                     </Card>
                     <Card className="hover:border-chartreuse-zap cursor-pointer">
                         <BookOpen className="text-chartreuse-zap w-6 h-6 mb-4" />
                         <h3 className="font-bold mb-2">Agent Guide</h3>
                         <p className="text-xs text-muted-ash">Deep dive into installing the agent on various platforms and environments.</p>
                     </Card>
                 </div>

                 <article className="prose prose-invert max-w-none space-y-12">
                     <section className="space-y-6">
                         <h2 className="text-3xl font-basier font-bold border-b border-cool-stone pb-2">Quick Start</h2>
                         <p className="text-silken-whisper">The fastest way to get started with CoShell is by running the installation command on your local machine.</p>
                         <div className="bg-smokey-carbon p-6 rounded-lg font-mono text-sm border border-cool-stone group relative">
                             <div className="text-muted-ash mb-2 select-none"># Install the agent</div>
                             <code className="text-chartreuse-zap italic">curl -fsSL https://coshell.dev/install.sh | sh</code>
                             <button className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"><ExternalLink className="w-4 h-4 text-shadow-white" /></button>
                         </div>
                     </section>

                     <section className="space-y-6">
                         <h2 className="text-3xl font-basier font-bold border-b border-cool-stone pb-2">Platform Support</h2>
                         <div className="grid grid-cols-2 gap-4">
                             <div className="flex items-center gap-3 p-4 bg-smokey-carbon/50 rounded-lg">
                                 <Terminal className="text-chartreuse-zap" />
                                 <span className="text-sm">macOS (Intel/M1/M2)</span>
                             </div>
                             <div className="flex items-center gap-3 p-4 bg-smokey-carbon/50 rounded-lg">
                                 <Layers className="text-chartreuse-zap" />
                                 <span className="text-sm">Linux (Aarch64/x86_64)</span>
                             </div>
                             <div className="flex items-center gap-3 p-4 bg-smokey-carbon/50 rounded-lg">
                                 <Monitor className="text-chartreuse-zap" />
                                 <span className="text-sm">Windows (WSL2)</span>
                             </div>
                             <div className="flex items-center gap-3 p-4 bg-smokey-carbon/50 rounded-lg">
                                 <Cloud className="text-chartreuse-zap" />
                                 <span className="text-sm">Docker & CI/CD</span>
                             </div>
                         </div>
                     </section>
                 </article>
            </main>
        </div>
    );
};
