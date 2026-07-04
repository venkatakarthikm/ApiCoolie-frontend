import React, { useState } from 'react';
import { Sparkles, Send, ThumbsUp, ThumbsDown, MessageSquare, AlertTriangle } from 'lucide-react';
import { apiClient } from '../utils/apiClient.js';
import { Button } from './ui/Button.jsx';
import { CopyButton } from './CopyButton.jsx';

export function AIInsightsAssistant({ executionId }) {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState('');
  const [model, setModel] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Chat follow ups
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [sendingFollowup, setSendingFollowup] = useState(false);
  
  // Feedback states
  const [feedbackGiven, setFeedbackGiven] = useState(null); // 'up' | 'down' | null

  const handleFetchExplanation = async () => {
    setLoading(true);
    setError('');
    setInsight('');
    try {
      const data = await apiClient.post(`/executions/${executionId}/explain`, {});
      if (data.quotaExceeded) {
        setError('Daily AI credit limit exceeded. Please try again tomorrow.');
      } else {
        setInsight(data.insight);
        setModel(data.modelUsed);
        setMessages([{ role: 'assistant', text: data.insight }]);
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to generate explanation logs context.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendFollowUp = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userQuestion = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', text: userQuestion }]);
    setInputValue('');
    setSendingFollowup(true);

    try {
      const data = await apiClient.post(`/executions/${executionId}/explain/followup`, {
        question: userQuestion,
      });
      setMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'error', text: `Failed: ${err.message}` }]);
    } finally {
      setSendingFollowup(false);
    }
  };

  return (
    <div className="border border-primary/20 rounded-2xl bg-primary/5 overflow-hidden">
      {/* Banner top */}
      <div className="px-4 py-3 bg-primary/10 border-b border-primary/20 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-primary animate-pulse" />
          <span className="text-xs font-bold text-primary font-sans">Developer AI Insights Assistant</span>
        </div>
        {success && (
          <span className="text-[9px] font-mono text-muted-foreground">
            Model: {model}
          </span>
        )}
      </div>

      {/* Main card panels */}
      <div className="p-4 space-y-4">
        {!success && !error && (
          <div className="text-center py-6 space-y-3.5">
            <AlertTriangle className="h-8 w-8 text-primary mx-auto opacity-70" />
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              This scheduled runtime failed. Trigger the AI model to redact secrets and analyze the error diagnostics.
            </p>
            <Button
              variant="primary"
              onClick={handleFetchExplanation}
              loading={loading}
              className="text-xs py-2 bg-primary hover:bg-opacity-90"
            >
              ✨ Explain this failure
            </Button>
          </div>
        )}

        {error && (
          <div className="text-center py-4 space-y-3">
            <p className="text-xs text-red-500 font-semibold">{error}</p>
            <Button variant="outline" onClick={handleFetchExplanation} className="text-xs py-1.5">
              Retry AI Analysis
            </Button>
          </div>
        )}

        {success && (
          <div className="space-y-4">
            
            {/* Conversation list */}
            <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 text-xs leading-relaxed ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl p-3.5 border ${
                      msg.role === 'user'
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : msg.role === 'error'
                        ? 'bg-red-500/10 border-red-500/20 text-red-500 font-mono'
                        : 'bg-card text-foreground border-border/45 font-sans'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex justify-between items-center gap-2 mb-2 pb-1 border-b border-border/20">
                        <span className="font-bold text-[10px] text-primary flex items-center gap-1">
                          <Sparkles className="h-3 w-3" /> Diagnostics
                        </span>
                        <CopyButton value={msg.text} />
                      </div>
                    )}
                    <span className="whitespace-pre-line">{msg.text}</span>
                  </div>
                </div>
              ))}

              {sendingFollowup && (
                <div className="flex gap-2 items-center text-xs text-muted-foreground animate-pulse pl-2">
                  <MessageSquare className="h-4 w-4 text-primary shrink-0 animate-spin" />
                  <span>AI assistant is debugging...</span>
                </div>
              )}
            </div>

            {/* Follow-up question controls */}
            <form onSubmit={handleSendFollowUp} className="flex gap-2 pt-2 border-t border-border/20">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask follow-up (e.g. how do I mock this API?)"
                className="flex-1 px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={sendingFollowup || !inputValue.trim()}
                className="bg-primary text-white p-2 rounded-lg hover:bg-opacity-95 disabled:opacity-40 transition-colors"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>

            {/* Feedback controls */}
            <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground">
              <span>Was this insight diagnosis helpful?</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFeedbackGiven('up')}
                  className={`p-1 hover:text-foreground transition-colors ${feedbackGiven === 'up' ? 'text-primary' : ''}`}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackGiven('down')}
                  className={`p-1 hover:text-foreground transition-colors ${feedbackGiven === 'down' ? 'text-primary' : ''}`}
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
