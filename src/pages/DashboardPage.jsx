import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  CalendarDays,
  Zap,
  Activity,
  AlertTriangle,
  Play,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Globe,
  Code2,
} from 'lucide-react';
import { apiClient } from '../utils/apiClient.js';
import { DashboardSkeleton } from '../components/ui/Skeleton.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export function DashboardPage() {
  const navigate = useNavigate();

  const { data: jobs, isLoading: loadingJobs } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => apiClient.get('/jobs'),
    refetchInterval: 30000,
  });

  const { data: executions, isLoading: loadingExecutions } = useQuery({
    queryKey: ['recent-executions'],
    queryFn: async () => {
      if (!jobs || jobs.length === 0) return [];
      const jobIds = jobs.slice(0, 5).map(j => j.id);
      const results = await Promise.all(
        jobIds.map(id => apiClient.get(`/jobs/${id}/executions?limit=5`))
      );
      return results.flat().sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
    },
    enabled: !!jobs && jobs.length > 0,
    refetchInterval: 30000,
  });

  const isLoading = loadingJobs || loadingExecutions;

  if (isLoading) return <DashboardSkeleton />;

  const activeJobs = jobs?.filter(j => j.status === 'active') || [];
  const failedExecutions = executions?.filter(e => e.status === 'failed') || [];

  // Empty Onboarding State
  if (jobs && jobs.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-12 space-y-8 animate-scale">
        <Helmet><title>Dashboard | Api Coolie</title></Helmet>
        <div className="text-center space-y-4">
          <Sparkles className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <h2 className="text-3xl font-extrabold tracking-tight font-sans">Welcome to Api Coolie</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            You don't have any scheduled tasks yet. Create your first Porter job under 30 seconds.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border border-border/40 bg-card rounded-2xl space-y-4 hover:border-primary/45 transition-colors">
            <h3 className="text-lg font-bold">Call an API on a schedule</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Configure HTTP headers, dynamic JSON payloads, timeouts, and triggers.
            </p>
            <Link to="/jobs/new?type=api" className="inline-block pt-2">
              <Button variant="primary" className="text-xs">
                Create API Scheduler <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <div className="p-6 border border-border/40 bg-card rounded-2xl space-y-4 hover:border-primary/45 transition-colors">
            <h3 className="text-lg font-bold">Run code on a schedule</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Write sandboxed JavaScript or Python. Runs locally — no external service, no rate limits.
            </p>
            <Link to="/jobs/new?type=code" className="inline-block pt-2">
              <Button variant="primary" className="text-xs">
                Create Code Runner <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const successRate = executions && executions.length > 0
    ? Math.round((executions.filter(e => e.status === 'success').length / executions.length) * 100)
    : 100;

  const avgDuration = executions && executions.length > 0
    ? Math.round(executions.reduce((sum, e) => sum + (e.durationMs || 0), 0) / executions.length)
    : 0;

  const chartData = executions
    ? [...executions].reverse().slice(-10).map(e => ({
      time: new Date(e.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: e.durationMs || 0,
    }))
    : [];

  // Sort jobs by most recently updated/run
  const recentJobs = [...(jobs || [])].sort((a, b) =>
    new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
  ).slice(0, 5);

  return (
    <div className="space-y-8 animate-scale">
      <Helmet><title>Dashboard | Api Coolie</title></Helmet>

      {/* KPI metrics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 border border-border/40 rounded-2xl bg-card flex items-center justify-between shadow-sm">
          <div className="space-y-1.5">
            <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Jobs</span>
            <span className="text-2xl font-extrabold leading-none">
              {activeJobs.length} <span className="text-xs text-muted-foreground font-normal">/ {jobs.length} total</span>
            </span>
          </div>
          <div className="p-3 bg-primary/10 rounded-xl text-primary"><CalendarDays className="h-5 w-5" /></div>
        </div>

        <div className="p-5 border border-border/40 rounded-2xl bg-card flex items-center justify-between shadow-sm">
          <div className="space-y-1.5">
            <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Success Rate</span>
            <span className={`text-2xl font-extrabold leading-none ${successRate < 80 ? 'text-red-500' : 'text-green-500'}`}>
              {successRate}%
            </span>
          </div>
          <div className="p-3 bg-primary/10 rounded-xl text-primary"><Zap className="h-5 w-5" /></div>
        </div>

        <div className="p-5 border border-border/40 rounded-2xl bg-card flex items-center justify-between shadow-sm">
          <div className="space-y-1.5">
            <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Avg Latency</span>
            <span className="text-2xl font-extrabold leading-none">{avgDuration}ms</span>
          </div>
          <div className="p-3 bg-primary/10 rounded-xl text-primary"><Activity className="h-5 w-5" /></div>
        </div>

        <div className="p-5 border border-border/40 rounded-2xl bg-card flex items-center justify-between shadow-sm">
          <div className="space-y-1.5">
            <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Failed Logs</span>
            <span className={`text-2xl font-extrabold leading-none ${failedExecutions.length > 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
              {failedExecutions.length}
            </span>
          </div>
          <div className="p-3 bg-primary/10 rounded-xl text-primary"><AlertTriangle className="h-5 w-5" /></div>
        </div>
      </div>

      {/* Recent Jobs — full-width horizontal cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Recent Jobs</h3>
          <Link to="/jobs" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentJobs.map(job => {
            const lastRun = job.executions?.[0];
            const isRunning = job.currentRunStatus === 'running';
            
            const getScheduleText = (j) => {
              if (j.scheduleType === 'manual_only') return 'Manual Trigger';
              if (j.scheduleType === 'interval' && j.intervalMs) {
                return `Every ${Number(j.intervalMs) / 1000}s`;
              }
              if (j.scheduleType === 'weekly_days' && j.weeklyDays) {
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const activeDays = j.weeklyDays.map(d => days[d]).join(', ');
                return `Weekly [${activeDays}] at ${j.runTime}`;
              }
              if (j.scheduleType === 'cron' && j.cronExpression) {
                return `Cron: ${j.cronExpression}`;
              }
              return 'Not configured';
            };

            return (
              <div
                key={job.id}
                onClick={() => navigate(`/jobs/${job.id}`)}
                className="p-6 border border-border/40 bg-card rounded-2xl hover:border-primary/50 hover:shadow-md cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-4 group relative overflow-hidden"
              >
                {/* Header: Type, Status, Name, Description */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border font-mono tracking-wider ${
                      job.jobType === 'code' ? 'bg-purple-500/10 border-purple-500/20 text-purple-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                    }`}>
                      {job.jobType}
                    </span>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border shrink-0 ${
                      job.status === 'active'
                        ? 'bg-green-500/10 border-green-500/20 text-green-500'
                        : 'bg-muted/30 border-border text-muted-foreground'
                    }`}>{job.status}</span>
                  </div>

                  <h4 className="text-base font-extrabold text-foreground group-hover:text-primary transition-colors truncate">
                    {job.name}
                  </h4>
                  {job.description ? (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{job.description}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground/40 italic">No description provided</p>
                  )}
                </div>

                {/* Middle: Schedule Info */}
                <div className="space-y-1.5 text-[11px] text-muted-foreground border-t border-border/20 pt-3">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <CalendarDays className="h-3.5 w-3.5 text-primary" />
                    <span>{getScheduleText(job)}</span>
                  </div>
                  {job.status === 'active' && job.nextRunAt && (
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
                      <span>Next: {new Date(job.nextRunAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Footer: Health Dots, Last Run & Latency */}
                <div className="pt-3 border-t border-border/20 flex items-center justify-between gap-4">
                  {/* Execution history dots */}
                  <div className="flex items-center gap-1">
                    {job.executions && job.executions.length > 0 ? (
                      job.executions.slice(0, 5).map(ex => (
                        <span
                          key={ex.id}
                          className={`w-2.5 h-2.5 rounded-full ${ex.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                          title={`${ex.status} (${ex.durationMs || 0}ms)`}
                        />
                      ))
                    ) : (
                      <span className="text-[10px] text-muted-foreground/40 italic font-medium">No history</span>
                    )}
                  </div>

                  {/* Last Run Stats */}
                  <div className="text-right shrink-0">
                    {lastRun ? (
                      <div className="flex flex-col items-end gap-0.5">
                        <span className={`text-[10px] font-bold uppercase ${lastRun.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                          {lastRun.status}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono font-bold">
                          {lastRun.durationMs || 0}ms
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-muted-foreground/40 italic font-medium">No runs</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="p-6 border border-border/40 bg-card rounded-2xl shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Execution Speed Latency (ms)</h3>
          <div className="h-56">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8E70CF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8E70CF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fontSize: 9 }} stroke="var(--border)" />
                  <YAxis tick={{ fontSize: 9 }} stroke="var(--border)" />
                  <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
                  <Area type="monotone" dataKey="duration" stroke="#8E70CF" fillOpacity={1} fill="url(#colorDuration)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-muted-foreground italic text-center py-16">No execution trends to visualize.</p>
            )}
          </div>
        </div>

        {/* Recent Execution Logs */}
        <div className="p-6 border border-border/40 bg-card rounded-2xl shadow-sm flex flex-col">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Recent Execution Logs</h3>
          {executions && executions.length > 0 ? (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 flex-grow">
              {executions.slice(0, 10).map((ex) => {
                const jobName = jobs?.find(j => j.id === ex.jobId)?.name || ex.jobId.slice(0, 8);
                return (
                  <div
                    key={ex.id}
                    onClick={() => navigate(`/jobs/${ex.jobId}/executions/${ex.id}`)}
                    className="flex items-center justify-between p-3 border border-border/30 rounded-xl hover:bg-muted/5 hover:border-primary/20 cursor-pointer transition-all text-xs group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${ex.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <span className="font-bold text-foreground block leading-tight">{jobName}</span>
                        <span className="text-[10px] text-muted-foreground">{new Date(ex.startedAt).toLocaleString()} · {ex.durationMs || 0}ms</span>
                      </div>
                    </div>
                    <ArrowRight className="h-3 w-3 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic text-center py-8">Waiting for schedules to trigger logs...</p>
          )}
        </div>
      </div>

    </div>
  );
}
