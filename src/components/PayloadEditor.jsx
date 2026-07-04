import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Plus, Trash, Eye } from 'lucide-react';
import { formatForDisplay } from '../utils/formatters.js';

export function PayloadEditor({
  method,
  url,
  headers,
  payloadType,
  payload,
  onChangeType,
  onChangePayload
}) {
  const [activeTab, setActiveTab] = useState(payloadType || 'none');
  const [formRows, setFormRows] = useState([]);

  // Sync state tab type
  useEffect(() => {
    setActiveTab(payloadType);
    if (payloadType === 'form') {
      try {
        const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
        if (parsed && typeof parsed === 'object') {
          const rows = Object.entries(parsed).map(([k, v]) => ({ key: k, value: String(v) }));
          setFormRows(rows);
        } else {
          setFormRows([]);
        }
      } catch (e) {
        setFormRows([]);
      }
    }
  }, [payloadType, payload]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    onChangeType(tab);
    if (tab === 'none') {
      onChangePayload('');
    } else if (tab === 'json') {
      onChangePayload('{\n  \n}');
    } else if (tab === 'form') {
      onChangePayload('{}');
      setFormRows([]);
    } else {
      onChangePayload('');
    }
  };

  const handleAddFormRow = () => {
    const updated = [...formRows, { key: '', value: '' }];
    setFormRows(updated);
    saveFormRows(updated);
  };

  const handleRemoveFormRow = (idx) => {
    const updated = formRows.filter((_, i) => i !== idx);
    setFormRows(updated);
    saveFormRows(updated);
  };

  const handleFormRowChange = (idx, field, val) => {
    const updated = formRows.map((r, i) => {
      if (i === idx) {
        return { ...r, [field]: val };
      }
      return r;
    });
    setFormRows(updated);
    saveFormRows(updated);
  };

  const saveFormRows = (rows) => {
    const obj = {};
    rows.forEach(r => {
      if (r.key) obj[r.key] = r.value;
    });
    onChangePayload(JSON.stringify(obj));
  };

  // Build live preview metadata
  const getHeadersText = () => {
    const lines = headers
      .filter(h => h.enabled && h.key)
      .map(h => `${h.key}: ${h.value}`);
    return lines.join('\n');
  };

  return (
    <div className="space-y-4">
      {/* Editor selector tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/40 pb-2 gap-2">
        <div className="flex flex-wrap gap-1.5">
          {['none', 'json', 'form', 'raw'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabChange(tab)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border uppercase transition-colors ${
                activeTab === tab
                  ? 'bg-primary/10 border-primary/20 text-primary'
                  : 'border-border/60 hover:bg-muted/15 text-muted-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-muted-foreground uppercase font-bold">Request Body</span>
      </div>

      {/* Editor Content Panels */}
      <div className="min-h-[160px] border border-border/40 rounded-xl overflow-hidden bg-card">
        {activeTab === 'none' && (
          <div className="p-12 text-center text-xs text-muted-foreground italic">
            This request will not send an HTTP body (Payload: none).
          </div>
        )}

        {activeTab === 'json' && (
          <div className="h-44 border-b border-border/30">
            <Editor
              height="100%"
              language="json"
              theme="vs-dark"
              value={typeof payload === 'object' ? JSON.stringify(payload, null, 2) : payload}
              onChange={onChangePayload}
              options={{
                minimap: { enabled: false },
                fontSize: 11,
                lineNumbers: 'on',
                folding: false,
                lineDecorationsWidth: 4,
              }}
            />
          </div>
        )}

        {activeTab === 'form' && (
          <div className="p-4 space-y-3">
            {formRows.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center py-4">No form parameters. Add row keys below.</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {formRows.map((row, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Param Key"
                      value={row.key}
                      onChange={(e) => handleFormRowChange(idx, 'key', e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={row.value}
                      onChange={(e) => handleFormRowChange(idx, 'value', e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFormRow(idx)}
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
              onClick={handleAddFormRow}
              className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline px-1"
            >
              <Plus className="h-3.5 w-3.5" /> Add form param
            </button>
          </div>
        )}

        {activeTab === 'raw' && (
          <textarea
            value={payload}
            onChange={(e) => onChangePayload(e.target.value)}
            rows={6}
            placeholder="Write raw text request payload body here..."
            className="w-full h-full p-3 border-0 rounded-0 text-xs bg-background focus:outline-none font-mono resize-none"
          />
        )}
      </div>

      {/* Live Request Preview (Visual Feedback) */}
      <div className="border border-border/40 rounded-xl overflow-hidden bg-muted/5 space-y-2">
        <div className="px-3 py-2 bg-muted/20 border-b border-border/40 flex items-center gap-2 text-xs font-bold text-muted-foreground">
          <Eye className="h-4 w-4 text-primary" />
          <span>HTTP Request Preview</span>
        </div>
        <div className="p-3 text-[10px] font-mono text-muted-foreground space-y-2 select-text overflow-x-auto leading-relaxed">
          <div>
            <span className="text-primary font-bold">{method || 'GET'}</span>{' '}
            <span className="text-foreground font-semibold">{url || 'https://api.domain.com/endpoint'}</span>
          </div>
          {getHeadersText() && (
            <div className="border-l-2 border-primary/20 pl-2 text-muted-foreground/80 whitespace-pre">
              {getHeadersText()}
            </div>
          )}
          {activeTab !== 'none' && payload && (
            <div className="border-t border-border/20 pt-2 text-foreground/70 whitespace-pre max-h-24 overflow-y-auto">
              {formatForDisplay(payload)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
