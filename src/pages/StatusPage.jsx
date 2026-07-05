import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, Server, Activity, ShieldCheck } from 'lucide-react';

export function StatusPage() {
  const systems = [
    { name: 'API Server Services', status: 'Operational', uptime: '99.99%', latency: '45ms' },
    { name: 'Background Queue Task Workers', status: 'Operational', uptime: '100%', latency: '12ms' },
    { name: 'Isolated-VM V8 Sandboxes', status: 'Operational', uptime: '99.98%', latency: '85ms' },
    { name: 'AI Failure Analysis Engine', status: 'Operational', uptime: '99.9%', latency: '1.2s' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 space-y-12 animate-scale text-xs">
      <Helmet>
        <title>System Status | Api Coolie</title>
        <meta name="description" content="Live uptime metrics and service health reports for Api Coolie API and scheduler task loops." />
        <link rel="canonical" href="https://apicoolie.stackinfi.in/status" />
        <meta property="og:title" content="System Status | Api Coolie" />
        <meta property="og:description" content="Live uptime metrics and service health reports for Api Coolie API and scheduler task loops." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://apicoolie.stackinfi.in/status" />
        <meta property="og:image" content="https://apicoolie.stackinfi.in/api-coolie-og.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="System Status | Api Coolie" />
        <meta name="twitter:description" content="Live uptime metrics and service health reports for Api Coolie API and scheduler task loops." />
        <meta name="twitter:image" content="https://apicoolie.stackinfi.in/api-coolie-og.webp" />
      </Helmet>

      {/* Main Status Header Banner */}
      <div className="p-6 border border-emerald-500/20 bg-emerald-500/5 rounded-3xl flex items-center gap-4 text-emerald-500">
        <CheckCircle2 className="h-8 w-8 shrink-0 animate-pulse" />
        <div className="space-y-1">
          <h2 className="text-sm font-bold uppercase tracking-wider">All Systems Operational</h2>
          <p className="text-xs opacity-90 leading-relaxed">No active incidents. Scheduler loop tick execution latency remains below &lt; 5ms.</p>
        </div>
      </div>

      {/* System breakdown grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-border/40 pb-3">
          <Activity className="h-4.5 w-4.5 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Services Health</h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {systems.map((sys) => (
            <div key={sys.name} className="p-5 border border-border/40 bg-card rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-primary" />
                  <span className="font-bold text-foreground">{sys.name}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-semibold">
                  <span>Uptime: {sys.uptime}</span>
                  <span>&bull;</span>
                  <span>Latency: {sys.latency}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 self-end sm:self-center">
                {/* Clean uptime bar block mockup */}
                <div className="flex gap-0.5">
                  {[...Array(16)].map((_, i) => (
                    <span key={i} className="w-1.5 h-6 rounded-sm bg-emerald-500/80" />
                  ))}
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                  {sys.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
