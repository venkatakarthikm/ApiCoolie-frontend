import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { ListSkeleton } from '../components/ui/Skeleton.jsx';
import { AlertCircle, RefreshCw, Clock, ShieldAlert } from 'lucide-react';
import { apiClient } from '../utils/apiClient.js';

export function ActivityLogPage() {
  const { data: logs, isLoading, error, refetch } = useQuery({
    queryKey: ['audit-activity'],
    queryFn: () => apiClient.get('/jobs/activity'),
  });

  const getActionColor = (action) => {
    if (action.includes('CREATE')) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (action.includes('DELETE')) return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
    if (action.includes('UPDATE') || action.includes('PAUSE') || action.includes('RESUME')) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-muted-foreground bg-muted/15 border-border/40';
  };

  return (
    <div className="space-y-6 animate-scale">
      <Helmet>
        <title>Audit Logs | Api Coolie</title>
      </Helmet>

      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-bold font-sans">Activity Log & Audit Records</h1>
          <p className="text-xs text-muted-foreground">Keep track of key changes, operations, and events on your jobs and account resources.</p>
        </div>
        <button
          onClick={() => refetch()}
          className="p-2 border border-border/40 hover:bg-muted/10 rounded-lg text-muted-foreground transition-colors"
          title="Refresh Log"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to retrieve audit log records: {error.message}</span>
        </div>
      )}

      {isLoading ? (
        <ListSkeleton />
      ) : !logs || logs.length === 0 ? (
        <div className="p-12 border border-dashed border-border rounded-2xl text-center bg-card text-muted-foreground italic text-xs">
          No audit log events recorded yet.
        </div>
      ) : (
        <div className="border border-border/40 rounded-2xl bg-card overflow-hidden shadow-sm">
          <div className="divide-y divide-border/30">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 flex justify-between items-center gap-4 text-xs hover:bg-muted/5 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                    <span className="font-semibold text-foreground">
                      Target: {log.entity} ({log.meta?.name || log.entityId || 'system'})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{log.createdAt ? new Date(log.createdAt).toLocaleString() : '--'}</span>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-muted-foreground bg-muted/10 border border-border/40 px-2 py-1 rounded max-w-[200px] truncate">
                  IP: {log.ipAddress || 'System'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
