import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Calendar, User, Clock, ArrowLeft, Heart, MessageSquare, Share2 } from 'lucide-react';

export function BlogPage() {
  const [selectedPost, setSelectedPost] = useState(null);

  const posts = [
    {
      slug: 'cron-cheat-sheet',
      title: 'The Ultimate Cron Expression Cheat Sheet (Including Sub-Minute Seconds)',
      date: 'June 28, 2026',
      author: 'Karthik S.',
      readTime: '8 min read',
      tag: 'Guide',
      summary: 'Cron syntax can be confusing, especially when extending standard patterns to 6-field seconds-level precision. This cheat-sheet demystifies intervals, ranges, and edge-cases.',
      content: `Cron expressions have been the industry standard for scheduling recurring tasks since the inception of Unix. However, traditional crontabs are strictly limited to minute-level granularity. In modern event-driven architectures, we often need faster execution cycles. 

To solve this, Api Coolie supports 6-field cron expressions that enable sub-minute scheduling with 1-second precision. Let’s break down the anatomy of a 6-field cron pattern, understand how to build complex schedules, and review standard shorthand notations.

### Anatomy of a 6-field Cron Expression

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

### Cron Special Characters

1. **The Asterisk (*)**: Matches all values. For instance, putting an asterisk in the minutes field means the job runs every minute.
2. **The Comma (,)**: Specifies a list of discrete values. E.g., \`1,3,5\` in the Day of Week field means the job runs on Monday, Wednesday, and Friday.
3. **The Hyphen (-)**: Specifies a range of values. E.g., \`9-17\` in the Hours field means the job runs hourly from 9 AM to 5 PM.
4. **The Slash (/)**: Specifies increments. E.g., \`*/15\` in the Seconds field means the job runs every 15 seconds.
5. **The Question Mark (?)**: Ignored field, used when you want to specify a Day of Month but not a Day of Week, or vice versa.

### Common Real-World Examples

*   **Trigger every 5 seconds**: \`*/5 * * * * *\`
    Use this for high-priority polling, such as fetching real-time order streams or querying service health indicators.
*   **Trigger every 30 seconds during business hours**: \`0,30 * 9-17 * * MON-FRI\`
    Runs twice a minute (at :00 and :30 seconds) between 9:00 AM and 5:59 PM, Monday through Friday.
*   **Trigger daily at midnight**: \`0 0 0 * * *\`
    Perfect for pruning tables, archiving statistics, and generating summary tables for the dashboard.
*   **Trigger at 10:15 AM on the last day of the month**: \`0 15 10 L * ?\`
    The \`L\` wildcard designates the last day of the month automatically, avoiding complex math.

Using 6-field cron patterns gives you fine-grained control over your serverless integrations. Be mindful when deploying sub-minute tasks: verify that your target APIs can handle the call volume without rate limiting or degrading database connections.`,
    },
    {
      slug: 'timezone-dst-pitfalls',
      title: 'Timezone and DST Pitfalls in Distributed Scheduled Operations',
      date: 'June 22, 2026',
      author: 'Team Coolie',
      readTime: '12 min read',
      tag: 'Operations',
      summary: 'Daylight Savings transitions and raw timezone offsets can trigger double executions or skip critical database loops. Discover how to build DST-safe architectures.',
      content: `Daylight Savings Time (DST) changes are one of the most common causes of bugs in scheduling engines. Twice a year, clocks shift, altering local time offsets. In the Spring, a whole hour is skipped (clocks go from 1:59 AM directly to 3:00 AM). In the Autumn, an hour is repeated (clocks roll back from 1:59 AM to 1:00 AM, executing the hour twice).

If your scheduler evaluates jobs using UTC offsets alone or runs strictly on server-time, you risk serious execution errors. Let's analyze these pitfalls and look at how to build reliable, DST-resistant systems.

### The Pitfalls in Action

#### 1. The Missing Hour (Spring Forward)
Suppose you schedule a database report to run daily at 2:30 AM local time. On the night of the Spring transition, the clock jumps from 1:59 AM to 3:00 AM. 
**The Bug:** The timestamp 2:30 AM never exists. If your scheduler looks for an exact local time match, your report will be skipped entirely.

#### 2. The Repeated Hour (Autumn Fall Back)
Suppose you schedule an inventory sync to run daily at 1:30 AM. On the night of the Autumn transition, the clock rolls back. 1:30 AM occurs twice.
**The Bug:** Without transaction isolation or double-run guards, your scheduler will execute the job twice, leading to duplicate API payloads, bloated records, or corrupt tables.

### How to Build a DST-Safe System

#### A. Avoid Hardcoding Raw UTC Offsets
Never save a user’s preferred schedule timezone as a static offset (e.g. \`UTC+5:30\` or \`UTC-4\`). Offsets are dynamic. Instead, store the schedule with its formal IANA Timezone Database identifier (e.g. \`Asia/Kolkata\` or \`America/New_York\`). The database contains the historical and future rules for DST transitions.

#### B. Calculate Next Run Times in Timezone-Aware Contexts
In Node.js, libraries like Luxon allow you to parse dates within specific timezones.
\`\`\`javascript
const { DateTime } = require('luxon');

// Calculate run target relative to target timezone
const nextRun = DateTime.fromObject(
  { hour: 2, minute: 30 },
  { zone: 'America/New_York' }
);
\`\`\`
If a local hour is skipped, timezone-aware libraries detect that the time object is invalid or automatically align it to the transition boundary (e.g., 3:00 AM).

#### C. Enforce Task Idempotency
Because network glitches or clock drift can cause duplicate triggers, design your jobs to be idempotent:
1.  **Deduplication Keys:** Include a unique execution ID for the scheduled window (e.g., \`job_123_2026-07-04-09-30\`).
2.  **Unique Constraints:** Use Postgres \`UNIQUE\` constraints on your database ledger to block duplicate operations.
3.  **Check-Then-Act:** In your API endpoints, check if the task for the target window has already executed before running the main logic.

By applying proper timezone calculations and protecting your endpoints with idempotency keys, you can ensure your scheduled jobs run reliably through any DST transition.`,
    },
    {
      slug: 'api-without-server',
      title: 'How to Schedule API Calls and Webhooks Without Managing a Server',
      date: 'June 18, 2026',
      author: 'Sarah Jenkins',
      readTime: '7 min read',
      tag: 'Architecture',
      summary: 'Running dedicated servers just to manage interval tasks is expensive and hard to maintain. Discover how serverless cron schedulers simplify your architecture.',
      content: `In the early stages of a project, scheduling recurring events seems simple. You might start with a Node.js process using \`setInterval\` or add a quick shell script to your linux crontab. 

However, as your app grows, managing scheduling yourself introduces hidden costs and points of failure. Let's look at why managing servers for scheduling is a mistake, and how serverless alternatives simplify your stack.

### The Limits of Server-Bound Schedulers

1.  **Single Point of Failure (SPOF)**:
    If your server crashes, restarts, or runs out of memory, your scheduling process dies. Critical tasks (like billing charges or data backups) will fail silently.
2.  **Deployment Disruptions**:
    Whenever you deploy new code or restart your server, you interrupt active timers. If a task was scheduled during the restart window, it is lost.
3.  **Scaling Inefficiency**:
    Keeping a VM active 24/7 just to run a 5-second database script once an hour is highly inefficient. You pay for unused compute time.
4.  **No Audit Trail or Monitoring**:
    Standard cron logs are written to system files that are difficult to access. If a task fails or hangs, you won't know without custom alerting.

### The Serverless Alternative

A serverless scheduler moves the execution trigger out of your main application server. Instead of running timers internally, you configure your tasks in a centralized console. The scheduler handles the timers and triggers your application via a standard HTTP webhook or API endpoint.

This architecture offers several key advantages:

*   **Decoupled Triggers**: Your application code only needs to handle HTTP requests. The scheduler manages the cron timers.
*   **High Availability**: The scheduler runs on a redundant, distributed platform. If your application server is restarted, the scheduler will retry the failed webhook calls.
*   **Detailed Analytics**: You get access to execution histories, logs, latency metrics, and success/failure alerts.
*   **Reduced Server Overhead**: You can use cheap serverless hosting (like Vercel, Netlify, or AWS Lambda) and let the scheduler trigger them as needed.

By moving your scheduling logic to a serverless provider like Api Coolie, you can simplify your codebase, reduce infrastructure costs, and build a more resilient system.`,
    },
    {
      slug: 'fault-tolerant-schedulers',
      title: 'Designing Fault-Tolerant Distributed Schedulers at Scale',
      date: 'July 01, 2026',
      author: 'Karthik S.',
      readTime: '10 min read',
      tag: 'System Design',
      summary: 'Explore the architectures of large-scale schedulers. Learn how to solve the split-brain problem, achieve exact-once deliveries, and optimize locks.',
      content: `Building a scheduler that runs a few jobs on a single machine is straightforward. But when you need to run millions of jobs across a cluster of servers, scaling the system introduces complex distributed computing challenges.

If multiple nodes execute schedules simultaneously, how do you prevent them from triggering the same job twice? If a node crashes mid-execution, how does the system recover? Let's dive into the core architecture of distributed schedulers, and explore how to solve these problems.

### Core Challenges at Scale

#### 1. The Split-Brain Problem
In a distributed cluster, network partitions can isolate nodes. If two nodes believe they are the "leader" responsible for triggering tasks, they will both execute the same scheduled jobs.

#### 2. At-Least-Once vs. Exactly-Once Delivery
In distributed systems, you must choose your delivery guarantee:
*   **At-Least-Once**: Ensures a task runs at least once, but may run multiple times due to retries or network latency.
*   **Exactly-Once**: Guarantees a task runs exactly once. This is much harder to achieve because network timeouts make it difficult to confirm if a node successfully processed a task.

### Key Architectural Solutions

#### A. Distributed Locking (Pessimistic Locking)
To ensure only one node runs a job at any given time, use a centralized locking mechanism. For database-backed schedulers, Postgres row-level locks are a highly effective solution:

\`\`\`sql
-- Attempt to acquire lock on job
SELECT id, status 
FROM scheduled_jobs 
WHERE id = $1 AND status = 'PENDING' 
FOR UPDATE SKIP LOCKED;
\`\`\`

The \`FOR UPDATE SKIP LOCKED\` query allows a worker node to safely query and lock a job row. If another node has already locked the row, the query skips it without blocking, allowing nodes to process jobs concurrently without conflicts.

#### B. Redundant Master-Worker Layouts
Another approach is a leader-follower architecture. A single "leader" node manages the cron timers and assigns active tasks to a pool of "worker" nodes via a message queue (such as Redis or RabbitMQ). 

If the leader node crashes, the cluster uses a consensus protocol (like Raft or ZooKeeper) to elect a new leader, ensuring continuous operations.

#### C. Graceful Recovery & Dead-Letter Queues
If a worker node crashes mid-execution, the task status remains "RUNNING". To prevent tasks from hanging indefinitely, implement a watcher process that checks for stale executions:

*   **Heartbeats**: Worker nodes send periodic updates while running a task. If a node stops sending heartbeats, the system marks it as failed.
*   **Timeout Enforcements**: Configure hard timeouts for all tasks. If a task exceeds its limit, the system terminates the process and marks it as failed.
*   **Dead-Letter Queues**: Move persistently failing tasks to a separate queue for manual inspection, preventing them from blocking the main queue.

Designing a distributed scheduler requires balancing reliability, performance, and complexity. By using robust database locking, message queues, and worker heartbeats, you can build a scheduling engine that scales smoothly to handle millions of tasks.`,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 space-y-12 animate-scale text-xs md:text-sm">
      <Helmet>
        <title>Blog | Api Coolie</title>
        <meta name="description" content="Read our technical blog for tutorials on cron expressions, scheduling scripts, managing environment variables, and DevOps guides." />
      </Helmet>

      {selectedPost ? (
        <article className="space-y-6">
          <button
            onClick={() => setSelectedPost(null)}
            className="text-xs text-primary hover:underline font-bold flex items-center gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to articles
          </button>
          
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-primary/10 text-primary w-fit block">
              {selectedPost.tag}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">{selectedPost.title}</h1>
            <div className="flex gap-4 text-xs text-muted-foreground font-semibold">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {selectedPost.date}</span>
              <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {selectedPost.author}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {selectedPost.readTime}</span>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none text-muted-foreground whitespace-pre-line text-xs sm:text-sm leading-relaxed border-t border-border/40 pt-6 space-y-4">
            {selectedPost.content}
          </div>

          <div className="border-t border-border/40 pt-6 flex items-center justify-between text-muted-foreground">
            <div className="flex gap-4">
              <button className="flex items-center gap-1 hover:text-primary transition-colors text-xs font-bold">
                <Heart className="h-4 w-4" /> Like Article
              </button>
              <button className="flex items-center gap-1 hover:text-primary transition-colors text-xs font-bold">
                <MessageSquare className="h-4 w-4" /> Write Comment
              </button>
            </div>
            <button className="flex items-center gap-1 hover:text-primary transition-colors text-xs font-bold">
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>
        </article>
      ) : (
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight font-sans">Engineering Blog</h1>
            <p className="text-sm text-muted-foreground">DevOps guides, cron loops, script isolations, and serverless best practices.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 pt-4">
            {posts.map((post) => (
              <div
                key={post.slug}
                onClick={() => setSelectedPost(post)}
                className="p-6 border border-border/40 bg-card rounded-3xl cursor-pointer hover:border-primary/45 hover:shadow-md transition-all space-y-4 group"
              >
                <div className="flex items-center justify-between gap-4 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                  <span className="px-2.5 py-0.5 rounded bg-muted/20 text-muted-foreground border border-border/30">{post.tag}</span>
                  <div className="flex gap-3">
                    <span>{post.date}</span>
                    <span>&bull;</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{post.summary}</p>
                <div className="text-xs text-primary font-bold flex items-center gap-1 group-hover:underline">
                  Read article <ArrowLeft className="h-3 w-3 rotate-180" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
