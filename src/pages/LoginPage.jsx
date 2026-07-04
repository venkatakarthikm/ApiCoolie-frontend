import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import { apiClient, BACKEND_API_URL } from '../utils/apiClient.js';
import { Button } from '../components/ui/Button.jsx';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '158034922618-76d2fejqshpgqieclmjhve9k9lnpk1ag.apps.googleusercontent.com';


export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated, login: loginStore } = useAuthStore();
  const navigate = useNavigate();

  const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/callback')}&response_type=token&scope=openid%20profile%20email`;

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiClient.post('/auth/login', { email, password });
      loginStore(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-background">
      <Helmet>
        <title>Sign in | Api Coolie</title>
      </Helmet>

      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <img src="/Api Coolie porter logo.png" alt="Api Coolie" className="h-12 w-12 object-contain" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Welcome Back</h2>
          <p className="text-xs text-muted-foreground">Sign in to your Api Coolie dashboard workspace.</p>
        </div>

        <div className="border border-border/40 bg-card/60 backdrop-blur-md rounded-3xl p-8 shadow-xl space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-extrabold uppercase text-muted-foreground tracking-wider" htmlFor="email">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm bg-background/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="you@domain.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-extrabold uppercase text-muted-foreground tracking-wider" htmlFor="password">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm bg-background/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full py-3 rounded-xl font-bold text-xs shadow-sm bg-primary text-white hover:bg-primary/95 transition-all">
              Sign In
            </Button>
          </form>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-border/40 w-full" />
            <span className="absolute bg-card px-3 text-[10px] text-muted-foreground uppercase font-extrabold tracking-wider">Or continue with</span>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={googleOAuthUrl}
              className="flex items-center justify-center gap-2.5 border border-border/60 rounded-xl py-2.5 text-xs font-bold bg-background hover:bg-muted/15 active:scale-[0.99] transition-all text-foreground shadow-sm w-full"
            >
              <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.72 5.72 0 0 1 8.24 12.88a5.72 5.72 0 0 1 5.751-5.72c1.47 0 2.82.52 3.885 1.385l3.1-3.1A9.99 9.99 0 0 0 13.99 2 9.99 9.99 0 0 0 4 12a9.99 9.99 0 0 0 9.99 10c5.56 0 10.1-4.04 10.1-10 0-.69-.06-1.35-.18-1.97H12.24z"/>
              </svg>
              <span>Google</span>
            </a>
          </div>

          <p className="text-center text-xs text-muted-foreground pt-1">
            New to Api Coolie?{' '}
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
