import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Calendar, User, Clock, ArrowLeft, Heart, MessageSquare, Share2 } from 'lucide-react';
import posts from '../utils/blogPosts.js';
import { CopyButton } from '../components/CopyButton.jsx';

function renderBlogContent(content) {
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
            return <code key={sIdx} className="bg-muted/15 border border-border/40 px-1.5 py-0.5 rounded text-[11px] text-primary">{subPart}</code>;
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
        <ul key={idx} className="list-disc pl-5 space-y-2 text-sm md:text-base text-muted-foreground my-4">
          {items.map((item, iIdx) => {
            const cleanItem = item.replace(/^[*-\s]+/, '');
            return <li key={iIdx}>{cleanItem}</li>;
          })}
        </ul>
      );
    }

    // Numbered List block
    if (/^\d+\.\s/.test(block)) {
      const items = block.split('\n');
      return (
        <ol key={idx} className="list-decimal pl-5 space-y-2 text-sm md:text-base text-muted-foreground my-4">
          {items.map((item, iIdx) => {
            const cleanItem = item.replace(/^\d+\.\s+/, '');
            return <li key={iIdx}>{cleanItem}</li>;
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

export function BlogPage() {
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 space-y-12 animate-scale text-sm md:text-base">
      {selectedPost ? (
        <article className="space-y-6">
          <Helmet>
            <title>{selectedPost.title} | Api Coolie Blog</title>
            <meta name="description" content={selectedPost.summary} />
            <link rel="canonical" href={`https://apicoolie.stackinfi.in/blog?post=${selectedPost.slug}`} />
            <meta property="og:title" content={`${selectedPost.title} | Api Coolie Blog`} />
            <meta property="og:description" content={selectedPost.summary} />
            <meta property="og:type" content="article" />
            <meta property="og:url" content={`https://apicoolie.stackinfi.in/blog?post=${selectedPost.slug}`} />
            <meta property="og:image" content="https://apicoolie.stackinfi.in/api-coolie-og.webp" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={`${selectedPost.title} | Api Coolie Blog`} />
            <meta name="twitter:description" content={selectedPost.summary} />
            <meta name="twitter:image" content="https://apicoolie.stackinfi.in/api-coolie-og.webp" />
          </Helmet>
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

          <div className="max-w-none border-t border-border/40 pt-6 space-y-4">
            {renderBlogContent(selectedPost.content)}
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
          <Helmet>
            <title>Engineering Blog | Api Coolie</title>
            <meta name="description" content="Read our technical blog for DevOps guides, cron loops, script isolations, and serverless best practices." />
            <link rel="canonical" href="https://apicoolie.stackinfi.in/blog" />
            <meta property="og:title" content="Engineering Blog | Api Coolie" />
            <meta property="og:description" content="Read our technical blog for DevOps guides, cron loops, script isolations, and serverless best practices." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://apicoolie.stackinfi.in/blog" />
            <meta property="og:image" content="https://apicoolie.stackinfi.in/api-coolie-og.webp" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Engineering Blog | Api Coolie" />
            <meta name="twitter:description" content="Read our technical blog for DevOps guides, cron loops, script isolations, and serverless best practices." />
            <meta name="twitter:image" content="https://apicoolie.stackinfi.in/api-coolie-og.webp" />
          </Helmet>
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
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">{post.summary}</p>
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
