import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, Code, Globe, HelpCircle, ArrowRight, BookOpen } from 'lucide-react';

const TEMPLATES = [
  {
    id: 'api-ping',
    type: 'api',
    title: 'Website Health Ping',
    description: 'Keep your website hot. Pings a GET URL every 5 minutes and flags downtime.',
    config: {
      name: 'Website Health Ping',
      description: 'Periodic ping health checks.',
      scheduleType: 'cron',
      cronExpression: '*/5 * * * *',
      apiConfig: {
        method: 'GET',
        url: 'https://httpbin.org/status/200',
        headers: [{ key: 'User-Agent', value: 'ApiCoolie-HealthCheck/1.0', enabled: true }]
      }
    }
  },
  {
    id: 'api-slack',
    type: 'api',
    title: 'Slack Alert Dispatches',
    description: 'Post custom payload payloads to slack incoming webhook channel addresses.',
    config: {
      name: 'Slack Notification Dispatch',
      description: 'Webhook triggers to alert slack channel admins.',
      scheduleType: 'manual_only',
      apiConfig: {
        method: 'POST',
        url: 'https://hooks.slack.com/services/T00/B00/X00',
        payloadType: 'json',
        payload: JSON.stringify({ text: "Hello from Api Coolie!" }),
        headers: [{ key: 'Content-Type', value: 'application/json', enabled: true }]
      }
    }
  },
  {
    id: 'api-weather',
    type: 'api',
    title: 'Daily Weather Tracker',
    description: 'Check city forecast stats daily to compile a personal weather report.',
    config: {
      name: 'Daily Weather Fetch',
      description: 'Collect daily weather forecasts.',
      scheduleType: 'weekly_days',
      weeklyDays: [1, 2, 3, 4, 5],
      runTime: '08:00:00',
      apiConfig: {
        method: 'GET',
        url: 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true',
        headers: []
      }
    }
  },
  {
    id: 'api-ipify',
    type: 'api',
    title: 'Public IP Logger',
    description: 'Poll public IP addresses daily to track dynamic server updates.',
    config: {
      name: 'Dynamic IP Fetch',
      description: 'Monitor outbound dynamic public IP addresses.',
      scheduleType: 'interval',
      intervalMs: 86400000, // 24h
      apiConfig: {
        method: 'GET',
        url: 'https://api.ipify.org?format=json',
        headers: []
      }
    }
  },
  {
    id: 'code-rates',
    type: 'code',
    title: 'Exchange Rates Parser',
    description: 'Fetch currency conversion metrics, parse values, and format a readable log.',
    config: {
      name: 'Exchange Rates Formatter',
      description: 'Parse currency values in isolated-vm.',
      scheduleType: 'manual_only',
      codeConfig: {
        language: 'javascript',
        sourceCode: `// Fetch exchange rates and display a formatted summary
fetch('https://open.er-api.com/v6/latest/USD')
  .then(res => res.json())
  .then(data => {
    console.log("=== USD Exchange Rates ===");
    console.log("EUR:", data.rates.EUR);
    console.log("GBP:", data.rates.GBP);
    console.log("INR:", data.rates.INR);
    
    // Set custom response
    response.status = 200;
    response.body = {
      base: "USD",
      rates: {
        EUR: data.rates.EUR,
        GBP: data.rates.GBP,
        INR: data.rates.INR
      }
    };
  })
  .catch(err => {
    console.error("Fetch failed:", err);
  });`
      }
    }
  },
  {
    id: 'code-discord',
    type: 'code',
    title: 'Discord Notification Bot',
    description: 'Run V8 sandbox scripts to dispatch stylized embeds to Discord webhook channels.',
    config: {
      name: 'Discord Webhook Bot',
      description: 'Publish system alerts to Discord channels.',
      scheduleType: 'manual_only',
      codeConfig: {
        language: 'javascript',
        sourceCode: `// Dispatch custom embeds to discord webhook channel
const webhookUrl = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/TOKEN';

const payload = {
  embeds: [{
    title: "System Alert Notification",
    description: "Sandbox code runner executed successfully on Api Coolie!",
    color: 3066993, // Green
    fields: [
      { name: "Server Status", value: "Normal", inline: true },
      { name: "Latency", value: "45ms", inline: true }
    ],
    timestamp: new Date().toISOString()
  }]
};

fetch(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
.then(() => console.log("Discord alert sent successfully."))
.catch(err => console.error("Discord post error:", err));`
      }
    }
  },
  {
    id: 'code-cleaner',
    type: 'code',
    title: 'Data Object Sorter',
    description: 'Filter arrays, clean nested attributes, and generate structured summaries in JavaScript.',
    config: {
      name: 'Data Object Sorter',
      description: 'Sort and filter data objects in isolated-vm.',
      scheduleType: 'manual_only',
      codeConfig: {
        language: 'javascript',
        sourceCode: `// Complex array filtering and properties compilation
const rawData = [
  { id: 1, name: "Task Alpha", status: "completed", priority: "high" },
  { id: 2, name: "Task Beta", status: "pending", priority: "low" },
  { id: 3, name: "Task Gamma", status: "completed", priority: "medium" },
  { id: 4, name: "Task Delta", status: "failed", priority: "high" }
];

console.log("Filtering raw dataset...");
const completedHigh = rawData.filter(t => t.status === "completed" || t.priority === "high");

console.log("Filtered results count:", completedHigh.length);
console.log(JSON.stringify(completedHigh, null, 2));

response.status = 200;
response.body = {
  total: rawData.length,
  filteredCount: completedHigh.length,
  results: completedHigh
};`
      }
    }
  },
  {
    id: 'code-scraper',
    type: 'code',
    title: 'Site Metadata Scraper',
    description: 'Load html content, parse body headers, and compile a quick page check.',
    config: {
      name: 'Site Metadata Scraper',
      description: 'Extract titles and tags from remote sites.',
      scheduleType: 'manual_only',
      codeConfig: {
        language: 'javascript',
        sourceCode: `// Fetch a page and extract target keywords
fetch('https://httpbin.org/html')
  .then(res => res.text())
  .then(html => {
    console.log("HTML retrieved successfully, length:", html.length);
    
    // Parse headers using basic regex
    const titleMatch = html.match(/<h1>(.*?)<\\/h1>/);
    const title = titleMatch ? titleMatch[1] : 'No heading found';
    
    console.log("Extracted Heading:", title);
    response.status = 200;
    response.body = { heading: title };
  })
  .catch(err => {
    console.error("Scrape error:", err);
  });`
      }
    }
  }
];

