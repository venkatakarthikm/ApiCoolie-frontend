import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/Button.jsx';
import { Link } from 'react-router-dom';
import { Check, X, Shield, Zap, Info, Clock, AlertTriangle } from 'lucide-react';

export function VersusPage() {
  const [activeTab, setActiveTab] = useState('schedulers');

  const comparisonTabs = [
    { id: 'schedulers', label: 'vs. Basic Webhook Crons', desc: 'Comparison with traditional online cron triggers (e.g. cron-job.org).' },
    { id: 'monitors', label: 'vs. Simple Uptime Checkers', desc: 'Comparison with standard website ping systems (e.g. UptimeRobot).' },
    { id: 'premium', label: 'vs. High-Cost API Trigger Tools', desc: 'Comparison with subscription-bound REST cron schedulers (e.g. EasyCron).' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8 animate-scale text-xs md:text-sm">
      <Helmet>
        <title>Alternatives & Versus Comparison | Api Coolie</title>
        <meta name="description" content="Compare Api Coolie with traditional online cron job schedulers, website uptime ping checkers, and premium API execution pipelines. Find the right developer scheduler." />
        <meta name="keywords" content="cron-job.org alternative, easycron alternative, uptimerobot alternative, free cron job scheduler online, schedule api call, webhook monitor" />
      </Helmet>

      {/* Sidebar navigation */}
      <aside className="w-full lg:w-72 shrink-0 space-y-4">
        <div className="px-3 py-1 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">Comparison Hub</span>
        </div>
        <nav className="flex flex-col gap-2">
          {comparisonTabs.map((tab) => (
            <button
              key={tab.id}
              id={`versus-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all text-xs font-medium ${
                activeTab === tab.id
                  ? 'bg-primary/5 text-primary border-primary shadow-sm'
                  : 'bg-card text-muted-foreground border-border/40 hover:text-foreground hover:bg-muted/10'
              }`}
            >
              <span className="font-extrabold text-foreground block mb-1">{tab.label}</span>
              <p className="text-[10px] text-muted-foreground leading-normal font-medium">{tab.desc}</p>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 max-w-4xl border border-border/40 bg-card rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
        
        {activeTab === 'schedulers' && (
          <div className="space-y-6">
            <div className="space-y-2 border-b border-border/40 pb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded bg-primary/10 w-fit">Scheduler Analysis</span>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-sans pt-1">Api Coolie vs. Basic Webhook Crons</h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Traditional scheduling websites (such as basic cron-job trigger utilities) only send basic HTTP pings to your endpoints. If you need dynamic headers, complex authentication, or runtime scripts, you are forced to deploy external server handlers. Here is how Api Coolie updates the experience.
              </p>
            </div>

            {/* Feature Matrix */}
            <div className="border border-border/40 rounded-2xl overflow-hidden bg-muted/5">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-muted/20 border-b border-border/40 font-bold">
                    <th className="p-3">Feature Checklist</th>
                    <th className="p-3">Api Coolie</th>
                    <th className="p-3">Basic Schedulers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-muted-foreground font-medium">
                  <tr>
                    <td className="p-3 font-semibold text-foreground">Custom Isolated Scripts (JS/Python)</td>
                    <td className="p-3 text-emerald-500 font-bold flex items-center gap-1"><Check className="h-4.5 w-4.5" /> Supported (V8 sandbox)</td>
                    <td className="p-3 text-rose-500"><X className="h-4.5 w-4.5" /> No (Pings Only)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-foreground">AI failure diagnostics</td>
                    <td className="p-3 text-emerald-500 font-bold flex items-center gap-1"><Check className="h-4.5 w-4.5" /> Yes (Automatic)</td>
                    <td className="p-3 text-rose-500"><X className="h-4.5 w-4.5" /> No logs analysis</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-foreground">Minimum Scheduler Tick</td>
                    <td className="p-3 text-foreground">1-Second Precision</td>
                    <td className="p-3 text-muted-foreground">1-Minute Limits</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-foreground">Timezone and DST shifts</td>
                    <td className="p-3 text-emerald-500 font-bold flex items-center gap-1"><Check className="h-4.5 w-4.5" /> Automatically corrected</td>
                    <td className="p-3 text-muted-foreground">Strict UTC/Standard offsets</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="space-y-4 pt-4">
              <h3 className="font-extrabold text-sm text-foreground">When to use traditional schedulers?</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Basic cron-job services are perfectly suitable for triggering simple, public endpoints that do not require secrets configuration or debugging checks.
              </p>
              <h3 className="font-extrabold text-sm text-foreground">Why choose Api Coolie instead?</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Api Coolie gives developers a comprehensive platform. Instead of maintaining boilerplate code on custom servers simply to format variables, query databases, or make secure tokens calls, you can code the logic directly inside our secure, timezone-aware JavaScript/Python sandboxes.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'monitors' && (
          <div className="space-y-6">
            <div className="space-y-2 border-b border-border/40 pb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded bg-primary/10 w-fit">Monitoring Analysis</span>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-sans pt-1">Api Coolie vs. Simple Uptime Checkers</h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Uptime ping systems (such as UptimeRobot) monitor endpoint availability. However, their execution is typically limited to GET triggers. Api Coolie is designed to handle payload schedules, programmatic tokens, and deep telemetry.
              </p>
            </div>

            {/* Feature Matrix */}
            <div className="border border-border/40 rounded-2xl overflow-hidden bg-muted/5">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-muted/20 border-b border-border/40 font-bold">
                    <th className="p-3">Feature Checklist</th>
                    <th className="p-3">Api Coolie</th>
                    <th className="p-3">Uptime Monitors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-muted-foreground font-medium">
                  <tr>
                    <td className="p-3 font-semibold text-foreground">Custom HTTP Payloads (POST/PUT/PATCH)</td>
                    <td className="p-3 text-emerald-500 font-bold flex items-center gap-1"><Check className="h-4.5 w-4.5" /> Full Body configurations</td>
                    <td className="p-3 text-muted-foreground">Limited / GET only on free</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-foreground">Uptime Status Badges</td>
                    <td className="p-3 text-emerald-500 font-bold flex items-center gap-1"><Check className="h-4.5 w-4.5" /> Dynamic SVG & JSON links</td>
                    <td className="p-3 text-emerald-500 font-bold flex items-center gap-1"><Check className="h-4.5 w-4.5" /> Yes</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-foreground">Failure Alert Notifications</td>
                    <td className="p-3 text-emerald-500 font-bold flex items-center gap-1"><Check className="h-4.5 w-4.5" /> Slack, Discord, custom API webhooks</td>
                    <td className="p-3 text-foreground">Email / SMS integrations</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-foreground">Programmatic API Key Operations</td>
                    <td className="p-3 text-emerald-500 font-bold flex items-center gap-1"><Check className="h-4.5 w-4.5" /> Supported (bearer headers)</td>
                    <td className="p-3 text-rose-500"><X className="h-4.5 w-4.5" /> No dashboard API keys</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="space-y-4 pt-4">
              <h3 className="font-extrabold text-sm text-foreground">When to use simple uptime checkers?</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Simple ping monitors are excellent for static website monitors or ping sweeps where you do not need payload configurations or data queries.
              </p>
              <h3 className="font-extrabold text-sm text-foreground">Why choose Api Coolie instead?</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Api Coolie combines cron scheduling and website monitoring. You can run complex payloads, verify authentication states, parse response metrics inside V8 isolates, and export dynamic status SVG badges directly to your README files.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'premium' && (
          <div className="space-y-6">
            <div className="space-y-2 border-b border-border/40 pb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded bg-primary/10 w-fit">SaaS Schedulers</span>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-sans pt-1">Api Coolie vs. High-Cost API Trigger Tools</h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                SaaS cron trigger platforms (such as EasyCron) charge high prices for basic API schedules and variables. Api Coolie offers a developer-first platform that is free to start.
              </p>
            </div>

            {/* Feature Matrix */}
            <div className="border border-border/40 rounded-2xl overflow-hidden bg-muted/5">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-muted/20 border-b border-border/40 font-bold">
                    <th className="p-3">Feature Checklist</th>
                    <th className="p-3">Api Coolie</th>
                    <th className="p-3">Premium Schedulers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-muted-foreground font-medium">
                  <tr>
                    <td className="p-3 font-semibold text-foreground">Pricing entry tier</td>
                    <td className="p-3 text-emerald-500 font-bold flex items-center gap-1"><Check className="h-4.5 w-4.5" /> Free-to-start (20 jobs)</td>
                    <td className="p-3 text-muted-foreground">Very limited free / trial only</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-foreground">Encrypted Env Secrets</td>
                    <td className="p-3 text-emerald-500 font-bold flex items-center gap-1"><Check className="h-4.5 w-4.5" /> AES-256 encrypted variables</td>
                    <td className="p-3 text-muted-foreground">Plaintext headers only</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-foreground">Interactive Monaco Code Editor</td>
                    <td className="p-3 text-emerald-500 font-bold flex items-center gap-1"><Check className="h-4.5 w-4.5" /> Supported (IntelliSense syntax)</td>
                    <td className="p-3 text-rose-500"><X className="h-4.5 w-4.5" /> Basic textarea boxes</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="space-y-4 pt-4">
              <h3 className="font-extrabold text-sm text-foreground">Why choose Api Coolie instead?</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Api Coolie delivers modern developer tooling without locking essential parameters (such as execution logs history, environment variables, and programmatic token access) behind expensive paywalls.
              </p>
            </div>
          </div>
        )}

        <div className="p-6 border border-primary/20 rounded-3xl bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden mt-8">
          <div className="space-y-2 relative z-10">
            <h3 className="text-sm font-bold text-foreground">Get started with Api Coolie today</h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Create your account to configure up to 20 active jobs, custom cron rules, and status badges.
            </p>
          </div>
          <Link to="/signup" className="relative z-10 shrink-0">
            <Button variant="primary" className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider">
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
