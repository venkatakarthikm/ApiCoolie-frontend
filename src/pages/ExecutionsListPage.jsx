import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ListSkeleton } from '../components/ui/Skeleton.jsx';
import { Activity, Search, AlertCircle, RefreshCw, Clock } from 'lucide-react';
import { apiClient } from '../utils/apiClient.js';

export function ExecutionsListPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: executions, isLoading, error, refetch } = useQuery({
    queryKey: ['global-executions', statusFilter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      return apiClient.get(`/executions?${params.toString()}`);
    },
    refetchInterval: 30000,
  });

  const filteredList = (executions || []).filter(ex => {
    if (!searchTerm.trim()) return true;
    return ex.job?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-scale">
      <Helmet>
        <title>Executions Activity | Api Coolie</title>
      </Helmet>

      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-bold font-sans">Global Run Executions</h1>
          <p className="text-xs text-muted-foreground">Monitor recent runs and status updates across all your scheduled jobs.</p>
        </div>
        <button
          onClick={() => refetch()}
          className="p-2 border border-border/40 hover:bg-muted/10 rounded-lg text-muted-foreground transition-colors"
          title="Refresh List"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-3 items-center text-xs bg-muted/5 p-4 rounded-xl border border-border/40 justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex flex-col gap-1">
            <span className="font-bold text-[9px] uppercase text-muted-foreground px-1">Filter Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-border rounded-lg bg-background font-medium focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-bold text-[9px] uppercase text-muted-foreground px-1">Search Job Name</span>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search job..."
                className="pl-8 pr-3 py-1.5 border border-border rounded-lg bg-background font-medium focus:outline-none w-48 text-xs"
              />
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to retrieve executions list: {error.message}</span>
        </div>
      )}

      {isLoading ? (
        <ListSkeleton />
      ) : filteredList.length === 0 ? (
        <div className="p-12 border border-dashed border-border rounded-2xl text-center bg-card text-muted-foreground italic text-xs">
          No execution logs found.
        </div>
      ) : (
        <div className="border border-border/40 rounded-2xl bg-card overflow-hidden shadow-sm">
          <div className="divide-y divide-border/30">
            {filteredList.map((ex) => (
              <div
                key={ex.id}
                className="p-4 flex justify-between items-center gap-4 text-xs hover:bg-muted/5 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      ex.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="font-bold text-foreground">
                      {ex.job?.name || 'Deleted Job'}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono uppercase bg-muted/15 border border-border/35 px-1.5 py-0.5 rounded">
                      {ex.job?.jobType || 'unknown'}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      ({ex.triggerType} run, {ex.durationMs || 0}ms)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{ex.startedAt ? new Date(ex.startedAt).toLocaleString() : '--'}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/jobs/${ex.jobId}/executions/${ex.id}`)}
                  className="text-xs text-primary font-bold hover:underline shrink-0"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
