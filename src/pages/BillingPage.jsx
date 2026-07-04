import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '../store/authStore.js';
import { CheckCircle2, AlertCircle, ShieldAlert, Cpu } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';

export function BillingPage() {
  const { user } = useAuthStore();

  const plan = user?.plan || 'free';
  const aiInsightQuota = user?.aiInsightQuotaUsed || 0;
  const quotaLimit = plan === 'free' ? 5 : plan === 'pro' ? 50 : 250;

  const usagePercent = Math.min(100, Math.round((aiInsightQuota / quotaLimit) * 100));

  return (
    <div className="space-y-6 animate-scale">
      <Helmet>
        <title>Usage & Billing | Api Coolie</title>
      </Helmet>

      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-bold font-sans">Usage & Billing</h1>
          <p className="text-xs text-muted-foreground">Monitor your API calls, execution limits, and AI quota usage metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="p-5 border border-border/40 bg-card rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">AI Insights Quota</h3>
          </div>
          <div className="space-y-2">
            <span className="text-2xl font-extrabold text-foreground">{aiInsightQuota} <span className="text-xs text-muted-foreground font-medium">/ {quotaLimit} used</span></span>
            <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden border border-border/40">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">Quota resets on your monthly billing cycle date.</p>
          </div>
        </div>

        {/* Plan card */}
        <div className="p-5 border border-border/40 bg-card rounded-2xl shadow-sm space-y-4 md:col-span-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Current Tier Plan</span>
            </div>
            <h3 className="text-xl font-extrabold capitalize text-primary">{plan} Plan</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You are currently on the {plan} plan. Upgrade to expand execution timeouts, increase retry triggers, and receive more AI-failed diagnostics monthly.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500">
            <CheckCircle2 className="h-4 w-4" />
            <span>Active and in good standing</span>
          </div>
        </div>
      </div>

      {/* Pricing comparison tables */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-foreground">Available Upgrade Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-5 border rounded-2xl bg-card space-y-4 relative ${plan === 'free' ? 'border-primary' : 'border-border/40'}`}>
            {plan === 'free' && (
              <span className="absolute -top-2.5 right-4 bg-primary text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">Current</span>
            )}
            <h4 className="font-bold text-sm">Free</h4>
            <span className="text-2xl font-extrabold">$0<span className="text-xs text-muted-foreground font-medium"> / mo</span></span>
            <ul className="text-xs text-muted-foreground space-y-2">
              <li className="flex items-center gap-2">✓ 5 AI failure insights</li>
              <li className="flex items-center gap-2">✓ 30-day log history</li>
              <li className="flex items-center gap-2">✓ isolated-vm sandboxes</li>
            </ul>
          </div>

          <div className={`p-5 border rounded-2xl bg-card space-y-4 relative ${plan === 'pro' ? 'border-primary' : 'border-border/40'}`}>
            {plan === 'pro' && (
              <span className="absolute -top-2.5 right-4 bg-primary text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">Current</span>
            )}
            <h4 className="font-bold text-sm text-primary">Pro</h4>
            <span className="text-2xl font-extrabold">$19<span className="text-xs text-muted-foreground font-medium"> / mo</span></span>
            <ul className="text-xs text-muted-foreground space-y-2">
              <li className="flex items-center gap-2">✓ 50 AI failure insights</li>
              <li className="flex items-center gap-2">✓ 90-day log history</li>
              <li className="flex items-center gap-2">✓ Priority queue execution</li>
            </ul>
            <Button variant="primary" className="w-full text-xs py-1.5" disabled={plan === 'pro'}>
              {plan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
            </Button>
          </div>

          <div className={`p-5 border rounded-2xl bg-card space-y-4 relative ${plan === 'team' ? 'border-primary' : 'border-border/40'}`}>
            {plan === 'team' && (
              <span className="absolute -top-2.5 right-4 bg-primary text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">Current</span>
            )}
            <h4 className="font-bold text-sm">Team</h4>
            <span className="text-2xl font-extrabold">$49<span className="text-xs text-muted-foreground font-medium"> / mo</span></span>
            <ul className="text-xs text-muted-foreground space-y-2">
              <li className="flex items-center gap-2">✓ 250 AI failure insights</li>
              <li className="flex items-center gap-2">✓ Unlimited log history</li>
              <li className="flex items-center gap-2">✓ Team collaboration invites</li>
            </ul>
            <Button variant="outline" className="w-full text-xs py-1.5" disabled={plan === 'team'}>
              {plan === 'team' ? 'Current Plan' : 'Upgrade to Team'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
