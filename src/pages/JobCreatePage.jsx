import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Globe, Code2, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { HeaderBuilder } from '../components/HeaderBuilder.jsx';
import { ScheduleBuilder } from '../components/ScheduleBuilder.jsx';
import { CodeRunnerPanel } from '../components/CodeRunnerPanel.jsx';
import { apiClient } from '../utils/apiClient.js';

export function JobCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type');

  const [jobType, setJobType] = useState(initialType || '');
  const [step, setStep] = useState(initialType ? 2 : 1);

  // Form base states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // API Config states
  const [apiConfigTab, setApiConfigTab] = useState('query');
  const [apiMethod, setApiMethod] = useState('GET');
  const [apiUrl, setApiUrl] = useState('');
  const [apiQueryParams, setApiQueryParams] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [rawHeadersText, setRawHeadersText] = useState('');
  const [payloadType, setPayloadType] = useState('none');
  const [payload, setPayload] = useState('');
  const [authType, setAuthType] = useState('none');
  const [authConfig, setAuthConfig] = useState({});

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

  // Code Config states
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [sourceCode, setSourceCode] = useState('');
  const [envVars, setEnvVars] = useState({});

  // Schedule states
  const [scheduleConfig, setScheduleConfig] = useState({
    scheduleType: 'manual_only',
    timezone: 'UTC',
  });

  // Load preset template if active
  React.useEffect(() => {
    const rawTemplate = sessionStorage.getItem('api_coolie_template');
    if (rawTemplate) {
      try {
        const tmpl = JSON.parse(rawTemplate);
        sessionStorage.removeItem('api_coolie_template');
        if (tmpl.name) setName(tmpl.name);
        if (tmpl.description) setDescription(tmpl.description);
        if (tmpl.scheduleType) {
          setScheduleConfig({
            scheduleType: tmpl.scheduleType,
            cronExpression: tmpl.cronExpression || '',
            intervalMs: tmpl.intervalMs || null,
            weeklyDays: tmpl.weeklyDays || [],
            runTime: tmpl.runTime || '09:00:00',
            timezone: tmpl.timezone || 'UTC',
          });
        }
        if (tmpl.apiConfig) {
          const api = tmpl.apiConfig;
          if (api.method) setApiMethod(api.method);
          if (api.url) setApiUrl(api.url);
          if (api.headers) setHeaders(api.headers);
          if (api.payloadType) setPayloadType(api.payloadType);
          if (api.payload) setPayload(api.payload);
          if (api.authType) setAuthType(api.authType);
          if (api.authConfig) setAuthConfig(api.authConfig);
          if (api.url) {
            syncUrlToQueryParams(api.url);
          }
        }
        if (tmpl.codeConfig) {
          const code = tmpl.codeConfig;
          if (code.language) setCodeLanguage(code.language);
          if (code.sourceCode) setSourceCode(code.sourceCode);
          if (code.envVars) setEnvVars(code.envVars);
        }
      } catch (e) {
        console.error('Template loading failed:', e);
      }
    }
  }, []);


  const handleSelectType = (type) => {
    setJobType(type);
    setStep(2);
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Job name is required.');
      return;
    }

    setLoading(true);
    setError('');

    const body = {
      name,
      description,
      jobType,
      ...scheduleConfig,
    };

    if (jobType === 'api') {
      body.apiConfig = {
        method: apiMethod,
        url: apiUrl,
        headers,
        rawHeadersText,
        payloadType,
        payload,
        authType,
        authConfig,
      };
    } else {
      body.codeConfig = {
        language: codeLanguage,
        sourceCode,
        envVars,
      };
    }

    try {
      const created = await apiClient.post('/jobs', body);
      navigate(`/jobs/${created.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-scale">
      <Helmet>
        <title>Create Job | Api Coolie</title>
      </Helmet>

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => (step === 2 && !initialType ? setStep(1) : navigate('/jobs'))}
          className="p-1.5 border border-border/60 hover:bg-muted/10 rounded-lg text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold font-sans">Configure Porter Task</h1>
          <span className="text-xs text-muted-foreground">Step {step} of 2</span>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-lg font-medium">
          {error}
        </div>
      )}

      {/* STEP 1: TYPE PICKER */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div
            onClick={() => handleSelectType('api')}
            className="p-8 border border-border/40 bg-card hover:border-primary rounded-3xl cursor-pointer hover:shadow-md transition-all space-y-4 text-center group"
          >
            <div className="p-4 bg-primary/10 rounded-2xl w-fit mx-auto text-primary group-hover:scale-105 transition-transform">
              <Globe className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Call an API Endpoint</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Automate scheduled calls to webhooks, sync endpoints, or external REST APIs. Complete with query, headers, auth, and body tabs.
            </p>
          </div>

          <div
            onClick={() => handleSelectType('code')}
            className="p-8 border border-border/40 bg-card hover:border-primary rounded-3xl cursor-pointer hover:shadow-md transition-all space-y-4 text-center group"
          >
            <div className="p-4 bg-primary/10 rounded-2xl w-fit mx-auto text-primary group-hover:scale-105 transition-transform">
              <Code2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Run custom Scripts</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Upload custom JavaScript or Python payloads. Runs in isolated V8 environments — no rate limits, no latency, no external service.
            </p>
          </div>
        </div>
      )}

      {/* STEP 2: BUILDER FORM */}
      {step === 2 && (
        <form onSubmit={handleCreateJob} className="space-y-6">

          {/* Base attributes */}
          <div className="border border-border/40 bg-card p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Base Configuration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-muted-foreground" htmlFor="jobName">Job Name</label>
                <input
                  type="text"
                  id="jobName"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-primary"
                  placeholder="e.g. Daily user status sync"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-muted-foreground" htmlFor="jobDesc">Description</label>
                <input
                  type="text"
                  id="jobDesc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-primary"
                  placeholder="Trigger hook to recalculate analytics cache"
                />
              </div>
            </div>
          </div>

          {/* API Config */}
          {jobType === 'api' && (
            <div className="border border-border/40 bg-card p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">API Configuration</h3>

              {/* URL + Method bar */}
              <div className="flex gap-2">
                <select
                  value={apiMethod}
                  onChange={(e) => setApiMethod(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg text-sm bg-background font-bold focus:outline-none min-w-[85px]"
                >
                  {['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <input
                  type="url"
                  value={apiUrl}
                  onChange={(e) => {
                    setApiUrl(e.target.value);
                    syncUrlToQueryParams(e.target.value);
                  }}
                  className="flex-grow px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-primary font-mono"
                  placeholder="https://api.example.com/v1/endpoint"
                />
              </div>

              {/* Postman-style sub-tabs */}
              <div className="border border-border/40 rounded-xl overflow-hidden">
                <div className="flex border-b border-border/40 bg-muted/10">
                  {[
                    { id: 'query', label: 'Query', badge: apiQueryParams.filter(p => p.key && p.enabled !== false).length },
                    { id: 'headers', label: 'Headers', badge: headers.filter(h => h.key && h.enabled !== false).length },
                    { id: 'auth', label: 'Auth', badge: authType !== 'none' ? 1 : 0 },
                    { id: 'body', label: 'Body', badge: (payloadType !== 'none' && payload) ? 1 : 0 },
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
                    <HeaderBuilder headers={headers} onChange={setHeaders} />
                  </div>
                )}

                {/* AUTH */}
                {apiConfigTab === 'auth' && (
                  <div className="p-4 space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {['none', 'bearer', 'basic', 'api_key', 'oauth2', 'custom_header'].map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setAuthType(t)}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                            authType === t
                              ? 'bg-primary/10 border-primary/40 text-primary'
                              : 'border-border/60 text-muted-foreground hover:border-primary/30'
                          }`}
                        >
                          {t === 'none' ? 'None' : t === 'bearer' ? 'Bearer' : t === 'basic' ? 'Basic' : t === 'api_key' ? 'API Key' : t === 'oauth2' ? 'OAuth 2' : 'Custom Header'}
                        </button>
                      ))}
                    </div>

                    {authType === 'bearer' && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Bearer Token</label>
                        <input
                          type="password"
                          value={authConfig.token || ''}
                          onChange={(e) => setAuthConfig({ ...authConfig, token: e.target.value })}
                          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                          className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono"
                        />
                        <p className="text-[10px] text-muted-foreground">Sent as: <code className="font-mono text-primary">Authorization: Bearer &lt;token&gt;</code></p>
                      </div>
                    )}

                    {authType === 'basic' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground">Username</label>
                          <input type="text" value={authConfig.username || ''} onChange={(e) => setAuthConfig({ ...authConfig, username: e.target.value })} placeholder="username" className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground">Password</label>
                          <input type="password" value={authConfig.password || ''} onChange={(e) => setAuthConfig({ ...authConfig, password: e.target.value })} placeholder="••••••••" className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono" />
                        </div>
                      </div>
                    )}

                    {authType === 'api_key' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground">Key Name</label>
                            <input type="text" value={authConfig.key_name || ''} onChange={(e) => setAuthConfig({ ...authConfig, key_name: e.target.value })} placeholder="X-API-Key" className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground">Key Value</label>
                            <input type="password" value={authConfig.key_value || ''} onChange={(e) => setAuthConfig({ ...authConfig, key_value: e.target.value })} placeholder="sk-..." className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono" />
                          </div>
                        </div>
                        <div className="flex gap-3">
                          {['header', 'query'].map(loc => (
                            <label key={loc} className="flex items-center gap-1.5 text-xs cursor-pointer">
                              <input type="radio" name="api_key_location" checked={(authConfig.location || 'header') === loc} onChange={() => setAuthConfig({ ...authConfig, location: loc })} className="h-3.5 w-3.5" />
                              <span>{loc === 'header' ? 'Send as Header' : 'Send as Query Param'}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {authType === 'oauth2' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground">Client ID</label>
                          <input type="text" value={authConfig.client_id || ''} onChange={(e) => setAuthConfig({ ...authConfig, client_id: e.target.value })} placeholder="client_id" className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground">Client Secret</label>
                          <input type="password" value={authConfig.client_secret || ''} onChange={(e) => setAuthConfig({ ...authConfig, client_secret: e.target.value })} placeholder="••••••••" className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono" />
                        </div>
                        <div className="space-y-1.5 col-span-2">
                          <label className="text-xs font-semibold text-muted-foreground">Token URL</label>
                          <input type="url" value={authConfig.token_url || ''} onChange={(e) => setAuthConfig({ ...authConfig, token_url: e.target.value })} placeholder="https://auth.example.com/oauth/token" className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono" />
                        </div>
                        <div className="space-y-1.5 col-span-2">
                          <label className="text-xs font-semibold text-muted-foreground">Scope (optional)</label>
                          <input type="text" value={authConfig.scope || ''} onChange={(e) => setAuthConfig({ ...authConfig, scope: e.target.value })} placeholder="read:data write:data" className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono" />
                        </div>
                      </div>
                    )}

                    {authType === 'custom_header' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground">Header Name</label>
                          <input type="text" value={authConfig.header_name || ''} onChange={(e) => setAuthConfig({ ...authConfig, header_name: e.target.value })} placeholder="X-Custom-Auth" className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground">Header Value</label>
                          <input type="password" value={authConfig.header_value || ''} onChange={(e) => setAuthConfig({ ...authConfig, header_value: e.target.value })} placeholder="••••••••" className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono" />
                        </div>
                      </div>
                    )}

                    {authType === 'none' && (
                      <p className="text-xs text-muted-foreground italic">No authentication will be sent with this request.</p>
                    )}
                  </div>
                )}

                {/* BODY */}
                {apiConfigTab === 'body' && (
                  <div className="p-4 space-y-3">
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
                          onClick={() => setPayloadType(bt.id)}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                            payloadType === bt.id
                              ? 'bg-primary/10 border-primary/40 text-primary'
                              : 'border-border/60 text-muted-foreground hover:border-primary/30'
                          }`}
                        >
                          {bt.label}
                        </button>
                      ))}
                    </div>

                    {payloadType !== 'none' && payloadType !== 'binary' && (
                      <textarea
                        value={payload}
                        onChange={(e) => setPayload(e.target.value)}
                        rows={8}
                        placeholder={
                          payloadType === 'json' ? '{"key": "value"}' :
                          payloadType === 'graphql' ? '{ query: "{ user { id name } }" }' :
                          payloadType === 'xml' ? '<root><key>value</key></root>' :
                          payloadType === 'form' || payloadType === 'form-urlencoded' ? 'key=value&other=data' :
                          'Plain text body...'
                        }
                        className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono resize-y"
                      />
                    )}
                    {payloadType === 'binary' && (
                      <p className="text-xs text-muted-foreground italic py-4 text-center">Binary upload is not supported for scheduled jobs. Use a URL or base64 string in JSON body instead.</p>
                    )}
                    {payloadType === 'none' && (
                      <p className="text-xs text-muted-foreground italic py-2">No request body will be sent.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Code Config */}
          {jobType === 'code' && (
            <div className="border border-border/40 bg-card p-6 rounded-2xl shadow-sm space-y-6">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Script Runner Workspace</h3>
              <CodeRunnerPanel
                language={codeLanguage}
                sourceCode={sourceCode}
                envVars={envVars}
                onChangeLanguage={setCodeLanguage}
                onChangeSourceCode={setSourceCode}
                onChangeEnvVars={setEnvVars}
              />
            </div>
          )}

          {/* Schedule */}
          <div className="border border-border/40 bg-card p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Trigger Scheduler</h3>
            <ScheduleBuilder
              scheduleType={scheduleConfig.scheduleType}
              onChange={setScheduleConfig}
            />
          </div>

          <div className="flex justify-end pt-4 gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => (!initialType ? setStep(1) : navigate('/jobs'))}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={loading}
              className="px-6 font-bold"
            >
              Create Job Schedule
            </Button>
          </div>

        </form>
      )}
    </div>
  );
}
