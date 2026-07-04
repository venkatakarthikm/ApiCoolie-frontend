import React, { useState, useEffect } from 'react';
import { ShieldAlert, HelpCircle, Code, Sparkles, RefreshCw } from 'lucide-react';
import { apiClient } from '../utils/apiClient.js';
import { CopyButton } from './CopyButton.jsx';
import { Button } from './ui/Button.jsx';

export function BadgeGenerator({ jobId, jobName }) {
  const [style, setStyle] = useState('flat');
  const [labelOverride, setLabelOverride] = useState('');
  const [badge, setBadge] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBadge = async () => {
    try {
      const res = await apiClient.post(`/badge/jobs/${jobId}/badge`, { style, labelOverride });
      setBadge(res);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchBadge();
    }
  }, [jobId]);

  const handleUpdateBadge = async () => {
    setLoading(true);
    await fetchBadge();
    setLoading(false);
  };

  if (!badge) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground italic">
        Configuring badge generators...
      </div>
    );
  }

  // Build target URL paths
  const backendUrl = import.meta.env.VITE_BACKEND_API_URL || 'https://apicoolie-backend.onrender.com';
  const baseBadgeUrl = `${backendUrl}/badge/${badge.slug}`;
  const svgUrl = `${baseBadgeUrl}.svg`;
  const jsonUrl = `${baseBadgeUrl}.json`;
  const targetDashboardUrl = `${window.location.origin}/jobs/${jobId}`;

  // Snippets
  const markdownSnippet = `[![Api Coolie Status](${svgUrl})](${targetDashboardUrl})`;
  const htmlSnippet = `<a href="${targetDashboardUrl}"><img src="${svgUrl}" alt="Api Coolie Status" /></a>`;
  const rstSnippet = `.. image:: ${svgUrl}\n   :target: ${targetDashboardUrl}\n   :alt: Api Coolie Status`;

  return (
    <div className="space-y-6">
      
      {/* Live Badge Preview Card */}
      <div className="border border-border/40 p-6 rounded-2xl bg-card flex flex-col items-center justify-center space-y-4 text-center">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Live Badge Preview</span>
        
        {/* Render actual badge dynamically using an object or image tag */}
        <div className="p-3 bg-muted/10 rounded-xl border border-border/45 select-none min-h-[40px] flex items-center justify-center">
          <img src={svgUrl} alt="Live Status Badge" className="h-5" key={style + labelOverride} />
        </div>
        
        <p className="text-[10px] text-muted-foreground">
          Badges update live. Cache headers are configured to prevent server/CDN latency lags.
        </p>
      </div>

      {/* Adjust preferences fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold uppercase text-muted-foreground" htmlFor="labelOverride">Label Override (Left Side)</label>
          <input
            type="text"
            id="labelOverride"
            value={labelOverride}
            onChange={(e) => setLabelOverride(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none"
            placeholder={jobName}
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold uppercase text-muted-foreground" htmlFor="badgeStyle">Badge Style Layout</label>
          <select
            id="badgeStyle"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none"
          >
            <option value="flat">Flat (Default)</option>
            <option value="plastic">Plastic shadow</option>
            <option value="flat-square">Flat Square</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleUpdateBadge} loading={loading} className="text-xs py-1.5">
          Save Settings
        </Button>
      </div>

      {/* Code snippets blocks */}
      <div className="space-y-4 pt-4 border-t border-border/30">
        <h4 className="text-xs font-bold text-foreground">Copy-Paste Embed Code Snippets</h4>
        
        {/* Markdown */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-semibold text-muted-foreground">
            <span>Markdown</span>
            <CopyButton value={markdownSnippet} label="Copy Markdown" />
          </div>
          <pre className="p-3 bg-muted/5 border border-border/40 rounded-xl overflow-x-auto text-[10px] font-mono leading-relaxed text-muted-foreground">
            {markdownSnippet}
          </pre>
        </div>

        {/* HTML */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-semibold text-muted-foreground">
            <span>HTML snippet</span>
            <CopyButton value={htmlSnippet} label="Copy HTML" />
          </div>
          <pre className="p-3 bg-muted/5 border border-border/40 rounded-xl overflow-x-auto text-[10px] font-mono leading-relaxed text-muted-foreground">
            {htmlSnippet}
          </pre>
        </div>

        {/* RST */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-semibold text-muted-foreground">
            <span>reStructuredText (RST)</span>
            <CopyButton value={rstSnippet} label="Copy RST" />
          </div>
          <pre className="p-3 bg-muted/5 border border-border/40 rounded-xl overflow-x-auto text-[10px] font-mono leading-relaxed text-muted-foreground">
            {rstSnippet}
          </pre>
        </div>
      </div>

    </div>
  );
}
