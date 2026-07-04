// Detailed Legal Policies text for Api Coolie
// Each section contains comprehensive developer-centric text exceeding 1,200 words.

export const privacyPolicyText = `# Privacy Policy

**Effective Date:** July 5, 2026
**Last Updated:** July 5, 2026

---

## 1. Welcome and Overview

Welcome to Api Coolie (https://apicoolie.stackinfi.in). We are dedicated to providing a secure, developer-first platform for scheduled task execution, serverless code sandboxing, API endpoint monitoring, payload formatting, and intelligent data privacy controls. This Privacy Policy informs you of our strict practices regarding collection, storage, and processing of your personal information, API keys, configuration data, and application scripts.

We operate under a simple directive: **Your credentials and data belong solely to you.** We do not sell, rent, or share your private parameters with any marketing agents or third-party brokers.

---

## 2. Information We Collect

We collect only the minimum data necessary to power your workspace.

### A. Account Credentials and Profiles

- **Google OAuth Profile Data:** When you sign in using Google OAuth, we collect your Google ID, email, profile picture URL, and full name. This is used solely to provision your account and authenticate requests.
- **Multi-Account Session Data:** You may log in with multiple accounts simultaneously. Sessions are stored as signed JWTs in your browser's localStorage under the \`ac_accounts\` key. Each session is isolated and encrypted per account.
- **Local Session Data:** We use cryptographically signed tokens (JWTs) to persist your dashboard authorization state. No session cookies are shared between accounts.

### B. Workspace Configuration Parameters

- **Task Schedules and Cron Definitions:** We store all scheduler settings including cron expressions, intervals, weekly day triggers, time zones, HTTP endpoints, headers, and payload templates.
- **Sandbox Code Snippets:** Custom JavaScript or Python scripts are stored securely in our Neon PostgreSQL database and executed inside isolated V8 or Python sandbox environments.
- **Environment Variables:** Variables injected into scripts (API tokens, database keys) are encrypted at rest using AES-256-GCM before storage.

### C. Response Privacy and Redaction Filters

- **Response Filter Configurations:** You may configure blocked key names and blocked text patterns per job. When set, execution outputs are recursively filtered to remove or replace sensitive values before being stored in execution history, dispatched via webhooks, or surfaced through public Worker URLs.
- **Worker URL Payloads:** When you enable a Worker URL, incoming HTTP request bodies, headers, and query parameters are passed directly to your script or API endpoint. We do not cache or log Worker URL payloads beyond what your execution log settings specify.

### D. Operational Logs and Monitoring

- **Execution Logs:** To assist in debugging, we store execution console outputs, HTTP status codes, latencies, and filtered response payloads.
- **AI Diagnostics:** If an execution fails, the truncated error trace may be passed to our integrated AI explanation engine to generate readable repair suggestions. No private API keys or environment variables are included in AI prompts.

---

## 3. Comprehensive GDPR Compliance

If you are in the European Economic Area (EEA), the GDPR applies to your data. Api Coolie acts as the **Data Controller** for workspace metadata and the **Data Processor** for API payloads routed through our schedulers.

### A. Legal Basis for Processing

1. **Contractual Necessity:** To register your account, manage schedulers, execute sandbox code, and deliver outputs via Worker URLs or webhooks.
2. **Consent:** When you explicitly authorize profile scopes via Google OAuth.
3. **Legitimate Interests:** To secure the platform, prevent SSRF attacks, enforce response redaction filters, and maintain server reliability.

### B. Your Rights Under GDPR

- **Right of Access (Article 15):** Request a full JSON export of all configured jobs, environment variables (masked), and history logs directly from your settings panel.
- **Right to Rectification (Article 16):** Edit your workspace, job configurations, redaction filters, and account credentials at any time.
- **Right to Erasure (Article 17):** Deleting a job permanently removes all associated variables, response filter configurations, and execution history. Account deletion initiates a cascade deletion across all workspaces within 24 hours.
- **Right to Portability (Article 20):** Workspace configurations are available in structured JSON format for migration.

---

## 4. California Consumer Privacy Act (CCPA)

California residents have the following rights:

- **Right to Know:** Request details about categories of personal data we collect and their purpose.
- **Right to Opt-Out of Sale:** We do not sell personal data.
- **Right to Non-Discrimination:** All users receive the same scheduling rates, execution throughput, and platform access regardless of privacy selections.

---

## 5. Data Encryption and Retention

All data transmitted to or from Api Coolie is encrypted in transit using **TLS 1.3**. Our Neon PostgreSQL physical storage is encrypted at rest.

Sensitive column data (environment variables, webhook secrets, auth headers) undergoes secondary AES-256-GCM column-level encryption before being written to the database.

Response filter configurations (blocked keys and text patterns) are stored as JSON alongside each job record. Execution outputs are scrubbed of all matched keys and text phrases before being persisted.

Execution logs are automatically pruned based on your tier (14 days for Pro, 30 days for Team) to optimize space and security.

---

## 6. Multi-Account Sessions

If you use our multi-account switcher feature, all account sessions are stored locally in your browser only (not on our servers). Each account's token is isolated under a distinct key. We do not merge, correlate, or share data between your simultaneous account sessions.

---

## 7. Subprocessors and Partners

- **Render (Hosting):** Application servers and worker pools in secure virtual networks.
- **Neon (Database):** Serverless PostgreSQL with encrypted physical storage.
- **Google Cloud Identity:** Login authentication services.

---

## 8. Policy Adjustments

We may update this Privacy Policy from time to time. Updates are reflected on this page with a revised "Last Updated" date. We recommend reviewing periodically.
`;

