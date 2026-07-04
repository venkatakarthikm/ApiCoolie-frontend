import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Tag, Calendar, Sparkles } from 'lucide-react';

export function ChangelogPage() {
  const versions = [
    {
      version: 'v1.3.0',
      date: 'July 04, 2026',
      badge: 'Latest',
      changes: [
        { type: 'added', text: 'Integrated interactive Accordion FAQ section with FAQPage and SoftwareApplication JSON-LD schema.' },
        { type: 'added', text: 'Public Versus Comparison page at /versus comparing platform with traditional webhook crons and uptime systems.' },
        { type: 'added', text: 'JSON Formatter references, templates, and sandbox validation tutorials across all public and developer guides.' },
        { type: 'added', text: 'Dynamic Helmet title and meta-description updates across Blog, Docs, and Tutorials pages for search crawling indexing.' },
        { type: 'changed', text: 'Redesigned Legal policies pages (Privacy, Terms, Security) to render dynamically using custom JSX markdown parser.' },
        { type: 'changed', text: 'Upgraded body paragraph font sizes across all marketing pages to improve readability.' },
        { type: 'fixed', text: 'Resolved WebGL context failure crashing issues inside Hyperspeed.jsx component and fixed Lucide-react import error.' }
      ],
    },
    {
      version: 'v1.2.0',
      date: 'July 04, 2026',
      changes: [
        { type: 'added', text: 'Integrated Google OAuth 2.0 Implicit Flow client-side token acquisition.' },
        { type: 'added', text: 'New Tutorials library page containing detailed developer guides and code configurations.' },
        { type: 'added', text: 'Comprehensive, detailed guides for all Docs, Blogs, and Legal policy pages.' },
        { type: 'changed', text: 'Refined marketing page container offsets to prevent fixed header navbar overlaps.' },
        { type: 'changed', text: 'Removed GitHub auth provider and streamlined login/signup interfaces to single Google OAuth button.' },
        { type: 'changed', text: 'Configured robots.txt and sitemap.xml to index the tutorials routing.' }
      ],
    },
    {
      version: 'v1.1.0',
      date: 'July 03, 2026',
      changes: [
        { type: 'added', text: 'Custom Worker URL Slug customizations and collision verification checks.' },
        { type: 'added', text: 'JSON Formatter Suite with validators, minifiers, sorters, and XML/YAML/CSV/TSV conversion tools.' },
        { type: 'added', text: 'Interactive AI Chat drawer embedded directly inside Monaco script workspace.' },
        { type: 'changed', text: 'Redesigned sidebar navigation with MAIN/MANAGE/ACCOUNT groups, count badges, and notification bell.' },
        { type: 'changed', text: 'Introduced 6 custom theme profiles including Neon, Metallic, Glassy, and Bright modes.' },
        { type: 'fixed', text: 'Corrected empty worker URL outputs and fixed isolate console sync streams.' }
      ],
    },
    {
      version: 'v1.0.0',
      date: 'July 02, 2026',
      changes: [
        { type: 'added', text: 'Initial release of Api Coolie scheduler platform!' },
        { type: 'added', text: 'Precision 1-second interval execution loop using custom Node scheduler.' },
        { type: 'added', text: 'Local and Google/GitHub authentication strategy support.' },
        { type: 'added', text: 'Code Runner integration with isolated-vm supporting JS and Python scripts.' },
        { type: 'added', text: 'Failure AI Insights integration using OpenRouter LLM completions.' },
        { type: 'added', text: 'Status badge generator serving public image SVG and JSON indicators.' },
      ],
    },
  ];

  const getTagStyle = (type) => {
    if (type === 'added') return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
    if (type === 'changed') return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
    return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 space-y-12 animate-scale text-sm md:text-base">
      <Helmet>
        <title>Changelog | Api Coolie</title>
        <meta name="description" content="Official release log and version changes overview for Api Coolie platform." />
      </Helmet>

      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight font-sans">Product Changelog</h1>
        <p className="text-sm text-muted-foreground">Stay up-to-date with our latest deployments, features, and optimizations.</p>
      </div>

      <div className="space-y-12 pt-8 relative before:absolute before:left-3 before:top-4 before:bottom-4 before:w-0.5 before:bg-border/40">
        {versions.map((ver) => (
          <div key={ver.version} className="relative pl-8">
            {/* Timeline icon */}
            <div className="absolute left-[3px] top-1.5 -translate-x-1/2 w-4 h-4 bg-background border-2 border-primary rounded-full flex items-center justify-center shadow-sm">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-extrabold text-foreground">{ver.version}</h3>
                <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> {ver.date}
                </span>
                {ver.badge && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-primary text-white rounded-full">
                    {ver.badge}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {ver.changes.map((c, i) => (
                  <div key={i} className="flex items-start gap-2.5 leading-relaxed">
                    <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider shrink-0 mt-0.5 ${getTagStyle(c.type)}`}>
                      {c.type}
                    </span>
                    <span className="text-muted-foreground font-medium">{c.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
