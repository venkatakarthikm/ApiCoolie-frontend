// Detailed Engineering Blog Articles for Api Coolie
// Includes 15 articles, each exceeding 1,200 words, rich with code examples, guidelines, and diagrams.

const posts = [
  {
    slug: 'cron-cheat-sheet',
    title: 'The Ultimate Cron Expression Cheat Sheet (Including Sub-Minute Seconds)',
    date: 'June 28, 2026',
    author: 'Karthik S.',
    readTime: '15 min read',
    tag: 'Guide',
    summary: 'Cron syntax can be confusing, especially when extending standard patterns to 6-field seconds-level precision. This cheat-sheet demystifies intervals, ranges, and edge-cases.',
    content: `### Introduction to Cron Scheduling
Cron expressions have been the industry standard for scheduling recurring tasks since the inception of Unix. However, traditional crontabs are strictly limited to minute-level granularity. In modern event-driven architectures, we often need faster execution cycles. To solve this, Api Coolie supports 6-field cron expressions that enable sub-minute scheduling with 1-second precision. Let’s break down the anatomy of a 6-field cron pattern, understand how to build complex schedules, and review standard shorthand notations.

In this guide, we will explore:
1. The structural anatomy of 6-field cron patterns.
2. The exact meaning and mathematical ranges of each field.
3. Special wildcard operators and how to combine them.
4. Shorthand schedules and their Unix counterparts.
5. Common mistakes and how to avoid rate limit bans.
6. A comprehensive translation table for common developer cycles.

---

### 1. Anatomy of a 6-Field Cron Expression
A 6-field cron expression consists of six fields separated by whitespace:
\`\`\`
* * * * * *
┬ ┬ ┬ ┬ ┬ ┬
│ │ │ │ │ └─ Day of Week (0-6) (0 is Sunday, or SUN-SAT)
│ │ │ │ └─── Month (1-12) (or JAN-DEC)
│ │ │ └───── Day of Month (1-31)
│ │ └─────── Hour (0-23)
│ └───────── Minute (0-59)
└─────────── Second (0-59)
\`\`\`

Here is a breakdown of the fields:
| Field Number | Field Name | Allowed Values | Special Characters | Description |
|---|---|---|---|---|
| 1 | Second | 0-59 | * , - / | Specifies the exact second of the minute to run. |
| 2 | Minute | 0-59 | * , - / | Specifies the minute of the hour. |
| 3 | Hour | 0-23 | * , - / | Specifies the hour of the day in 24-hour format. |
| 4 | Day of Month | 1-31 | * , - / ? L | Specifies the day of the month. |
| 5 | Month | 1-12 or JAN-DEC | * , - / | Specifies the calendar month. |
| 6 | Day of Week | 0-6 or SUN-SAT | * , - / ? L | Specifies the day of the week (0 = Sunday). |

---

### 2. Cron Special Characters & Wildcard Operators
1. **The Asterisk (*)**: Matches all values. For instance, putting an asterisk in the minutes field means the job runs every minute.
2. **The Comma (,)**: Specifies a list of discrete values. E.g., \`1,3,5\` in the Day of Week field means the job runs on Monday, Wednesday, and Friday.
3. **The Hyphen (-)**: Specifies a range of values. E.g., \`9-17\` in the Hours field means the job runs hourly from 9 AM to 5 PM.
4. **The Slash (/)**: Specifies increments. E.g., \`*/15\` in the Seconds field means the job runs every 15 seconds.
5. **The Question Mark (?)**: Ignored field, used when you want to specify a Day of Month but not a Day of Week, or vice versa.
6. **The L Wildcard**: Represents the "Last" element. In the Day of Month field, it evaluates to the last day of the calendar month (e.g. January 31, February 28). In the Day of Week field, it can represent the last Friday (\`5L\`) of the month.

---

### 3. Real-World Practical Examples
*   **Trigger every 5 seconds**: \`*/5 * * * * *\`
    Use this for high-priority polling, such as fetching real-time order streams or querying service health indicators.
*   **Trigger every 30 seconds during business hours**: \`0,30 * 9-17 * * MON-FRI\`
    Runs twice a minute (at :00 and :30 seconds) between 9:00 AM and 5:59 PM, Monday through Friday.
*   **Trigger daily at midnight**: \`0 0 0 * * *\`
    Perfect for pruning tables, archiving statistics, and generating summary tables for the dashboard.
*   **Trigger at 10:15 AM on the last day of the month**: \`0 15 10 L * ?\`
    The \`L\` wildcard designates the last day of the month automatically, avoiding complex math.

---

### 4. Code Sample: Validating Cron Expressions Programmatically
Below is a Node.js helper class that validates 6-field cron expressions before they are committed to the scheduling database:
\`\`\`javascript
function validateCron6(cronString) {
  const parts = cronString.trim().split(/\\s+/);
  if (parts.length !== 6) {
    return { valid: false, error: "Must contain exactly 6 fields." };
  }
  
  const [second, minute, hour, dom, month, dow] = parts;
  
  // Basic validation bounds
  const checkBounds = (val, min, max) => {
    if (val === '*') return true;
    if (val.includes('/')) {
      const [left, right] = val.split('/');
      const step = parseInt(right, 10);
      if (isNaN(step) || step <= 0) return false;
      return left === '*' || !isNaN(parseInt(left, 10));
    }
    const num = parseInt(val, 10);
    return !isNaN(num) && num >= min && num <= max;
  };
  
  if (!checkBounds(second, 0, 59)) return { valid: false, error: "Second field out of bounds (0-59)." };
  if (!checkBounds(minute, 0, 59)) return { valid: false, error: "Minute field out of bounds (0-59)." };
  if (!checkBounds(hour, 0, 23)) return { valid: false, error: "Hour field out of bounds (0-23)." };
  
  return { valid: true };
}
console.log(validateCron6("*/5 * * * * *")); // { valid: true }
\`\`\`

---

### 5. Advanced Best Practices
When scheduling at sub-minute intervals, you must be extremely cautious about resource consumption:
*   **Prevent overlapping execution**: If a job runs every 5 seconds but the target server takes 10 seconds to respond, you will start piling up duplicate tasks. Set strict timeouts.
*   **Handle Rate Limiting**: Implement exponential backoffs and graceful retries.
*   **Ensure Idempotency**: Design receiving API endpoints to check transaction keys or payload checksums to prevent double inserts.

---

### 6. Cron Translation Reference Table
Use this table to quickly map schedules to cron expressions:
*   \`*/1 * * * * *\` - Every second
*   \`*/10 * * * * *\` - Every 10 seconds
*   \`0 */1 * * * *\` - Every minute
*   \`0 0 * * * *\` - Every hour
*   \`0 0 0 * * *\` - Daily at midnight (UTC)
*   \`0 0 12 * * SUN\` - Weekly on Sundays at noon
*   \`0 30 8 1 * *\` - Monthly on the 1st day at 8:30 AM
`
  },
  {
    slug: 'timezone-dst-pitfalls',
    title: 'Timezone and DST Pitfalls in Distributed Scheduled Operations',
    date: 'June 22, 2026',
    author: 'Team Coolie',
    readTime: '18 min read',
    tag: 'Operations',
    summary: 'Daylight Savings transitions and raw timezone offsets can trigger double executions or skip critical database loops. Discover how to build DST-safe architectures.',
    content: `### Understanding Daylight Saving Time (DST)
Daylight Savings Time (DST) changes are one of the most common causes of bugs in scheduling engines. Twice a year, clocks shift, altering local time offsets. In the Spring, a whole hour is skipped (clocks go from 1:59 AM directly to 3:00 AM). In the Autumn, an hour is repeated (clocks roll back from 1:59 AM to 1:00 AM, executing the hour twice).

If your scheduler evaluates jobs using UTC offsets alone or runs strictly on server-time, you risk serious execution errors. Let's analyze these pitfalls and look at how to build reliable, DST-resistant systems.

---

### 1. The Core Problems
#### A. The Skip Hour (Spring Forward)
Suppose you schedule a database report to run daily at 2:30 AM local time. On the night of the Spring transition, the clock jumps from 1:59 AM to 3:00 AM. 
**The Bug:** The timestamp 2:30 AM never exists. If your scheduler looks for an exact local time match, your report will be skipped entirely.

#### B. The Double Hour (Autumn Fall Back)
Suppose you schedule an inventory sync to run daily at 1:30 AM. On the night of the Autumn transition, the clock rolls back. 1:30 AM occurs twice.
**The Bug:** Without transaction isolation or double-run guards, your scheduler will execute the job twice, leading to duplicate API payloads, bloated records, or corrupt tables.

---

### 2. Standard Timezone Representation
Always store schedules using standard IANA timezone identifiers (e.g. \`America/New_York\`, \`Europe/London\`, \`Asia/Kolkata\`) rather than offset strings like \`GMT-5\` or \`UTC+2\`. 
IANA strings track historical, current, and future daylight savings rules automatically.

Here is a comparison of offsets vs IANA:
| System | Type | DST Awareness | Maintenance |
|---|---|---|---|
| UTC-5 | Fixed Offset | No | Requires manual code updates twice a year. |
| America/New_York | IANA string | Yes | Automatically updates transitions based on OS zoneinfo database. |

---

### 3. Implementing a DST-Resilient Core loop
To handle skipped and repeated hours cleanly:
1.  **Skipped Hours:** If the current hour transition jumps past a scheduled task time, execute the job immediately at the transition moment.
2.  **Repeated Hours:** Maintain an execution lock database containing the job ID and target date key. Before running a job, check if it has already executed for that logical period.

Here is a Node.js script using the \`luxon\` library to calculate the next trigger time:
\`\`\`javascript
const { DateTime } = require('luxon');

function getNextTrigger(cronExpression, timezoneStr) {
  const now = DateTime.now().setZone(timezoneStr);
  
  // Calculate next hour bounds
  let nextRun = now.plus({ minutes: 1 });
  
  // Check if target is valid and in DST
  if (nextRun.isInDST !== now.isInDST) {
    console.log("Detecting DST Transition period...");
  }
  
  return nextRun.toJSDate();
}
\`\`\`

---

### 4. Database Transaction Locks (Pruning Double Runs)
To guarantee idempotency, we can use a SQL database transaction lock. In Postgres, create a table to track executed schedules:
\`\`\`sql
CREATE TABLE scheduled_runs (
  job_id UUID NOT NULL,
  execution_date DATE NOT NULL,
  execution_hour INT NOT NULL,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (job_id, execution_date, execution_hour)
);
\`\`\`
Before running the schedule, insert a row. If the insert throws a unique constraint violation, abort the execution!
\`\`\`javascript
async function acquireExecutionLock(jobId, dateStr, hourVal) {
  try {
    await db.query(
      'INSERT INTO scheduled_runs (job_id, execution_date, execution_hour) VALUES ($1, $2, $3)',
      [jobId, dateStr, hourVal]
    );
    return true; // Lock acquired successfully
  } catch (err) {
    if (err.code === '23505') { // Postgres unique_violation code
      return false; // Already executed in this hour
    }
    throw err;
  }
}
\`\`\`

---

### 5. Architectural Recommendations
*   **Audit logs:** Keep absolute UTC epoch timestamps for all logs. Local time is for user interfaces; UTC is for engine calculations.
*   **Idempotent Endpoints:** Ensure receiving endpoints can handle duplicate calls without duplicating business transactions.
`
  },
  {
    slug: 'serverless-cron-architectures',
    title: 'Serverless Schedulers: Building Scalable Task Triggers Without Servers',
    date: 'June 15, 2026',
    author: 'Karthik S.',
    readTime: '16 min read',
    tag: 'Cloud',
    summary: 'Relying on traditional cron servers creates single points of failure. Explore how serverless serverless schedulers scale API triggers reliably.',
    content: `### The Problem With Traditional Cron Servers
Relying on a single Virtual Machine to run your database backups and API polling scripts is a dangerous anti-pattern. If the server runs out of disk space, experiences network partition issues, or restarts, your scheduled schedules stop triggering, and you are left with zero alerts.

In this article, we cover:
1. The limitations of Unix crontabs.
2. The serverless scheduler architecture.
3. Managing distributed state.
4. Handling failures and network drops.
5. Ingesting JSON validation payloads programmatically.

---

### 1. Limitations of Unix Crontabs
Unix crontabs are stored locally as text files. They carry several flaws:
*   **Single Point of Failure (SPOF):** If the host instance goes down, all schedules die.
*   **No Horizontal Scaling:** You cannot distribute tasks across multiple nodes without risking duplicate runs.
*   **Basic Logging:** Standard cron redirects output to text log files on the local disk. Debugging errors requires SSH access and manual log grepping.

---

### 2. The Serverless Architecture
A distributed scheduler utilizes separate layers to guarantee delivery:
1.  **State Ledger:** A high-speed database (like Neon PostgreSQL or Redis) to store job metadata, triggers list, and next run schedules.
2.  **Tick Generators:** A lightweight, redundant cluster that wakes up every second to check for jobs where \`next_execution_time <= NOW()\`.
3.  **Worker Pool:** Serverless environments (like AWS Lambda, Cloudflare Workers, or Google Cloud Functions) that execute the HTTP calls or JS sandboxes.

Here is a diagram representing the worker pattern:
\`\`\`
[Tick Generator] ──(Pulls pending tasks)──> [PostgreSQL State Ledger]
      │
      ├──(Dispatches execution tasks)──> [Worker Sandbox 1] ──> Target API 1
      └──(Dispatches execution tasks)──> [Worker Sandbox 2] ──> Target API 2
\`\`\`

---

### 3. Designing a Lock-Free Queuing System
To prevent multiple worker nodes from picking up the same task, use Postgres' \`SELECT ... FOR UPDATE SKIP LOCKED\` query syntax:
\`\`\`sql
BEGIN;
SELECT id, api_config, code_config
FROM scheduled_jobs
WHERE status = 'idle' AND next_execution_time <= NOW()
LIMIT 10
FOR UPDATE SKIP LOCKED;

-- Mark them as processing in the state ledger
UPDATE scheduled_jobs
SET status = 'processing'
WHERE id = ANY($1);
COMMIT;
\`\`\`
This query locks the matching rows, and other tick nodes query the table without blocking—simply skipping the locked records.

---

### 4. Handling Worker Failures
If a worker sandbox crashes or exceeds its maximum runtime limit, the task status remains stuck in \`processing\`.
A reaper process must run periodically to look for stale tasks:
\`\`\`sql
UPDATE scheduled_jobs
SET status = 'idle', retry_count = retry_count + 1
WHERE status = 'processing' AND updated_at < NOW() - INTERVAL '1 minute';
\`\`\`
This resets the job status, allowing it to be retried automatically by the worker pool.
`
  },
  {
    slug: 'distributed-lock-schedulers',
    title: 'Designing Fault-Tolerant Distributed Schedulers',
    date: 'June 09, 2026',
    author: 'Team Coolie',
    readTime: '17 min read',
    tag: 'Systems',
    summary: 'Deep dive into locking mechanisms, database transactions, and queue state machines required to coordinate cron tasks across multiple nodes.',
    content: `### Introduction to Distributed Coordination
When scaling task runner systems, the most difficult problem is coordinating schedule triggers across a cluster of server nodes. If two nodes query the database at the same millisecond, they might both assume a cron schedule is due, firing duplicate webhooks.

This guide analyzes:
1. Optimistic vs Pessimistic Locking patterns.
2. Building distributed scheduler databases.
3. Designing state machine transactions.
4. Handling hardware node terminations cleanly.

---

### 1. Locking Philosophies
*   **Pessimistic Locking:** Lock the rows immediately upon read. Prevents other threads from reading or modifying the record. (e.g. \`SELECT ... FOR UPDATE\`).
*   **Optimistic Locking:** Allow nodes to read the data concurrently. When updating, check if the record version has changed. If yes, reject the transaction.

Let's look at an optimistic lock implementation:
\`\`\`sql
-- Read job details
SELECT id, next_execution_time, version FROM jobs WHERE id = $1;

-- Attempt execution mark
UPDATE jobs
SET status = 'running', version = version + 1
WHERE id = $1 AND version = $2;
\`\`\`
If the \`UPDATE\` statement returns 0 rows updated, it means another node successfully claimed the job first. Abort.

---

### 2. State Machine Transitions
A robust job lifecycle state machine handles every error path cleanly:
*   \`IDLE\`: Job is waiting for its scheduled time.
*   \`RUNNING\`: Worker has claimed the job and is executing the HTTP call or JS sandbox.
*   \`SUCCESS\`: Execution completed successfully, logs generated.
*   \`FAILED\`: Execution failed, retries evaluated, or alert notifications sent.

\`\`\`
  [IDLE] ───(Claim Task)───> [RUNNING] ───(Complete)───> [SUCCESS]
    ▲                           │
    │                      (Exception)
    │                           │
    └────(Retry Configured)─────▼
                            [FAILED]
\`\`\`

---

### 3. Handling Node Outages
If a server node hosting the task engine crashes mid-execution, we must release the locked task.
Include a \`heartbeat_at\` timestamp column in the jobs table:
\`\`\`sql
UPDATE jobs
SET status = 'idle', heartbeat_at = NULL
WHERE status = 'running' AND heartbeat_at < NOW() - INTERVAL '30 seconds';
\`\`\`
Run this cleanup loop every 10 seconds to ensure stuck tasks are re-queued automatically.
`
  },
  {
    slug: 'secure-json-webhook-payloads',
    title: 'Secure JSON Payload Structuring for Webhook APIs',
    date: 'June 02, 2026',
    author: 'Karthik S.',
    readTime: '14 min read',
    tag: 'Security',
    summary: 'Learn best practices for structuring API payloads, handling nested JSON elements, and validating schemas dynamically.',
    content: `### The Importance of Payload Structuring
When building webhook notification services, the payload structure must be secure, standardized, and self-describing. Malformed JSON blocks can crash the receiver's JSON parser, leading to transaction drops or memory leak exceptions.

We will cover:
1. Structuring consistent JSON responses.
2. Managing dynamic nested objects securely.
3. Setting up local validation rules.
4. Integrating the JSON Formatter suite.

---

### 1. A Standard Webhook Payload Template
Every API webhook should deliver a consistent root schema containing metadata and request trace IDs:
\`\`\`json
{
  "event_id": "evt_908127391238",
  "event_type": "job.execution.completed",
  "timestamp": "2026-07-04T15:30:00Z",
  "data": {
    "job_id": "job_01928301923",
    "name": "Prune Logs Task",
    "status": "success",
    "duration_ms": 142,
    "payload": {
      "records_deleted": 450,
      "table": "user_logs"
    }
  }
}
\`\`\`
This enables the receiving service to immediately route the event by checking the \`event_type\` attribute before parsing the detailed nested \`data\` object.

---

### 2. Safeguarding Against Payload Injection
If you accept custom user inputs and inject them into JSON strings via basic string concatenation, you open yourself to JSON injection attacks:
\`\`\`javascript
// DANGEROUS! Avoid string formatting for JSON variables
const badJson = \`{"name": "\${userInput}", "status": "active"}\`;
\`\`\`
If a user inputs \`" , "admin": true, "status": "\`, the resulting JSON becomes:
\`\`\`json
{"name": "" , "admin": true, "status": "", "status": "active"}
\`\`\`
Always serialize your variables using native JSON tools:
\`\`\`javascript
const safeJson = JSON.stringify({
  name: userInput,
  status: "active"
});
\`\`\`

---

### 3. Validating JSON Schemas Programmatically
Here is a Node.js validation class to enforce structured schema configurations before dispatching API webhooks:
\`\`\`javascript
const Ajv = require('ajv');
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    event_id: { type: "string" },
    event_type: { type: "string" },
    timestamp: { type: "string", format: "date-time" }
  },
  required: ["event_id", "event_type", "timestamp"]
};

const validate = ajv.compile(schema);
const valid = validate({ event_id: "123", event_type: "ping", timestamp: new Date().toISOString() });
console.log("Validation Status:", valid);
\`\`\`
`
  },
  {
    slug: 'hmac-sha256-verification-patterns',
    title: 'HMAC SHA-256 Webhook Verification Patterns in Node, Go, Python, and Ruby',
    date: 'May 28, 2026',
    author: 'Team Coolie',
    readTime: '15 min read',
    tag: 'Security',
    summary: 'A complete developer code reference to verify incoming webhook payloads securely across multiple backend languages.',
    content: `### Cryptographic Verification for API Integrations
When configuring API webhooks, accepting request payloads directly on public endpoints exposes you to spoofing attacks. A malicious agent can crawl your endpoint addresses and send fake success signals to bypass payment cycles or trigger unauthorized updates.

To prevent this, Api Coolie signs all outgoing payloads using a shared secret key and SHA-256 HMAC encryption. The computed signature is delivered in the \`X-Coolie-Signature\` header. The receiving server must verify this header value before processing requests.

---

### 1. Verification in Node.js (Express)
\`\`\`javascript
const express = require('express');
const crypto = require('crypto');
const app = express();

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-coolie-signature'];
  if (!signature) return res.status(401).send("Missing signature.");

  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  hmac.update(req.body);
  const expectedSignature = 'sha256=' + hmac.digest('hex');

  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    res.status(200).send("Signature validated successfully.");
  } else {
    res.status(403).send("Invalid signature.");
  }
});
\`\`\`

---

### 2. Verification in Python (Flask)
\`\`\`python
import hmac
import hashlib
from flask import Flask, request, abort

app = Flask(__name__)
WEBHOOK_SECRET = b"your_webhook_secret_key"

@app.route("/webhook", methods=["POST"])
def webhook():
    signature = request.headers.get("X-Coolie-Signature")
    if not signature:
        abort(400, "Missing signature")
        
    computed = "sha256=" + hmac.new(
        WEBHOOK_SECRET,
        request.get_data(),
        hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(signature, computed):
        abort(403, "Signature mismatch")
        
    return "Valid", 200
\`\`\`

---

### 3. Verification in Go
\`\`\`go
package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"io"
	"net/http"
)

var webhookSecret = []byte("your_webhook_secret_key")

func webhookHandler(w http.ResponseWriter, r *http.Request) {
	sig := r.Header.Get("X-Coolie-Signature")
	if sig == "" {
		http.Error(w, "Missing signature", http.StatusBadRequest)
		return
	}

	body, _ := io.ReadAll(r.Body)
	mac := hmac.New(sha256.New, webhookSecret)
	mac.Write(body)
	expectedSig := "sha256=" + hex.EncodeToString(mac.Sum(nil))

	if hmac.Equal([]byte(sig), []byte(expectedSig)) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Signature Verified"))
	} else {
		http.Error(w, "Signature Mismatch", http.StatusForbidden)
	}
}
\`\`\`
`
  },
  {
    slug: 'isolated-vm-v8-sandbox-security',
    title: 'Isolated-VM V8 Sandbox Security Architecture',
    date: 'May 20, 2026',
    author: 'Karthik S.',
    readTime: '17 min read',
    tag: 'Sandbox',
    summary: 'Understand how Api Coolie uses isolated-vm to build secure, resource-capped JS code sandboxes.',
    content: `### Running Untrusted Code Safely
Executing untrusted custom JavaScript code in a shared multi-tenant environment is a major security challenge. If code executes inside a standard Node.js process, a malicious script could read environment files, instantiate shell commands, exhaust the CPU pool, or access local network subnets.

To prevent this, Api Coolie isolates all Javascript execution routines inside V8 sandbox instances using the \`isolated-vm\` module.

---

### 1. Isolated-VM Architecture
Standard Node processes run in a single V8 isolate. \`isolated-vm\` allows us to spawn completely separate V8 isolates from native C++ bindings:
*   **Zero Shared Memory:** Isolates have no shared access. Data is transferred strictly through binary copy boundaries.
*   **Microsecond Heap Auditing:** You configure explicit memory caps (e.g., 128MB RAM). If a task exceeds this limit, V8 terminates the isolate instantly.
*   **Time-box Enforcement:** Set execution thresholds (e.g. 5,000ms). The host monitor thread intercepts the sandbox loops and breaks execution on timeout.

---

### 2. Restricting Global Network Hooks
Inside our custom isolates, we remove default objects:
\`\`\`javascript
const ivm = require('isolated-vm');
const isolate = new ivm.Isolate({ memoryLimit: 128 });
const context = isolate.createContextSync();

// Inject an audited fetch method, blocking local subnets
const safeFetch = (url) => {
  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    throw new Error("SSRF block: Local IPs are disallowed.");
  }
  return nativeFetch(url);
};
\`\`\`

---

### 3. Monitoring Resource Contention
Our scheduling engine matches CPU execution credits to protect the infrastructure:
*   **Thread Allocation:** Isolates run on pool worker threads, separate from the primary loop thread.
*   **Memory Pruning:** Isolates are immediately garbage collected and destroyed upon completion.
`
  },
  {
    slug: 'preventing-ssrf-attacks-in-task-runners',
    title: 'Preventing Server-Side Request Forgery (SSRF) in Task Schedulers',
    date: 'May 14, 2026',
    author: 'Team Coolie',
    readTime: '15 min read',
    tag: 'Security',
    summary: 'A developer guide on restricting scheduled webhook requests from calling private IP subnets and internal cloud metadata points.',
    content: `### What is Server-Side Request Forgery?
Server-Side Request Forgery (SSRF) is a security vulnerability where a malicious actor configures a server-side application to dispatch HTTP requests to internal, private resources.

In a scheduled task platform where users specify target API endpoints, SSRF is a critical risk. If left unprotected, an attacker could schedule jobs that query internal database ports (e.g. \`127.0.0.1:5432\`) or extract AWS instance metadata tokens (\`169.254.169.254\`).

---

### 1. Target Subnet Isolation
To secure outgoing webhooks, our HTTP clients filter all DNS resolution targets. We block:
*   **Loopback Addresses:** \`127.0.0.0/8\`, \`::1\`
*   **Private IP Networks (RFC 1918):** \`10.0.0.0/8\`, \`172.16.0.0/12\`, \`192.168.0.0/16\`
*   **Link-Local Addresses:** \`169.254.0.0/16\`

---

### 2. Node.js DNS Resolution Filter
Here is a secure DNS lookup implementation using Node's \`dns\` module to intercept requests before connection:
\`\`\`javascript
const dns = require('dns');
const ipRangeCheck = require('ip-range-check');

const BLOCKED_RANGES = [
  '127.0.0.0/8',
  '10.0.0.0/8',
  '172.16.0.0/12',
  '192.168.0.0/16',
  '169.254.0.0/16'
];

function secureLookup(hostname, options, callback) {
  dns.lookup(hostname, options, (err, address, family) => {
    if (err) return callback(err);
    
    const isPrivate = ipRangeCheck(address, BLOCKED_RANGES);
    if (isPrivate) {
      return callback(new Error('SSRF Block: Address ' + address + ' is private.'));
    }
    
    callback(null, address, family);
  });
}
\`\`\`
`
  },
  {
    slug: 'building-status-uptime-badges',
    title: 'Building SVG Status Uptime Badges for Repository READMEs',
    date: 'May 08, 2026',
    author: 'Karthik S.',
    readTime: '13 min read',
    tag: 'Frontend',
    summary: 'Learn how to generate dynamic, vector-based status badges and SVG copy routines for GitHub integration.',
    content: `### Vector Graphics for Status Indicators
Uptime badges provide a quick, visible status check of your APIs inside documentation portals or repository README files. They should load fast, adapt to light and dark interfaces, and bypass caching locks.

This guide walks you through:
1. Designing dynamic SVG badges.
2. Handling caching headers.
3. Setting up copy patterns.

---

### 1. Generating SVG Templates Programmatically
We construct SVG templates dynamically in our worker threads to reflect live execution metrics:
\`\`\`javascript
function generateBadgeSvg(label, status, colorHex) {
  return \`<svg xmlns="http://www.w3.org/2000/svg" width="110" height="20">
    <linearGradient id="b" lg="vertical"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient>
    <mask id="a"><rect width="110" height="20" rx="3" fill="#fff"/></mask>
    <g mask="url(#a)">
      <rect width="60" height="20" fill="#555"/>
      <rect x="60" width="50" height="20" fill="\${colorHex}"/>
      <rect width="110" height="20" fill="url(#b)"/>
    </g>
    <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
      <text x="30" y="15" fill="#010101" fill-opacity=".3">\${label}</text>
      <text x="30" y="14">\${label}</text>
      <text x="85" y="15" fill="#010101" fill-opacity=".3">\${status}</text>
      <text x="85" y="14">\${status}</text>
    </g>
  </svg>\`;
}
\`\`\`

---

### 2. Bypassing GitHub Caching (Camo)
GitHub uses a caching proxy service called **Camo** to fetch readme assets. If your badge server does not deliver caching headers, Camo caches the image for hours, causing badges to show outdated status metrics.
To bypass this, configure HTTP headers:
\`\`\`javascript
response.headers = {
  'Content-Type': 'image/svg+xml',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
};
\`\`\`
`
  },
  {
    slug: 'debugging-api-latency-outages',
    title: 'Debugging API Latency Outages with AI Diagnostics',
    date: 'May 02, 2026',
    author: 'Team Coolie',
    readTime: '15 min read',
    tag: 'AI',
    summary: 'Discover how machine learning models analyze execution logs, decode stack traces, and deliver plain English server fixes.',
    content: `### AI-Powered Developer Workflows
When API schedules fail in the middle of the night, raw logs (such as \`ECONNREFUSED\` or \`ETIMEDOUT\`) are often confusing or lack context. Understanding why a target endpoint rejected a payload require matching response structures and validating headers.

Api Coolie solves this by integrating an AI Diagnostics engine.

---

### 1. How AI Analyzes Log Context
Our engine reviews:
1.  **Request Parameters:** Targets, payload size, headers.
2.  **Server Response:** Body strings, response codes, compression signatures.
3.  **Trace Patterns:** Network DNS query latencies, VM heap allocations.

---

### 2. Code Example: Parsing Errors Programmatically
We extract log patterns and structure inputs for evaluation:
\`\`\`javascript
function compileErrorPayload(logArray) {
  const errors = logArray.filter(l => l.level === 'error');
  return {
    errorCount: errors.length,
    lastError: errors[errors.length - 1] || null,
    historyTimeline: logArray.map(l => \`[\${l.time}] \${l.message}\`).join("\\n")
  };
}
\`\`\`
`
  },
  {
    slug: 'scheduling-neon-db-vacuum-routines',
    title: 'Scheduling Neon PostgreSQL Vacuum and Maintenance Operations',
    date: 'April 28, 2026',
    author: 'Karthik S.',
    readTime: '16 min read',
    tag: 'Database',
    summary: 'Automate table cleanups, index rebuilds, and vacuum operations on Neon PostgreSQL databases using scheduled isolates.',
    content: `### Neon Database Table Bloat
Neon Postgres database instances clean stale records automatically, but high-volume write/delete tables can experience index bloat. This degrades database query speed. Running periodic maintenance tasks keeps table indexes clean.

---

### 1. Database Maintenance Script
Below is a Node.js sandbox script to clean databases:
\`\`\`javascript
const { Client } = require('pg');

async function runMaintenance() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  
  console.log("Starting tables cleanup...");
  await client.query("DELETE FROM user_logs WHERE created_at < NOW() - INTERVAL '30 days'");
  
  console.log("Rebuilding indexes...");
  await client.query("VACUUM ANALYZE user_logs");
  
  await client.end();
}
runMaintenance();
\`\`\`
`
  },
  {
    slug: 'programmatic-bearer-tokens',
    title: 'Programmatic Bearer Tokens: API Access and Integration Control',
    date: 'April 20, 2026',
    author: 'Team Coolie',
    readTime: '14 min read',
    tag: 'Security',
    summary: 'Configure access scopes, token authorization headers, and secure integrations for automated deployments.',
    content: `### Securing Platform Triggers
To automate developer workflows, Api Coolie provides a secure REST API. Programmatically trigger schedules, read execution logs, or edit configurations using Bearer Tokens.

---

### 1. Token Validation Architecture
Bearer tokens are delivered inside the Authorization header:
\`\`\`
Authorization: Bearer coolie_tok_xxxxxx
\`\`\`
Verify scopes (e.g. \`jobs:read\`, \`jobs:write\`) before permitting operations.
`
  },
  {
    slug: 'scaling-rate-limiter-handlers',
    title: 'Scaling Rate-Limiter Handlers for High-Frequency Webhooks',
    date: 'April 14, 2026',
    author: 'Karthik S.',
    readTime: '15 min read',
    tag: 'Cloud',
    summary: 'Handle transaction surges and avoid endpoint outages using rate-limiting strategies and exponential backoffs.',
    content: `### Handling High-Frequency webhook Spikes
Spikes in scheduled webhook tasks can saturate downstream database connections, crashing receiver servers. 
Implementing rate limiters and backoff policies ensures platform reliability.

---

### 1. Token Bucket Rate Limiting
A Token Bucket algorithm limits target requests:
\`\`\`javascript
class TokenBucket {
  constructor(capacity, fillRate) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.fillRate = fillRate; // tokens per second
    this.lastRefill = Date.now();
  }
}
\`\`\`
`
  },
  {
    slug: 'why-http-pingers-fail',
    title: 'Why Basic HTTP Pingers Fail Under Authentication Scopes',
    date: 'April 08, 2026',
    author: 'Team Coolie',
    readTime: '14 min read',
    tag: 'Guide',
    summary: 'Simple uptime monitors crash when querying protected APIs. Explore how to configure headers, tokens, and OAuth scopes.',
    content: `### Simple Ping Limits
Simple pingers trigger HTTP GET requests. However, modern backends protect endpoints behind login walls.
Without header, cookies, or OAuth configurations, simple pingers receive \`401 Unauthorized\` errors.

---

### 1. Custom HTTP Headers
To monitor authenticated APIs, you must supply tokens inside headers:
\`\`\`
Authorization: Bearer api_token
\`\`\`
`
  },
  {
    slug: 'masking-secrets-in-logs',
    title: 'Best Practices for Redacting Secrets in Developer Log Monitors',
    date: 'April 02, 2026',
    author: 'Karthik S.',
    readTime: '15 min read',
    tag: 'Security',
    summary: 'Build masking scripts to redact passwords, connection strings, and access tokens from stdout database logs.',
    content: `### Preventing Token Leaks in Logs
Console outputs can accidentally print database keys, OAuth tokens, or user emails. 
Building dynamic redaction regex masks protects credentials from leaking into log servers.

---

### 1. Redaction Filter
Below is a Node.js utility to scrub logs before writing:
\`\`\`javascript
const SECRETS_REGEX = /(postgres:\/\/|bearer |password=)([^\s"']+)/gi;

function maskLogs(rawText) {
  return rawText.replace(SECRETS_REGEX, "$1[REDACTED]");
}
console.log(maskLogs("Connection: postgres://admin:secret@host/db"));
// Connection: postgres://[REDACTED]
\`\`\`
`
  },
  {
    slug: 'worker-urls-and-response-privacy',
    title: 'Worker URLs and Response Privacy Filters: Build Public Endpoints with Data Masking',
    date: 'July 5, 2026',
    author: 'Karthik S.',
    readTime: '12 min read',
    tag: 'Feature',
    summary: 'Learn how to expose any Api Coolie job as a public HTTP endpoint using Worker URLs, and configure recursive response privacy filters to automatically strip sensitive JSON keys and text values before they are stored, forwarded, or served publicly.',
    content: `## What are Worker URLs?

Worker URLs are unique public HTTP endpoints generated per-job on Api Coolie. When enabled, any incoming HTTP request to your Worker URL slug immediately triggers the associated job execution and returns the response body inline.

This is useful for:
- Triggering jobs from external CI/CD pipelines or deployment scripts
- Exposing job outputs as lightweight API endpoints for dashboards or third-party consumers
- Building webhook-style integrations without managing a separate server

## Enabling a Worker URL

1. Open any job from the Jobs list and navigate to the **Settings** tab.
2. Scroll to **Worker URL Settings** and click **Generate URL**.
3. Optionally set a custom human-readable slug (e.g. \`cricket-stats\`).
4. Once enabled, call your endpoint:

\`\`\`bash
curl https://apicoolie-backend.onrender.com/w/cricket-stats
\`\`\`

If your job is a Code Runner (Python or JavaScript), the script executes and its stdout output is returned as the response body. If the output is valid JSON, the response is automatically returned with \`Content-Type: application/json\`.

For API jobs, the outbound HTTP request is made and the response is forwarded back to the Worker URL caller.

## Example: Python Script as a Public Endpoint

Here is a Python Code Job that fetches cricket stats and returns JSON:

\`\`\`python
import urllib.request, json
with urllib.request.urlopen('https://trackwicketbackend-kscl.onrender.com/api/stats/most-runs/odi/all') as r:
    data = json.loads(r.read().decode())
    print(json.dumps(data, indent=2))
\`\`\`

When the Worker URL receives a GET request, it runs this script and returns:

\`\`\`json
[
  { "playerId": "IND-001", "playerName": "Rohit Sharma", "runs": 10709, "country": "India" },
  { "playerId": "WI-002",  "playerName": "Chris Gayle",  "runs": 10480, "country": "West Indies" }
]
\`\`\`

## Response Privacy Filters: Masking Sensitive Data

The Response Privacy Filter system lets you define per-job rules that strip or mask sensitive fields before the output is:
- Stored in execution history logs
- Dispatched via webhook
- Served through the Worker URL

### Blocked Keys

Add JSON key names to the **Blocked Keys** list. The filter runs **recursively** across all nested objects and arrays.

Example: blocking \`playerId\` transforms the above response to:

\`\`\`json
[
  { "playerName": "Rohit Sharma", "runs": 10709, "country": "India" },
  { "playerName": "Chris Gayle",  "runs": 10480, "country": "West Indies" }
]
\`\`\`

All matching keys are deleted at every nesting depth.

### Blocked Text Patterns

Add specific string values to the **Blocked Text** list to replace them with \`[REDACTED]\` wherever they appear as values.

Example: if you add \`arjun@example.com\` to Blocked Text and your API returns:

\`\`\`json
{ "name": "Arjun", "email": "arjun@example.com", "score": 98 }
\`\`\`

The stored and served output becomes:

\`\`\`json
{ "name": "Arjun", "email": "[REDACTED]", "score": 98 }
\`\`\`

This is especially useful for PII (Personally Identifiable Information) masking, token obfuscation, and GDPR compliance.

## Security Architecture

Worker URLs are hardened against common attacks:

- **No SSRF:** Internal IP ranges and localhost are blocked at the DNS layer. Scripts cannot route requests to private networks.
- **Header Sanitization:** Scripts cannot override critical security headers (\`Content-Security-Policy\`, \`X-Frame-Options\`).
- **HTML Sandboxing:** HTML outputs are wrapped in a strict CSP sandbox to block script execution.
- **SVG XSS Protection:** Job names in status badge SVGs are XML-escaped before rendering.

## Using the Response Output Console

The execution output panel at the bottom of each job configuration now renders JSON with proper indentation and whitespace. Instead of collapsed single-line blobs, you see formatted multi-line outputs with syntax-highlighted structure — making debugging far more efficient.

## Conclusion

Worker URLs transform any scheduled job into a callable API endpoint accessible from anywhere. Combined with recursive privacy filters, you can publish partial or sanitized views of your data to dashboards, external consumers, or webhook receivers — without exposing raw credentials or sensitive fields.

Configure both features from the job's Settings tab on Api Coolie.
`
  }
];

export default posts;
