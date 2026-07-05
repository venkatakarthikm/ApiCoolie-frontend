import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FileText, Scale, Shield, Lock, Server, Globe, Key, AlertCircle, Info, Database, Send, Clock } from 'lucide-react';
import { privacyPolicyText, termsOfServiceText, securityOperationsText } from '../utils/legalText.js';
import { CopyButton } from '../components/CopyButton.jsx';

function renderLegalContent(content) {
  const blocks = content.split('\n\n');
  return blocks.map((block, idx) => {
    block = block.trim();
    if (!block) return null;

    // Generic Headers Parser (# to ######)
    const headerMatch = block.match(/^(#{1,6})\s+(.*)$/s);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const text = headerMatch[2].trim();
      const Tag = `h${level}`;
      let className = "text-foreground font-bold font-sans mt-5 mb-2";
      if (level === 1) className = "text-2xl font-extrabold text-foreground pt-4 pb-2 mt-6";
      else if (level === 2) className = "text-xl font-extrabold text-foreground pt-3 pb-2 mt-5";
      else if (level === 3) className = "text-lg font-bold text-foreground pt-2 pb-1 mt-4";
      else if (level === 4) className = "text-base font-bold text-foreground pt-1.5 pb-1 mt-3";
      else className = "text-sm font-bold text-foreground mt-2";
      
      const renderedText = text.split('**').map((part, pIdx) => {
        if (pIdx % 2 === 1) {
          return <strong key={pIdx} className="text-foreground font-bold">{part}</strong>;
        }
        return part.split('`').map((subPart, sIdx) => {
          if (sIdx % 2 === 1) {
            return <code key={sIdx} className="bg-muted/15 border border-border/40 px-1 py-0.5 rounded text-[10px] text-primary">{subPart}</code>;
          }
          return subPart;
        });
      });

      return (
        <Tag key={idx} className={className}>
          {renderedText}
        </Tag>
      );
    }

    // Horizontal Rule
    if (block === '---') {
      return <hr key={idx} className="my-6 border-border/40" />;
    }

    // Code block
    if (block.startsWith('```')) {
      const lines = block.split('\n');
      const language = lines[0].replace('```', '').trim();
      const code = lines.slice(1, -1).join('\n');
      return (
        <div key={idx} className="relative border border-border/40 rounded-2xl bg-card overflow-hidden my-4">
          <div className="absolute right-3 top-3 z-10">
            <CopyButton value={code} label="Copy Code" />
          </div>
          <pre className="p-4 text-xs overflow-x-auto bg-muted/5 font-mono leading-relaxed text-muted-foreground max-h-96">
            <code>{code}</code>
          </pre>
        </div>
      );
    }

    // Table block
    if (block.startsWith('|')) {
      const rows = block.split('\n');
      const tableRows = rows.filter(r => r.trim() && !r.includes('---|'));
      if (tableRows.length > 0) {
        return (
          <div key={idx} className="border border-border/40 rounded-2xl overflow-hidden bg-muted/5 my-4">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-muted/20 border-b border-border/40 font-bold">
                  {tableRows[0].split('|').slice(1, -1).map((cell, cIdx) => (
                    <th key={cIdx} className="p-3">{cell.trim()}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 text-muted-foreground font-medium">
                {tableRows.slice(1).map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.split('|').slice(1, -1).map((cell, cIdx) => (
                      <td key={cIdx} className="p-3">{cell.trim()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    }

    // Bullet List block
    if (block.startsWith('* ') || block.startsWith('- ')) {
      const items = block.split('\n');
      return (
        <ul key={idx} className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-muted-foreground my-4">
          {items.map((item, iIdx) => {
            const cleanItem = item.replace(/^[*-\s]+/, '');
            // handle inline bold inside list item
            const renderedItem = cleanItem.split('**').map((part, pIdx) => {
              if (pIdx % 2 === 1) {
                return <strong key={pIdx} className="text-foreground font-bold">{part}</strong>;
              }
              return part;
            });
            return <li key={iIdx}>{renderedItem}</li>;
          })}
        </ul>
      );
    }

    // Numbered List block
    if (/^\d+\.\s/.test(block)) {
      const items = block.split('\n');
      return (
        <ol key={idx} className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-muted-foreground my-4">
          {items.map((item, iIdx) => {
            const cleanItem = item.replace(/^\d+\.\s+/, '');
            // handle inline bold inside list item
            const renderedItem = cleanItem.split('**').map((part, pIdx) => {
              if (pIdx % 2 === 1) {
                return <strong key={pIdx} className="text-foreground font-bold">{part}</strong>;
              }
              return part;
            });
            return <li key={iIdx}>{renderedItem}</li>;
          })}
        </ol>
      );
    }

    // Default Paragraph with bold replacements
    // Simple inline parser for **bold** text
    const renderedText = block.split('**').map((part, pIdx) => {
      if (pIdx % 2 === 1) {
        return <strong key={pIdx} className="text-foreground font-bold">{part}</strong>;
      }
      // handle inline code: `code`
      return part.split('`').map((subPart, sIdx) => {
        if (sIdx % 2 === 1) {
          return <code key={sIdx} className="bg-muted/15 border border-border/40 px-1.5 py-0.5 rounded text-[11px] text-primary">{subPart}</code>;
        }
        return subPart;
      });
    });

    return (
      <p key={idx} className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium my-4">
        {renderedText}
      </p>
    );
  });
}

export function LegalPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  
  // Set tab based on path
  const getTabFromPath = (path) => {
    if (path.includes('terms')) return 'terms';
    if (path.includes('security')) return 'security';
    return 'privacy';
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath(pathname));

  useEffect(() => {
    setActiveTab(getTabFromPath(pathname));
  }, [pathname]);

  const handleTabChange = (tabId) => {
    navigate(`/legal/${tabId}`);
  };

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: FileText, desc: 'How we collect, encrypt, and manage user parameters.' },
    { id: 'terms', label: 'Terms of Service', icon: Scale, desc: 'Rules, service limits, and runtime constraints.' },
    { id: 'security', label: 'Security Operations', icon: Shield, desc: 'Database isolation and secrets protection.' }
  ];

  let title = 'Privacy Policy';
  let desc = 'How we collect, encrypt, and manage user parameters.';

  if (activeTab === 'terms') {
    title = 'Terms of Service';
    desc = 'Rules and limitations for using the Api Coolie scheduler service.';
  } else if (activeTab === 'security') {
    title = 'Security Operations';
    desc = 'Measures enforcing authorization isolation and credential protection.';
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8 animate-scale text-xs md:text-sm">
      <Helmet>
        <title>{title} | Api Coolie</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={`https://apicoolie.stackinfi.in/legal/${activeTab}`} />
        <meta property="og:title" content={`${title} | Api Coolie`} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://apicoolie.stackinfi.in/legal/${activeTab}`} />
        <meta property="og:image" content="https://apicoolie.stackinfi.in/api-coolie-og.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${title} | Api Coolie`} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content="https://apicoolie.stackinfi.in/api-coolie-og.webp" />
      </Helmet>

      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 shrink-0 space-y-4">
        <div className="px-3 py-1 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">Legal Center</span>
        </div>
        <nav className="flex flex-col gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                id={`legal-tab-btn-${tab.id}`}
                onClick={() => handleTabChange(tab.id)}
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
        
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div className="space-y-2 border-b border-border/40 pb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded bg-primary/10 w-fit">Privacy Policy</span>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-sans pt-1">Privacy Policy</h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Api Coolie values developer trust. We prioritize high-grade encryption and secure access validation over data collection.
              </p>
            </div>

            <div className="max-w-none border-t border-border/40 pt-6 space-y-4">
              {renderLegalContent(privacyPolicyText)}
            </div>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-6">
            <div className="space-y-2 border-b border-border/40 pb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded bg-primary/10 w-fit">Terms of Service</span>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-sans pt-1">Terms of Service</h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Rules, acceptable usage boundaries, and service limitations for managing scheduled jobs on Api Coolie.
              </p>
            </div>

            <div className="max-w-none border-t border-border/40 pt-6 space-y-4">
              {renderLegalContent(termsOfServiceText)}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="space-y-2 border-b border-border/40 pb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded bg-primary/10 w-fit">Security Framework</span>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-sans pt-1">Security Operations</h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                How we protect developer credentials, isolate databases, and ensure cryptographic verification of incoming triggers.
              </p>
            </div>

            <div className="max-w-none border-t border-border/40 pt-6 space-y-4">
              {renderLegalContent(securityOperationsText)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
