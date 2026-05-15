import React from 'react';
import { Shield, Lock, Fingerprint, RefreshCcw, Eye, Database } from 'lucide-react';

// Define Card locally since it's not exported from App
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-smokey-carbon border border-cool-stone rounded-lg p-6 ${className}`}>{children}</div>
);

const LegalLayout = ({ title, children, lastUpdated }: { title: string, children: React.ReactNode, lastUpdated: string }) => (
    <div className="py-24 px-6 max-w-4xl mx-auto min-h-screen">
        <div className="mb-16">
            <h1 className="text-5xl font-basier font-bold mb-4">{title}</h1>
            <p className="text-muted-ash text-sm uppercase tracking-widest font-black">Last Updated: {lastUpdated}</p>
        </div>
        <div className="prose prose-invert prose-p:text-silken-whisper prose-h3:text-cloud-white prose-h2:text-cloud-white max-w-none space-y-12">
            {children}
        </div>
    </div>
);

export const PrivacyPolicyPage = () => (
    <LegalLayout title="Privacy Policy" lastUpdated="January 2026">
        <section className="space-y-4">
            <h2 className="text-2xl font-bold">What we collect</h2>
            <p>When you create an account we collect your email address and name. When you use CoShell we collect data about your sessions — such as start time, end time, duration, and viewer count.</p>
        </section>
        <section className="space-y-4">
            <h2 className="text-2xl font-bold">How we use your data</h2>
            <p>We use your email for account-related communications — welcome emails, trial reminders, and billing. We use session metadata to power your dashboard. We use analytics data to improve our service.</p>
        </section>
        <section className="space-y-4">
            <h2 className="text-2xl font-bold">Data storage and security</h2>
            <p>Session recordings are stored encrypted on Cloudflare R2 infrastructure. Account data is stored in our database hosted on Supabase. All data in transit is encrypted via TLS. We do not sell or rent your data.</p>
        </section>
        <section className="space-y-4">
             <h2 className="text-2xl font-bold">Third parties</h2>
             <p>We use Stripe for payment processing, Cloudflare for storage, Supabase for our database, Resend for email, and PostHog for analytics. Each of these services has their own privacy policies.</p>
        </section>
        <div className="mt-12 p-6 bg-smokey-carbon rounded-lg border border-cool-stone">
            <p className="text-sm font-bold text-chartreuse-zap mb-2">Need to export or delete your data?</p>
            <p className="text-xs text-silken-whisper">Contact us at <span className="text-cloud-white underline">privacy@coshell.io</span> or use the export tools in your settings dashboard.</p>
        </div>
    </LegalLayout>
);

export const TermsOfServicePage = () => (
    <LegalLayout title="Terms of Service" lastUpdated="January 2026">
        <section className="space-y-4">
            <h2 className="text-2xl font-bold">Acceptance</h2>
            <p>By creating a CoShell account you agree to these terms. If you do not agree, do not use the service.</p>
        </section>
        <section className="space-y-4">
            <h2 className="text-2xl font-bold">Acceptable use</h2>
            <p>You may not use CoShell to share access to systems you do not own or have explicit permission to access. You may not use CoShell for any illegal purpose. You may not attempt to reverse engineer or copy CoShell.</p>
        </section>
        <section className="space-y-4">
            <h2 className="text-2xl font-bold">Payment and billing</h2>
            <p>Paid plans are billed monthly or annually in advance. If a payment fails we will notify you and give you a grace period before suspending your account. We do not offer refunds except as required by law.</p>
        </section>
        <section className="space-y-4">
            <h2 className="text-2xl font-bold">Limitation of liability</h2>
            <p>CoShell is provided as-is. We are not liable for any damages resulting from your use of the service, including but not limited to data loss, service interruptions, or unauthorized access.</p>
        </section>
    </LegalLayout>
);

export const SecurityPage = () => (
    <div className="py-24 px-6 max-w-6xl mx-auto min-h-screen">
        <div className="text-center mb-16">
            <h1 className="text-5xl font-basier font-bold mb-4">Security at CoShell.</h1>
            <p className="text-xl text-shadow-white">We take the security of your terminal sessions seriously. Here's how we protect you.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {[
                { icon: <Shield />, title: "Encryption in transit", desc: "All communication between agent, server, and viewers is encrypted using TLS 1.2+." },
                { icon: <Lock />, title: "Encryption at rest", desc: "Recordings on Cloudflare R2 and account data in Supabase are encrypted at rest." },
                { icon: <Fingerprint />, title: "Secure Auth", desc: "Passwords are hashed with bcrypt. GitHub/Google OAuth supported for MFA." },
                { icon: <RefreshCcw />, title: "Token Rotation", desc: "Agent tokens can be invalidated and regenerated instantly from your settings." },
                { icon: <Eye />, title: "Secret Redaction", desc: "Auto-masks API keys, tokens, and passwords before they reach viewers." },
                { icon: <Database />, title: "Data Isolation", desc: "Every user's data is isolated; recordings are access-controlled at the account level." }
            ].map((s, i) => (
                <Card key={i} className="space-y-4">
                    <div className="text-chartreuse-zap shrink-0">{s.icon}</div>
                    <h3 className="font-bold text-lg">{s.title}</h3>
                    <p className="text-sm text-silken-whisper leading-relaxed">{s.desc}</p>
                </Card>
            ))}
        </div>

        <div className="bg-smokey-carbon p-12 rounded-2xl border border-cool-stone border-dashed text-center">
            <h2 className="text-2xl font-bold mb-4">Responsible Disclosure</h2>
            <p className="text-silken-whisper max-w-2xl mx-auto mb-8">If you discover a security vulnerability in CoShell, please email us at <span className="text-chartreuse-zap underline">security@coshell.io</span></p>
            <div className="text-xs text-muted-ash">Note: We do not currently offer a bug bounty program but deeply appreciate responsible disclosure.</div>
        </div>
    </div>
);
