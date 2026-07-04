import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Terminal, Clock, ShieldCheck, AlertCircle, Copy, Loader2 } from 'lucide-react';
import { apiClient } from '../utils/apiClient.js';
import { CopyButton } from './CopyButton.jsx';
import { formatForDisplay } from '../utils/formatters.js';

export function RunOutputPanel({ executionId, onClose }) {
  const [elapsed, setElapsed] = useState(0);

  // Poll execution status while it is queued or running
  const { data: execution, error } = useQuery({
    queryKey: ['execution-run', executionId],
    queryFn: () => apiClient.get(`/executions/${executionId}`),
    refetchInterval: (query) => {
      const state = query.state.data;
      if (state && ['success', 'failed'].includes(state.status)) {
        return false;
      }
      return 1500; // Poll every 1.5s
    },
    enabled: !!executionId,
  });

  const isRunning = execution && ['queued', 'running'].includes(execution.status);

  // Timer simulation during running state
  useEffect(() => {
    let timer;
    if (isRunning) {
      const started = execution.startedAt ? new Date(execution.startedAt).getTime() : Date.now();
      timer = setInterval(() => {
        setElapsed(Math.round((Date.now() - started) / 1000));
      }, 1000);
    } else {
      setElapsed(0);
    }
    return () => clearInterval(timer);
  }, [isRunning, execution]);

  if (error) {
    return (
      <div className="p-4 border border-red-500/20 bg-red-500/5 text-red-500 text-xs rounded-xl flex items-center gap-2">
        <AlertCircle className="h-4.5 w-4.5" />
        <span>Failed to load run details: {error.message}</span>
      </div>
    );
  }

  if (!execution) {
    return (
      <div className="p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span>Retrieving execution logs...</span>
      </div>
    );
  }

  // Determine status color codes
  const statusStyles = {
    queued: 'bg-muted/20 border-border text-muted-foreground',
    running: 'bg-primary/10 border-primary/20 text-primary animate-pulse',
    success: 'bg-green-500/10 border-green-500/20 text-green-500',
    failed: 'bg-red-500/10 border-red-500/20 text-red-500',
  };

  const formattedResponse = formatForDisplay(execution.responseBody || '');
  const formattedHeaders = execution.responseHeaders ? formatForDisplay(execution.responseHeaders) : '';

  return (
    <div className="border border-border/40 rounded-xl bg-card overflow-hidden flex flex-col h-full">
      {/* Header bar */}
      <div className="px-4 py-3 bg-muted/20 border-b border-border/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-4.5 w-4.5 text-primary" />
          <span className="text-xs font-bold font-mono">Run Output Logs</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Status pill */}
          <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${statusStyles[execution.status]}`}>
            {execution.status}
          </span>
          {onClose && (
            <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">
              Close
            </button>
          )}
        </div>
      </div>

      {/* Log body content */}
      <div className="p-4 flex-1 space-y-4 overflow-y-auto text-xs font-mono min-h-[250px] max-h-[500px]">
        {/* Timing parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-b border-border/30 pb-4 text-muted-foreground">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider">Trigger</span>
            <span className="text-foreground capitalize">{execution.triggerType}</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider">Duration</span>
            <span className="text-foreground">
              {isRunning ? `${elapsed}s elapsed` : `${execution.durationMs || 0}ms`}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="block text-[10px] font-bold uppercase tracking-wider">HTTP Code</span>
            <span className="text-foreground">{execution.statusCode || '--'}</span>
          </div>
        </div>

        {/* Errors/Stdout panels */}
        {execution.errorMessage && (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-red-500 font-bold">
              <span>Error/stderr:</span>
              <CopyButton value={execution.errorMessage} />
            </div>
            <pre className="p-3 bg-red-500/5 border border-red-500/10 text-red-500 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {execution.errorMessage}
            </pre>
          </div>
        )}

        {/* Body content */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-foreground font-bold">
            <span>Response Body/stdout:</span>
            {execution.responseBody && <CopyButton value={execution.responseBody} />}
          </div>
          {execution.responseBody ? (
            <pre className="p-3 bg-muted/5 border border-border/40 rounded-lg overflow-x-auto leading-relaxed text-muted-foreground max-h-60 overflow-y-auto">
              {formattedResponse}
            </pre>
          ) : (
            <p className="text-muted-foreground italic">No response body captured.</p>
          )}
        </div>

        {/* Headers content (API only) */}
        {formattedHeaders && (
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between items-center text-foreground font-bold">
              <span>Response Headers:</span>
              <CopyButton value={execution.responseHeaders} />
            </div>
            <pre className="p-3 bg-muted/5 border border-border/40 rounded-lg overflow-x-auto leading-relaxed text-muted-foreground max-h-40 overflow-y-auto">
              {formattedHeaders}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
