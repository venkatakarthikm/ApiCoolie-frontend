import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Terminal, Clock, ShieldCheck, AlertCircle, Copy, Loader2, Cpu } from 'lucide-react';
import { apiClient } from '../utils/apiClient.js';
import { CopyButton } from '../components/CopyButton.jsx';
import { AIInsightsAssistant } from '../components/AIInsightsAssistant.jsx';
import { formatForDisplay } from '../utils/formatters.js';

export function ExecutionDetailsPage() {
  const { id: jobId, executionId } = useParams();
  const navigate = useNavigate();

  // Fetch execution details
  const { data: execution, isLoading, error } = useQuery({
    queryKey: ['execution-details', executionId],
    queryFn: () => apiClient.get(`/executions/${executionId}`),
    enabled: !!executionId,
  });

  // Fetch job details (to display job name)
  const { data: job } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => apiClient.get(`/jobs/${jobId}`),
    enabled: !!jobId,
  });

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-2 text-xs text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span>Retrieving run details...</span>
      </div>
    );
  }

  if (error || !execution) {
    return (
      <div className="p-4 border border-red-500/20 bg-red-500/5 text-red-500 text-xs rounded-xl flex items-center gap-2 max-w-xl mx-auto my-12">
        <AlertCircle className="h-4.5 w-4.5" />
        <span>Failed to load execution details: {error?.message || 'Not found'}</span>
      </div>
    );
  }

  const statusStyles = {
    queued: 'bg-muted/20 border-border text-muted-foreground',
    running: 'bg-primary/10 border-primary/20 text-primary animate-pulse',
    success: 'bg-green-500/10 border-green-500/20 text-green-500',
    failed: 'bg-red-500/10 border-red-500/20 text-red-500',
  };

  const formattedResponse = formatForDisplay(execution.responseBody || '');
  const formattedHeaders = execution.responseHeaders ? formatForDisplay(execution.responseHeaders) : '';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-scale">
      <Helmet>
        <title>Execution Details | Api Coolie</title>
      </Helmet>

      {/* Breadcrumb Header */}
      <div className="flex items-center gap-3 border-b border-border/40 pb-4">
        <button
          onClick={() => navigate(`/jobs/${jobId}/history`)}
          className="p-1.5 border border-border/60 hover:bg-muted/10 rounded-lg text-muted-foreground hover:text-foreground"
          title="Back to Job History"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold font-sans">Run Execution Logs</h1>
          <span className="text-xs text-muted-foreground">
            Job: <Link to={`/jobs/${jobId}`} className="text-primary hover:underline font-semibold">{job?.name || jobId}</Link>
          </span>
        </div>
      </div>

      {/* Main execution metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 border border-border/40 bg-card rounded-2xl shadow-sm text-xs">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Status</span>
          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase ${statusStyles[execution.status]}`}>
            {execution.status}
          </span>
        </div>
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Trigger</span>
          <span className="text-foreground capitalize font-semibold">{execution.triggerType}</span>
        </div>
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Duration</span>
          <span className="text-foreground font-semibold flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            {execution.durationMs !== null ? `${execution.durationMs}ms` : '--'}
          </span>
        </div>
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">HTTP / Exit Code</span>
          <span className="text-foreground font-semibold font-mono">
            {execution.statusCode !== null ? execution.statusCode : '--'}
          </span>
        </div>
      </div>

      {/* Stdout Console / Error messages block */}
      <div className="border border-border/40 bg-card rounded-2xl overflow-hidden shadow-sm flex flex-col">
        <div className="px-4 py-3 bg-muted/20 border-b border-border/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-4.5 w-4.5 text-primary" />
            <span className="text-xs font-bold font-mono">Console Logs & Diagnostics</span>
          </div>
          {execution.errorMessage && (
            <span className="text-[10px] text-red-500 font-bold bg-red-500/10 px-2.5 py-0.5 border border-red-500/15 rounded-full">
              Terminated with Error
            </span>
          )}
        </div>
        
        <div className="p-4 bg-muted/5 font-mono text-xs overflow-x-auto min-h-[120px] max-h-[300px]">
          {execution.errorMessage ? (
            <pre className="text-red-400 whitespace-pre-wrap">{execution.errorMessage}</pre>
          ) : execution.status === 'queued' ? (
            <span className="text-muted-foreground italic">Task enqueued. Waiting to trigger...</span>
          ) : execution.status === 'running' ? (
            <span className="text-primary italic animate-pulse">Running execution script...</span>
          ) : (
            <pre className="text-foreground whitespace-pre-wrap">
              [System Log] Execution started at {new Date(execution.startedAt).toLocaleString()}
              {`\n`}[System Log] Status: SUCCESS ({execution.statusCode || 200})
              {`\n`}[System Log] Finished in {execution.durationMs}ms.
            </pre>
          )}
        </div>
      </div>

      {/* Response payload panels (only if response was stored) */}
      {execution.responseStored && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Response Payload */}
          <div className="border border-border/40 bg-card rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="px-4 py-3 bg-muted/20 border-b border-border/40 flex items-center justify-between">
              <span className="text-xs font-bold font-mono">Response payload</span>
              <CopyButton value={formattedResponse} label="Copy payload" />
            </div>
            <div className="p-4 overflow-x-auto max-h-72 bg-muted/5 font-mono text-xs">
              <pre className="text-foreground whitespace-pre-wrap">{formattedResponse || '[Empty response]'}</pre>
            </div>
          </div>

          {/* Response Headers */}
          <div className="border border-border/40 bg-card rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="px-4 py-3 bg-muted/20 border-b border-border/40 flex items-center justify-between">
              <span className="text-xs font-bold font-mono">Response Headers</span>
              <CopyButton value={formattedHeaders} label="Copy headers" />
            </div>
            <div className="p-4 overflow-x-auto max-h-72 bg-muted/5 font-mono text-xs">
              <pre className="text-foreground whitespace-pre-wrap">{formattedHeaders || '[No response headers]'}</pre>
            </div>
          </div>
        </div>
      )}

      {/* AI failure diagnostic panel */}
      {execution.status === 'failed' && (
        <div className="border border-border/40 bg-card rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border/40 pb-3">
            <Cpu className="h-5 w-5 text-primary animate-pulse" />
            <h3 className="text-sm font-bold font-sans">AI Diagnostic Assistant</h3>
          </div>
          <AIInsightsAssistant executionId={execution.id} />
        </div>
      )}

    </div>
  );
}
