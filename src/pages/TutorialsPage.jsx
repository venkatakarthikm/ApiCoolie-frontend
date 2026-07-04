import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Terminal, ShieldAlert, Cpu, Check, Copy, ArrowRight, Slack, Database, Lock, Globe, Code2 } from 'lucide-react';
import { CopyButton } from '../components/CopyButton.jsx';

export function TutorialsPage() {
  const [activeTab, setActiveTab] = useState('slack');

  const slackCode = `// Slack Uptime Alerter Script for Api Coolie Code Runner
// Runs every 5 minutes: */5 * * * *

const TARGET_URL = 'https://mysite.com/health';
const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL; // Fetch from securely encrypted environment variables

async function run() {
  if (!SLACK_WEBHOOK) {
    throw new Error("Missing SLACK_WEBHOOK_URL environment variable.");
  }

  const startTime = Date.now();
  console.log(\`[Monitor] Starting health poll for \${TARGET_URL}...\\n\`);

  try {
    const response = await fetch(TARGET_URL, {
      method: 'GET',
      headers: { 'User-Agent': 'ApiCoolieUptimeMonitor/1.0' },
      timeout: 10000 // 10s timeout
    });

    const latency = Date.now() - startTime;
    console.log(\`[Monitor] Response received. Status: \${response.status}. Latency: \${latency}ms\\n\`);

    if (response.status !== 200) {
      await alertSlack(response.status, latency, \`HTTP Status code returned: \${response.status}\`);
    } else {
      console.log(\`[Monitor] System is healthy. Polling iteration completed.\\n\`);
    }
  } catch (error) {
    const latency = Date.now() - startTime;
    console.error(\`[Monitor] Poll failed after \${latency}ms. Error: \${error.message}\\n\`);
    await alertSlack('DOWN', latency, error.message);
  }
}

async function alertSlack(status, latency, details) {
  const message = {
    attachments: [{
      color: '#e11d48',
      title: '🚨 Uptime Alert: Target Endpoint is Unhealthy!',
      fields: [
        { title: 'Target URL', value: TARGET_URL, short: true },
        { title: 'Status / Error', value: String(status), short: true },
        { title: 'Latency Measured', value: \`\${latency}ms\`, short: true },
        { title: 'Failure Cause', value: details, short: false }
      ],
      ts: Math.floor(Date.now() / 1000)
    }]
  };

  const slackRes = await fetch(SLACK_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  });

  if (!slackRes.ok) {
    console.error(\`[Slack Alert] Failed to send notification to Slack channel: \${slackRes.statusText}\\n\`);
  } else {
    console.log('[Slack Alert] Notification payload successfully delivered to Slack Webhook URL.\\n');
  }
}

// Invoke the entry point function
run();`;

  const dbCode = `// Database Vacuum & Cleanup Script for Neon Postgres
// Runs nightly: 0 0 * * *

const { Client } = require('pg'); // PG library is pre-loaded in sandbox

async function run() {
  const connectionString = process.env.DATABASE_URL; // Encrypted in configuration panel
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL variable.");
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("[DB Operations] Connected to Neon Postgres instance. Starting cron operations...\\n");

    // 1. Clean up logs older than 30 days
    const pruneQuery = "DELETE FROM public.activity_logs WHERE created_at < NOW() - INTERVAL '30 days';";
    const pruneResult = await client.query(pruneQuery);
    console.log(\`[Prune] Deleted \${pruneResult.rowCount} audit log entries older than 30 days.\\n\`);

    // 2. Perform table optimizations (VACUUM ANALYZE) to update statistics
    console.log("[DB Operations] Running VACUUM ANALYZE on public tables to optimize query indexes...\\n");
    await client.query("VACUUM ANALYZE public.activity_logs;");
    console.log("[DB Operations] Table optimization completed successfully.\\n");

    // 3. Reset failed tokens cache
    const resetQuery = "UPDATE public.api_tokens SET failure_count = 0 WHERE failure_count > 0 AND last_used < NOW() - INTERVAL '1 day';";
    const resetResult = await client.query(resetQuery);
    console.log(\`[Cache] Restored \${resetResult.rowCount} transiently blocked API tokens.\\n\`);

  } catch (err) {
    console.error("[DB Operations] Database maintenance task encountered a critical failure:", err);
    throw err;
  } finally {
    await client.end();
    console.log("[DB Operations] Database connections closed safely.\\n");
  }
}

run();`;

  const hmacCode = `// HMAC SHA-256 Webhook Payload Signer
// Configured inside Api Coolie Custom Jobs Integration

const crypto = require('crypto');

function signPayload(payloadObject, sharedHmacSecret) {
  // 1. Serialize payload object into canonical, dense JSON format
  const serialized = JSON.stringify(payloadObject);

  // 2. Generate HMAC SHA-256 hash using the cryptographically secure secret
  const hmac = crypto.createHmac('sha256', sharedHmacSecret);
  hmac.update(serialized);
  const signature = hmac.digest('hex');

  // 3. Output header value to match our receiver's expected validation schema
  return \`sha256=\${signature}\`;
}`;

  const jsonCode = `// Dynamic JSON Schema Payload Validator
// Configured inside Api Coolie Code Sandbox

function validatePayload(data) {
  // 1. Enforce schema rules (e.g. key attributes existence and types validation)
  const requiredKeys = ['id', 'status', 'version', 'payload'];
  for (const key of requiredKeys) {
    if (!(key in data)) {
      throw new Error(\`Schema validation failure: Missing required property '\${key}'\`);
    }
  }
  
  if (typeof data.id !== 'number' && typeof data.id !== 'string') {
    throw new Error("Schema validation failure: 'id' property must be a string or a number");
  }
  
  if (typeof data.payload !== 'object' || data.payload === null) {
    throw new Error("Schema validation failure: 'payload' property must be a valid JSON object");
  }
  
  return true;
}

// Example Execution
fetch('https://api.ipify.org?format=json')
  .then(res => res.json())
  .then(data => {
    // Structure dynamic test payload matching your API's schema
    const mockPayload = {
      id: 10024,
      status: "active",
      version: "2.1.0",
      payload: {
        ipAddress: data.ip,
        provider: "Api Coolie Formatter Suite"
      }
    };
    
    validatePayload(mockPayload);
    console.log("JSON schema validation passed successfully!");
  })
  .catch(err => {
    console.error("Task failed validation checklist:", err.message);
    throw err; // Trigger alerts
  });`;

  const tabs = [
    { id: 'slack', label: 'Uptime Slack Alerter', icon: Slack, desc: 'Set up automated monitoring of endpoints with Slack notifications.' },
    { id: 'db', label: 'Neon Database Cleanup', icon: Database, desc: 'Clean old records and run VACUUM operations on a Neon Postgres instance.' },
    { id: 'hmac', label: 'HMAC Webhook Signer', icon: Lock, desc: 'Verify incoming scheduled webhooks securely on your backend.' },
    { id: 'json', label: 'JSON Schema Validator', icon: Globe, desc: 'Fetch JSON API payloads, validate fields, and alert on syntax mismatches.' }
  ];

  let tutTitle = 'Developer Tutorials';
  let tutDesc = 'Step-by-step developer tutorials to get the most out of Api Coolie scheduling and validation platforms.';

  if (activeTab === 'slack') {
    tutTitle = 'Uptime Slack Alerter Integration Tutorial';
    tutDesc = 'Learn how to set up automated uptime monitoring of endpoints and send execution alert notifications to Slack.';
  } else if (activeTab === 'db') {
    tutTitle = 'Neon Postgres Database Maintenance Tutorial';
    tutDesc = 'Learn how to automate database pruning, reset metrics, and run VACUUM ANALYZE operations on Neon Postgres.';
  } else if (activeTab === 'hmac') {
    tutTitle = 'Cryptographic HMAC Signature Verification Tutorial';
    tutDesc = 'Learn how to secure incoming scheduled webhooks using SHA-256 HMAC signature headers on Express/Flask backends.';
  } else if (activeTab === 'json') {
    tutTitle = 'Automated JSON Payload Validation Tutorial';
    tutDesc = 'Learn how to parse API responses, validate parameters against schemas, and trigger alerts inside isolated V8 sandboxes.';
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 animate-scale text-xs md:text-sm">
      <Helmet>
        <title>{tutTitle} | Api Coolie</title>
        <meta name="description" content={tutDesc} />
        <meta property="og:title" content={`${tutTitle} | Api Coolie`} />
        <meta property="og:description" content={tutDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://apicoolie.stackinfi.in/tutorials" />
        <meta property="og:image" content="https://apicoolie.stackinfi.in/Api%20Coolie.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${tutTitle} | Api Coolie`} />
        <meta name="twitter:description" content={tutDesc} />
        <meta name="twitter:image" content="https://apicoolie.stackinfi.in/Api%20Coolie.png" />
      </Helmet>

      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 shrink-0 space-y-4">
        <div className="px-3 py-1 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">Tutorial Library</span>
        </div>
        <nav className="flex flex-col gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all text-xs font-medium ${
                  activeTab === tab.id
                    ? 'bg-primary/5 text-primary border-primary shadow-sm'
                    : 'bg-card text-muted-foreground border-border/40 hover:text-foreground hover:bg-muted/10'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <Icon className={`h-4.5 w-4.5 ${activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="font-extrabold text-foreground">{tab.label}</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-normal font-medium">{tab.desc}</p>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 max-w-4xl border border-border/40 bg-card rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
        {activeTab === 'slack' && (
          <div className="space-y-6">
            <div className="space-y-2 border-b border-border/40 pb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded bg-primary/10 w-fit">Slack Integrations</span>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-sans pt-1">Uptime Slack Alerter</h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Learn how to build a highly reliable website monitoring job that runs every 5 minutes in a sandbox container, parses response parameters, measures latency, and automatically sends beautiful alert attachments to Slack when endpoints go offline.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-foreground">Step 1: Set up a Slack Incoming Webhook</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Go to your Slack workspace configuration panel, create an application, and activate <strong>Incoming Webhooks</strong>. Copy the generated Webhook URL (looks like <code>https://hooks.slack.com/services/T000/B000/XXXX</code>).
              </p>

              <h3 className="text-sm font-extrabold text-foreground pt-3">Step 2: Add Secrets to Api Coolie Workspace</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Navigate to your Api Coolie dashboard, create a new job, and scroll down to the <strong>Variables</strong> panel. Add an encrypted variable:
                <br />
                <code className="bg-muted/15 border border-border/40 px-2 py-0.5 rounded text-[11px] text-primary mt-1 inline-block">Key: SLACK_WEBHOOK_URL</code>
              </p>

              <h3 className="text-sm font-extrabold text-foreground pt-3">Step 3: Deploy the Code Runner script</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Paste the following JavaScript runner code directly into your Code Editor tab. Set the schedule to <code>*/5 * * * *</code> (every 5 minutes).
              </p>

              <div className="relative border border-border/40 rounded-2xl bg-card overflow-hidden mt-3">
                <div className="absolute right-3 top-3 z-10">
                  <CopyButton value={slackCode} label="Copy Script" />
                </div>
                <pre className="p-4 text-[10px] overflow-x-auto bg-muted/5 font-mono leading-relaxed text-muted-foreground max-h-96">
                  {slackCode}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'db' && (
          <div className="space-y-6">
            <div className="space-y-2 border-b border-border/40 pb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded bg-primary/10 w-fit">Postgres Routines</span>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-sans pt-1">Automated Neon Postgres Maintenance</h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Optimize your query performance and prune large logging datasets by running automated cleanup scripts every night. This tutorial explains how to connect to a Neon server instance inside an isolated sandbox, delete old records, reset failure metrics, and run VACUUM ANALYZE operations.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-foreground">Step 1: Get your Neon Connection String</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Locate your Postgres connection string in the Neon console panel (looks like <code>postgres://user:password@endpoint-pooler.neon.tech/neondb</code>).
              </p>

              <h3 className="text-sm font-extrabold text-foreground pt-3">Step 2: Add Encrypted Variables</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                In the Api Coolie job builder, create a new Code Job, and add an encrypted variable:
                <br />
                <code className="bg-muted/15 border border-border/40 px-2 py-0.5 rounded text-[11px] text-primary mt-1 inline-block">Key: DATABASE_URL</code>
              </p>

              <h3 className="text-sm font-extrabold text-foreground pt-3">Step 3: Maintain Tables</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Paste the database maintenance script below. Configure the cron expression to run at midnight: <code>0 0 * * *</code>.
              </p>

              <div className="relative border border-border/40 rounded-2xl bg-card overflow-hidden mt-3">
                <div className="absolute right-3 top-3 z-10">
                  <CopyButton value={dbCode} label="Copy Script" />
                </div>
                <pre className="p-4 text-[10px] overflow-x-auto bg-muted/5 font-mono leading-relaxed text-muted-foreground max-h-96">
                  {dbCode}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hmac' && (
          <div className="space-y-6">
            <div className="space-y-2 border-b border-border/40 pb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded bg-primary/10 w-fit">Security Framework</span>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-sans pt-1">Cryptographic HMAC Payload Signatures</h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Prevent webhook spoofing and replay attacks. In this guide, we walk you through generating a cryptographically secure signature for webhook payloads using SHA-256 HMAC, injecting it as an HTTP header, and validating it on the receiving server.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-foreground">Step 1: Configure webhook secret</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                In the Api Coolie dashboard settings, configure a <strong>Webhook Signature Secret</strong>. This secret token remains private to your account and the receiving server.
              </p>

              <h3 className="text-sm font-extrabold text-foreground pt-3">Step 2: Sign custom webhook payloads</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                When a scheduled job fires, Api Coolie serializes the execution log metadata, signs it using the HMAC algorithm, and adds a header:
                <br />
                <code className="bg-muted/15 border border-border/40 px-2 py-0.5 rounded text-[11px] text-primary mt-1 inline-block">X-Coolie-Signature: sha256=hash_string</code>
              </p>

              <h3 className="text-sm font-extrabold text-foreground pt-3">Step 3: Verify the signatures on your backend</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                On your receiver server (e.g. Node.js backend), compute the signature of the incoming raw request body and compare it securely:
              </p>

              <div className="relative border border-border/40 rounded-2xl bg-card overflow-hidden mt-3">
                <div className="absolute right-3 top-3 z-10">
                  <CopyButton value={hmacCode} label="Copy Script" />
                </div>
                <pre className="p-4 text-[10px] overflow-x-auto bg-muted/5 font-mono leading-relaxed text-muted-foreground">
                  {hmacCode}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'json' && (
          <div className="space-y-6">
            <div className="space-y-2 border-b border-border/40 pb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded bg-primary/10 w-fit">JSON Suite</span>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-sans pt-1">Automated JSON Payload Validation</h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Ensure external API schemas do not change without notice. Learn how to fetch JSON payloads, programmatically validate keys and values against strict schema rules inside a secure sandbox runner, and raise execution alerts if structures mismatch.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-foreground">Step 1: Set up a Validator Task</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Create a new Code Job inside Api Coolie and select the JavaScript (Node.js) runtime environment.
              </p>

              <h3 className="text-sm font-extrabold text-foreground pt-3">Step 2: Add validation parameters</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Use the script below. It fetches raw content, parses fields, and asserts types. If a field is missing, throwing an Error flags the execution run as failed, notifying your Slack/Discord webhooks automatically.
              </p>

              <div className="relative border border-border/40 rounded-2xl bg-card overflow-hidden mt-3">
                <div className="absolute right-3 top-3 z-10">
                  <CopyButton value={jsonCode} label="Copy Script" />
                </div>
                <pre className="p-4 text-[10px] overflow-x-auto bg-muted/5 font-mono leading-relaxed text-muted-foreground">
                  {jsonCode}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
