import React, { useState, useEffect } from 'react';
import { Plus, Trash, CheckSquare, Square, ClipboardPaste } from 'lucide-react';
import { apiClient } from '../utils/apiClient.js';
import { Button } from './ui/Button.jsx';

export function HeaderBuilder({ headers, onChange }) {
  const [mode, setMode] = useState('structured'); // 'structured' | 'raw'
  const [rawText, setRawText] = useState('');
  const [parseError, setParseError] = useState('');
  const [parsing, setParsing] = useState(false);

  // Sync headers object to raw string on load/change
  useEffect(() => {
    if (headers && headers.length > 0) {
      const lines = headers.map(h => `${h.key}: ${h.value}`);
      setRawText(lines.join('\n'));
    } else {
      setRawText('');
    }
  }, [headers]);

  const handleAddRow = () => {
    const updated = [...headers, { key: '', value: '', enabled: true }];
    onChange(updated);
  };

  const handleRemoveRow = (index) => {
    const updated = headers.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleRowChange = (index, field, val) => {
    const updated = headers.map((h, i) => {
      if (i === index) {
        return { ...h, [field]: val };
      }
      return h;
    });
    onChange(updated);
  };

  const handleParseRawText = async () => {
    if (!rawText.trim()) {
      onChange([]);
      return;
    }
    setParsing(true);
    setParseError('');

    try {
      // Validate headers parser endpoint
      const result = await apiClient.post('/jobs/parse-headers', { rawHeadersText: rawText });
      onChange(result);
    } catch (err) {
      setParseError('Failed to parse raw headers formatting.');
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode selectors */}
      <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('structured')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
              mode === 'structured'
                ? 'bg-primary/10 border-primary/20 text-primary'
                : 'border-border/60 hover:bg-muted/15 text-muted-foreground'
            }`}
          >
            Structured Rows
          </button>
          <button
            type="button"
            onClick={() => setMode('raw')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
              mode === 'raw'
                ? 'bg-primary/10 border-primary/20 text-primary'
                : 'border-border/60 hover:bg-muted/15 text-muted-foreground'
            }`}
          >
            Raw Paste Textarea
          </button>
        </div>
        <span className="text-[10px] text-muted-foreground uppercase font-bold">HTTP Headers</span>
      </div>

      {/* Structured Rows view */}
      {mode === 'structured' && (
        <div className="space-y-2">
          {headers.length === 0 ? (
            <p className="text-xs text-muted-foreground italic text-center py-4">No headers configured. Add headers below or paste raw values.</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {headers.map((row, idx) => (
                <div key={idx} className="flex gap-2.5 items-center">
                  <button
                    type="button"
                    onClick={() => handleRowChange(idx, 'enabled', !row.enabled)}
                    className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                    title={row.enabled ? 'Disable header' : 'Enable header'}
                  >
                    {row.enabled ? <CheckSquare className="h-4.5 w-4.5" /> : <Square className="h-4.5 w-4.5" />}
                  </button>
                  <input
                    type="text"
                    placeholder="Key (e.g. Content-Type)"
                    value={row.key}
                    onChange={(e) => handleRowChange(idx, 'key', e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={row.value}
                    onChange={(e) => handleRowChange(idx, 'value', e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(idx)}
                    className="text-red-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={handleAddRow}
            className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline mt-2 px-1"
          >
            <Plus className="h-3.5 w-3.5" /> Add custom header
          </button>
        </div>
      )}

      {/* Raw Paste Textarea view */}
      {mode === 'raw' && (
        <div className="space-y-3">
          {parseError && (
            <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] rounded-lg">
              {parseError}
            </div>
          )}
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            onBlur={handleParseRawText}
            rows={5}
            placeholder="Paste raw headers. Supporting format key: value or curl -H 'key: value' lines."
            className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono resize-none"
          />
          <div className="flex justify-between items-center text-[10px] text-muted-foreground px-1">
            <span>Saves automatically when you click outside (blur).</span>
            <Button
              variant="outline"
              loading={parsing}
              onClick={handleParseRawText}
              className="py-1 px-3 text-[10px]"
            >
              Parse now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
