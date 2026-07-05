import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Heart, Sparkles, Globe, Terminal, Calendar } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 space-y-12 animate-scale">
      <Helmet>
        <title>About | Api Coolie</title>
        <meta name="description" content="Discover why we built Api Coolie - the Porter carrying your API payloads and script runners securely on scheduled loops." />
        <link rel="canonical" href="https://apicoolie.stackinfi.in/about" />
        <meta property="og:title" content="About | Api Coolie" />
        <meta property="og:description" content="Discover why we built Api Coolie - the Porter carrying your API payloads and script runners securely on scheduled loops." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://apicoolie.stackinfi.in/about" />
        <meta property="og:image" content="https://apicoolie.stackinfi.in/api-coolie-og.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About | Api Coolie" />
        <meta name="twitter:description" content="Discover why we built Api Coolie - the Porter carrying your API payloads and script runners securely on scheduled loops." />
        <meta name="twitter:image" content="https://apicoolie.stackinfi.in/api-coolie-og.webp" />
      </Helmet>

      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">The Porter for your API payloads</h1>
        <p className="text-sm md:text-lg text-muted-foreground">Why we created Api Coolie, and what we strive for.</p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-6 leading-relaxed text-sm md:text-base font-medium">
        <p>
          In Hindi, <strong>"Coolie"</strong> translates to a porter—someone who carries heavy loads, suitcases, and cargo at railway stations so you don't have to strain yourself. We designed <strong>Api Coolie</strong> to behave exactly like a loyal digital porter.
        </p>
        <p>
          Whether you need to trigger heavy webhook updates, run database cleanup scripts, query third-party endpoints, or schedule complex Python automation, Api Coolie carries that execution load for you—silently, securely, and exactly on time.
        </p>
        <p>
          We observed that modern development teams spend significant engineering cycles simply configuring and maintaining cron schedules, managing local virtual machine processes, or verifying webhook response payloads. By consolidating task scheduling, sandbox code runners, and a live JSON Formatter suite in one integrated web portal, we streamline developer workflows.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
          <div className="p-6 border border-border/40 bg-card rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <Heart className="h-6 w-6 text-primary" />
            <h3 className="font-bold text-foreground text-sm">Developer First</h3>
            <p className="text-xs text-muted-foreground leading-normal font-medium">Built for engineers who need instant logs, copyable configurations, syntax highlights, and fast debugging tools.</p>
          </div>
          <div className="p-6 border border-border/40 bg-card rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h3 className="font-bold text-foreground text-sm">Secure by Design</h3>
            <p className="text-xs text-muted-foreground leading-normal font-medium">SSRF filters, encrypted headers/env variables, and secret-redacted logs protect credentials from leaking.</p>
          </div>
          <div className="p-6 border border-border/40 bg-card rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <Sparkles className="h-6 w-6 text-primary" />
            <h3 className="font-bold text-foreground text-sm">AI Diagnostics</h3>
            <p className="text-xs text-muted-foreground leading-normal font-medium">Integrated failure explanation engine translates confusing stack traces into plain English instructions.</p>
          </div>
          <div className="p-6 border border-border/40 bg-card rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <Globe className="h-6 w-6 text-primary" />
            <h3 className="font-bold text-foreground text-sm">JSON Formatter Suite</h3>
            <p className="text-xs text-muted-foreground leading-normal font-medium">Built-in formatter, syntax validator, and schema comparison tools to inspect payloads before triggering schedules.</p>
          </div>
        </div>

        <div className="pt-8 space-y-4">
          <h2 className="text-xl font-bold text-foreground">Our Core Principles</h2>
          <p>
            We believe that scheduling and monitoring resources should not carry premium costs or locking restrictions. Api Coolie is free to start, and we guarantee that essential utilities—including our JSON validation and formatting suite—will remain fully accessible to all developers without registration or paywall boundaries.
          </p>
        </div>
      </div>
    </div>
  );
}
