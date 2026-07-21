import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Zap, ArrowRight, Play, Calendar, Code2, Cpu, ChevronDown, HelpCircle, Globe } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';

export function LandingPage() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden w-full">
      <Helmet>
        <title>Api Coolie | Modern Scheduled API Calls & Code Executions</title>
        <meta name="description" content="Api Coolie is a serverless cron job scheduler to deploy and schedule API calls & custom JS/Python scripts with detailed execution logs and status badges." />
        <link rel="canonical" href="https://apicoolie.stackinfi.in/" />
        <meta property="og:title" content="Api Coolie | Modern Scheduled API Calls & Code Executions" />
        <meta property="og:description" content="Api Coolie is a serverless cron job scheduler to deploy and schedule API calls & custom JS/Python scripts with detailed execution logs and status badges." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://apicoolie.stackinfi.in/" />
        <meta property="og:image" content="https://apicoolie.stackinfi.in/api-coolie-og.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Api Coolie | Modern Scheduled API Calls & Code Executions" />
        <meta name="twitter:description" content="Api Coolie is a serverless cron job scheduler to deploy and schedule API calls & custom JS/Python scripts with detailed execution logs and status badges." />
        <meta name="twitter:image" content="https://apicoolie.stackinfi.in/api-coolie-og.webp" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Api Coolie",
              "operatingSystem": "All",
              "applicationCategory": "DeveloperApplication",
              "offers": {
                "@type": "Offer",
                "price": "0.00",
                "priceCurrency": "USD"
              },
              "description": "Serverless scheduled task automation platform running API triggers and custom JavaScript/Python code sandboxes using timezone-aware cron expressions."
            }
          `}
        </script>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How do I schedule an API call online without managing a server?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can schedule API calls online without a server by using a serverless API scheduler like Api Coolie. By configuring the request URL, HTTP method, authorization headers, and setting a cron expression, Api Coolie triggers the request automatically."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How do I run a JavaScript or Python script on a schedule online?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can run scripts on a schedule online by copying your JavaScript or Python code into Api Coolie's Code Runner, which executes your code inside an isolated V8 sandbox on your set cron interval."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is a timezone-aware cron scheduler?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A timezone-aware cron scheduler evaluates execution times based on a specific local timezone rather than server UTC offsets, automatically correcting for Daylight Saving Time (DST) changes."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How do I verify webhook payloads using HMAC signatures?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Api Coolie hashes request payloads using a secret key and SHA-256 HMAC, sending it in the X-Coolie-Signature header. Your backend validates this hash to ensure payload integrity."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is Api Coolie free to use?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, Api Coolie's Free Plan includes up to 20 active jobs, 1-minute execution cycles, and 20 daily AI diagnostics insights to analyze failed execution logs."
                  }
                }
              ]
            }
          `}
        </script>
      </Helmet>

      {/* Hero Header Section with animated gradient background */}
      <div className="relative min-h-[100vh] py-20 flex flex-col justify-center items-center overflow-hidden border-b border-border bg-gradient-to-br from-black via-zinc-900 to-black text-white w-full">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none w-full h-full animate-gradient-shift" style={{
          background: 'linear-gradient(-45deg, #8E70CF, #10b981, #3b82f6, #8E70CF)',
          backgroundSize: '400% 400%'
        }} />

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
              'AI LOG DIAGNOSTIC', 'STATUS BADGES', 'REAL-TIME METRICS', 'JSON FORMATTER SUITE',
              'JSON SCHEMA VALIDATION', 'PAYLOAD SYNTAX CHECKER', 'V8 JSON RUNTIMES', 'HMAC SIGNATURES',
              'CRON SCHEDULING', 'ISOLATED-VM SANDBOX', 'REST API TRIGGER', 'WEBHOOK DISPATCH',
              'AI LOG DIAGNOSTIC', 'STATUS BADGES', 'REAL-TIME METRICS', 'JSON FORMATTER SUITE',
              'JSON SCHEMA VALIDATION', 'PAYLOAD SYNTAX CHECKER', 'V8 JSON RUNTIMES', 'HMAC SIGNATURES'
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

              {/* Feature 4 */}
              <div className="p-6 border border-border/40 rounded-2xl bg-card space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-primary/10 rounded-xl w-fit text-primary border border-primary/20">
                  <Globe className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold">JSON Payload Suite</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Format, validate, and compare API payloads before deploying scheduled routines. Access tools publicly and anonymously at any time.
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

        {/* FAQ Section */}
        <section className="py-20 max-w-4xl mx-auto px-4 w-full border-t border-border/20">
          <div className="text-center space-y-3 mb-12">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded bg-primary/10 w-fit mx-auto block">FAQ</span>
            <h2 className="text-3xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Everything you need to know about scheduling API calls, running sandboxed scripts, and status monitors.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How do I schedule an API call online without managing a server?",
                a: "You can schedule API calls online without a server by using a serverless API scheduler like Api Coolie. By configuring the request URL, HTTP method (GET, POST, etc.), authorization headers, and setting a cron expression or custom interval, Api Coolie triggers the request automatically from a high-availability queue."
              },
              {
                q: "How do I run a JavaScript or Python script on a schedule online?",
                a: "You can run scripts on a schedule online by copying your JavaScript or Python code into Api Coolie's Code Runner. The engine provisions a secure, isolated V8 sandbox container to execute your code on your set cron interval, with support for encrypted environment variables."
              },
              {
                q: "What is a timezone-aware cron scheduler?",
                a: "A timezone-aware cron scheduler evaluates execution times based on a specific local timezone (e.g., Asia/Kolkata or America/New_York) rather than server UTC offsets. This protects tasks from being executed twice or skipped during Daylight Savings Time (DST) changes."
              },
              {
                q: "How do I verify webhook payloads using HMAC signatures?",
                a: "Api Coolie hashes request payloads using a secret key and SHA-256 HMAC, sending it in the X-Coolie-Signature header. Your backend validates this hash to ensure payload integrity and verify that triggers originate from our servers."
              },
              {
                q: "Is Api Coolie free to use?",
                a: "Yes, Api Coolie is free to start. The Free Plan includes up to 20 active jobs, 1-minute minimum execution cycles, and 20 daily AI diagnostic insights to analyze failed execution logs."
              }
            ].map((item, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="border border-border/40 rounded-2xl bg-card overflow-hidden transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-extrabold text-foreground hover:text-primary transition-colors text-xs sm:text-sm"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                      {item.q}
                    </span>
                    <ChevronDown className={`h-4.5 w-4.5 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                  </button>
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-60 border-t border-border/20 p-5' : 'max-h-0'
                    }`}
                  >
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

    </div>
  );
}
