import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Settings, User, Globe, AlertCircle, Save } from 'lucide-react';
import { apiClient } from '../utils/apiClient.js';
import { Button } from '../components/ui/Button.jsx';
import { useAuthStore } from '../store/authStore.js';
import { showToast } from '../utils/toast.js';

export function SettingsPage() {
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuthStore();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [timezone, setTimezone] = useState(user?.timezoneDefault || 'UTC');
  const [loading, setLoading] = useState(false);

  // Sync state values on user update
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setTimezone(user.timezoneDefault || 'UTC');
    }
  }, [user]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Direct PATCH or update user endpoint
      const res = await apiClient.patch('/auth/me', {
        fullName,
        timezoneDefault: timezone
      });
      updateUser(res);
      showToast('Settings updated successfully.', 'success');
    } catch (err) {
      showToast(`Update failed: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-scale">
      <Helmet>
        <title>Account Settings | Api Coolie</title>
      </Helmet>

      {/* Header */}
      <div className="border-b border-border/40 pb-4">
        <h1 className="text-xl font-bold font-sans">Account Settings</h1>
        <p className="text-xs text-muted-foreground">Manage profile attributes, timezones and operational variables.</p>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSaveSettings} className="border border-border/40 bg-card rounded-2xl p-6 shadow-sm space-y-6">
        <div className="space-y-4">
          
          {/* Email read only */}
          <div className="space-y-1.5">
            <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</span>
            <div className="px-3 py-2 border border-border bg-muted/10 rounded-lg text-sm text-muted-foreground select-none">
              {user?.email}
            </div>
            <span className="text-[10px] text-muted-foreground">Credentials email cannot be changed.</span>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider" htmlFor="fullName">Profile Display Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4.5 w-4.5 text-muted-foreground" />
              <input
                type="text"
                id="fullName"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-primary"
                placeholder="Developer"
              />
            </div>
          </div>

          {/* Default Timezone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider" htmlFor="tzVal">Default Calendar Timezone</label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 h-4.5 w-4.5 text-muted-foreground" />
              <select
                id="tzVal"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-primary"
              >
                <option value="UTC">Coordinated Universal Time (UTC)</option>
                <option value="Asia/Kolkata">India Standard Time (IST)</option>
                <option value="America/New_York">Eastern Standard Time (EST/EDT)</option>
                <option value="Europe/London">London Time (GMT/BST)</option>
                <option value="Asia/Singapore">Singapore Standard Time (SGT)</option>
              </select>
            </div>
            <span className="text-[10px] text-muted-foreground">Sets the default timezone value for newly configured scheduling loops.</span>
          </div>

        </div>

        <div className="flex justify-end pt-4 border-t border-border/25">
          <Button type="submit" loading={loading} className="px-6 flex items-center gap-1.5">
            <Save className="h-4 w-4" /> Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
