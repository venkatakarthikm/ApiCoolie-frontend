import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 space-y-12">
      <Helmet>
        <title>About | Api Coolie</title>
        <meta name="description" content="Discover why we built Api Coolie - the Porter carrying your API payloads and script runners securely on scheduled loops." />
      </Helmet>

      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">The Porter for your API payloads</h1>
        <p className="text-lg text-muted-foreground">Why we created Api Coolie, and what we strive for.</p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-6 leading-relaxed">
        <p>
          In Hindi, <strong>"Coolie"</strong> translates to a porter—someone who carries heavy loads, suitcases, and cargo at railway stations so you don't have to strain yourself. We designed <strong>Api Coolie</strong> to behave exactly like a loyal digital porter.
        </p>
        <p>
          Whether you need to trigger heavy webhook updates, run database cleanup scripts, query third-party endpoints, or schedule complex Python automation, Api Coolie carries that execution load for you—silently, securely, and exactly on time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="p-5 border border-border/40 bg-card rounded-xl space-y-3">
            <Heart className="h-6 w-6 text-primary" />
            <h3 className="font-bold text-foreground">Developer First</h3>
            <p className="text-xs">Built for engineers who need instant logs, copyable configurations, syntax highlights, and fast debugging tools.</p>
          </div>
          <div className="p-5 border border-border/40 bg-card rounded-xl space-y-3">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h3 className="font-bold text-foreground">Secure by Design</h3>
            <p className="text-xs">SSRF filters, encrypted headers/env variables, and secret-redacted logs protect credentials from leaking.</p>
          </div>
          <div className="p-5 border border-border/40 bg-card rounded-xl space-y-3">
            <Sparkles className="h-6 w-6 text-primary" />
            <h3 className="font-bold text-foreground">AI Diagnostics</h3>
            <p className="text-xs">Integrated failure explanation engine translates confusing stack traces into plain English instructions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
