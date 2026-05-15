import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

type AuthCallbackProps = {
  setView: (v: 'DASHBOARD' | 'PLAN_SELECT' | 'ONBOARDING' | 'LOGIN' | 'LANDING') => void;
};

/**
 * AuthCallbackPage
 * 
 * Handles the OAuth callback from Google/GitHub
 * Shows loading state while Supabase processes the session
 * Then auto-redirects based on user profile state
 */
export const AuthCallbackPage = ({ setView }: AuthCallbackProps) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Give Supabase/browser a moment to process the OAuth session
    // The useAuth hook in background will detect the new user session
    const timer = setTimeout(() => {
      try {
        // Attempt to redirect - the AppInner component's useEffect
        // will detect the new user state and redirect appropriately
        setView('DASHBOARD');
      } catch (e) {
        setError('Authentication failed. Redirecting to login...');
        setTimeout(() => setView('LOGIN'), 3000);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [setView]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-midnight-oil">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <Loader2 className="w-16 h-16 animate-spin text-chartreuse-zap mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-cloud-white mb-3">
          Completing sign in...
        </h2>
        <p className="text-silken-whisper text-lg mb-8">
          We're verifying your account and setting things up.
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-alert-red/10 border border-alert-red/30 rounded-lg p-4 text-alert-red text-sm"
          >
            {error}
          </motion.div>
        )}

        <p className="text-xs text-muted-ash mt-12">
          This usually takes a few seconds...
        </p>
      </motion.div>
    </div>
  );
};
