import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      // Wait for auth to load
      if (loading) return;

      // If we have a session, user is authenticated
      if (user) {
        // Redirect based on onboarding status
        if (profile) {
          // Has payment info, can go to onboarding or dashboard
          if (profile.stripe_subscription_id) {
            if (profile.agent_connected_at) {
              navigate('/dashboard');
            } else {
              navigate('/onboarding');
            }
          } else {
            // No payment, go to plan selection
            navigate('/plan-selection');
          }
        } else {
          // Profile still loading, wait
          navigate('/plan-selection');
        }
      } else {
        // No session, redirect to home
        navigate('/');
      }
    };

    handleCallback();
  }, [user, profile, loading, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-alert-red mb-4">Authentication Error</h2>
          <p className="text-silken-whisper mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-chartreuse-zap text-midnight-oil rounded hover:opacity-90"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-chartreuse-zap mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Completing Sign In</h2>
        <p className="text-silken-whisper">Please wait while we set up your account...</p>
      </div>
    </div>
  );
}
