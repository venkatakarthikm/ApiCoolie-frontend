import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { KeyRound, ShieldCheck, Eye, Trash2, Plus, Copy, AlertCircle, Sparkles } from 'lucide-react';
import { apiClient } from '../utils/apiClient.js';
import { Button } from '../components/ui/Button.jsx';
import { CopyButton } from '../components/CopyButton.jsx';
import { showToast } from '../utils/toast.js';
import { ConfirmModal } from '../components/ui/ConfirmModal.jsx';

export function TokenManagementPage() {
  const queryClient = useQueryClient();
  const [createdToken, setCreatedToken] = useState(null);
  const [confirmRevoke, setConfirmRevoke] = useState(null);
  
  // Scoping inputs
  const [jobId, setJobId] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch API tokens
  const { data: tokens, isLoading } = useQuery({
    queryKey: ['api-tokens'],
    queryFn: () => apiClient.get('/tokens'),
  });

  // Fetch Jobs (to let user scope a token to a specific job if desired)
  const { data: jobs } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => apiClient.get('/jobs'),
  });

  // Create token mutation
  const createMutation = useMutation({
    mutationFn: () => apiClient.post('/tokens', { jobId: jobId || null }),
    onSuccess: (data) => {
      setCreatedToken(data);
      queryClient.invalidateQueries({ queryKey: ['api-tokens'] });
    },
  });

  // Revoke token mutation
  const revokeMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/tokens/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-tokens'] });
      showToast('API Token revoked successfully.', 'success');
    },
  });

  const handleCreateToken = async (e) => {
    e.preventDefault();
    setLoading(true);
    await createMutation.mutateAsync();
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-scale">
      <Helmet>
        <title>API Tokens | Api Coolie</title>
      </Helmet>

      {/* Title */}
      <div className="border-b border-border/40 pb-4">
        <h1 className="text-xl font-bold font-sans">Programmatic API Tokens</h1>
        <p className="text-xs text-muted-foreground">Manage keys for calling Api Coolie API endpoints and scheduling hooks from your scripts.</p>
      </div>

      {/* Creation form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-1 border border-border/40 bg-card p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Generate API Key</h3>
          <form onSubmit={handleCreateToken} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-muted-foreground" htmlFor="scopeJob">Limit Scope to Job (Optional)</label>
              <select
                id="scopeJob"
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none"
              >
                <option value="">Account-Wide (All access)</option>
                {jobs?.map(job => (
                  <option key={job.id} value={job.id}>{job.name}</option>
                ))}
              </select>
            </div>
            <Button type="submit" loading={loading} className="w-full text-xs">
              Generate Developer Token
            </Button>
          </form>
        </div>

        {/* Copy once container */}
        <div className="md:col-span-2">
          {createdToken ? (
            <div className="p-6 border border-primary/20 bg-primary/5 rounded-2xl space-y-4 animate-scale">
              <div className="flex items-center gap-2 text-primary font-bold text-xs">
                <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                <span>API Key Generated Successfully</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Make sure to copy this token now. For your security, this key is encrypted at rest and will <strong>never be shown again</strong>.
              </p>
              
              {/* Token Copy Block */}
              <div className="flex gap-2 items-center bg-card border border-border/60 p-3 rounded-xl font-mono text-xs select-all text-foreground overflow-x-auto relative">
                <span className="pr-12">{createdToken.token}</span>
                <div className="absolute right-2 top-1.5">
                  <CopyButton value={createdToken.token} label="Copy Token" />
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={() => setCreatedToken(null)}
                className="text-xs py-1 px-3"
              >
                Close Panel
              </Button>
            </div>
          ) : (
            <div className="border border-dashed border-border rounded-2xl p-8 text-center bg-muted/5 text-muted-foreground text-xs italic min-h-[160px] flex items-center justify-center">
              Generate a key on the left to display credentials.
            </div>
          )}
        </div>
      </div>

      {/* Active tokens table list */}
      <div className="border border-border/40 bg-card rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-muted/20 border-b border-border/40">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Credentials</h3>
        </div>

        {isLoading ? (
          <div className="p-6 text-center text-xs text-muted-foreground">Loading active keys...</div>
        ) : tokens && tokens.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground italic">No developer keys registered.</div>
        ) : (
          <div className="divide-y divide-border/30 overflow-x-auto">
            {tokens?.map((tok) => (
              <div key={tok.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono bg-muted/25 px-2 py-0.5 rounded border border-border text-foreground font-semibold">
                      {tok.tokenPrefix}...
                    </span>
                    {tok.jobId ? (
                      <span className="text-[10px] text-muted-foreground">Scoped to Job: {tok.jobId.slice(0, 8)}...</span>
                    ) : (
                      <span className="text-[10px] text-primary font-semibold uppercase">Account-Wide</span>
                    )}
                    {tok.revokedAt && (
                      <span className="text-[9px] text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full uppercase font-bold border border-red-500/20">
                        Revoked
                      </span>
                    )}
                  </div>
                  <span className="block text-[10px] text-muted-foreground">
                    Created: {new Date(tok.createdAt).toLocaleDateString()}
                    {tok.lastUsedAt && ` | Last used: ${new Date(tok.lastUsedAt).toLocaleString()}`}
                  </span>
                </div>

                {!tok.revokedAt && (
                  <button
                    type="button"
                    onClick={() => setConfirmRevoke(tok.id)}
                    className="p-1.5 border border-border/60 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors"
                    title="Revoke Token"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!confirmRevoke}
        title="Revoke API Token?"
        message="This will immediately revoke the token. Any scripts or integrations using it will stop working. This action cannot be undone."
        confirmLabel="Yes, Revoke"
        cancelLabel="Keep Token"
        danger={true}
        onConfirm={() => {
          if (confirmRevoke) revokeMutation.mutate(confirmRevoke);
          setConfirmRevoke(null);
        }}
        onCancel={() => setConfirmRevoke(null)}
      />
    </div>
  );
}
