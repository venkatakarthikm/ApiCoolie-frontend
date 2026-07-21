import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import {
  Settings,
  Calendar,
  History,
  BarChart3,
  BadgeAlert,
  Play,
  Pause,
  Save,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Send,
  Loader2,
  RefreshCw,
  Globe,
  Info,
  Terminal,
  Trash2,
  Copy,
  AlertTriangle
} from 'lucide-react';
import { apiClient } from '../utils/apiClient.js';
import { Button } from '../components/ui/Button.jsx';
import { showToast } from '../utils/toast.js';
import { HeaderBuilder } from '../components/HeaderBuilder.jsx';
import { PayloadEditor } from '../components/PayloadEditor.jsx';
import { ScheduleBuilder } from '../components/ScheduleBuilder.jsx';
import { CodeRunnerPanel } from '../components/CodeRunnerPanel.jsx';
import { BadgeGenerator } from '../components/BadgeGenerator.jsx';
import { WorkerUrlPanel } from '../components/WorkerUrlPanel.jsx';
import { RunOutputPanel } from '../components/RunOutputPanel.jsx';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export function JobDetailsPage() {
  const { id, tab } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const activeTab = tab || 'details';

  // Load Job details
  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => apiClient.get(`/jobs/${id}`),
    enabled: !!id,
  });

  // Mutate Job updates
  const updateMutation = useMutation({
    mutationFn: (body) => apiClient.patch(`/jobs/${id}`, body),
    onSuccess: (data) => {
      queryClient.setQueryData(['job', id], data);
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['stats', id] });
      queryClient.invalidateQueries({ queryKey: ['audit-activity'] });
      queryClient.invalidateQueries({ queryKey: ['sidebar-badges'] });
      showToast('Job configuration updated successfully.', 'success');
    },
    onError: (err) => {
      showToast(`Update failed: ${err.message}`, 'error');
    },
  });

  // Trigger manual run
  const runMutation = useMutation({
    mutationFn: () => apiClient.post(`/jobs/${id}/run`),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ['executions', id] });
      queryClient.invalidateQueries({ queryKey: ['global-executions'] });
      queryClient.invalidateQueries({ queryKey: ['stats', id] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['recent-executions'] });
      queryClient.invalidateQueries({ queryKey: ['audit-activity'] });
      showToast('Manual run triggered successfully', 'success');
      navigate(`/jobs/${id}/executions/${data.executionId}`);
    },
    onError: () => {
      showToast('Failed to trigger manual run', 'error');
    }
  });

  // Pause / Resume
  const pauseMutation = useMutation({
    mutationFn: () => apiClient.post(`/jobs/${id}/pause`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['sidebar-badges'] });
      queryClient.invalidateQueries({ queryKey: ['audit-activity'] });
      showToast('Job paused successfully', 'success');
    },
    onError: () => {
      showToast('Failed to pause job', 'error');
    }
  });
  const resumeMutation = useMutation({
    mutationFn: () => apiClient.post(`/jobs/${id}/resume`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['sidebar-badges'] });
      queryClient.invalidateQueries({ queryKey: ['audit-activity'] });
      showToast('Job resumed successfully', 'success');
    },
    onError: () => {
      showToast('Failed to resume job', 'error');
    }
  });

  // Executions query
  const { data: executions, refetch: refetchExecutions } = useQuery({
    queryKey: ['executions', id],
    queryFn: () => apiClient.get(`/jobs/${id}/executions?limit=30`),
    enabled: !!id,
    refetchInterval: 15000,
  });

  // Stats query
  const { data: stats } = useQuery({
    queryKey: ['stats', id],
    queryFn: () => apiClient.get(`/jobs/${id}/stats`),
    enabled: !!id,
  });

  // Config tab form bindings
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookSecurityEnabled, setWebhookSecurityEnabled] = useState(false);
  const [webhookSecurityToken, setWebhookSecurityToken] = useState('');
  const [sendingTestWebhook, setSendingTestWebhook] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const deleteMutation = useMutation({
    mutationFn: () => apiClient.delete(`/jobs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['sidebar-badges'] });
      queryClient.invalidateQueries({ queryKey: ['audit-activity'] });
      queryClient.invalidateQueries({ queryKey: ['global-executions'] });
      showToast('Job moved to recycle bin successfully.', 'success');
      navigate('/jobs');
    },
    onError: (err) => {
      showToast(`Delete failed: ${err.message}`, 'error');
    }
  });

  // History logs filtering
  const [logFilter, setLogFilter] = useState('all'); // all | today | yesterday | week | last_week | month | year | custom
  const [logStartDate, setLogStartDate] = useState('');
  const [logEndDate, setLogEndDate] = useState('');


  // API Config parameters
  const [apiConfigTab, setApiConfigTab] = useState('query'); // query | headers | auth | body
  const [apiMethod, setApiMethod] = useState('GET');
  const [apiUrl, setApiUrl] = useState('');
  const [apiQueryParams, setApiQueryParams] = useState([]); // [{key,value,enabled}]
  const [apiHeaders, setApiHeaders] = useState([]);
  const [apiRawHeadersText, setApiRawHeadersText] = useState('');
  const [apiPayloadType, setApiPayloadType] = useState('none');
  const [apiPayload, setApiPayload] = useState('');
  const [apiAuthType, setApiAuthType] = useState('none');
  const [apiAuthConfig, setApiAuthConfig] = useState({});

  // API Test execution runner
  const [apiIsRunning, setApiIsRunning] = useState(false);
  const [apiTestExecutionId, setApiTestExecutionId] = useState(null);

  const handleTestRunApi = async () => {
    if (!id) {
      showToast('Please save the job configuration first to execute a test run.', 'error');
      return;
    }
    setApiIsRunning(true);
    setApiTestExecutionId(null);
    try {
      const result = await apiClient.post(`/jobs/${id}/test-run`, {});
      setApiTestExecutionId(result.id);
      showToast('API execution test finished!', 'success');
    } catch (error) {
      showToast(`API execution trigger failed: ${error.message}`, 'error');
    } finally {
      setApiIsRunning(false);
    }
  };

  // Parse URL query parameters to state
  const syncUrlToQueryParams = (url) => {
    try {
      const urlObj = new URL(url);
      const params = [];
      urlObj.searchParams.forEach((value, key) => {
        params.push({ key, value, enabled: true });
      });
      setApiQueryParams(params);
    } catch (_) {
      const qIdx = url.indexOf('?');
      if (qIdx !== -1) {
        const qs = url.substring(qIdx + 1);
        const pairs = qs.split('&');
        const params = [];
        pairs.forEach(p => {
          const parts = p.split('=');
          if (parts[0]) {
            params.push({
              key: decodeURIComponent(parts[0]),
              value: decodeURIComponent(parts[1] || ''),
              enabled: true
            });
          }
        });
        setApiQueryParams(params);
      } else {
        setApiQueryParams([]);
      }
    }
  };

  // Sync Query Params back to URL string
  const syncQueryParamsToUrl = (params, currentUrl) => {
    let baseUrl = currentUrl || '';
    const qIdx = baseUrl.indexOf('?');
    if (qIdx !== -1) {
      baseUrl = baseUrl.substring(0, qIdx);
    }
    const enabledParams = params.filter(p => p.key && p.enabled !== false);
    if (enabledParams.length > 0) {
      const qs = enabledParams.map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join('&');
      setApiUrl(`${baseUrl}?${qs}`);
    } else {
      setApiUrl(baseUrl);
    }
  };

  // Code Config parameters
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [codeSource, setCodeSource] = useState('');
  const [codeEnvVars, setCodeEnvVars] = useState({});

  // Schedule Config
  const [scheduleConfig, setScheduleConfig] = useState({});

  // Response Filter/Redaction states
  const [blockedKeys, setBlockedKeys] = useState([]);
  const [blockedText, setBlockedText] = useState([]);
  const [newBlockedKey, setNewBlockedKey] = useState('');
  const [newBlockedText, setNewBlockedText] = useState('');

  // Sync state values on load
  useEffect(() => {
    if (job) {
      setName(job.name || '');
      setDescription(job.description || '');
      setStatus(job.status || 'active');

      const filter = job.responseFilter || {};
      setBlockedKeys(filter.blockedKeys || []);
      setBlockedText(filter.blockedText || []);

      const delivery = job.responseDelivery || {};
      setWebhookUrl(delivery.webhook_url || '');
      setWebhookSecurityEnabled(delivery.security?.enabled || false);
      setWebhookSecurityToken(delivery.security?.token || '');

      setScheduleConfig({
        scheduleType: job.scheduleType,
        timezone: job.timezone || 'UTC',
        cronExpression: job.cronExpression,
        intervalMs: job.intervalMs ? Number(job.intervalMs) : null,
        weeklyDays: job.weeklyDays || [],
        runTime: job.runTime,
        retryPolicy: job.retryPolicy,
        repeatUntilMatch: job.repeatUntilMatch,
      });

      if (job.jobType === 'api' && job.apiConfig) {
        const config = job.apiConfig;
        setApiMethod(config.method);
        setApiUrl(config.url);
        setApiHeaders(config.headers || []);
        setApiRawHeadersText(config.rawHeadersText || '');
        setApiPayloadType(config.payloadType);
        setApiPayload(config.payload || '');
        setApiAuthType(config.authType);
        setApiAuthConfig(config.authConfig || {});
        // Parse params out of loaded URL
        try {
          const urlObj = new URL(config.url || '');
          const params = [];
          urlObj.searchParams.forEach((value, key) => {
            params.push({ key, value, enabled: true });
          });
          setApiQueryParams(params);
        } catch (_) {
          const qIdx = (config.url || '').indexOf('?');
          if (qIdx !== -1) {
            const qs = (config.url || '').substring(qIdx + 1);
            const pairs = qs.split('&');
            const params = [];
            pairs.forEach(p => {
              const parts = p.split('=');
              if (parts[0]) {
                params.push({
                  key: decodeURIComponent(parts[0]),
                  value: decodeURIComponent(parts[1] || ''),
                  enabled: true
                });
              }
            });
            setApiQueryParams(params);
          } else {
            setApiQueryParams([]);
          }
        }
      }

      if (job.jobType === 'code' && job.codeConfig) {
        const config = job.codeConfig;
        setCodeLanguage(config.language);
        setCodeSource(config.sourceCode || '');
        setCodeEnvVars(config.envVars || {});
      }
    }
  }, [job]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-2 text-xs text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span>Loading job specifications...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        <span>Error loading job details: {error.message}</span>
      </div>
    );
  }

  const handleSaveChanges = (e) => {
    if (e) e.preventDefault();

    const body = {
      name,
      description,
      status,
      responseDelivery: {
        enabled: !!webhookUrl,
        mode: webhookUrl ? 'webhook' : 'pull',
        webhook_url: webhookUrl,
        security: {
          enabled: webhookSecurityEnabled,
          token: webhookSecurityToken,
        },
      },
      responseFilter: {
        blockedKeys,
        blockedText,
      },
      ...scheduleConfig,
    };

    if (job.jobType === 'api') {
      body.apiConfig = {
        method: apiMethod,
        url: apiUrl,
        headers: apiHeaders,
        rawHeadersText: apiRawHeadersText,
        payloadType: apiPayloadType,
        payload: apiPayload,
        authType: apiAuthType,
        authConfig: apiAuthConfig,
      };
    } else {
      body.codeConfig = {
        language: codeLanguage,
        sourceCode: codeSource,
        envVars: codeEnvVars,
      };
    }

    updateMutation.mutate(body);
  };

  const getDetectedKeys = () => {
    let responseText = '';
    
    // Find the latest successful execution logs
    const latestSuccess = executions?.find(ex => ex.status === 'success' && ex.responseBody);
    if (latestSuccess) {
      responseText = latestSuccess.responseBody;
    }

    if (!responseText) return [];

    try {
      const parsed = JSON.parse(responseText);
      const keysSet = new Set();
      
      const extractKeys = (obj) => {
        if (obj === null || obj === undefined) return;
        if (Array.isArray(obj)) {
          obj.forEach(item => extractKeys(item));
        } else if (typeof obj === 'object') {
          Object.entries(obj).forEach(([k, v]) => {
            keysSet.add(k);
            extractKeys(v);
          });
        }
      };

      extractKeys(parsed);
      return Array.from(keysSet);
    } catch (_) {
      return [];
    }
  };

  const handleToggleKey = (key) => {
    if (blockedKeys.includes(key)) {
      setBlockedKeys(blockedKeys.filter(k => k !== key));
    } else {
      setBlockedKeys([...blockedKeys, key]);
    }
  };

  const handleAddBlockedKey = (e) => {
    e.preventDefault();
    if (newBlockedKey.trim() && !blockedKeys.includes(newBlockedKey.trim())) {
      setBlockedKeys([...blockedKeys, newBlockedKey.trim()]);
      setNewBlockedKey('');
    }
  };

  const handleAddBlockedText = (e) => {
    e.preventDefault();
    if (newBlockedText.trim() && !blockedText.includes(newBlockedText.trim())) {
      setBlockedText([...blockedText, newBlockedText.trim()]);
      setNewBlockedText('');
    }
  };

  const handleSendTestWebhook = async () => {
    if (!webhookUrl) return;
    setSendingTestWebhook(true);
    try {
      const res = await apiClient.post('/webhooks/test', {
        webhookUrl,
        securityToken: webhookSecurityEnabled ? webhookSecurityToken : null,
      });
      showToast(res.message || 'Test webhook dispatched successfully.', 'success');
    } catch (err) {
      showToast(`Webhook test failed: ${err.message}`, 'error');
    } finally {
      setSendingTestWebhook(false);
    }
  };

  const tabsList = [
    { id: 'details', title: 'Details', icon: Info },
    { id: 'config', title: 'Config', icon: Settings },
    { id: 'schedule', title: 'Schedule', icon: Calendar },
    { id: 'history', title: 'History Logs', icon: History },
    { id: 'stats', title: 'Analytics', icon: BarChart3 },
    { id: 'badge', title: 'Status Badge', icon: BadgeAlert },
    { id: 'worker', title: 'Worker URL', icon: Globe },
  ];

  return (
    <div className="space-y-6 animate-scale">
      <Helmet>
        <title>{job.name} | Api Coolie</title>
      </Helmet>

      {/* Top Details Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border/40 pb-4">
        <div className="space-y-1.5 flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-foreground leading-tight">{job.name}</h1>
            <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-muted/15 border border-border/40 text-muted-foreground font-mono">
              {job.jobType}
            </span>
            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
              job.status === 'active' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-muted/30 border-border text-muted-foreground'
            }`}>
              {job.status}
            </span>
          </div>
          {job.description && <p className="text-xs text-muted-foreground">{job.description}</p>}
        </div>

        {/* Header Actions Buttons */}
        <div className="flex gap-2 shrink-0">
          <Button
            onClick={() => runMutation.mutate()}
            loading={runMutation.isLoading}
            className="text-xs py-2 bg-green-600 hover:bg-green-700 text-white flex items-center gap-1.5"
          >
            <Play className="h-3.5 w-3.5 fill-current" /> Run Now
          </Button>

          {job.status === 'active' ? (
            <Button
              variant="outline"
              onClick={() => pauseMutation.mutate()}
              loading={pauseMutation.isLoading}
              className="text-xs py-2 text-yellow-500 hover:bg-yellow-500/5"
            >
              <Pause className="h-3.5 w-3.5 mr-1" /> Pause Job
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => resumeMutation.mutate()}
              loading={resumeMutation.isLoading}
              className="text-xs py-2 text-green-500 hover:bg-green-500/5"
            >
              <Play className="h-3.5 w-3.5 mr-1" /> Resume Job
            </Button>
          )}

          <Button
            variant="danger"
            onClick={() => {
              setDeleteConfirmText('');
              setShowDeleteModal(true);
            }}
            className="text-xs py-2 bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 font-bold"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete Job
          </Button>
        </div>
      </div>

      {/* Top Level Summary Stats Snapshot Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Next Run */}
        <div className="p-4 border border-border/40 bg-card rounded-2xl shadow-sm text-xs flex flex-col justify-between">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Next Runtime</span>
          <span className="text-foreground font-semibold leading-tight">
            {job.status === 'active' && job.nextRunAt ? new Date(job.nextRunAt).toLocaleString() : 'Manual Trigger Only'}
          </span>
        </div>

        {/* Success Rate */}
        <div className="p-4 border border-border/40 bg-card rounded-2xl shadow-sm text-xs flex flex-col justify-between">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Success Rate</span>
          <span className={`text-lg font-extrabold leading-none ${
            (stats?.successRate ?? 100) < 80 ? 'text-red-500' : 'text-green-500'
          }`}>
            {stats?.totalRuns > 0 ? `${stats.successRate}%` : '100%'}
          </span>
        </div>

        {/* Average Latency */}
        <div className="p-4 border border-border/40 bg-card rounded-2xl shadow-sm text-xs flex flex-col justify-between">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Average Latency</span>
          <span className="text-lg font-extrabold leading-none text-foreground">
            {stats?.averageDurationMs || 0}ms
          </span>
        </div>

        {/* Most Recent Log status */}
        <div className="p-4 border border-border/40 bg-card rounded-2xl shadow-sm text-xs flex flex-col justify-between">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Most Recent Run</span>
          {executions && executions.length > 0 ? (
            <div className="flex items-center gap-1.5 leading-none">
              <span className={`w-2.5 h-2.5 rounded-full ${
                executions[0].status === 'success' ? 'bg-green-500' : executions[0].status === 'failed' ? 'bg-red-500' : 'bg-muted-foreground animate-pulse'
              }`} />
              <span className="font-semibold capitalize text-foreground">{executions[0].status}</span>
              <span className="text-[10px] text-muted-foreground">({executions[0].durationMs || 0}ms)</span>
            </div>
          ) : (
            <span className="text-muted-foreground italic">No executions recorded</span>
          )}
        </div>
      </div>

      {/* Tabs selectors menu */}
      <div className="flex gap-1.5 border-b border-border/40 overflow-x-auto pb-1.5">
        {tabsList.map(tabItem => {
          const Icon = tabItem.icon;
          return (
            <button
              key={tabItem.id}
              type="button"
              onClick={() => navigate(`/jobs/${id}/${tabItem.id}`)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tabItem.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tabItem.title}</span>
            </button>
          );
        })}
      </div>

      {/* TABS SCREENS PANELS */}
      <div className="pt-2">

        {/* 0. DETAILS TAB */}
        {activeTab === 'details' && (
          <div className="border border-border/40 bg-card p-6 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-border/30 pb-3">
              <h3 className="text-sm font-bold text-foreground">Job Info & Details</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Created / Edited info */}
              <div className="space-y-4 bg-muted/5 p-4 rounded-xl border border-border/35 text-xs">
                <h4 className="font-bold text-[10px] uppercase text-muted-foreground">Job Metadata</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Job ID:</span>
                    <span className="font-mono">{job.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Job Type:</span>
                    <span className="font-bold uppercase text-primary">{job.jobType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created At:</span>
                    <span className="font-semibold">{new Date(job.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Edited:</span>
                    <span className="font-semibold">{new Date(job.updatedAt || job.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Editable Name & Description */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-muted-foreground" htmlFor="editName">Job Name</label>
                  <input
                    type="text"
                    id="editName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-primary"
                    placeholder="e.g. Daily Sync"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-muted-foreground" htmlFor="editDesc">Description</label>
                  <textarea
                    id="editDesc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-primary resize-y"
                    rows={4}
                    placeholder="Provide a description for this scheduled porter task..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={handleSaveChanges} className="px-6 flex items-center gap-1.5">
                <Save className="h-4 w-4" /> Save Job Details
              </Button>
            </div>
          </div>
        )}

        {/* 1. CONFIG TAB */}
        {activeTab === 'config' && (
          <div className="space-y-6">
            {job.jobType === 'api' && (
              <div className="border border-border/40 bg-card p-6 rounded-2xl shadow-sm space-y-6">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">API Configuration</h3>
                
                {/* URL + Method bar */}
                <div className="flex gap-2">
                  <select
                    value={apiMethod}
                    onChange={(e) => setApiMethod(e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg text-sm bg-background font-bold focus:outline-none min-w-[80px]"
                  >
                    {['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <input
                    type="url"
                    required
                    value={apiUrl}
                    onChange={(e) => {
                      setApiUrl(e.target.value);
                      syncUrlToQueryParams(e.target.value);
                    }}
                    className="flex-grow px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-primary font-mono"
                    placeholder="https://api.example.com/v1/endpoint"
                  />
                  <Button
                    type="button"
                    onClick={handleTestRunApi}
                    loading={apiIsRunning}
                    className="px-4 py-2 text-xs font-bold bg-green-600 hover:bg-green-700 text-white shrink-0 flex items-center gap-1.5"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" /> Run API
                  </Button>
                </div>

                {/* Postman-style sub-tabs */}
                <div className="border border-border/40 rounded-xl overflow-hidden">
                  {/* Sub-tab header */}
                  <div className="flex gap-0 border-b border-border/40 bg-muted/10">
                    {[
                      { id: 'query', label: 'Query', badge: apiQueryParams.filter(p => p.key && p.enabled !== false).length },
                      { id: 'headers', label: 'Headers', badge: apiHeaders.filter(h => h.key && h.enabled !== false).length },
                      { id: 'auth', label: 'Auth', badge: apiAuthType !== 'none' ? 1 : 0 },
                      { id: 'body', label: 'Body', badge: (apiPayloadType !== 'none' && apiPayload) ? 1 : 0 },
                    ].map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setApiConfigTab(t.id)}
                        className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                          apiConfigTab === t.id
                            ? 'border-primary text-primary bg-primary/5'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {t.label}
                        {t.badge > 0 && (
                          <span className="text-[9px] font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">{t.badge}</span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* QUERY PARAMS */}
                  {apiConfigTab === 'query' && (
                    <div className="p-4 space-y-2">
                      {apiQueryParams.map((param, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={param.enabled !== false}
                            onChange={(e) => {
                              const updated = [...apiQueryParams];
                              updated[idx] = { ...updated[idx], enabled: e.target.checked };
                              syncQueryParamsToUrl(updated, apiUrl);
                              setApiQueryParams(updated);
                            }}
                            className="h-3.5 w-3.5 rounded border-border"
                          />
                          <input
                            type="text"
                            placeholder="Key"
                            value={param.key}
                            onChange={(e) => {
                              const updated = [...apiQueryParams];
                              updated[idx] = { ...updated[idx], key: e.target.value };
                              syncQueryParamsToUrl(updated, apiUrl);
                              setApiQueryParams(updated);
                            }}
                            className="flex-1 px-3 py-1.5 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono"
                          />
                          <input
                            type="text"
                            placeholder="Value"
                            value={param.value}
                            onChange={(e) => {
                              const updated = [...apiQueryParams];
                              updated[idx] = { ...updated[idx], value: e.target.value };
                              syncQueryParamsToUrl(updated, apiUrl);
                              setApiQueryParams(updated);
                            }}
                            className="flex-1 px-3 py-1.5 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = apiQueryParams.filter((_, i) => i !== idx);
                              syncQueryParamsToUrl(updated, apiUrl);
                              setApiQueryParams(updated);
                            }}
                            className="text-red-400 hover:text-red-500 p-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setApiQueryParams([...apiQueryParams, { key: '', value: '', enabled: true }])}
                        className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline mt-1"
                      >
                        <span className="text-base leading-none">+</span> Add Query Param
                      </button>
                    </div>
                  )}

                  {/* HEADERS */}
                  {apiConfigTab === 'headers' && (
                    <div className="p-4">
                      <HeaderBuilder headers={apiHeaders} onChange={setApiHeaders} />
                    </div>
                  )}

                  {/* AUTH */}
                  {apiConfigTab === 'auth' && (
                    <div className="p-4 space-y-4">
                      {/* Auth type selector */}
                      <div className="flex flex-wrap gap-1">
                        {['none', 'bearer', 'basic', 'api_key', 'oauth2', 'custom_header'].map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setApiAuthType(t)}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                              apiAuthType === t
                                ? 'bg-primary/10 border-primary/40 text-primary'
                                : 'border-border/60 text-muted-foreground hover:border-primary/30'
                            }`}
                          >
                            {t === 'none' ? 'None' : t === 'bearer' ? 'Bearer' : t === 'basic' ? 'Basic' : t === 'api_key' ? 'API Key' : t === 'oauth2' ? 'OAuth 2' : 'Custom Header'}
                          </button>
                        ))}
                      </div>

                      {apiAuthType === 'bearer' && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground">Bearer Token</label>
                          <input
                            type="password"
                            value={apiAuthConfig.token || ''}
                            onChange={(e) => setApiAuthConfig({ ...apiAuthConfig, token: e.target.value })}
                            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                            className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono"
                          />
                          <p className="text-[10px] text-muted-foreground">Sent as: <code className="font-mono text-primary">Authorization: Bearer &lt;token&gt;</code></p>
                        </div>
                      )}

                      {apiAuthType === 'basic' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground">Username</label>
                            <input
                              type="text"
                              value={apiAuthConfig.username || ''}
                              onChange={(e) => setApiAuthConfig({ ...apiAuthConfig, username: e.target.value })}
                              placeholder="username"
                              className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground">Password</label>
                            <input
                              type="password"
                              value={apiAuthConfig.password || ''}
                              onChange={(e) => setApiAuthConfig({ ...apiAuthConfig, password: e.target.value })}
                              placeholder="••••••••"
                              className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono"
                            />
                          </div>
                        </div>
                      )}

                      {apiAuthType === 'api_key' && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-muted-foreground">Key Name</label>
                              <input
                                type="text"
                                value={apiAuthConfig.key_name || ''}
                                onChange={(e) => setApiAuthConfig({ ...apiAuthConfig, key_name: e.target.value })}
                                placeholder="X-API-Key"
                                className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-muted-foreground">Key Value</label>
                              <input
                                type="password"
                                value={apiAuthConfig.key_value || ''}
                                onChange={(e) => setApiAuthConfig({ ...apiAuthConfig, key_value: e.target.value })}
                                placeholder="sk-..."
                                className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {['header', 'query'].map(loc => (
                              <label key={loc} className="flex items-center gap-1.5 text-xs cursor-pointer">
                                <input
                                  type="radio"
                                  name="api_key_location"
                                  checked={(apiAuthConfig.location || 'header') === loc}
                                  onChange={() => setApiAuthConfig({ ...apiAuthConfig, location: loc })}
                                  className="h-3.5 w-3.5"
                                />
                                <span className="capitalize">{loc === 'header' ? 'Send as Header' : 'Send as Query Param'}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {apiAuthType === 'oauth2' && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-muted-foreground">Client ID</label>
                              <input type="text" value={apiAuthConfig.client_id || ''} onChange={(e) => setApiAuthConfig({ ...apiAuthConfig, client_id: e.target.value })} placeholder="client_id" className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-muted-foreground">Client Secret</label>
                              <input type="password" value={apiAuthConfig.client_secret || ''} onChange={(e) => setApiAuthConfig({ ...apiAuthConfig, client_secret: e.target.value })} placeholder="••••••••" className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono" />
                            </div>
                            <div className="space-y-1.5 col-span-2">
                              <label className="text-xs font-semibold text-muted-foreground">Token URL</label>
                              <input type="url" value={apiAuthConfig.token_url || ''} onChange={(e) => setApiAuthConfig({ ...apiAuthConfig, token_url: e.target.value })} placeholder="https://auth.example.com/oauth/token" className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono" />
                            </div>
                            <div className="space-y-1.5 col-span-2">
                              <label className="text-xs font-semibold text-muted-foreground">Scope (optional)</label>
                              <input type="text" value={apiAuthConfig.scope || ''} onChange={(e) => setApiAuthConfig({ ...apiAuthConfig, scope: e.target.value })} placeholder="read:data write:data" className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono" />
                            </div>
                          </div>
                        </div>
                      )}

                      {apiAuthType === 'custom_header' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground">Header Name</label>
                            <input type="text" value={apiAuthConfig.header_name || ''} onChange={(e) => setApiAuthConfig({ ...apiAuthConfig, header_name: e.target.value })} placeholder="X-Custom-Auth" className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground">Header Value</label>
                            <input type="password" value={apiAuthConfig.header_value || ''} onChange={(e) => setApiAuthConfig({ ...apiAuthConfig, header_value: e.target.value })} placeholder="••••••••" className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono" />
                          </div>
                        </div>
                      )}

                      {apiAuthType === 'none' && (
                        <p className="text-xs text-muted-foreground italic">No authentication will be sent with this request.</p>
                      )}
                    </div>
                  )}

                  {/* BODY */}
                  {apiConfigTab === 'body' && (
                    <div className="p-4 space-y-3">
                      {/* Body type selector */}
                      <div className="flex flex-wrap gap-1">
                        {[
                          { id: 'none', label: 'None' },
                          { id: 'json', label: 'JSON' },
                          { id: 'xml', label: 'XML' },
                          { id: 'text', label: 'Text' },
                          { id: 'form', label: 'Form' },
                          { id: 'form-urlencoded', label: 'Form-encode' },
                          { id: 'graphql', label: 'GraphQL' },
                          { id: 'binary', label: 'Binary' },
                        ].map(bt => (
                          <button
                            key={bt.id}
                            type="button"
                            onClick={() => setApiPayloadType(bt.id)}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                              apiPayloadType === bt.id
                                ? 'bg-primary/10 border-primary/40 text-primary'
                                : 'border-border/60 text-muted-foreground hover:border-primary/30'
                            }`}
                          >
                            {bt.label}
                          </button>
                        ))}
                      </div>

                      {apiPayloadType !== 'none' && apiPayloadType !== 'binary' && (
                        <textarea
                          value={apiPayload}
                          onChange={(e) => setApiPayload(e.target.value)}
                          rows={8}
                          placeholder={
                            apiPayloadType === 'json' ? '{"key": "value"}' :
                            apiPayloadType === 'graphql' ? '{ query: "{ user { id name } }" }' :
                            apiPayloadType === 'xml' ? '<root><key>value</key></root>' :
                            apiPayloadType === 'form' || apiPayloadType === 'form-urlencoded' ? 'key=value&other=data' :
                            'Plain text body...'
                          }
                          className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono resize-y"
                        />
                      )}
                      {apiPayloadType === 'binary' && (
                        <p className="text-xs text-muted-foreground italic py-4 text-center">Binary upload not supported in scheduled jobs. Use a URL or base64 string in the JSON body instead.</p>
                      )}
                      {apiPayloadType === 'none' && (
                        <p className="text-xs text-muted-foreground italic py-2">No request body will be sent.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* API Output Console */}
                <div className="pt-4 border-t border-border/30 mt-4">
                  {apiTestExecutionId ? (
                    <RunOutputPanel
                      executionId={apiTestExecutionId}
                      onClose={() => setApiTestExecutionId(null)}
                    />
                  ) : (
                    <div className="border border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-6 text-center bg-muted/5 min-h-[120px] text-muted-foreground space-y-2">
                      <Terminal className="h-8 w-8 text-muted-foreground/60" />
                      <div className="space-y-1 max-w-xs">
                        <h4 className="text-xs font-bold text-foreground">API Output Console</h4>
                        <p className="text-[11px] leading-relaxed">
                          Click <strong>"Run API"</strong> to test this endpoint instantly.
                          The execution status, HTTP headers, and response body will appear here.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {job.jobType === 'code' && (
              <div className="border border-border/40 bg-card p-6 rounded-2xl shadow-sm space-y-6">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Script Runner Workspace</h3>
                <CodeRunnerPanel
                  language={codeLanguage}
                  sourceCode={codeSource}
                  envVars={codeEnvVars}
                  jobId={job.id}
                  onChangeLanguage={setCodeLanguage}
                  onChangeSourceCode={setCodeSource}
                  onChangeEnvVars={setCodeEnvVars}
                />
              </div>
            )}

            {/* Webhook Response forwarders panel */}
            <div className="border border-border/40 bg-card p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Response Forwarding Webhooks</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-muted-foreground" htmlFor="webhookUrl">Webhook Forward URL</label>
                  <input
                    type="url"
                    id="webhookUrl"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-primary"
                    placeholder="https://my-backend.com/webhooks/api-coolie"
                  />
                </div>

                {webhookUrl && (
                  <div className="space-y-4 pt-4 sm:pt-0 sm:pl-4 border-t sm:border-t-0 sm:border-l border-border/30 flex flex-col justify-end space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="webSec"
                        checked={webhookSecurityEnabled}
                        onChange={(e) => setWebhookSecurityEnabled(e.target.checked)}
                        className="h-4 w-4 text-primary focus:ring-primary rounded border-border"
                      />
                      <label htmlFor="webSec" className="text-xs font-semibold text-foreground">Sign payloads with HMAC SHA-256</label>
                    </div>
                    {webhookSecurityEnabled && (
                      <input
                        type="text"
                        value={webhookSecurityToken}
                        onChange={(e) => setWebhookSecurityToken(e.target.value)}
                        placeholder="Secret key (Plain token copyable once)"
                        className="w-full px-3 py-1.5 border border-border rounded-lg text-xs bg-background focus:outline-none"
                      />
                    )}
                    <Button
                      variant="outline"
                      onClick={handleSendTestWebhook}
                      loading={sendingTestWebhook}
                      className="py-1 text-[10px] w-fit"
                    >
                      <Send className="h-3 w-3 mr-1" /> Send Test Webhook
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Response Data Redaction & Privacy Filters panel */}
            <div className="border border-border/40 bg-card p-6 rounded-2xl shadow-sm space-y-4">
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Response Redaction & Privacy Filters</h3>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Omit sensitive keys or replace specific text values from all final logs, webhooks, and worker responses.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Blocked Keys Section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>Redacted JSON Keys</span>
                  </h4>

                  {/* Manual Key Input */}
                  <form onSubmit={handleAddBlockedKey} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add key name to block (e.g. password)"
                      value={newBlockedKey}
                      onChange={(e) => setNewBlockedKey(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono"
                    />
                    <Button type="submit" variant="outline" className="py-1 text-[10px] px-3 shrink-0">
                      Add Key
                    </Button>
                  </form>

                  {/* Blocked keys badges */}
                  <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 bg-muted/5 border border-border/40 rounded-xl">
                    {blockedKeys.length === 0 ? (
                      <span className="text-[10px] text-muted-foreground italic">No keys blocked.</span>
                    ) : (
                      blockedKeys.map(k => (
                        <span key={k} className="inline-flex items-center gap-1 bg-red-500/10 text-red-500 border border-red-500/15 px-2 py-0.5 rounded-full text-[10px] font-mono">
                          {k}
                          <button
                            type="button"
                            onClick={() => setBlockedKeys(blockedKeys.filter(item => item !== k))}
                            className="hover:text-red-600 font-bold ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* Detected keys from last execution */}
                  {(() => {
                    const detected = getDetectedKeys();
                    if (detected.length === 0) return null;
                    return (
                      <div className="space-y-1.5 pt-1">
                        <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Detected Keys in Latest Output:</span>
                        <p className="text-[10px] text-muted-foreground">Untick any key to block it from execution responses.</p>
                        <div className="flex flex-wrap gap-3 p-3 bg-muted/10 border border-border/40 rounded-xl max-h-32 overflow-y-auto">
                          {detected.map(k => {
                            const isBlocked = blockedKeys.includes(k);
                            return (
                              <label key={k} className="flex items-center gap-2 text-xs font-mono select-none cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={!isBlocked}
                                  onChange={() => handleToggleKey(k)}
                                  className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
                                />
                                <span className={isBlocked ? 'line-through text-muted-foreground/60' : 'text-foreground'}>
                                  {k}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Blocked Text Phrases Section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span>Redacted Text & Values</span>
                  </h4>

                  {/* Manual Phrase Input */}
                  <form onSubmit={handleAddBlockedText} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add sensitive text/token to mask"
                      value={newBlockedText}
                      onChange={(e) => setNewBlockedText(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono"
                    />
                    <Button type="submit" variant="outline" className="py-1 text-[10px] px-3 shrink-0">
                      Add Text
                    </Button>
                  </form>

                  {/* Blocked text badges */}
                  <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 bg-muted/5 border border-border/40 rounded-xl">
                    {blockedText.length === 0 ? (
                      <span className="text-[10px] text-muted-foreground italic">No values/text masked.</span>
                    ) : (
                      blockedText.map(t => (
                        <span key={t} className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/15 px-2 py-0.5 rounded-full text-[10px] font-mono">
                          {t.length > 20 ? t.substring(0, 20) + '...' : t}
                          <button
                            type="button"
                            onClick={() => setBlockedText(blockedText.filter(item => item !== t))}
                            className="hover:text-yellow-600 font-bold ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground italic">
                    Note: Any matching substring above will be replaced with <code className="font-mono text-red-500">[REDACTED]</code> dynamically inside the output body.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button onClick={handleSaveChanges} className="px-6 flex items-center gap-1.5">
                <Save className="h-4 w-4" /> Save Job Changes
              </Button>
            </div>
          </div>
        )}

        {/* 2. SCHEDULE TAB */}
        {activeTab === 'schedule' && (
          <div className="border border-border/40 bg-card p-6 rounded-2xl shadow-sm space-y-6">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Configure Cycles</h3>
            
            <ScheduleBuilder
              scheduleType={job.scheduleType}
              cronExpression={job.cronExpression}
              intervalMs={job.intervalMs}
              weeklyDays={job.weeklyDays}
              runTime={job.runTime}
              timezone={job.timezone}
              retryPolicy={job.retryPolicy}
              repeatUntilMatch={job.repeatUntilMatch}
              onChange={setScheduleConfig}
            />

            <div className="flex justify-end pt-4">
              <Button onClick={handleSaveChanges} className="px-6 flex items-center gap-1.5">
                <Save className="h-4 w-4" /> Save Schedule Changes
              </Button>
            </div>
          </div>
        )}

        {/* 3. HISTORY LOGS TAB */}
        {activeTab === 'history' && (
          <div className="border border-border/40 bg-card rounded-2xl shadow-sm overflow-hidden w-full">
            <div className="px-4 py-3 bg-muted/20 border-b border-border/40 flex justify-between items-center flex-wrap gap-2">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Execution History Logs</h3>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => refetchExecutions()}
                  className="p-1 rounded hover:bg-muted/30 text-muted-foreground hover:text-foreground"
                  title="Refresh logs"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Date Filtering Bar */}
            <div className="px-4 py-3 flex flex-wrap items-center gap-3 text-xs bg-muted/5 border-b border-border/30">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-muted-foreground">Filter Logs:</span>
                <select
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value)}
                  className="px-2.5 py-1.5 border border-border rounded-lg bg-background focus:outline-none text-xs font-medium"
                >
                  <option value="all">All Logs</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="week">This Week</option>
                  <option value="last_week">Last Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                  <option value="custom">Custom Date Range</option>
                </select>
              </div>

              {logFilter === 'custom' && (
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={logStartDate}
                    onChange={(e) => setLogStartDate(e.target.value)}
                    className="px-2 py-1 border border-border rounded-lg bg-background text-xs"
                  />
                  <span className="text-muted-foreground">to</span>
                  <input
                    type="date"
                    value={logEndDate}
                    onChange={(e) => setLogEndDate(e.target.value)}
                    className="px-2 py-1 border border-border rounded-lg bg-background text-xs"
                  />
                </div>
              )}
            </div>
            
            {(() => {
              const list = Array.isArray(executions) ? executions : [];
              const now = new Date();
              const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
              const startOfYesterday = new Date(startOfToday);
              startOfYesterday.setDate(startOfYesterday.getDate() - 1);

              const filtered = list.filter(ex => {
                if (!ex.startedAt) return false;
                const date = new Date(ex.startedAt);

                switch (logFilter) {
                  case 'today':
                    return date >= startOfToday;
                  case 'yesterday':
                    return date >= startOfYesterday && date < startOfToday;
                  case 'week': {
                    const startOfWeek = new Date(startOfToday);
                    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
                    return date >= startOfWeek;
                  }
                  case 'last_week': {
                    const startOfWeek = new Date(startOfToday);
                    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() - 7);
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(endOfWeek.getDate() + 7);
                    return date >= startOfWeek && date < endOfWeek;
                  }
                  case 'month': {
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                    return date >= startOfMonth;
                  }
                  case 'year': {
                    const startOfYear = new Date(now.getFullYear(), 0, 1);
                    return date >= startOfYear;
                  }
                  case 'custom': {
                    let pass = true;
                    if (logStartDate) {
                      const s = new Date(logStartDate);
                      s.setHours(0, 0, 0, 0);
                      pass = pass && date >= s;
                    }
                    if (logEndDate) {
                      const e = new Date(logEndDate);
                      e.setHours(23, 59, 59, 999);
                      pass = pass && date <= e;
                    }
                    return pass;
                  }
                  default:
                    return true;
                }
              });

              if (filtered.length === 0) {
                return <p className="p-8 text-center text-xs text-muted-foreground italic">No matching run logs found for the selected date filter.</p>;
              }
              return (
                <div className="divide-y divide-border/30 max-h-[500px] overflow-y-auto">
                  {filtered.map((ex) => {
                    const formattedDate = ex.startedAt ? (() => {
                      const d = new Date(ex.startedAt);
                      return isNaN(d.getTime()) ? '--' : d.toLocaleString();
                    })() : '--';
                    return (
                      <div
                        key={ex.id}
                        className="p-4 flex justify-between items-center gap-4 text-xs hover:bg-muted/5 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`w-2.5 h-2.5 rounded-full ${
                              ex.status === 'success' ? 'bg-green-500' : ex.status === 'failed' ? 'bg-red-500' : 'bg-muted-foreground animate-pulse'
                            }`} />
                            <span className="font-bold capitalize">{ex.triggerType} run</span>
                            <span className="text-[10px] text-muted-foreground">
                              (Code {ex.statusCode || '--'}, {ex.durationMs || 0}ms)
                            </span>
                          </div>
                          <span className="block text-[10px] text-muted-foreground">{formattedDate}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate(`/jobs/${id}/executions/${ex.id}`)}
                          className="text-xs text-primary font-bold hover:underline shrink-0"
                        >
                          View Logs
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* 4. ANALYTICS TABS */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {stats ? (
              <div className="space-y-6">
                
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 border border-border/40 bg-card rounded-2xl shadow-sm">
                    <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Total Executions</span>
                    <span className="text-2xl font-extrabold">{stats.totalRuns}</span>
                  </div>
                  <div className="p-5 border border-border/40 bg-card rounded-2xl shadow-sm">
                    <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Average Duration</span>
                    <span className="text-2xl font-extrabold">{stats.averageDurationMs}ms</span>
                  </div>
                  <div className="p-5 border border-border/40 bg-card rounded-2xl shadow-sm">
                    <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">95th Percentile Latency</span>
                    <span className="text-2xl font-extrabold">{stats.p95DurationMs}ms</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Latency History */}
                  <div className="p-6 border border-border/40 bg-card rounded-2xl shadow-sm md:col-span-2 flex flex-col justify-between">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Run latency speed history (ms)</h4>
                    <div className="h-64">
                      {stats.recentHistory.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stats.recentHistory}>
                            <XAxis dataKey="time" hide />
                            <YAxis tick={{ fontSize: 9 }} stroke="var(--border)" />
                            <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
                            <Bar dataKey="durationMs" fill="#8E70CF" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-xs text-muted-foreground italic text-center py-16">No execution stats data available yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Status codes distribution list */}
                  <div className="p-6 border border-border/40 bg-card rounded-2xl shadow-sm">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">HTTP Codes Distribution</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {Object.entries(stats.statusCodes).map(([code, count]) => (
                        <div key={code} className="flex justify-between items-center text-xs py-1.5 border-b border-border/20 last:border-0">
                          <span className="font-semibold text-foreground">{code}</span>
                          <span className="text-muted-foreground font-mono">{count} hits</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span>Aggregating analytics parameters...</span>
              </div>
            )}
          </div>
        )}

        {/* 5. BADGES TAB */}
        {activeTab === 'badge' && (
          <div className="border border-border/40 bg-card p-6 rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">SVG Status Badges</h3>
            <BadgeGenerator jobId={job.id} jobName={job.name} />
          </div>
        )}

        {/* 6. WORKER URL TAB */}
        {activeTab === 'worker' && (
          <div className="border border-border/40 bg-card p-6 rounded-2xl shadow-sm">
            <WorkerUrlPanel job={job} />
          </div>
        )}

      </div>

      {/* Soft-Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
          onClick={() => setShowDeleteModal(false)}
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
                <h3 className="text-sm font-bold text-foreground leading-tight">Move Job to Recycle Bin?</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Its schedules will be paused, and worker URLs will stop functioning. You can recover it within 60 days.
                </p>
              </div>
            </div>

            {/* Instruction with copy/fill helper */}
            <div className="bg-muted/5 border border-border/40 rounded-xl p-3 text-xs space-y-2">
              <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Confirmation Action Required</span>
              <div className="flex items-center justify-between gap-2 bg-muted/15 p-2 rounded-lg border border-border/20">
                <code className="font-mono text-xs text-primary font-bold">apicoolie/{job.name}</code>
                <button
                  type="button"
                  onClick={() => {
                    setDeleteConfirmText(`apicoolie/${job.name}`);
                    showToast('Code entered into field!', 'success');
                  }}
                  className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline hover:text-primary-light shrink-0"
                  title="Auto-fill confirmation input"
                >
                  <Copy className="h-3 w-3" /> Auto-fill
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground">Type or click auto-fill to proceed.</p>
            </div>

            {/* Confirmation input */}
            <div className="space-y-1.5">
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={`Type: apicoolie/${job.name}`}
                className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-red-500 font-mono"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2.5 pt-1">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="py-1.5 text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                disabled={deleteConfirmText !== `apicoolie/${job.name}`}
                loading={deleteMutation.isLoading}
                onClick={() => deleteMutation.mutate()}
                className="py-1.5 text-xs font-bold"
              >
                Move to Recycle Bin
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
