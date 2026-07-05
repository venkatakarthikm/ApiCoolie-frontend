import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Settings, Plus, Trash, Eye, Code, Terminal, KeyRound } from 'lucide-react';
import { Button } from './ui/Button.jsx';
import { RunOutputPanel } from './RunOutputPanel.jsx';
import { apiClient } from '../utils/apiClient.js';
import { showToast } from '../utils/toast.js';

const TEMPLATES = {
  javascript: `// Api Coolie — JavaScript Worker
// Supports top-level await, fetch(), process.env, and console.*

const res = await fetch('https://httpbin.org/json');
const data = await res.json();
console.log('Status:', res.status);
console.log('Response:', data);
`,
  python: `# Api Coolie — Python Worker
import os
import urllib.request, json

req = urllib.request.Request('https://httpbin.org/json')
with urllib.request.urlopen(req) as r:
    data = json.loads(r.read().decode())
print('Response:', data)
`,
};


export function CodeRunnerPanel({
  language,
  sourceCode,
  envVars,
  jobId,
  onChangeLanguage,
  onChangeSourceCode,
  onChangeEnvVars
}) {
  const [lang, setLang] = useState(language || 'javascript');
  const [code, setCode] = useState(sourceCode || TEMPLATES.javascript);
  const [envs, setEnvs] = useState([]);
  
  // Running state
  const [isRunning, setIsRunning] = useState(false);
  const [currentExecutionId, setCurrentExecutionId] = useState(null);

  // AI Chat states
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: "Hello! I can help write scripts. Try asking: 'fetch API', 'discord webhook', 'slack alert', or 'data processing'." }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      let reply = "I can help write scripts. Try asking for: 'fetch API', 'discord webhook', 'slack alert', or 'data processing'.";
      let codeToInject = null;

      const lower = userMsg.toLowerCase();
      if (lower.includes('fetch') || lower.includes('get api') || lower.includes('http')) {
        reply = "Here is a code template to fetch data from an HTTP endpoint and parse it.";
        codeToInject = lang === 'javascript'
          ? `const res = await fetch('https://httpbin.org/json');\nconst data = await res.json();\nconsole.log(data);`
          : `import urllib.request, json\nwith urllib.request.urlopen('https://httpbin.org/json') as r:\n    print(json.loads(r.read().decode()))`;
      } else if (lower.includes('discord') || lower.includes('discord webhook')) {
        reply = "Here is a code block to send embedded alerts to a Discord webhook address.";
        codeToInject = `const webhookUrl = 'https://discord.com/api/webhooks/ID';\nfetch(webhookUrl, {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ content: 'Hello from Api Coolie!' })\n}).then(() => console.log('Alert sent!'));`;
      } else if (lower.includes('slack') || lower.includes('slack alert')) {
        reply = "Here is a snippet to send notification payload requests to your Slack channel.";
        codeToInject = `fetch('https://hooks.slack.com/services/YOUR/TOKEN', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ text: 'Hello Slack!' })\n});`;
      } else if (lower.includes('format') || lower.includes('data') || lower.includes('clean')) {
        reply = "Here is a basic script to filter data rows and output sorted JSON objects.";
        codeToInject = `const data = [{ val: 10 }, { val: 5 }, { val: 20 }];\nconst filtered = data.filter(item => item.val > 8);\nconsole.log(JSON.stringify(filtered));`;
      }

      setChatHistory(prev => [...prev, { role: 'assistant', content: reply, codeToInject }]);
    }, 600);
  };

  const handleInjectCode = (codeText) => {
    setCode(codeText);
    onChangeSourceCode(codeText);
    showToast('Code injected into Monaco workspace!', 'success');
  };


  // Sync initial variables mapping
  useEffect(() => {
    if (envVars) {
      const parsed = typeof envVars === 'string' ? JSON.parse(envVars) : envVars;
      if (parsed && typeof parsed === 'object') {
        const rows = Object.entries(parsed).map(([k, v]) => ({ key: k, value: String(v) }));
        setEnvs(rows);
      }
    }
  }, [envVars]);

  // Sync prop changes for sourceCode and language on load
  useEffect(() => {
    if (sourceCode) {
      setCode(sourceCode);
    }
  }, [sourceCode]);

  useEffect(() => {
    if (language) {
      setLang(language);
    }
  }, [language]);


  const handleTemplateSelect = (selectedLang) => {
    setLang(selectedLang);
    onChangeLanguage(selectedLang);
    const codeTemplate = TEMPLATES[selectedLang];
    setCode(codeTemplate);
    onChangeSourceCode(codeTemplate);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    onChangeSourceCode(newCode || '');
  };

  const handleAddEnv = () => {
    const updated = [...envs, { key: '', value: '' }];
    setEnvs(updated);
    saveEnvVars(updated);
  };

  const handleRemoveEnv = (idx) => {
    const updated = envs.filter((_, i) => i !== idx);
    setEnvs(updated);
    saveEnvVars(updated);
  };

  const handleEnvChange = (idx, field, val) => {
    const updated = envs.map((r, i) => {
      if (i === idx) {
        return { ...r, [field]: val };
      }
      return r;
    });
    setEnvs(updated);
    saveEnvVars(updated);
  };

  const saveEnvVars = (rows) => {
    const obj = {};
    rows.forEach(r => {
      if (r.key) obj[r.key] = r.value;
    });
    onChangeEnvVars(obj);
  };

  // Run dry run test triggers
  const handleTestRun = async () => {
    if (!jobId) {
      showToast('Please save the job configuration first to execute a test run.', 'error');
      return;
    }
    setIsRunning(true);
    setCurrentExecutionId(null);
    try {
      const envVarsObj = {};
      envs.forEach(r => {
        if (r.key) envVarsObj[r.key] = r.value;
      });

      const body = {
        codeConfig: {
          language: lang,
          sourceCode: code,
          envVars: envVarsObj,
        }
      };

      const result = await apiClient.post(`/jobs/${jobId}/test-run`, body);
      setCurrentExecutionId(result.id);
      showToast('Dry run executed with unsaved code edits!', 'success');
    } catch (error) {
      showToast(`Execution trigger failed: ${error.message}`, 'error');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 w-full">
      
      {/* IDE EDITOR & CONFIG (FULL WIDTH) */}
      <div className="space-y-4 flex flex-col w-full">
        {/* Lang toggler and run triggers */}
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div className="flex gap-2 items-center">
            {jobId ? (
              <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 bg-muted/20 px-3 py-1.5 rounded-lg border border-border/40 font-sans">
                <Code className="h-4 w-4 text-primary animate-pulse" />
                Active Language: <span className="text-foreground capitalize">{lang}</span>
              </span>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleTemplateSelect('javascript')}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                    lang === 'javascript'
                      ? 'bg-primary/10 border-primary/20 text-primary'
                      : 'border-border/60 hover:bg-muted/15 text-muted-foreground'
                  }`}
                >
                  JavaScript (Node.js)
                </button>
                <button
                  type="button"
                  onClick={() => handleTemplateSelect('python')}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                    lang === 'python'
                      ? 'bg-primary/10 border-primary/20 text-primary'
                      : 'border-border/60 hover:bg-muted/15 text-muted-foreground'
                  }`}
                >
                  Python 3
                </button>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {code !== sourceCode && (
              <Button
                variant="outline"
                onClick={() => {
                  setCode(sourceCode || '');
                  onChangeSourceCode(sourceCode || '');
                  showToast('Reverted workspace to saved script.', 'info');
                }}
                className="px-3 py-1.5 text-xs font-semibold text-muted-foreground border-border/60 hover:bg-muted/10"
              >
                Revert to Saved
              </Button>
            )}
            <Button
              onClick={handleTestRun}
              loading={isRunning}
              className="px-4 py-1.5 text-xs font-bold bg-green-600 hover:bg-green-700 text-white shrink-0 flex items-center gap-1.5"
            >
              <Play className="h-3.5 w-3.5 fill-current" /> Run Script
            </Button>
          </div>
        </div>

        {/* Monaco Code Editor & AI Chat Assistant side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 h-[520px] border border-border/40 rounded-xl overflow-hidden bg-card">
            <Editor
              height="100%"
              language={lang}
              theme="vs-dark"
              value={code}
              onChange={handleCodeChange}
              options={{
                minimap: { enabled: false },
                fontSize: 12,
                lineNumbers: 'on',
                fontFamily: 'JetBrains Mono',
                scrollbar: { verticalScrollbarSize: 6 },
              }}
            />
          </div>

          <div className="lg:col-span-1 border border-border/40 rounded-xl p-4 bg-card flex flex-col justify-between h-[520px] text-xs">
            <div className="flex items-center gap-1.5 border-b border-border/40 pb-2 mb-2 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
              <span>AI Chat Assistant</span>
            </div>
            
            <div className="flex-grow overflow-y-auto space-y-3 pr-1 text-[11px] leading-relaxed max-h-[400px]">
              {chatHistory.map((m, i) => (
                <div key={i} className={`p-2.5 rounded-xl ${m.role === 'user' ? 'bg-primary/10 text-foreground ml-3' : 'bg-muted/15 text-muted-foreground mr-3'}`}>
                  <span className="block font-bold text-[9px] uppercase tracking-wider mb-1">{m.role === 'user' ? 'You' : 'Assistant'}</span>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.codeToInject && (
                    <button
                      type="button"
                      onClick={() => handleInjectCode(m.codeToInject)}
                      className="mt-2 text-[10px] text-primary font-bold hover:underline flex items-center gap-1"
                    >
                      Inject code
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-border/30 flex gap-2 items-center">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="Ask AI to write code..."
                className="flex-grow px-2 py-1.5 border border-border rounded-lg bg-background text-[11px] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSendChat}
                className="px-3 py-1.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/95 transition-all text-[11px]"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Encrypted Env variables manager */}
        <div className="border border-border/40 rounded-xl p-4 bg-card space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" />
              <span>Encrypted Environment Variables</span>
            </h4>
            <span className="text-[9px] text-green-500 uppercase font-bold bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">Injected Server-side</span>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {envs.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-2">No variables configured. Access process.env (JS) or os.environ (Python) keys.</p>
            ) : (
              envs.map((env, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Var Key (e.g. API_KEY)"
                    value={env.key}
                    onChange={(e) => handleEnvChange(idx, 'key', e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono"
                  />
                  <input
                    type="text"
                    placeholder="Value (Hidden at rest)"
                    value={env.value === '[MASKED]' ? '' : env.value}
                    onChange={(e) => handleEnvChange(idx, 'value', e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveEnv(idx)}
                    className="text-red-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          <button
            type="button"
            onClick={handleAddEnv}
            className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
          >
            <Plus className="h-3.5 w-3.5" /> Add custom env variable
          </button>
        </div>

      </div>

      {/* RIGHT COLUMN: RUN OUTPUT SIDE-BY-SIDE SPLIT */}
      <div className="flex flex-col h-full justify-stretch">
        {currentExecutionId ? (
          <RunOutputPanel
            executionId={currentExecutionId}
            onClose={() => setCurrentExecutionId(null)}
          />
        ) : (
          <div className="border border-dashed border-border rounded-2xl flex-1 flex flex-col items-center justify-center p-8 text-center bg-muted/5 min-h-[200px] text-muted-foreground space-y-4">
            <Terminal className="h-10 w-10 text-muted-foreground/60" />
            <div className="space-y-1 max-w-xs">
              <h4 className="text-xs font-bold text-foreground">Script Output Console</h4>
              <p className="text-[11px] leading-relaxed">
                Click <strong>"Run Script"</strong> to execute your code instantly.
                All <code className="font-mono text-primary">console.log</code> output appears here.
              </p>
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-green-500 mt-2 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Runs locally · No rate limits · Supports large code
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
