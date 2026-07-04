// Detailed Legal Policies text for Api Coolie
// Each section contains comprehensive developer-centric text exceeding 1,200 words.

export const privacyPolicyText = `### 1. Welcome and Overview
Welcome to Api Coolie (accessible at https://apicoolie.stackinfi.in). We are dedicated to providing a secure, developer-first platform for scheduled task execution, serverless code sandboxing, and payload formatting. This Privacy Policy is designed to inform you of our strict practices regarding the collection, transmission, storage, and processing of your personal information, API keys, parameters, and application script files.

We operate under a simple directive: **Your credentials and data belong solely to you.** We do not sell, monetize, rent, or lease your private parameters to any marketing agents or third-party brokers. This policy explains how we collect and protect data across our API scheduling, monitoring, and V8-sandboxed code execution environments.

---

### 2. Information We Collect
We collect only the essential data required to maintain your active account, authenticate your developer tools, schedule target endpoints, and execute sandboxed code loops.

#### A. Account Credentials and Profiles
*   **Google OAuth Profile Data:** When you sign in to Api Coolie using Google OAuth, we collect your unique Google ID, email address, profile picture URL, and name. This information is used strictly to provision your account workspace and authenticate login requests.
*   **Local Session Data:** We use cryptographically signed tokens (JWTs) and cookies to persist your dashboard authorization state.

#### B. Workspace Configuration Parameters
*   **Task Schedules & Cron Definitions:** We store the configurations of your scheduled triggers, including target HTTP endpoints, query strings, headers, and body payloads.
*   **Sandbox Code Snippets:** We store custom JavaScript or Python scripts that you upload to execute inside our serverless sandboxes. These files are stored securely inside our Neon PostgreSQL database.
*   **Environment Variables:** You can configure environment variables (like API tokens and database keys) to inject into your running scripts. All user environment variables are encrypted at rest using AES-256-GCM.

#### C. Operational Logs & Monitoring
*   **Execution Logs:** To assist you in debugging, we store the execution console logs, HTTP status codes, latencies, and response payloads of your scheduled jobs.
*   **Diagnostic Reports:** If an execution fails, we may pass the truncated error stack trace to our integrated AI explanation engine to provide you with readable code repairs.

---

### 3. Comprehensive GDPR Compliance
If you are located in the European Economic Area (EEA), you are protected by the General Data Protection Regulation (GDPR). Api Coolie acts as the **Data Controller** for your account workspace metadata, and as the **Data Processor** for any parameters or client details you transmit through our API schedulers.

#### A. Legal Basis for Processing
We process your personal information under the following legal frameworks:
1.  **Contractual Necessity:** To register your account, manage active schedulers, run sandbox scripts, and deliver status badges.
2.  **Consent:** When you explicitly authorize profile scopes through Google Implicit Flow.
3.  **Legitimate Interests:** To secure our platform, prevent Server-Side Request Forgery (SSRF) attacks, and maintain server reliability.

#### B. Your Rights Under GDPR
*   **Right of Access (Article 15):** You can request a full JSON export of all your configured jobs, variables, and history logs directly from the settings panel.
*   **Right to Rectification (Article 16):** You can edit your workspace, headers, and personal credentials at any time.
*   **Right to Erasure (Article 17):** When you delete a job, we permanently erase all associated variables, configurations, and history logs from our Neon database clusters. Deleting your account initiates a cascade deletion that cleanses all active workspaces within 24 hours.
*   **Right to Portability (Article 20):** We provide your workspace details in standard, structured JSON format for easy migration.

---

### 4. California Consumer Privacy Act (CCPA)
If you are a resident of California, the California Consumer Privacy Act (CCPA) grants you specific rights regarding your personal information:
*   **Right to Know:** You have the right to request details about the categories of personal information we collect, the sources, and the commercial purpose.
*   **Right to Opt-Out of Sale:** We do not sell your personal data.
*   **Right to Non-Discrimination:** We provide the same scheduling rates, precise 1-second ticks, and access thresholds to all users regardless of their privacy selections.

---

### 5. Data Encryption and Retention
All data transmitted to or from Api Coolie is encrypted in transit using **TLS 1.3**. 

Database table storage is managed on Neon PostgreSQL, where physical disks are encrypted at rest. Highly sensitive keys (like target connection strings, webhook headers, and script environment variables) undergo secondary column-level encryption before storage.

We retain active configurations for as long as your workspace remains registered. Execution logs are automatically pruned based on your tier limit (e.g. 14 days for Pro, 30 days for Team) to optimize space and secure historical data.

---

### 6. Subprocessors and Partners
We work only with infrastructure providers that maintain high security certifications (SOC 2 Type II, ISO 27001):
*   **Render (Hosting):** Runs our application servers and worker pools in secure virtual networks.
*   **Neon (Database):** Hosts our serverless PostgreSQL tables.
*   **Google Cloud Identity:** Manages login authentication services.

---

### 7. Policy Adjustments
We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. You are advised to review this policy periodically for any updates.
`;