export function TemplatesPage() {
  const navigate = useNavigate();

  const handleSelectTemplate = (tmpl) => {
    // Store template context in sessionStorage to pre-fill the form on creation page
    sessionStorage.setItem('api_coolie_template', JSON.stringify(tmpl.config));
    navigate(`/jobs/new?type=${tmpl.type}&template=${tmpl.id}`);
  };

  return (
    <div className="space-y-6 animate-scale">
      <Helmet>
        <title>Quick-start Preset Templates | Api Coolie</title>
      </Helmet>

      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-bold font-sans flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> Preset Job Templates
          </h1>
          <p className="text-xs text-muted-foreground">Select a pre-configured template to jump-start your API routines and sandboxed JS script workers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TEMPLATES.map((tmpl) => (
          <div
            key={tmpl.id}
            onClick={() => handleSelectTemplate(tmpl)}
            className="p-5 border border-border/40 bg-card rounded-2xl hover:shadow-md hover:border-primary/40 cursor-pointer transition-all flex flex-col justify-between space-y-4 group relative overflow-hidden"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {tmpl.type === 'api' ? (
                  <span className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-500 border border-emerald-500/10">
                    <Globe className="h-4 w-4" />
                  </span>
                ) : (
                  <span className="p-1.5 bg-blue-500/10 rounded-lg text-blue-500 border border-blue-500/10">
                    <Code className="h-4 w-4" />
                  </span>
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-muted-foreground">
                  {tmpl.type === 'api' ? 'API Endpoint' : 'Sandbox Code'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                {tmpl.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {tmpl.description}
              </p>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-semibold text-primary group-hover:gap-2 transition-all">
              <span>Use Template</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