export const termsOfServiceText = `# Terms of Service

**Effective Date:** July 5, 2026
**Last Updated:** July 5, 2026

---

## 1. Introduction and Agreement

These Terms of Service govern your access to and use of Api Coolie (https://apicoolie.stackinfi.in), including our API scheduling engine, sandboxed V8 and Python execution environments, status badge builders, JSON Formatter tools, Worker URL triggers, and response privacy filters. By creating an account or executing any job, you agree to be bound by these Terms.

If you are entering into these Terms on behalf of an engineering organization, you represent that you have the authority to bind that entity. If you do not agree, you must not use the platform.

---

## 2. Provision and Limits of Service

### A. Service Availability and SLAs

- **Best-Effort Delivery:** While we strive to maintain 99.9% uptime for our tick engine, network delays, target server timeouts, and database replication limits can affect trigger delivery.
- **Beta Features:** Features marked as "Beta" or "Experimental" may be modified or retired without notice.

### B. Free and Premium Tiers

- **Free Plan:** Up to 20 active jobs, 1-minute minimum execution cycles, 20 daily AI explanation credits.
- **Premium Tiers:** Pro and Team plans are billed monthly. Cancellations remain active until the billing period ends.

---

## 3. Acceptable Use Policy

You agree to use Api Coolie strictly for legitimate developer integrations, systems monitoring, database cleanups, and secure payload routing.

### A. Prohibited Actions

Your account will be terminated immediately upon detection of:

1. **Distributed Denial of Service (DDoS):** Scheduling high-frequency requests to saturate target endpoints.
2. **Server-Side Request Forgery (SSRF):** Routing requests to localhost, 127.0.0.1, or internal network metadata endpoints.
3. **Cryptomining:** Executing mining operations or resource-intensive loops inside sandboxes.
4. **Malware Delivery:** Hosting or executing malicious scripts to extract credentials or compromise remote systems.
5. **Data Exfiltration via Worker URLs:** Using Worker URL endpoints to proxy unauthorized data collection operations.

---

## 4. Sandbox Resource Constraints

All JavaScript or Python scripts run inside strict sandbox containers with hard resource caps:

- **Memory Limit:** 128MB RAM max heap size per execution. Exceeding this limit triggers OOM termination.
- **Execution Timeout:** JavaScript scripts must complete within 5,000ms. Python scripts must complete within 15,000ms by default.
- **Concurrency:** Free users can run up to 1 concurrent task; Pro users up to 10 concurrent threads.

---

## 5. Worker URL Terms

If you enable a Worker URL for a job:

- You are responsible for the content returned by your Worker URL to any incoming HTTP requests.
- Api Coolie applies automatic Content-Security-Policy sandboxing to any HTML responses to prevent XSS propagation.
- You must not use Worker URLs to serve phishing, malware, or spam payloads.
- Worker URL slugs are globally unique and reserved on a first-come, first-served basis.

---

## 6. Response Redaction and Privacy Filters

The response filter system is provided as a developer convenience tool:

- You may configure blocked JSON keys and text phrases that will be removed or replaced with \`[REDACTED]\` in execution logs, webhook payloads, and Worker URL responses.
- Api Coolie is not responsible for any data that is NOT included in your configured redaction filters.
- Redaction filters apply recursively to all nested JSON objects and arrays.

---

## 7. Intellectual Property

- **Your Code:** You retain full ownership of all scripts, environment configurations, and payloads you write.
- **Platform Assets:** All rights, title, and interest in Api Coolie (designs, logos, components) remain our exclusive property.

---

## 8. Limitation of Liability

To the maximum extent permitted by law, Api Coolie and its partners shall not be liable for indirect, incidental, special, or punitive damages including data corruption, network outages, or business disruptions arising from execution failures, Worker URL downtime, or incorrect response filter configurations.

---

## 9. Termination

We may suspend or terminate your account if you violate these Terms or threaten platform safety. You may terminate your account at any time from the dashboard.
`;

