import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, MessageSquare, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8">
      <Helmet>
        <title>Contact Support | Api Coolie</title>
        <meta name="description" content="Reach out to Api Coolie support for help with serverless API triggers, sandboxed VM runners, status logs, or pricing plans." />
        <link rel="canonical" href="https://apicoolie.stackinfi.in/contact" />
        <meta property="og:title" content="Contact Support | Api Coolie" />
        <meta property="og:description" content="Reach out to Api Coolie support for help with serverless API triggers, sandboxed VM runners, status logs, or pricing plans." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://apicoolie.stackinfi.in/contact" />
        <meta property="og:image" content="https://apicoolie.stackinfi.in/api-coolie-og.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Support | Api Coolie" />
        <meta name="twitter:description" content="Reach out to Api Coolie support for help with serverless API triggers, sandboxed VM runners, status logs, or pricing plans." />
        <meta name="twitter:image" content="https://apicoolie.stackinfi.in/api-coolie-og.webp" />
      </Helmet>

      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Contact Support</h1>
        <p className="text-sm text-muted-foreground">Having trouble with a scheduled script or billing plan? Send us a ticket.</p>
      </div>

      {submitted ? (
        <div className="p-6 border border-green-500/20 bg-green-500/5 rounded-2xl text-center space-y-3">
          <CheckCircle className="h-10 w-10 text-green-500 mx-auto" />
          <h3 className="font-bold text-lg">Ticket Created</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Thank you! Your ticket has been logged successfully. Our team will contact you back via your email address within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="border border-border/40 bg-card rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-muted-foreground mb-1.5" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              required
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-primary"
              placeholder="you@domain.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-muted-foreground mb-1.5" htmlFor="message">Message Details</label>
            <textarea
              id="message"
              required
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-primary resize-none"
              placeholder="Describe your issue with code runners, timeouts, badge links..."
            />
          </div>
          <Button type="submit" loading={loading} className="w-full">
            Submit Support Ticket
          </Button>
        </form>
      )}
    </div>
  );
}