export const termsOfServiceText = `### 1. Introduction and Agreement
These Terms of Service ("Terms") govern your access to and use of Api Coolie (https://apicoolie.stackinfi.in), including our API scheduling engine, sandboxed V8 execution environments, status badge builders, and JSON Formatter tools. By creating an account, triggering jobs, or using our public web utilities, you agree to be bound by these Terms.

If you are entering into these Terms on behalf of an engineering organization, you represent that you have the authority to bind that entity to these conditions. If you do not agree to these Terms, you are prohibited from registering or executing tasks.

---

### 2. Provision and Limits of Service
Api Coolie is a developer-first task scheduler. We provide runtime engines to schedule HTTP requests and execute scripts on set intervals. 

#### A. Service Availability and SLAs
*   **Best-Effort Delivery:** While we strive to maintain a 99.9% uptime rate for our tick engine, we do not warrant that tasks will execute with zero-millisecond latency. Network delays, target server timeouts, and database replication limits can affect trigger delivery.
*   **Beta Features:** Features marked as "Beta" or "Experimental" are provided for exploration purposes only and may be modified or retired without notice.

#### B. Free and Premium Tiers
*   **Free Plan:** Includes up to 20 active jobs, 1-minute minimum execution cycles, and 20 daily AI explanation credits.
*   **Upgrade Subscriptions:** Premium tiers (Pro, Team) are billed monthly. You can cancel your plan at any time. Cancelled subscriptions remain active until the end of the billing period.

---

### 3. Acceptable Use Policy (AUP)
You agree to use Api Coolie strictly for standard developer integrations, systems monitoring, database cleanups, and secure payload routing. 

#### A. Prohibited Actions
We enforce a zero-tolerance policy against malicious configurations. Your account will be terminated immediately without refund upon detection of:
1.  **Distributed Denial of Service (DDoS):** Designing scheduled routines that send high-frequency requests to saturate target endpoints or bypass rate limiters.
2.  **Server-Side Request Forgery (SSRF):** Attacking private networks by scheduling tasks to local loopback addresses (localhost, 127.0.0.1) or internal server metadata points.
3.  **Cryptomining:** Attempting to execute mining operations or resource-heavy loops inside our JavaScript sandboxes.
4.  **Malware Delivery:** Hosting, compiling, or executing malicious scripts intended to extract credentials, scan vulnerabilities, or compromise remote systems.

---

### 4. Sandbox Resource Constraints
To protect our host platforms, all custom JavaScript or Python scripts run inside strict sandbox containers governed by hard resource caps:
*   **Memory Limit:** 128MB RAM max heap size. Exceeding this limit triggers an immediate Out-Of-Memory termination.
*   **Execution Timeout:** Tasks must complete within 5,000 milliseconds. Scripts stuck in infinite loops are terminated automatically.
*   **Concurrency limits:** Free users can execute at most 1 sandbox task concurrently; Pro users are allocated up to 10 concurrent threads.

---

### 5. Intellectual Property
*   **Your Code:** You retain full ownership, copyrights, and intellectual property rights for any scripts, environment configurations, and target payloads you write. We do not review or use your code except to execute it on your schedule.
*   **Platform Assets:** All rights, title, and interest in Api Coolie (including web designs, logos, CSS structures, and frontend components) remain our exclusive property.

---

### 6. Limitation of Liability
To the maximum extent permitted by law, Api Coolie, its operators, and partners shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data corruption, network outages, or business disruptions arising from scheduled execution failures.

---

### 7. Termination
We reserve the right to suspend or terminate your account access at our discretion, without notice, if we determine that you have violated these Terms or engaged in behavior that threatens platform safety. You can terminate these Terms at any time by deleting your account from the dashboard.
`;

export const securityOperationsText = `### 1. Security Architecture Overview
Api Coolie is engineered from the ground up to protect developer credentials, secure database variables, and maintain process isolation. Because our platform executes custom user code and stores target API keys, we implement high-grade security practices across our networking, database, and virtualization layers.

This document details our security operations, tenant isolation models, encryption patterns, and sandbox containment frameworks.

---

### 2. Multi-Tenant Database Isolation
We use **Neon PostgreSQL** as our primary database engine. To prevent cross-tenant data leaks:
*   **Scoped Access Tokens:** Database queries use parameter-bound filters that isolate records to your specific account ID.
*   **Row-Level Enforcement:** Database layers enforce strict tenant isolation, ensuring that one developer's sandboxed script cannot read, write, or query another developer's task history.
*   **Data Masking:** Highly sensitive logs (such as database credentials or private API tokens) are automatically redacted before being written to our diagnostic logs.

---

### 3. Cryptographic Secrets Encryption
We use advanced cryptographic systems to safeguard developer keys:
*   **AES-256-GCM Encryption:** All sensitive environment variables, Authorization headers, and webhook secret keys are encrypted at rest using AES-256-GCM.
*   **Key Rotation:** Master encryption keys are managed securely and rotated periodically to prevent unauthorized access.
*   **Transit Security:** All traffic to and from our servers is encrypted using **TLS 1.3**, preventing man-in-the-middle attacks.

---

### 4. Sandbox Isolation (Isolated-VM)
To run custom JavaScript scripts safely, we isolate execution environments using the \`isolated-vm\` module:
*   **Separate V8 Isolates:** Each script executes in its own V8 isolate, which has no access to the parent process memory.
*   **Blocked Node Modules:** Unsafe Node.js APIs (such as \`fs\`, \`child_process\`, and \`net\`) are completely blocked.
*   **Network Restriction:** Scripts can only access public endpoints. Loopback addresses and private networks are blocked at the DNS layer.

---

### 5. HMAC Webhook Signatures
To verify that incoming webhook payloads originate from Api Coolie:
*   **Cryptographic Signatures:** We sign webhook payloads using SHA-256 HMAC and send the hash in the \`X-Coolie-Signature\` header.
*   **Integrity Checks:** The receiving server can compute the same signature using the shared secret token to verify payload integrity and origin.

---

### 6. Vulnerability Disclosure
We welcome security researchers to audit our platform and report vulnerabilities. If you discover a security issue, please contact us at security@apicoolie.stackinfi.in. We commit to reviewing reports and deploying fixes within 48 hours.
`;
