import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Zap, ArrowRight, Play, Calendar, Code2, Cpu } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import Hyperspeed from '../components/Hyperspeed.jsx';

export function LandingPage() {
  const [showHyperspeed, setShowHyperspeed] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setShowHyperspeed(true);
    }, 100);
    return () => clearTimeout(t1);
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden w-full">
      <Helmet>
        <title>Api Coolie | Modern Scheduled API Calls & Code Executions</title>
        <meta name="description" content="Api Coolie carries your API payloads and script executors (JS & Python) on precise schedules (cron, intervals, weekly days). Dynamic logs, status badges and AI diagnostics." />
      </Helmet>

      {/* Hero Header Section with Hyperspeed background (Permanently Dark) */}
      <div className="relative min-h-[100vh] py-20 flex flex-col justify-center items-center overflow-hidden border-b border-zinc-900 bg-black text-white w-full">
        {/* Hyperspeed background component */}
        <div 
          className="absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out pointer-events-none w-full h-full"
          style={{ opacity: showHyperspeed ? (webglFailed ? 0.9 : 0.45) : 0 }}
        >
          <Hyperspeed onWebGLFailed={() => setWebglFailed(true)} />
        </div>

        {/* Content wrapper */}
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center px-4 space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold shadow-sm">
            <Zap className="h-3.5 w-3.5 animate-pulse text-primary" /> 
            <span>Precision V8 script isolates are now live!</span>
          </div>

          <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight leading-[1.05] font-sans max-w-4xl text-white">
            Deploy and Schedule <br className="hidden sm:inline" /> <span className="animate-aurora">API calls</span> & <span className="animate-aurora">scripts</span> <br className="hidden sm:inline" /> with absolute precision.
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
            The serverless scheduler crafted for developers. Run scheduled HTTP calls or build isolated-vm JavaScript runners. Complete with real-time log streaming, public status badges, and automated AI diagnostic analytics.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link to="/signup">
              <Button variant="primary" className="h-11 px-6 text-xs font-bold w-full sm:w-auto uppercase tracking-wider shadow-md">
                Start Scheduling Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/docs">
              <Button variant="outline" className="h-11 px-6 text-xs font-bold w-full sm:w-auto uppercase tracking-wider border-zinc-800 hover:bg-zinc-900 text-white bg-transparent">
                Read Docs
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Rest of the page content (Follows Light/Dark Theme colors) */}
      <div className="relative z-10 w-full">
        {/* Floating gradient glow behind hero mockup */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-[120px] pointer-events-none -z-10" />

        {/* Hero Interactive preview mockup */}
        <section className="relative py-16 flex flex-col items-center justify-center px-4 max-w-5xl mx-auto w-full">
          <div className="w-full max-w-4xl border border-border/40 rounded-3xl bg-card/60 backdrop-blur-md shadow-xl overflow-hidden text-left">
            <div className="flex items-center justify-between px-5 py-3 bg-muted/20 border-b border-border/40">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-muted-foreground">interactive runner.js</span>
              <span className="w-4" />
            </div>
            <div className="p-6 font-mono text-[11px] text-muted-foreground space-y-2.5 bg-card/40">
              <p className="text-primary font-bold">// Welcome to Api Coolie sandboxed environment</p>
              <p className="text-foreground"><span className="text-purple-400">const</span> response = <span className="text-purple-400">await</span> fetch(<span className="text-green-400">"https://api.stackinfi.in/ping"</span>);</p>
              <p className="text-foreground">console.log(<span className="text-green-400">"Server ping status:"</span>, response.status);</p>
              <p className="border-t border-border/30 pt-3 text-green-400 font-bold flex items-center gap-2">
                <Play className="h-3 w-3 fill-green-400 text-green-400" /> [15:30:00 UTC] execution successful (duration: 45ms, status code: 200)
              </p>
            </div>
          </div>
        </section>

        {/* Marquee Section */}
        <section className="py-8 bg-muted/5 border-y border-border/40 overflow-hidden relative w-full">
          <div className="animate-marquee gap-8">
            {[
              'CRON SCHEDULING', 'ISOLATED-VM SANDBOX', 'REST API TRIGGER', 'WEBHOOK DISPATCH',
              'AI LOG DIAGNOSTIC', 'STATUS BADGES', 'REAL-TIME METRICS', 'JSON SUITE SUITE',
              'CRON SCHEDULING', 'ISOLATED-VM SANDBOX', 'REST API TRIGGER', 'WEBHOOK DISPATCH',
              'AI LOG DIAGNOSTIC', 'STATUS BADGES', 'REAL-TIME METRICS', 'JSON SUITE SUITE'
            ].map((tag, idx) => (
              <span key={idx} className="text-xs font-extrabold tracking-widest text-muted-foreground/40 mx-4 block">
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Stats metrics */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { metric: '10M+', label: 'Monthly API calls' },
              { metric: '99.99%', label: 'Precise uptime tick' },
              { metric: '50k+', label: 'Configured workers' },
              { metric: '< 50ms', label: 'Sandbox execution delay' }
            ].map((stat, idx) => (
              <div key={idx} className="p-6 border border-border/35 bg-card/40 rounded-2xl text-center space-y-1 shadow-sm hover:scale-[1.02] transition-transform">
                <span className="text-3xl font-extrabold text-primary block leading-none">{stat.metric}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Features Grid */}
        <section className="py-20 border-t border-border/20 bg-muted/5 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
              <h2 className="text-3xl font-extrabold tracking-tight">Full Features Coverage</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Why use complex server setups or cron tab commands? Api Coolie matches all cron schedulers, serverless functions, and validators into a single web dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-6 border border-border/40 rounded-2xl bg-card space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-primary/10 rounded-xl w-fit text-primary border border-primary/20">
                  <Code2 className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold">Hosted V8 isolates</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Run JavaScript/Node.js script runners inside separate, secure V8 heap blocks. Safe from loop overflows, memory escapes, and global space pollutions.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 border border-border/40 rounded-2xl bg-card space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-primary/10 rounded-xl w-fit text-primary border border-primary/20">
                  <Calendar className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold">1-Second Tick Precision</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Choose custom cron strings, intervals, or weekly day cycles. Schedules resolve instantly in multi-threaded task engines without queuing delays.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 border border-border/40 rounded-2xl bg-card space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-primary/10 rounded-xl w-fit text-primary border border-primary/20">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold">AI Diagnostics</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  API request failed? Click the diagnostics assistant to receive structured code repairs, payload fixes, and details on what headers were rejected.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Teaser */}
        <section className="py-20 max-w-5xl mx-auto px-4 w-full">
          <div className="p-8 border border-primary/20 rounded-3xl bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-2 relative z-10">
              <h3 className="text-xl font-bold">Ready to automate your endpoints?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Get started with 20 active routines, 1-second precisions, and 5 monthly AI diagnostic credits completely free.
              </p>
            </div>
            <Link to="/signup" className="relative z-10 shrink-0">
              <Button variant="primary" className="px-6 py-3 text-xs font-bold uppercase tracking-wider">
                Create Account Free
              </Button>
            </Link>
          </div>
        </section>
      </div>

    </div>
  );
}