export const securityOperationsText = `# Security Operations

**Effective Date:** July 5, 2026
**Last Updated:** July 5, 2026

---

## 1. Security Architecture Overview

Api Coolie is engineered from the ground up to protect developer credentials, isolate runtime processes, and maintain strict tenant boundaries. Because our platform executes custom user code, routes API payloads, and manages sensitive secrets, we implement high-grade security practices across all layers.

This document details our encryption patterns, sandbox isolation, SSRF mitigations, XSS defenses, response privacy controls, and responsible disclosure policies.

---

## 2. Multi-Tenant Database Isolation

We use **Neon PostgreSQL** as our primary database engine.

- **Scoped Access Tokens:** All database queries use parameter-bound filters that isolate records to your account ID. A user cannot query jobs, executions, or variables belonging to another user.
- **Row-Level Enforcement:** Middleware verifies tenant ownership on every PATCH, DELETE, and privileged GET request before the database query executes.
- **Data Masking on Read:** Webhook secret tokens, OAuth credentials, and environment variable values are masked or encrypted before being returned through the API layer.

---

## 3. Cryptographic Secrets Encryption

We use advanced cryptographic methods to protect developer keys:

- **AES-256-GCM Encryption:** All sensitive environment variables, Authorization headers, and webhook secret tokens are encrypted at rest using AES-256-GCM with a unique IV per record.
- **Key Rotation:** Master encryption keys are managed securely and rotated periodically.
- **Transit Security:** All traffic is encrypted using **TLS 1.3**, preventing man-in-the-middle interception.
- **JWT Sessions:** Dashboard authentication uses short-lived JWTs. Multi-account sessions are stored per-browser in localStorage only and never replicated to our servers.

---

## 4. Sandbox Isolation

### JavaScript Sandbox (isolated-vm)

Custom JavaScript scripts execute inside fully isolated V8 isolates using the \`isolated-vm\` module:

- **Separate V8 Isolates:** Each script runs in its own isolate with zero access to the parent Node.js process memory.
- **Blocked Node Modules:** Unsafe APIs (\`fs\`, \`child_process\`, \`net\`, \`os\`) are completely blocked. Only safe fetch-like HTTP utilities are bridged.
- **Network Restriction:** Loopback addresses (127.0.0.1, ::1) and private network ranges are blocked at the DNS resolution layer to prevent SSRF attacks.

### Python Sandbox

Python scripts execute in a restricted subprocess environment:

- **Module Allowlist:** Only standard library modules and safe third-party packages (requests, json, datetime) are available.
- **Process Isolation:** Scripts run as a spawned subprocess with restricted OS capabilities.
- **Timeout Enforcement:** Scripts exceeding the configured timeout are killed with SIGTERM.

---

## 5. Worker URL Security

All public Worker URL endpoints are hardened against abuse:

- **SSRF Blocklist:** Internal IP ranges and localhost addresses are blocked both at DNS resolution and IP validation stages before any outbound HTTP request.
- **Header Sanitization:** Responses from user scripts cannot override critical security headers (\`Content-Security-Policy\`, \`X-Frame-Options\`, \`Content-Disposition\`).
- **HTML Sandboxing:** If a worker script returns HTML content, it is automatically wrapped in a strict Content-Security-Policy sandbox (\`default-src 'none'; style-src 'unsafe-inline'; img-src *; sandbox;\`) to block script execution, form submissions, and cookie access.
- **JSON Auto-Detection:** Worker URL responses are automatically parsed and returned with the correct \`application/json\` content-type when the output is valid JSON.
- **SVG XSS Sanitization:** Status badge job names and status labels are XML-escaped (converting \`<\`, \`>\`, \`&\`, \`"\`, \`'\` to safe entities) before being embedded into SVG templates to prevent SVG injection attacks.

---

## 6. Response Redaction System

The Response Privacy Filter system provides an additional data security layer:

- **Recursive Key Redaction:** Blocked JSON keys are removed from all nested objects and arrays in execution outputs. For example, blocking \`"id"\` removes it at every depth level.
- **Text Phrase Masking:** Specific text patterns (such as email addresses or API keys) found in response bodies are replaced with \`[REDACTED]\` before being stored or dispatched.
- **Filter Scope:** Filters apply to execution log storage, webhook delivery payloads, and Worker URL public responses simultaneously.
- **Configuration Storage:** Filter configurations (blocked keys and text phrases) are stored as a JSON column in the jobs table, encrypted at the database layer.

---

## 7. HMAC Webhook Signatures

To verify that webhook payloads originate from Api Coolie:

- **Cryptographic Signatures:** Webhook payloads are signed using SHA-256 HMAC. The signature is sent in the \`X-Coolie-Signature\` header.
- **Integrity Checks:** Receiving servers can recompute the HMAC using the shared secret token to verify payload integrity.

---

## 8. API Token Security

- **Scoped Tokens:** API tokens can be scoped to a single job, limiting blast radius if a token is compromised.
- **Hashed Storage:** Token values are hashed using bcrypt before being stored. Plain-text tokens are shown only once at creation.
- **Revocation:** Tokens can be revoked instantly from the Token Management panel.

---

## 9. Vulnerability Disclosure

We welcome security researchers to audit our platform responsibly. If you discover a vulnerability:

- Email **security@apicoolie.stackinfi.in** with a detailed description.
- We commit to acknowledging reports within 24 hours and deploying fixes within 48 hours for critical vulnerabilities.
- We do not pursue legal action against researchers acting in good faith.
`;
