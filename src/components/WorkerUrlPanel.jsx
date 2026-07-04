import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Globe, Zap, RefreshCw, Copy, ToggleLeft, ToggleRight, ExternalLink, AlertCircle, Code2, CheckCircle, Save } from 'lucide-react';
import { apiClient } from '../utils/apiClient.js';
import { showToast } from '../utils/toast.js';

export function WorkerUrlPanel({ job }) {
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);

  // Custom slug states
  const [customSlug, setCustomSlug] = useState(job.workerUrlSlug || '');
  const [isSlugAvailable, setIsSlugAvailable] = useState(true);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || 'https://apicoolie-backend.onrender.com';
  const workerUrl = job.workerUrlSlug
    ? `${BACKEND_API_URL}/w/${job.workerUrlSlug}`
    : null;

  // Check slug availability on change
  useEffect(() => {
    if (!customSlug || customSlug === job.workerUrlSlug) {
      setIsSlugAvailable(true);
      setSuggestions([]);
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(customSlug)) {
      setIsSlugAvailable(false);
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setCheckingSlug(true);
      try {
        const res = await apiClient.get(`/jobs/check-slug/${customSlug}`);
        setIsSlugAvailable(res.available);
        if (!res.available) {
          // Suggest alternatives
          setSuggestions([
            `${customSlug}-1`,
            `${customSlug}-${Math.floor(Math.random() * 90 + 10)}`,
            `${customSlug}-cool`
          ]);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCheckingSlug(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [customSlug, job.workerUrlSlug]);

  // Save Custom Slug Mutation
  const saveCustomSlugMutation = useMutation({
    mutationFn: (slugToSave) => apiClient.post(`/jobs/${job.id}/worker/custom`, { slug: slugToSave }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['job', job.id]);
      showToast('Worker slug saved successfully!', 'success');
      setShowWarningModal(false);
    },
    onError: (err) => showToast(err.message, 'error'),
  });

  // Generate/regenerate slug
  const generateMutation = useMutation({
    mutationFn: () => apiClient.post(`/jobs/${job.id}/worker/generate`),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['job', job.id]);
      setCustomSlug(data.workerUrlSlug);
      showToast('Worker URL generated successfully!', 'success');
    },
    onError: (err) => showToast(err.message, 'error'),
  });

  // Toggle enable/disable
  const toggleMutation = useMutation({
    mutationFn: (enabled) => apiClient.patch(`/jobs/${job.id}/worker/toggle`, { enabled }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['job', job.id]);
      showToast(data.workerUrlEnabled ? 'Worker URL enabled.' : 'Worker URL disabled.', 'success');
    },
    onError: (err) => showToast(err.message, 'error'),
  });

  const copyUrl = async () => {
    if (!workerUrl) return;
    try {
      await navigator.clipboard.writeText(workerUrl);
      setCopied(true);
      showToast('Worker URL copied!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      showToast('Failed to copy URL.', 'error');
    }
  };

  const handleSaveSlugClick = () => {
    if (job.workerUrlSlug) {
      // User is changing an existing slug. Warn them that it deletes old logs/paths.
      setShowWarningModal(true);
    } else {
      saveCustomSlugMutation.mutate(customSlug);
    }
  };

  const isLoading = generateMutation.isLoading || toggleMutation.isLoading || saveCustomSlugMutation.isLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Worker URL Settings</h3>
            <p className="text-xs text-muted-foreground">Configure your serverless HTTP endpoint path triggers.</p>
          </div>
        </div>
      </div>

      <>
          {/* How it works */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: Globe, label: 'Customizable Slug', desc: 'Personalize the URL path endpoint matching your brand' },
              { icon: Zap, label: 'Instant Execution', desc: 'Any HTTP request triggers your code immediately' },
              { icon: Code2, label: 'Full Request Context', desc: 'Access method, headers, body & query params in code' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="p-4 border border-border/40 bg-muted/5 rounded-2xl text-xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="font-bold">{label}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* URL Status card */}
          <div className={`border rounded-2xl p-5 space-y-4 ${job.workerUrlEnabled && workerUrl ? 'border-green-500/20 bg-green-500/5' : 'border-border/40 bg-card'}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {job.workerUrlEnabled && workerUrl
                  ? <CheckCircle className="h-4 w-4 text-green-500" />
                  : <Globe className="h-4 w-4 text-muted-foreground" />
                }
                <span className="text-xs font-bold">
                  {workerUrl ? (job.workerUrlEnabled ? 'Worker Active' : 'Worker Paused') : 'No Worker URL'}
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                {workerUrl && (
                  <button
                    type="button"
                    onClick={() => toggleMutation.mutate(!job.workerUrlEnabled)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-border/60 rounded-xl hover:bg-muted/10 transition-all font-semibold disabled:opacity-50"
                  >
                    {job.workerUrlEnabled
                      ? <ToggleRight className="h-4 w-4 text-green-500" />
                      : <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                    }
                    {job.workerUrlEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => generateMutation.mutate()}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-bold disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  {workerUrl ? 'Regenerate' : 'Generate URL'}
                </button>
              </div>
            </div>

            {workerUrl && (
              <div className="flex items-center gap-2 bg-muted/10 border border-border/40 rounded-xl p-3">
                <Globe className="h-3.5 w-3.5 text-primary shrink-0" />
                <code className="text-xs font-mono flex-1 text-foreground truncate">{workerUrl}</code>
                <button
                  type="button"
                  onClick={copyUrl}
                  className="p-1.5 hover:bg-muted/20 rounded-lg transition-colors shrink-0"
                  title="Copy URL"
                >
                  {copied ? <CheckCircle className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                </button>
                <a
                  href={workerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 hover:bg-muted/20 rounded-lg transition-colors shrink-0"
                  title="Open in new tab"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </a>
              </div>
            )}
          </div>

          {/* Custom Slug Editor */}
          <div className="border border-border/40 bg-card rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-foreground">Customize Slug Endpoint</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="Enter custom slug (e.g. status-checker)"
                className={`flex-grow px-3 py-1.5 border rounded-lg text-xs bg-background focus:outline-none ${
                  !isSlugAvailable ? 'border-red-500' : 'border-border'
                }`}
              />
              <button
                type="button"
                onClick={handleSaveSlugClick}
                disabled={isLoading || !customSlug || !isSlugAvailable || checkingSlug || customSlug === job.workerUrlSlug}
                className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/95 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Slug</span>
              </button>
            </div>

            {checkingSlug && <p className="text-[10px] text-muted-foreground">Checking availability...</p>}
            {!isSlugAvailable && (
              <div className="space-y-1">
                <p className="text-[10px] text-red-500 font-semibold">This slug is taken. Suggestions:</p>
                <div className="flex gap-1.5 flex-wrap">
                  {suggestions.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setCustomSlug(sug)}
                      className="text-[9px] px-2 py-0.5 bg-muted/10 border border-border/45 hover:border-primary rounded text-primary font-bold font-mono"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Warning Modal */}
          {showWarningModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-card border border-border/40 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-xl">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" /> Warning: Slug Retention
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Changing your worker slug will permanently release the old endpoint and purge historical logs associated with it to conserve storage. Do you want to proceed?
                </p>
                <div className="flex justify-end gap-2 text-xs font-bold pt-2">
                  <button
                    onClick={() => setShowWarningModal(false)}
                    className="px-4 py-2 border border-border rounded-xl hover:bg-muted/15"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => saveCustomSlugMutation.mutate(customSlug)}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
                  >
                    Confirm Change
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      </div>
  );
}
