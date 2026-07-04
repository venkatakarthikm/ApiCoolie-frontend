import React from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export function LegalPage() {
  const { pathname } = useLocation();

  let title = 'Privacy Policy';
  let desc = 'How we collect, encrypt, and manage user parameters.';
  let content = (
    <div className="space-y-6 text-xs sm:text-sm">
      <section className="space-y-3">
        <h3 className="text-base font-extrabold text-foreground">1. Information We Collect</h3>
        <p>We collect information you provide directly to us when creating an account, configuring jobs, or communicating with support. This includes:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Account Data:</strong> Primary email addresses, usernames, billing parameters, profile photos, and OAuth identification credentials passed during registration.</li>
          <li><strong>Job Configurations:</strong> Target HTTP API urls, custom request headers, raw JSON bodies, and code runner files (JavaScript/Python) scheduled for interval loops.</li>
          <li><strong>Environmental Parameters:</strong> Private API tokens, webhook tokens, and server passwords configured inside the job dashboard. These values are encrypted immediately and never displayed or sent in plaintext.</li>
          <li><strong>Execution Metrics:</strong> Run logs, response status codes, execution latencies, CPU time consumption, and stdout/stderr print records.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-extrabold text-foreground">2. How We Use Information</h3>
        <p>The collected data is processed strictly to deliver task scheduling services. Specific use cases include:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Managing account status, executing billing adjustments, and validating API call quotas.</li>
          <li>Provisioning secure V8 Isolate sandboxes to compile and execute scheduled code routines.</li>
          <li>Generating dynamic execution logs and rendering public SVG status badges.</li>
          <li>Analyzing job failure logs via LLM adapters to display AI-assisted bug recommendations on your dashboard.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-extrabold text-foreground">3. CCPA and GDPR Compliance Rights</h3>
        <p>In accordance with global privacy frameworks, Api Coolie guarantees the following self-service control operations for all users:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Right to Access:</strong> You can download or view all database records associated with your account, including complete job lists, API tokens, and execution histories.</li>
          <li><strong>Right to Rectification:</strong> You can update profile values, edit job configurations, and reset environmental parameters at any time from the account workspace.</li>
          <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Deleting your account permanently purges all tables, active cron runners, database schedules, and encrypted environmental secrets. Purges are completed immediately and are non-reversible.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-extrabold text-foreground">4. Third-Party Subprocessors</h3>
        <p>We work with trusted infrastructure providers to run our platform. These third parties include:</p>
        <table className="w-full text-xs text-left border border-border/40 rounded-xl overflow-hidden mt-3">
          <thead>
            <tr className="bg-muted/20 border-b border-border/40 font-bold">
              <th className="p-3">Partner Entity</th>
              <th className="p-3">Purpose</th>
              <th className="p-3">Data Exchanged</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20 text-muted-foreground font-medium">
            <tr>
              <td className="p-3 font-semibold text-foreground">Neon Database Inc.</td>
              <td className="p-3">Primary postgres storage.</td>
              <td className="p-3">All user records, encrypted secrets, and execution history.</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-foreground">OpenRouter API</td>
              <td className="p-3">Generates AI diagnostics for error logs.</td>
              <td className="p-3">Anonymized script stdout/stderr error logs (no environment variables are shared).</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-foreground">Google Cloud Platform</td>
              <td className="p-3">OAuth 2.0 Identity verification.</td>
              <td className="p-3">Email validation, name, and profile photos.</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );

  if (pathname.includes('terms')) {
    title = 'Terms of Service';
    desc = 'Rules and limitations for using the Api Coolie scheduler service.';
    content = (
      <div className="space-y-6 text-xs sm:text-sm">
        <section className="space-y-3">
          <h3 className="text-base font-extrabold text-foreground">1. Description of Service</h3>
          <p>Api Coolie provides scheduled task execution resources. This includes configuring REST API calls and compiling custom scripts (JavaScript/Python) inside isolated sandboxes. Services are provided "as-is" and "as-available". While we aim for 99.9% uptime, we do not guarantee uninterrupted operation or zero-latency trigger cycles.</p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-extrabold text-foreground">2. Acceptable Use Policy (AUP)</h3>
          <p>By registering on Api Coolie, you agree to configure jobs strictly for legitimate integrations. The following use cases are strictly prohibited and will result in immediate account termination:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Security Vulnerability Attacks:</strong> Configuring endpoint loops pointing to internal networks, loopback IP subnets, or metadata ports (Server-Side Request Forgery - SSRF).</li>
            <li><strong>Denial of Service (DoS):</strong> Setting high-frequency scheduling patterns designed to flood third-party servers, bypass rate-limits, or cause service outages.</li>
            <li><strong>Resource Exploits:</strong> Attempting to run cryptocurrency miners, CPU stress-testing loops, file system scans, or port scanners within V8 script sandboxes.</li>
            <li><strong>Spam and Phishing:</strong> Using cron webhooks to distribute automated spam, generate phishing pages, or scrap copyrighted intellectual properties without consent.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-extrabold text-foreground">3. Isolate Runtime Restrictions</h3>
          <p>To ensure system stability, task execution is subject to strict resource caps:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Memory Limits:</strong> Sandboxed runs are capped at 128MB of Heap RAM. Tasks exceeding this limit are terminated immediately with a memory allocation failure.</li>
            <li><strong>CPU Execution Limits:</strong> Total script runtime is capped at 5 seconds. Script tasks that fail to complete within this window are killed automatically.</li>
            <li><strong>Free Tier Boundaries:</strong> Free tier accounts are limited to a minimum scheduler cycle of 1 minute. Precise 1-second interval execution requires an upgrade to a paid subscription plan.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-extrabold text-foreground">4. Limitation of Liability and Indemnification</h3>
          <p>Api Coolie is not liable for any financial losses, data corruption, or service interruptions caused by scheduled job execution failures. You agree to indemnify, defend, and hold harmless Api Coolie and its operators from any claims, damages, liabilities, or expenses arising from your usage of our task runner tools.</p>
        </section>
      </div>
    );
  } else if (pathname.includes('security')) {
    title = 'Security Operations';
    desc = 'Measures enforcing authorization isolation and credential protection.';
    content = (
      <div className="space-y-6 text-xs sm:text-sm">
        <section className="space-y-3">
          <h3 className="text-base font-extrabold text-foreground">1. Multi-Tenant Database Isolation</h3>
          <p>Api Coolie stores user metadata and job configurations inside a shared Neon Postgres database. To ensure strict multi-tenant isolation, the application enforces the following controls:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>UUID-Scoped Queries:</strong> Database records do not use sequential integer keys. All records are indexed using cryptographically random UUIDs.</li>
            <li><strong>Application-Layer Scope Checks:</strong> The backend Express service validates user ownership parameters on every query. Every write, read, and delete operation is scoped strictly using authenticated session tokens to prevent unauthorized database cross-reads.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-extrabold text-foreground">2. Encryption at Rest and in Transit</h3>
          <p>Protecting user data is a top priority. We implement encryption throughout the application lifecycles:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>In Transit:</strong> All connections to our API endpoints, dashboard, and webhook targets are encrypted using TLS 1.3. Unencrypted HTTP requests are automatically upgraded.</li>
            <li><strong>Secrets at Rest:</strong> Sensitive environmental variables (database connection strings, API tokens, passwords) are encrypted before storage. We use AES-256-GCM encryption with keys kept separate from database storage.</li>
            <li><strong>Redacted Log Output:</strong> The scheduler engine scans execution log streams for matching values of encrypted variables. Any matches are redacted and replaced with a secure placeholder before logs are committed to database storage.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-extrabold text-foreground">3. Webhook Authentication and HMAC Signatures</h3>
          <p>Incoming webhook calls are verified using cryptographically signed headers. When a job completes, the scheduler signs the JSON request payload using your account's Webhook Signature Secret and sends it in the header:</p>
          <code className="bg-muted/15 border border-border/40 px-3 py-1 rounded text-[11px] text-primary block w-fit font-mono">X-Coolie-Signature: sha256=computed_hash_value</code>
          <p>Your backend can use this header to verify that the request came from Api Coolie and has not been modified. This prevents unauthorized callers from sending fake logs or spoofing trigger events.</p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-extrabold text-foreground">4. Vulnerability Disclosure Policy</h3>
          <p>We welcome security reports from developers and security researchers. If you discover a security issue or vulnerability on Api Coolie, please contact us at <a href="mailto:security@apicoolie.com" className="text-primary font-semibold hover:underline">security@apicoolie.com</a> before public disclosure. We will review your report and work to address it promptly.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 space-y-8">
      <Helmet>
        <title>{title} | Api Coolie</title>
      </Helmet>

      <div className="space-y-2 border-b border-border/40 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>

      <div className="text-muted-foreground leading-relaxed">
        {content}
      </div>
    </div>
  );
}
