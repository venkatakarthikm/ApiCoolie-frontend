import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Play,
  Pause,
  Trash2,
  Plus,
  Calendar,
  AlertCircle,
  List,
  Grid,
  Table as TableIcon,
  Clock,
  Activity,
  Globe,
  Code,
  Copy,
  AlertTriangle
} from 'lucide-react';
import { apiClient } from '../utils/apiClient.js';
import { showToast } from '../utils/toast.js';
import { ListSkeleton } from '../components/ui/Skeleton.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ConfirmModal } from '../components/ui/ConfirmModal.jsx';
import cronstrue from 'cronstrue';

export function JobsListPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [layout, setLayout] = useState('list'); // 'list' | 'grid' | 'table'
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'recycle'
  const [confirmPermanentDelete, setConfirmPermanentDelete] = useState(null);
  const [permanentDeleteText, setPermanentDeleteText] = useState('');

  // Fetch Jobs List
  const { data: rawJobs, isLoading, error } = useQuery({
    queryKey: ['jobs', filterType, filterStatus, activeTab],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filterType) params.append('type', filterType);
      if (filterStatus) params.append('status', filterStatus);
      if (activeTab === 'recycle') params.append('deleted', 'true');
      return apiClient.get(`/jobs?${params.toString()}`);
    },
  });

  // Sort jobs: recent edited first (using updatedAt, fallback to createdAt)
  const jobs = rawJobs ? [...rawJobs].sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt);
    const dateB = new Date(b.updatedAt || b.createdAt);
    return dateB - dateA;
  }) : [];

  // Pause mutation
  const pauseMutation = useMutation({
    mutationFn: (id) => apiClient.post(`/jobs/${id}/pause`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      showToast('Job paused successfully', 'success');
    },
    onError: () => {
      showToast('Failed to pause job', 'error');
    }
  });

  // Resume mutation
  const resumeMutation = useMutation({
    mutationFn: (id) => apiClient.post(`/jobs/${id}/resume`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      showToast('Job resumed successfully', 'success');
    },
    onError: () => {
      showToast('Failed to resume job', 'error');
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/jobs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      showToast('Job moved to recycle bin successfully', 'success');
    },
    onError: () => {
      showToast('Failed to delete job', 'error');
    }
  });

  // Restore mutation
  const restoreMutation = useMutation({
    mutationFn: (id) => apiClient.post(`/jobs/${id}/restore`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      showToast('Job restored from recycle bin successfully', 'success');
    },
    onError: (err) => {
      showToast(`Failed to restore job: ${err.message}`, 'error');
    }
  });

  // Permanent Delete mutation
  const permanentDeleteMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/jobs/${id}?permanent=true`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      showToast('Job permanently purged from system.', 'success');
      setConfirmPermanentDelete(null);
    },
    onError: (err) => {
      showToast(`Purge failed: ${err.message}`, 'error');
    }
  });

  // Trigger manual run mutation
  const runMutation = useMutation({
    mutationFn: (id) => apiClient.post(`/jobs/${id}/run`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      showToast('Manual trigger successful', 'success');
    },
    onError: () => {
      showToast('Failed to trigger job', 'error');
    }
  });

  const getScheduleText = (job) => {
    if (job.scheduleType === 'manual_only') return 'Manual Trigger only';
    if (job.scheduleType === 'interval' && job.intervalMs) {
      return `Every ${Number(job.intervalMs) / 1000}s`;
    }
    if (job.scheduleType === 'weekly_days' && job.weeklyDays) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const activeDays = job.weeklyDays.map(d => days[d]).join(', ');
      return `Weekly [${activeDays}] at ${job.runTime}`;
    }
    if (job.scheduleType === 'cron' && job.cronExpression) {
      try {
        return cronstrue.toString(job.cronExpression);
      } catch (e) {
        return `Cron: ${job.cronExpression}`;
      }
    }
    return 'Not configured';
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'active') {
      return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs px-2.5 py-1 rounded-full border font-bold uppercase';
    }
    if (status === 'paused') {
      return 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs px-2.5 py-1 rounded-full border font-bold uppercase';
    }
    return 'bg-muted/30 border-border text-muted-foreground text-xs px-2.5 py-1 rounded-full border font-bold uppercase';
  };

  return (
    <div className="space-y-6 animate-scale">
      <Helmet>
        <title>Schedules & Jobs | Api Coolie</title>
      </Helmet>

      {/* Header bar and additions */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold font-sans tracking-tight">Schedules & Job Lists</h1>
          <p className="text-sm text-muted-foreground">Manage your scheduled API requests and sandboxed logic runner routines.</p>
        </div>
        <Button variant="primary" className="text-xs flex items-center gap-1.5 px-4 py-2" onClick={() => navigate('/jobs/new')}>
          <Plus className="h-4.5 w-4.5" /> Create new Job
        </Button>
      </div>

      {/* Sub-tabs switcher */}
      <div className="flex gap-1.5 border-b border-border/40 pb-0 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 font-bold transition-all ${
            activeTab === 'active'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Active & Paused Jobs
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('recycle')}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 font-bold transition-all ${
            activeTab === 'recycle'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Recycle Bin (Deleted)
        </button>
      </div>

      {/* Filters selectors & Layout Picker bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-muted/5 p-4 rounded-2xl border border-border/40">
        <div className="flex flex-wrap gap-4 items-center text-xs">
          <div className="flex flex-col gap-1">
            <span className="font-bold text-[10px] uppercase text-muted-foreground px-1">Job Type</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 border border-border rounded-lg bg-background font-medium focus:outline-none text-xs"
            >
              <option value="">All Types</option>
              <option value="api">API Call</option>
              <option value="code">Code Runner</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-bold text-[10px] uppercase text-muted-foreground px-1">Status</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 border border-border rounded-lg bg-background font-medium focus:outline-none text-xs"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Layout selector */}
        <div className="flex items-center gap-1 bg-muted/20 border border-border/40 rounded-xl p-1">
          <button
            onClick={() => setLayout('list')}
            className={`p-1.5 rounded-lg transition-colors ${layout === 'list' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            title="List View"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setLayout('grid')}
            className={`p-1.5 rounded-lg transition-colors ${layout === 'grid' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            title="Grid View"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setLayout('table')}
            className={`p-1.5 rounded-lg transition-colors ${layout === 'table' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            title="Table View"
          >
            <TableIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Error handling */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to retrieve jobs list: {error.message}</span>
        </div>
      )}

      {/* Lists display */}
      {isLoading ? (
        <ListSkeleton />
      ) : jobs && jobs.length === 0 ? (
        <div className="p-12 border border-dashed border-border rounded-2xl text-center bg-card text-muted-foreground italic text-xs">
          No scheduled jobs match the selected filter conditions.
        </div>
      ) : (
        <>
          {/* LIST LAYOUT */}
          {layout === 'list' && (
            <div className="space-y-4">
              {jobs.map((job) => {
                const isJobRunning = job.currentRunStatus === 'running';
                const lastEditedDate = new Date(job.updatedAt || job.createdAt).toLocaleString();
                return (
                  <div
                    key={job.id}
                    onClick={activeTab === 'recycle' ? undefined : () => navigate(`/jobs/${job.id}`)}
                    className={`p-5 border rounded-2xl bg-card transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden group border-border/40 ${
                      activeTab === 'recycle' ? '' : 'hover:shadow-md hover:border-primary/40 cursor-pointer'
                    }`}
                  >
                    {/* Metadata */}
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          {job.name}
                        </span>

                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-muted/15 border border-border/40 text-muted-foreground font-mono">
                          {job.jobType}
                        </span>

                        <span className={getStatusBadgeClass(job.status)}>
                          {job.status}
                        </span>

                        {isJobRunning && (
                          <span className="text-xs text-primary font-bold flex items-center gap-1.5 ml-1">
                            <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
                            Running
                          </span>
                        )}
                      </div>

                      {job.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                          {job.description}
                        </p>
                      )}

                      <div className="flex items-center gap-6 text-[11px] text-muted-foreground font-semibold flex-wrap">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" /> {getScheduleText(job)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" /> Edited: {lastEditedDate}
                        </span>
                        {job.status === 'active' && job.nextRunAt && (
                          <span>Next Run: {new Date(job.nextRunAt).toLocaleString()}</span>
                        )}

                        {job.executions && job.executions.length > 0 && (
                          <div className="flex items-center gap-2 border-l border-border/65 pl-4">
                            <span>Health:</span>
                            <div className="flex gap-1.5 items-center">
                              {job.executions.slice(0, 5).map((ex) => (
                                <span
                                  key={ex.id}
                                  className={`w-2 h-2 rounded-full ${ex.status === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                  title={`${ex.status} run (${ex.durationMs || 0}ms)`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center" onClick={(e) => e.stopPropagation()}>
                      {activeTab === 'recycle' ? (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => restoreMutation.mutate(job.id)}
                            loading={restoreMutation.isLoading}
                            className="px-3 py-1.5 text-xs font-semibold text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/5 flex items-center gap-1"
                          >
                            Restore
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => {
                              setPermanentDeleteText('');
                              setConfirmPermanentDelete(job);
                            }}
                            className="px-3 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
                          >
                            Purge
                          </Button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); runMutation.mutate(job.id); }}
                            disabled={runMutation.isLoading}
                            className="p-2.5 border border-border/60 hover:bg-muted/10 active:scale-95 rounded-xl text-primary transition-all font-semibold text-xs flex items-center gap-1.5"
                            title="Trigger run manually"
                          >
                            <Play className="h-4 w-4 fill-current" />
                          </button>

                          {job.status === 'active' ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); pauseMutation.mutate(job.id); }}
                              className="p-2.5 border border-border/60 hover:bg-muted/10 active:scale-95 rounded-xl text-amber-500 transition-all font-semibold text-xs"
                              title="Pause schedule"
                            >
                              <Pause className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={(e) => { e.stopPropagation(); resumeMutation.mutate(job.id); }}
                              className="p-2.5 border border-border/60 hover:bg-muted/10 active:scale-95 rounded-xl text-emerald-500 transition-all font-semibold text-xs"
                              title="Resume schedule"
                            >
                              <Play className="h-4 w-4" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setConfirmDelete(job.id); }}
                            className="p-2.5 border border-border/60 hover:bg-red-500/10 active:scale-95 rounded-xl text-red-400 transition-all font-semibold text-xs"
                            title="Delete job"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* GRID LAYOUT */}
          {layout === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => {
                const isJobRunning = job.currentRunStatus === 'running';
                const lastEditedDate = new Date(job.updatedAt || job.createdAt).toLocaleDateString();
                return (
                  <div
                    key={job.id}
                    onClick={activeTab === 'recycle' ? undefined : () => navigate(`/jobs/${job.id}`)}
                    className={`border border-border/40 rounded-2xl bg-card p-6 flex flex-col justify-between space-y-4 transition-all relative overflow-hidden group ${
                      activeTab === 'recycle' ? '' : 'hover:shadow-md hover:border-primary/45 cursor-pointer'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold uppercase text-muted-foreground font-mono bg-muted/20 px-2 py-0.5 rounded border border-border/40">
                          {job.jobType}
                        </span>
                        <span className={getStatusBadgeClass(job.status)}>
                          {job.status}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-foreground truncate group-hover:text-primary transition-colors">
                        {job.name}
                      </h3>

                      {job.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {job.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 pt-2 border-t border-border/40">
                      <div className="space-y-1.5 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-1.5 truncate">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{getScheduleText(job)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Edited: {lastEditedDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1" onClick={(e) => e.stopPropagation()}>
                        {/* Health indicators */}
                        <div className="flex gap-1">
                          {job.executions?.slice(0, 4).map((ex) => (
                            <span
                              key={ex.id}
                              className={`w-2 h-2 rounded-full ${ex.status === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                            />
                          ))}
                        </div>

                        {activeTab === 'recycle' ? (
                          <div className="flex gap-1.5">
                            <Button
                              variant="outline"
                              onClick={() => restoreMutation.mutate(job.id)}
                              loading={restoreMutation.isLoading}
                              className="px-2.5 py-1 text-[10px] font-bold text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/5"
                            >
                              Restore
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => {
                                setPermanentDeleteText('');
                                setConfirmPermanentDelete(job);
                              }}
                              className="px-2.5 py-1 text-[10px] font-bold bg-red-600 hover:bg-red-700 text-white"
                            >
                              Purge
                            </Button>
                          </div>
                        ) : (
                          /* Quick run button */
                          <button
                            onClick={(e) => { e.stopPropagation(); runMutation.mutate(job.id); }}
                            disabled={runMutation.isLoading}
                            className="p-2 border border-border/60 hover:bg-muted/10 rounded-lg text-primary active:scale-95 transition-all"
                            title="Run manually"
                          >
                            <Play className="h-3.5 w-3.5 fill-current" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TABLE LAYOUT */}
          {layout === 'table' && (
            <div className="border border-border/40 rounded-2xl bg-card overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-muted/20 border-b border-border/40 text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      <th className="p-4 pl-6">Job Name</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Schedule</th>
                      <th className="p-4">Last Edited</th>
                      <th className="p-4 text-right pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {jobs.map((job) => {
                      const lastEditedDate = new Date(job.updatedAt || job.createdAt).toLocaleDateString();
                      return (
                        <tr
                          key={job.id}
                          onClick={activeTab === 'recycle' ? undefined : () => navigate(`/jobs/${job.id}`)}
                          className={`transition-colors group ${activeTab === 'recycle' ? '' : 'hover:bg-muted/5 cursor-pointer'}`}
                        >
                          <td className="p-4 pl-6 font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                            {job.name}
                          </td>
                          <td className="p-4 font-mono uppercase text-muted-foreground">{job.jobType}</td>
                          <td className="p-4">
                            <span className={getStatusBadgeClass(job.status)}>
                              {job.status}
                            </span>
                          </td>
                          <td className="p-4 text-muted-foreground font-semibold">
                            {getScheduleText(job)}
                          </td>
                          <td className="p-4 text-muted-foreground">{lastEditedDate}</td>
                          <td className="p-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                            {activeTab === 'recycle' ? (
                              <div className="inline-flex items-center gap-1.5">
                                <Button
                                  variant="outline"
                                  onClick={() => restoreMutation.mutate(job.id)}
                                  loading={restoreMutation.isLoading}
                                  className="px-2.5 py-1 text-[10px] font-bold text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/5"
                                >
                                  Restore
                                </Button>
                                <Button
                                  variant="danger"
                                  onClick={() => {
                                    setPermanentDeleteText('');
                                    setConfirmPermanentDelete(job);
                                  }}
                                  className="px-2.5 py-1 text-[10px] font-bold bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Purge
                                </Button>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => runMutation.mutate(job.id)}
                                  disabled={runMutation.isLoading}
                                  className="p-1.5 border border-border/60 hover:bg-muted/10 rounded-lg text-primary active:scale-95 transition-all"
                                  title="Run now"
                                >
                                  <Play className="h-3.5 w-3.5 fill-current" />
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(job.id)}
                                  className="p-1.5 border border-border/60 hover:bg-red-500/10 rounded-lg text-red-400 active:scale-95 transition-all"
                                  title="Delete"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Confirm Delete Modal (Soft Delete) */}
      <ConfirmModal
        isOpen={!!confirmDelete}
        title="Move job to Recycle Bin?"
        message="This will temporarily pause the job schedules and stop its Worker URLs. You can restore it from the Recycle Bin within 60 days before it is permanently deleted."
        confirmLabel="Move to Recycle Bin"
        cancelLabel="Keep Job"
        danger={true}
        onConfirm={() => {
          if (confirmDelete) deleteMutation.mutate(confirmDelete);
          setConfirmDelete(null);
        }}
        onCancel={() => setConfirmDelete(null)}
      />

      {/* Confirm Permanent Purge Modal */}
      {confirmPermanentDelete && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
        >
          <div
            className="bg-card border border-border/60 rounded-2xl shadow-2xl p-6 max-w-md w-full space-y-5 animate-scale"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground leading-tight">Permanently Delete Job?</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  This will permanently destroy the job configuration, analytics data, and all execution history logs. This action is absolute and cannot be undone.
                </p>
              </div>
            </div>

            {/* Instruction with copy/fill helper */}
            <div className="bg-muted/5 border border-border/40 rounded-xl p-3 text-xs space-y-2">
              <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Verification Required</span>
              <div className="flex items-center justify-between gap-2 bg-muted/15 p-2 rounded-lg border border-border/20">
                <code className="font-mono text-xs text-primary font-bold">apicoolie/{confirmPermanentDelete.name}</code>
                <button
                  type="button"
                  onClick={() => {
                    setPermanentDeleteText(`apicoolie/${confirmPermanentDelete.name}`);
                    showToast('Code entered into field!', 'success');
                  }}
                  className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline hover:text-primary-light shrink-0"
                >
                  <Copy className="h-3 w-3" /> Auto-fill
                </button>
              </div>
            </div>

            {/* Confirmation input */}
            <div className="space-y-1.5">
              <input
                type="text"
                value={permanentDeleteText}
                onChange={(e) => setPermanentDeleteText(e.target.value)}
                placeholder={`Type: apicoolie/${confirmPermanentDelete.name}`}
                className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-red-500 font-mono"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2.5 pt-1">
              <Button
                variant="outline"
                onClick={() => setConfirmPermanentDelete(null)}
                className="py-1.5 text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                disabled={permanentDeleteText !== `apicoolie/${confirmPermanentDelete.name}`}
                loading={permanentDeleteMutation.isLoading}
                onClick={() => permanentDeleteMutation.mutate(confirmPermanentDelete.id)}
                className="py-1.5 text-xs font-bold"
              >
                Permanently Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
