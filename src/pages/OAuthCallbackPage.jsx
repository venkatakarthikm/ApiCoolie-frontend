import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { apiClient } from '../utils/apiClient.js';

export function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);

  useEffect(() => {
    // 1. Google Implicit Flow callback checks (access token is in hash fragment)
    const hash = window.location.hash;
    if (hash) {
      const hashParams = new URLSearchParams(hash.substring(1));
      const googleAccessToken = hashParams.get('access_token');
      
      if (googleAccessToken) {
        async function exchangeGoogleToken() {
          try {
            const data = await apiClient.post('/auth/google-implicit', {
              access_token: googleAccessToken,
            });
            loginStore(data.token, data.user);
            navigate('/dashboard');
          } catch (err) {
            console.error('Google implicit OAuth login failure:', err);
            navigate('/login');
          }
        }
        exchangeGoogleToken();
        return;
      }
    }

    // 2. Query parameter fallback (for local / standard server redirections)
    const token = searchParams.get('token');
    if (!token) {
      navigate('/login');
      return;
    }

    async function loadProfileAndLogin() {
      try {
        // Temp save token in store to let client load user profile
        useAuthStore.setState({ token });
        
        const user = await apiClient.get('/auth/me');
        
        // Save permanently
        loginStore(token, user);
        navigate('/dashboard');
      } catch (err) {
        console.error('OAuth callback login failure:', err);
        navigate('/login');
      }
    }

    loadProfileAndLogin();
  }, [searchParams, navigate, loginStore]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span className="text-sm font-semibold text-muted-foreground animate-pulse">Syncing OAuth credentials...</span>
    </div>
  );
}
