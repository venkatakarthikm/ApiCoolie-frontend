import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Key, Calendar, Terminal, Shield, ArrowRight, Book, HelpCircle, AlertCircle, Info, Cpu, Database, Network } from 'lucide-react';
import { CopyButton } from '../components/CopyButton.jsx';

export function DocsPage() {
  const [activeSection, setActiveSection] = useState('started');

  const nodeCode = `const crypto = require('crypto');

/**
 * Verifies that a webhook request came from Api Coolie
 * @param {object} payload - The raw parsed JSON request body
 * @param {string} signatureHeader - The value of the X-Coolie-Signature header
 * @param {string} secretToken - Your configured Webhook Signature Secret
 * @returns {boolean}
 */
function verifyWebhook(payload, signatureHeader, secretToken) {
  if (!signatureHeader || !secretToken) {
    return false;
  }

  // 1. Reconstruct the HMAC SHA-256 signature from the payload
  const signature = crypto
    .createHmac('sha256', secretToken)
    .update(JSON.stringify(payload))
    .digest('hex');

  // 2. Format to match expected header: sha256=signature_hex
  const expectedSignature = \`sha256=\${signature}\`;

  // 3. Compare against headers using timingSafeEqual to protect against timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signatureHeader),
      Buffer.from(expectedSignature)
    );
  } catch (err) {
    return false;
  }
}`;

  const pythonCode = `import hmac
import hashlib
import json

def verify_webhook(payload, signature_header, secret_token):
    """
    Verifies that a webhook request came from Api Coolie
    :param payload: dict representation of the webhook request body
    :param signature_header: string from 'X-Coolie-Signature' header
    :param secret_token: string matching your Webhook Signature Secret
    :return: bool indicating match status
    """
    if not signature_header or not secret_token:
        return False
        
    # 1. Serialize payload with canonical separators to match server serialization
    serialized = json.dumps(payload, separators=(',', ':'))
    
    # 2. Compute the SHA-256 HMAC hash
    signature = hmac.new(
        secret_token.encode('utf-8'),
        serialized.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    # 3. Securely compare headers to prevent side-channel timing analysis
    expected = f"sha256={signature}"
    return hmac.compare_digest(signature_header, expected)`;

  const docSections = [
    { id: 'started', title: 'Getting Started & Architecture', icon: BookOpen },
    { id: 'cron', title: 'Advanced Cron Scheduler Rules', icon: Calendar },
    { id: 'vm', title: 'Isolated-VM V8 Runtime Spec', icon: Terminal },
    { id: 'sec', title: 'Webhook Security & HMAC Signatures', icon: Shield },
    { id: 'api', title: 'Programmatic REST API Keys', icon: Key },
    { id: 'faq', title: 'Developer FAQ & Troubleshooting', icon: HelpCircle },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8 animate-scale text-xs md:text-sm">
      <Helmet>
        <title>Documentation | Api Coolie</title>
        <meta name="description" content="Official documentation for Api Coolie. Learn cron patterns, script integrations, HMAC verification codes, and client scopes." />
      </Helmet>

      {/* Docs Side Nav */}
      <aside className="w-full lg:w-72 shrink-0 space-y-1.5">
        <div className="px-3 mb-4 flex items-center gap-2">
          <Book className="h-5 w-5 text-primary" />
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">Dev Center Docs</span>
        </div>
        <div className="space-y-1">
          {docSections.map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                id={`doc-sec-${sec.id}`}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all text-left ${
                  activeSection === sec.id
                    ? 'bg-primary text-white shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/10 bg-card/45 border border-border/20'
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span>{sec.title}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Docs Content panel */}
      <div className="flex-1 max-w-4xl border border-border/40 bg-card/65 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-lg space-y-8">
        
        {activeSection === 'started' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-sans">Getting Started & Architecture</h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Api Coolie is a developer-first platform designed to run scheduled API triggers and scripts in isolated environments. By hosting your scheduling logic on our highly available infrastructure, you eliminate the need to maintain fragile linux <code>crontab</code> configuration files, manage server processes, or build custom task queues.
            </p>
            
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-foreground">Platform Core Components</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-border/40 bg-muted/5 rounded-2xl space-y-2">
                  <h4 className="font-extrabold text-xs text-foreground flex items-center gap-1.5">
                    <Network className="h-4 w-4 text-primary" /> API Trigger Jobs
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Standard scheduled HTTP requests mapping payloads (JSON, form data, or raw bytes) directly to remote target endpoints. Ideal for invoking webhooks, running serverless lambdas, or synchronizing third-party databases.
                  </p>
                </div>
                <div className="p-4 border border-border/40 bg-muted/5 rounded-2xl space-y-2">
                  <h4 className="font-extrabold text-xs text-foreground flex items-center gap-1.5">
                    <Cpu className="h-4 w-4 text-primary" /> Code Isolation Jobs
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Custom JavaScript or Python code scripts running inside sandboxed containers. Each run cycle receives encrypted database credentials and environmental configurations dynamically on boot.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="font-extrabold text-sm text-foreground">How It Works (Under the Hood)</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Api Coolie uses a distributed scheduler engine synchronized with a Neon Postgres event ledger. When a cron trigger pattern evaluates to true:
              </p>
              <ol className="list-decimal pl-5 text-xs text-muted-foreground space-y-2 leading-relaxed">
                <li>The task engine acquires a temporary row lock on the job's scheduling configuration ledger.</li>
                <li>If the job type is a <strong>Code Job</strong>, a V8 Isolate runtime gets provisioned dynamically with strict limits (128MB Heap, 5000ms CPU execution limits).</li>
                <li>For <strong>API Jobs</strong>, the scheduler dispatches a node request client with configurable timeout parameters and redirects support.</li>
                <li>Execution statistics (latency metrics, HTTP status codes, output stdout/stderr, and CPU compute durations) are streamed back and committed to the user's dashboard view.</li>
              </ol>
            </div>
          </div>
        )}

        {activeSection === 'cron' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-sans">Advanced Cron Scheduler Rules</h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We support standard 5-field UNIX cron formats as well as advanced 6-field cron expressions allowing sub-minute scheduling granularity (down to 1-second precisions).
            </p>
            
            <div className="border border-border/40 rounded-2xl overflow-hidden bg-muted/5">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-muted/20 border-b border-border/40 font-bold">
                    <th className="p-3">Field Position</th>
                    <th className="p-3">Field Name</th>
                    <th className="p-3">Allowed Range</th>
                    <th className="p-3">Wildcards Supported</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-muted-foreground font-medium">
                  <tr><td className="p-3">1</td><td className="p-3 font-semibold text-foreground">Seconds</td><td className="p-3">0-59</td><td className="p-3"><code>*</code> , <code>-</code> , <code>/</code></td></tr>
                  <tr><td className="p-3">2</td><td className="p-3 font-semibold text-foreground">Minutes</td><td className="p-3">0-59</td><td className="p-3"><code>*</code> , <code>-</code> , <code>/</code></td></tr>
                  <tr><td className="p-3">3</td><td className="p-3 font-semibold text-foreground">Hours</td><td className="p-3">0-23</td><td className="p-3"><code>*</code> , <code>-</code> , <code>/</code></td></tr>
                  <tr><td className="p-3">4</td><td className="p-3 font-semibold text-foreground">Day of Month</td><td className="p-3">1-31</td><td className="p-3"><code>*</code> , <code>-</code> , <code>/</code> , <code>?</code></td></tr>
                  <tr><td className="p-3">5</td><td className="p-3 font-semibold text-foreground">Month</td><td className="p-3">1-12 (or JAN-DEC)</td><td className="p-3"><code>*</code> , <code>-</code> , <code>/</code></td></tr>
                  <tr><td className="p-3">6</td><td className="p-3 font-semibold text-foreground">Day of Week</td><td className="p-3">0-6 (0 is Sunday, or SUN-SAT)</td><td className="p-3"><code>*</code> , <code>-</code> , <code>/</code> , <code>?</code></td></tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="font-extrabold text-sm text-foreground">Common Scheduling Patterns</h3>
              <ul className="space-y-2.5 text-xs text-muted-foreground font-medium">
                <li><code className="bg-muted/15 border border-border/40 px-2 py-0.5 rounded text-primary">*/10 * * * * *</code> : Triggers every 10 seconds exactly.</li>
                <li><code className="bg-muted/15 border border-border/40 px-2 py-0.5 rounded text-primary">0 30 9 * * *</code> : Triggers daily at 9:30 AM.</li>
                <li><code className="bg-muted/15 border border-border/40 px-2 py-0.5 rounded text-primary">0 0 12 * * MON-FRI</code> : Triggers every Monday through Friday at 12:00 PM.</li>
                <li><code className="bg-muted/15 border border-border/40 px-2 py-0.5 rounded text-primary">0 0 0 1 */3 *</code> : Triggers at midnight on the first day of every quarter (Jan 1, Apr 1, Jul 1, Oct 1).</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex gap-3 text-yellow-600">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-xs">Timezone and Daylight Savings Time (DST) Operations</h4>
                <p className="text-[11px] leading-relaxed">
                  Unlike typical system crontabs which execute strictly on local server UTC offsets, Api Coolie allows you to assign specific target timezones (e.g., <code>Asia/Kolkata</code>, <code>America/New_York</code>) to every job. Our engine uses timezone-aware date libraries to calculate future execution times. If a scheduled trigger overlaps with a daylight saving time transition, the engine automatically corrects the run timestamp to prevent skipping or double execution.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'vm' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-sans">Isolated-VM V8 Runtime Specification</h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              For security, isolation, and predictability, all custom Javascript scripts execute inside V8 Isolate sandboxes using <code>isolated-vm</code>. This prevents processes from sharing memory states, tampering with the parent OS filesystem, or initiating resource starvation loops.
            </p>

            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-foreground">Sandbox Constraint Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
                <div className="p-4 border border-border/20 rounded-2xl space-y-1 bg-muted/5">
                  <span className="text-foreground font-extrabold block">RAM Heap Cap</span>
                  <span className="text-lg font-bold text-primary">128 MB</span>
                  <p className="text-[10px] leading-normal">Exceeding this value raises a Heap Memory Out-of-Range exception and terminates the job immediately.</p>
                </div>
                <div className="p-4 border border-border/20 rounded-2xl space-y-1 bg-muted/5">
                  <span className="text-foreground font-extrabold block">CPU Time Limit</span>
                  <span className="text-lg font-bold text-primary">5,000 ms</span>
                  <p className="text-[10px] leading-normal">Total thread execution time is limited to 5 seconds to eliminate runaway execution states and CPU starvation.</p>
                </div>
                <div className="p-4 border border-border/20 rounded-2xl space-y-1 bg-muted/5">
                  <span className="text-foreground font-extrabold block">Network Policy</span>
                  <span className="text-lg font-bold text-primary">Restricted</span>
                  <p className="text-[10px] leading-normal">Outbound connections are verified. Internal network addresses (SSRF targets) are blocked at the socket layer.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="font-extrabold text-sm text-foreground">Pre-configured Global Objects</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The sandbox context strips standard global Node references (like <code>fs</code>, <code>path</code>, <code>http</code>, or `require` of unsafe modules) and replaces them with audited helpers:
              </p>
              <ul className="space-y-3 text-xs text-muted-foreground pl-5 list-disc leading-relaxed">
                <li>
                  <code>fetch(url, options)</code>: A WHATWG-compliant fetch client for communicating with remote HTTPS APIs.
                </li>
                <li>
                  <code>console.log() / console.error() / console.info()</code>: Captures outputs and routes them to your execution log viewer.
                </li>
                <li>
                  <code>process.env</code>: Contains a list of decrypted custom environment variables configured in your job details panel.
                </li>
                <li>
                  <code>require('pg')</code>: The pre-bundled database client library for direct PostgreSQL/Neon data queries.
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeSection === 'sec' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-sans">Webhook Security & HMAC Signatures</h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When configuring an API Job, you can enable <strong>Webhook Notifications</strong>. This forces the Api Coolie scheduler to dispatch a POST request containing execution logs, payload results, and status codes to your target backend on completion.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              To guarantee that incoming requests originate exclusively from Api Coolie and have not been altered or spoofed, configure a <strong>Webhook Signature Secret</strong> in settings. We use this secret token to sign every webhook request payload via an HMAC SHA-256 signature, which is sent in the header:
              <br />
              <code className="bg-muted/15 border border-border/40 px-2 py-0.5 rounded text-[11px] text-primary mt-1 inline-block">X-Coolie-Signature: sha256=computed_hash</code>
            </p>

            <div className="space-y-4 pt-4">
              <h3 className="font-extrabold text-sm text-foreground">Node.js Express Code Verification</h3>
              <div className="relative border border-border/40 rounded-2xl bg-card overflow-hidden">
                <div className="absolute right-3 top-3 z-10">
                  <CopyButton value={nodeCode} label="Copy JS" />
                </div>
                <pre className="p-4 text-[10px] overflow-x-auto bg-muted/5 font-mono leading-relaxed text-muted-foreground">
                  {nodeCode}
                </pre>
              </div>

              <h3 className="font-extrabold text-sm pt-4">Python Flask / FastAPI Verification</h3>
              <div className="relative border border-border/40 rounded-2xl bg-card overflow-hidden">
                <div className="absolute right-3 top-3 z-10">
                  <CopyButton value={pythonCode} label="Copy Python" />
                </div>
                <pre className="p-4 text-[10px] overflow-x-auto bg-muted/5 font-mono leading-relaxed text-muted-foreground">
                  {pythonCode}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'api' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-sans">Programmatic REST API Keys</h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Developers can control their Api Coolie resources programmatically via our JSON REST API. All requests must carry an API Key passed as a bearer token in the headers.
            </p>

            <div className="border border-border/40 rounded-2xl p-4 bg-muted/5 font-mono text-xs text-muted-foreground">
              Authorization: Bearer ac_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
            </div>

            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-foreground">Endpoint Routing Index</h3>
              <div className="border border-border/40 rounded-2xl overflow-hidden bg-muted/5 text-[11px]">
                <div className="grid grid-cols-12 bg-muted/20 border-b border-border/40 font-bold p-3">
                  <span className="col-span-2">Method</span>
                  <span className="col-span-6">Path</span>
                  <span className="col-span-4">Scope Required</span>
                </div>
                <div className="divide-y divide-border/20 text-muted-foreground font-medium">
                  <div className="grid grid-cols-12 p-3"><span className="col-span-2 text-emerald-500 font-extrabold">GET</span><span className="col-span-6 font-mono text-foreground">/api/v1/jobs</span><span className="col-span-4">jobs:read</span></div>
                  <div className="grid grid-cols-12 p-3"><span className="col-span-2 text-blue-500 font-extrabold">POST</span><span className="col-span-6 font-mono text-foreground">/api/v1/jobs</span><span className="col-span-4">jobs:write</span></div>
                  <div className="grid grid-cols-12 p-3"><span className="col-span-2 text-emerald-500 font-extrabold">GET</span><span className="col-span-6 font-mono text-foreground">/api/v1/jobs/:id</span><span className="col-span-4">jobs:read</span></div>
                  <div className="grid grid-cols-12 p-3"><span className="col-span-2 text-amber-500 font-extrabold">PATCH</span><span className="col-span-6 font-mono text-foreground">/api/v1/jobs/:id</span><span className="col-span-4">jobs:write</span></div>
                  <div className="grid grid-cols-12 p-3"><span className="col-span-2 text-rose-500 font-extrabold">DELETE</span><span className="col-span-6 font-mono text-foreground">/api/v1/jobs/:id</span><span className="col-span-4">jobs:write</span></div>
                  <div className="grid grid-cols-12 p-3"><span className="col-span-2 text-blue-500 font-extrabold">POST</span><span className="col-span-6 font-mono text-foreground">/api/v1/jobs/:id/run</span><span className="col-span-4">jobs:execute</span></div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted/5 border border-border/40 rounded-2xl space-y-2">
              <h4 className="font-extrabold text-xs text-foreground">Token Security Policies</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                When generating a programmatic token inside your account settings, restrict access properties using specific scope assignments. For example, assign read-only scopes (`jobs:read`) to scripts parsing job health statuses, and limit write configurations (`jobs:write`) strictly to trusted CI pipelines.
              </p>
            </div>
          </div>
        )}

        {activeSection === 'faq' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-sans">Developer FAQ & Troubleshooting</h1>
            
            <div className="space-y-4">
              {[
                { 
                  q: "Why is my Code Job returning a Timeout Exception?", 
                  a: "Code Jobs must finish execution within 5,000 milliseconds. If you are querying multiple external APIs in a serial fashion or attempting heavy math computations, the sandbox will terminate. Optimize script performance by executing operations asynchronously with Promise.all() or chunking tasks." 
                },
                { 
                  q: "How can I trigger my jobs externally on demand?", 
                  a: "Enable the 'Worker URL' feature inside the job settings panel. This creates a unique endpoint slug (e.g. /w/prune-tables). Sending an HTTP request directly to this address will execute the job synchronously and return the logs in the response body." 
                },
                { 
                  q: "What is SSRF filtering, and why is my local endpoint blocked?", 
                  a: "To prevent Server-Side Request Forgery (SSRF) attacks, the Api Coolie scheduler disallows outbound calls to loopback IP addresses (like localhost, 127.0.0.1) and private subnets (like 10.0.0.0/8 or 192.168.0.0/16). All target endpoints must be public facing and protected by secure authentication." 
                },
                { 
                  q: "Does Api Coolie support npm dependencies inside sandboxes?", 
                  a: "For security and runtime integrity, sandboxes block arbitrary package downloads. Common utilities such as the Node postgres client ('pg') are pre-loaded. If your task requires complex packages, write an API Job that delegates work to a secure external worker endpoint on your own servers." 
                }
              ].map(({ q, a }, idx) => (
                <div key={idx} className="space-y-1.5 p-4 border border-border/40 rounded-2xl bg-muted/5">
                  <h4 className="font-extrabold text-xs text-foreground flex items-center gap-1.5">
                    <Info className="h-4.5 w-4.5 text-primary shrink-0" /> {q}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed pl-6">{a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
