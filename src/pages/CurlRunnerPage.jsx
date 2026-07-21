import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import {
  Terminal,
  Play,
  Save,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Copy,
  ChevronDown,
  ChevronRight,
  Clock,
  FileCode,
  Plus,
  Pencil,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { apiClient } from '../utils/apiClient.js';
import { showToast } from '../utils/toast.js';

export function CurlRunnerPage() {
  const queryClient = useQueryClient();
  const [curlInput, setCurlInput] = useState('curl https://httpbin.org/get');
  const [response, setResponse] = useState(null);
  const [responseError, setResponseError] = useState(null);
  const [running, setRunning] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showHeaders, setShowHeaders] = useState(false);

  const { data: savedCurls = [], isLoading: loadingCurls } = useQuery({
    queryKey: ['saved-curls'],
    queryFn: () => apiClient.get('/saved-curls'),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (editingId) {
        return apiClient.patch(`/saved-curls/${editingId}`, data);
      }
      return apiClient.post('/saved-curls', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-curls'] });
      showToast(editingId ? 'Curl updated successfully.' : 'Curl saved successfully.', 'success');
      setSaveModalOpen(false);
      setSaveName('');
      setEditingId(null);
    },
    onError: (err) => showToast(`Save failed: ${err.message}`, 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/saved-curls/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-curls'] });
      showToast('Saved curl deleted.', 'success');
    },
    onError: (err) => showToast(`Delete failed: ${err.message}`, 'error'),
  });

  const handleRun = async () => {
    if (!curlInput.trim()) {
      showToast('Please enter a curl command.', 'error');
      return;
    }
    setRunning(true);
    setResponse(null);
    setResponseError(null);
    try {
      const result = await apiClient.post('/saved-curls/execute', {
        curlCommand: curlInput,
      });
      setResponse(result);
    } catch (err) {
      setResponseError(err.message || 'Request failed.');
    } finally {
      setRunning(false);
    }
  };

  const handleSave = () => {
    if (!saveName.trim()) {
      showToast('Please enter a name.', 'error');
      return;
    }
    saveMutation.mutate({ name: saveName, curlCommand: curlInput });
  };

  const handleLoadCurl = (curl) => {
    setCurlInput(curl.curlCommand);
    setResponse(null);
    setResponseError(null);
    showToast(`Loaded "${curl.name}"`, 'success');
  };

  const handleEditCurl = (curl) => {
    setEditingId(curl.id);
    setSaveName(curl.name);
    setCurlInput(curl.curlCommand);
    setSaveModalOpen(true);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(typeof text === 'string' ? text : JSON.stringify(text, null, 2));
    showToast('Copied to clipboard!', 'success');
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'text-green-500 bg-green-500/10 border-green-500/20';
    if (status >= 300 && status < 400) return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    if (status >= 400 && status < 500) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-red-500 bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="space-y-6 animate-scale h-full flex flex-col">
      <Helmet>
        <title>Curl Runner | Api Coolie</title>
        <meta name="description" content="Execute curl commands instantly and inspect HTTP responses with full headers, status codes, and timing." />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-bold font-sans">Curl Runner</h1>
          <p className="text-xs text-muted-foreground">Paste or type a curl command, run it, and inspect the response instantly.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => { setEditingId(null); setSaveName(''); setSaveModalOpen(true); }}
          className="text-xs flex items-center gap-1.5"
        >
          <Save className="h-3.5 w-3.5" /> Save Current
        </Button>
      </div>

      {/* Main workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-grow min-h-[500px]">
        {/* Left: Curl input + Saved curls */}
        <div className="lg:col-span-1 space-y-4">
          {/* Input area */}
          <div className="border border-border/40 bg-card rounded-2xl p-4 flex flex-col space-y-3 h-full">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Curl Command</h3>
              <div className="flex gap-1.5">
                <button
                  onClick={() => { setCurlInput(''); setResponse(null); setResponseError(null); }}
                  className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/10 transition-colors"
                  title="Clear"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <textarea
              value={curlInput}
              onChange={(e) => setCurlInput(e.target.value)}
              placeholder={'curl https://api.example.com/data\n\n# Supports:\n# -X POST\n# -H "Authorization: Bearer token"\n# -d \'{"key":"value"}\''}
              className="flex-grow w-full px-3 py-2 border border-border rounded-xl text-xs bg-background focus:outline-none focus:border-primary font-mono resize-y min-h-[200px] leading-relaxed"
              spellCheck={false}
            />
            <Button
              variant="primary"
              onClick={handleRun}
              loading={running}
              className="w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2"
            >
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
              {running ? 'Executing...' : 'Run Command'}
            </Button>
          </div>

          {/* Saved Curls List */}
          <div className="border border-border/40 bg-card rounded-2xl p-4 space-y-3">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Saved Commands</h3>
            {loadingCurls ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : savedCurls.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center py-4">No saved commands yet.</p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {savedCurls.map((curl) => (
                  <div
                    key={curl.id}
                    className="p-3 border border-border/30 rounded-xl hover:border-primary/30 hover:bg-muted/5 transition-all group cursor-pointer"
                    onClick={() => handleLoadCurl(curl)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-foreground block truncate group-hover:text-primary transition-colors">
                          {curl.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono block truncate mt-0.5">
                          {curl.curlCommand.substring(0, 60)}{curl.curlCommand.length > 60 ? '...' : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditCurl(curl); }}
                          className="p-1 text-muted-foreground hover:text-primary rounded"
                          title="Edit"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(curl.id); }}
                          className="p-1 text-muted-foreground hover:text-red-500 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Response area */}
        <div className="lg:col-span-2 border border-border/40 bg-card rounded-2xl p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Response</h3>
            {response && (
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getStatusColor(response.status)}`}>
                  {response.status} {response.statusText}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {response.durationMs}ms
                </span>
                <button
                  onClick={() => handleCopy(response.body)}
                  className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-muted/10 transition-colors"
                  title="Copy response"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Response meta info */}
          {response && (
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground border-b border-border/30 pb-3">
              <span className="flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                <span className="font-mono">{response.method} {response.url}</span>
              </span>
            </div>
          )}

          {/* Response headers toggle */}
          {response && response.headers && (
            <div className="border border-border/30 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowHeaders(!showHeaders)}
                className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider hover:bg-muted/5 transition-colors"
              >
                {showHeaders ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                Response Headers ({Object.keys(response.headers).length})
              </button>
              {showHeaders && (
                <div className="px-3 pb-3 space-y-1">
                  {Object.entries(response.headers).map(([key, value]) => (
                    <div key={key} className="flex gap-2 text-[10px] font-mono">
                      <span className="text-primary font-bold shrink-0">{key}:</span>
                      <span className="text-muted-foreground break-all">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Response body */}
          <div className="flex-grow rounded-xl border border-border/30 bg-background/50 overflow-auto">
            {running ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">Executing request...</span>
              </div>
            ) : responseError ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] space-y-3 p-6">
                <div className="p-3 bg-red-500/10 rounded-xl">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <span className="text-sm font-bold text-red-500">Request Failed</span>
                <p className="text-xs text-muted-foreground text-center max-w-md">{responseError}</p>
              </div>
            ) : response ? (
              <pre className="p-4 text-xs font-mono text-foreground whitespace-pre-wrap break-all leading-relaxed overflow-auto max-h-[600px]">
                {typeof response.body === 'string'
                  ? response.body
                  : JSON.stringify(response.body, null, 2)}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] space-y-3 text-muted-foreground">
                <FileCode className="h-10 w-10 opacity-40" />
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold">No Response Yet</p>
                  <p className="text-[10px]">Enter a curl command and click Run to see the response here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {saveModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
          onClick={() => setSaveModalOpen(false)}
        >
          <div
            className="bg-card border border-border/60 rounded-2xl shadow-2xl p-6 max-w-md w-full space-y-5 animate-scale"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-foreground">
              {editingId ? 'Update Saved Command' : 'Save Curl Command'}
            </h3>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Command Name</label>
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="e.g. Get Users API, Health Check"
                className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary"
                autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
              />
            </div>
            <div className="flex justify-end gap-2.5 pt-1">
              <Button
                variant="outline"
                onClick={() => { setSaveModalOpen(false); setEditingId(null); setSaveName(''); }}
                className="py-1.5 text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                loading={saveMutation.isLoading}
                className="py-1.5 text-xs font-bold"
              >
                {editingId ? 'Update' : 'Save Command'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
