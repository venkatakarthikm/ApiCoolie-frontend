import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../utils/formatters.js';

/**
 * Reusable Copy Button. Swaps icon to Check on click and provides a momentary success status.
 */
export function CopyButton({ value, className = '', label = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    if (!value) return;

    const textToCopy = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 p-1.5 rounded-md hover:bg-muted/20 active:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground focus:outline-none ${className}`}
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-500 animate-scale" />
          {label && <span className="text-xs text-green-500 font-medium">Copied!</span>}
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {label && <span className="text-xs font-medium">{label}</span>}
        </>
      )}
    </button>
  );
}
