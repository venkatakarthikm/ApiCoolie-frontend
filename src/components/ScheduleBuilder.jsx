import React, { useState, useEffect } from 'react';
import cronstrue from 'cronstrue';
import { Calendar, ChevronDown, ChevronUp, RefreshCw, AlertCircle, Clock } from 'lucide-react';
import { apiClient } from '../utils/apiClient.js';

const COMMON_TIMEZONES = [
  'UTC',
  'Asia/Kolkata',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Australia/Sydney',
];

export function ScheduleBuilder({
  scheduleType,
  cronExpression,
  intervalMs,
  weeklyDays,
  runTime,
  timezone,
  retryPolicy,
  repeatUntilMatch,
  onChange
}) {
  const [activeMode, setActiveMode] = useState(scheduleType || 'manual_only');
  const [cronText, setCronText] = useState(cronExpression || '*/5 * * * *');
  const [intervalVal, setIntervalVal] = useState(intervalMs ? String(intervalMs) : '60000');
  const [selectedDays, setSelectedDays] = useState(weeklyDays || []);
  const [timeVal, setTimeVal] = useState(runTime || '12:00:00');
  const [tzVal, setTzVal] = useState(timezone || 'UTC');
  const [tzSearch, setTzSearch] = useState('');
  const [showTzDropdown, setShowTzDropdown] = useState(false);

  // Accordion Toggles
  const [accordionOpen, setAccordionOpen] = useState(false);

  // Advanced configurations
  const [maxRetries, setMaxRetries] = useState(retryPolicy?.max_retries || 3);
  const [backoffType, setBackoffType] = useState(retryPolicy?.backoff_type || 'fixed');
  const [backoffSeconds, setBackoffSeconds] = useState(retryPolicy?.backoff_seconds || 10);

  const [matchEnabled, setMatchEnabled] = useState(repeatUntilMatch?.enabled || false);
  const [matchWord, setMatchWord] = useState(repeatUntilMatch?.match_word || '');
  const [matchField, setMatchField] = useState(repeatUntilMatch?.field || 'response_body');
  const [matchAttempts, setMatchAttempts] = useState(repeatUntilMatch?.max_attempts || 3);

  // Next run times state
  const [nextRuns, setNextRuns] = useState([]);
  const [cronExplain, setCronExplain] = useState('');
  const [cronError, setCronError] = useState('');

  // Sync props when job configuration resolves
  useEffect(() => {
    if (scheduleType) setActiveMode(scheduleType);
  }, [scheduleType]);

  useEffect(() => {
    if (cronExpression) setCronText(cronExpression);
  }, [cronExpression]);

  useEffect(() => {
    if (intervalMs) setIntervalVal(String(intervalMs));
  }, [intervalMs]);

  useEffect(() => {
    if (weeklyDays) setSelectedDays(weeklyDays);
  }, [weeklyDays]);

  useEffect(() => {
    if (runTime) setTimeVal(runTime);
  }, [runTime]);

  useEffect(() => {
    if (timezone) setTzVal(timezone);
  }, [timezone]);

  useEffect(() => {
    if (retryPolicy) {
      setMaxRetries(retryPolicy.max_retries || 3);
      setBackoffType(retryPolicy.backoff_type || 'fixed');
      setBackoffSeconds(retryPolicy.backoff_seconds || 10);
    }
  }, [retryPolicy]);

  useEffect(() => {
    if (repeatUntilMatch) {
      setMatchEnabled(repeatUntilMatch.enabled || false);
      setMatchWord(repeatUntilMatch.match_word || '');
      setMatchField(repeatUntilMatch.field || 'response_body');
      setMatchAttempts(repeatUntilMatch.max_attempts || 3);
    }
  }, [repeatUntilMatch]);

  // Validate cron expressions with backend
  useEffect(() => {
    if (activeMode === 'cron' && cronText) {
      // Client-side translation
      try {
        const translation = cronstrue.toString(cronText);
        setCronExplain(translation);
        setCronError('');
      } catch (err) {
        setCronExplain('');
        setCronError('Invalid cron syntax expression.');
      }

      // Server-side next runs calculation
      const delay = setTimeout(async () => {
        try {
          const res = await apiClient.post('/jobs/validate-cron', {
            cronExpression: cronText,
            timezone: tzVal
          });
          if (res.valid) {
            setNextRuns(res.nextRuns);
          } else {
            setNextRuns([]);
          }
        } catch (e) {
          setNextRuns([]);
        }
      }, 500);

      return () => clearTimeout(delay);
    } else {
      setNextRuns([]);
      setCronExplain('');
      setCronError('');
    }
  }, [cronText, activeMode, tzVal]);

  // Bubble changes up to parent container
  useEffect(() => {
    const changes = {
      scheduleType: activeMode,
      timezone: tzVal,
      cronExpression: activeMode === 'cron' ? cronText : null,
      intervalMs: activeMode === 'interval' ? Number(intervalVal) : null,
      weeklyDays: activeMode === 'weekly_days' ? selectedDays : [],
      runTime: activeMode === 'weekly_days' ? timeVal : null,
      retryPolicy: {
        max_retries: Number(maxRetries),
        backoff_type: backoffType,
        backoff_seconds: Number(backoffSeconds),
      },
      repeatUntilMatch: {
        enabled: matchEnabled,
        match_word: matchWord,
        field: matchField,
        max_attempts: Number(matchAttempts),
      },
    };
    onChange(changes);
  }, [
    activeMode, cronText, intervalVal, selectedDays, timeVal, tzVal,
    maxRetries, backoffType, backoffSeconds, matchEnabled, matchWord, matchField, matchAttempts
  ]);

  const toggleDay = (dayIndex) => {
    setSelectedDays(prev =>
      prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex].sort()
    );
  };

  const weekdays = [
    { label: 'S', idx: 0, fullName: 'Sunday' },
    { label: 'M', idx: 1, fullName: 'Monday' },
    { label: 'T', idx: 2, fullName: 'Tuesday' },
    { label: 'W', idx: 3, fullName: 'Wednesday' },
    { label: 'T', idx: 4, fullName: 'Thursday' },
    { label: 'F', idx: 5, fullName: 'Friday' },
    { label: 'S', idx: 6, fullName: 'Saturday' },
  ];

  const filteredTzs = COMMON_TIMEZONES.filter(tz =>
    tz.toLowerCase().includes(tzSearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Schedule modes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/40 pb-2 gap-2">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'cron', label: 'Cron' },
            { id: 'interval', label: 'Interval' },
            { id: 'weekly_days', label: 'Weekly Days' },
            { id: 'manual_only', label: 'Manual Only' },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setActiveMode(mode.id)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                activeMode === mode.id
                  ? 'bg-primary/10 border-primary/20 text-primary'
                  : 'border-border/60 hover:bg-muted/15 text-muted-foreground'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-muted-foreground uppercase font-bold">Schedule Trigger</span>
      </div>

      {/* Mode Configurations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          
          {/* Cron configuration */}
          {activeMode === 'cron' && (
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase text-muted-foreground" htmlFor="cronExp">Cron Expression</label>
              <input
                type="text"
                id="cronExp"
                value={cronText}
                onChange={(e) => setCronText(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono"
                placeholder="*/5 * * * * *"
              />
              {cronExplain && (
                <p className="text-[10px] text-primary font-semibold flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Runs {cronExplain.toLowerCase()}
                </p>
              )}
              {cronError && (
                <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" /> {cronError}
                </p>
              )}
            </div>
          )}

          {/* Interval configuration */}
          {activeMode === 'interval' && (
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase text-muted-foreground" htmlFor="intervalVal">Trigger Cycle (ms)</label>
              <input
                type="number"
                id="intervalVal"
                min="1000"
                value={intervalVal}
                onChange={(e) => setIntervalVal(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono"
                placeholder="60000"
              />
              <span className="text-[10px] text-muted-foreground block">
                Minimum trigger: 1000ms (1 second). Value represents elapsed interval loop.
              </span>
            </div>
          )}

          {/* Weekly Days configuration */}
          {activeMode === 'weekly_days' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <span className="block text-[10px] font-bold uppercase text-muted-foreground">Select Days</span>
                <div className="flex gap-1.5">
                  {weekdays.map((day) => {
                    const selected = selectedDays.includes(day.idx);
                    return (
                      <button
                        key={day.idx}
                        type="button"
                        onClick={() => toggleDay(day.idx)}
                        className={`w-8 h-8 rounded-full border text-xs font-bold transition-all flex items-center justify-center ${
                          selected
                            ? 'bg-primary text-white border-primary shadow-glass'
                            : 'border-border/60 hover:bg-muted/15 text-muted-foreground'
                        }`}
                        title={day.fullName}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase text-muted-foreground" htmlFor="runTime">Execution Time (HH:mm:ss)</label>
                <input
                  type="text"
                  id="runTime"
                  value={timeVal}
                  onChange={(e) => setTimeVal(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono"
                  placeholder="12:00:00"
                />
              </div>
            </div>
          )}

          {/* Manual Only */}
          {activeMode === 'manual_only' && (
            <div className="p-4 border border-border/40 bg-muted/5 text-xs text-muted-foreground rounded-xl italic">
              Job runs only when clicked or via programmatic api calls. No scheduled cycle.
            </div>
          )}
        </div>

        {/* Timezone & Next runs panel */}
        {(activeMode === 'weekly_days' || (activeMode === 'cron' && nextRuns.length > 0)) && (
          <div className="space-y-3 bg-muted/5 border border-border/40 p-4 rounded-xl relative">
            {activeMode === 'weekly_days' && (
              <div className="space-y-1.5">
                <span className="block text-[10px] font-bold uppercase text-muted-foreground">Target Timezone</span>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowTzDropdown(prev => !prev)}
                    className="w-full text-left px-3 py-2 border border-border rounded-lg text-xs bg-background focus:outline-none flex justify-between items-center"
                  >
                    <span>{tzVal}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  {showTzDropdown && (
                    <div className="absolute top-9 left-0 right-0 z-50 border border-border bg-card rounded-lg shadow-lg max-h-44 overflow-y-auto p-1.5 space-y-1">
                      <input
                        type="text"
                        value={tzSearch}
                        onChange={(e) => setTzSearch(e.target.value)}
                        placeholder="Filter timezone..."
                        className="w-full px-2 py-1.5 border border-border rounded-md text-[10px] bg-background focus:outline-none mb-1.5"
                      />
                      {filteredTzs.map(tz => (
                        <button
                          key={tz}
                          type="button"
                          onClick={() => {
                            setTzVal(tz);
                            setShowTzDropdown(false);
                          }}
                          className="w-full text-left px-2 py-1 text-[10px] rounded hover:bg-primary hover:text-white transition-colors"
                        >
                          {tz}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-muted-foreground">We handle Daylight Savings transitions automatically.</span>
              </div>
            )}

            {/* Next runtimes preview */}
            {nextRuns.length > 0 && (
              <div className="space-y-1 pt-1">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Next 5 Scheduled Runs</span>
                <ul className="space-y-1 font-mono text-[9px] text-foreground">
                  {nextRuns.map((run, i) => (
                    <li key={i} className="flex gap-2 items-center">
                      <span className="text-primary">&bull;</span>
                      <span>{new Date(run).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Advanced Configurations Accordion */}
      <div className="border border-border/40 rounded-xl overflow-hidden bg-card">
        <button
          type="button"
          onClick={() => setAccordionOpen(prev => !prev)}
          className="w-full px-4 py-3 border-b border-border/40 flex items-center justify-between hover:bg-muted/10 transition-colors text-xs font-bold text-muted-foreground"
        >
          <span>Advanced Trigger Settings (Retry & Stop-rules)</span>
          {accordionOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {accordionOpen && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x divide-border/30">
            {/* Left: Retries */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-foreground">Retry Policy</h4>
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[9px] font-semibold text-muted-foreground mb-1" htmlFor="maxRetries">Max Retries</label>
                  <input
                    type="number"
                    id="maxRetries"
                    min="0"
                    max="10"
                    value={maxRetries}
                    onChange={(e) => setMaxRetries(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-border rounded-lg text-xs bg-background font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-semibold text-muted-foreground mb-1" htmlFor="backoffType">Backoff Type</label>
                  <select
                    id="backoffType"
                    value={backoffType}
                    onChange={(e) => setBackoffType(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-border rounded-lg text-xs bg-background"
                  >
                    <option value="fixed">Fixed</option>
                    <option value="exponential">Exponential</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-semibold text-muted-foreground mb-1" htmlFor="backoffSec">Backoff Delay (seconds)</label>
                <input
                  type="number"
                  id="backoffSec"
                  min="1"
                  value={backoffSeconds}
                  onChange={(e) => setBackoffSeconds(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-border rounded-lg text-xs bg-background font-mono"
                />
              </div>
            </div>

            {/* Right: Repeat until match */}
            <div className="space-y-3.5 pt-4 md:pt-0 md:pl-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-foreground">Repeat Until Match</h4>
                <input
                  type="checkbox"
                  checked={matchEnabled}
                  onChange={(e) => setMatchEnabled(e.target.checked)}
                  className="h-4.5 w-4.5 text-primary focus:ring-primary rounded border-border"
                />
              </div>
              {matchEnabled ? (
                <div className="space-y-3 animate-scale">
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[9px] font-semibold text-muted-foreground mb-1" htmlFor="matchField">Compare Field</label>
                      <select
                        id="matchField"
                        value={matchField}
                        onChange={(e) => setMatchField(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-border rounded-lg text-xs bg-background"
                      >
                        <option value="response_body">Response Body</option>
                        <option value="status_code">Status Code</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-muted-foreground mb-1" htmlFor="matchAttempts">Max Loop Attempts</label>
                      <input
                        type="number"
                        id="matchAttempts"
                        min="2"
                        max="20"
                        value={matchAttempts}
                        onChange={(e) => setMatchAttempts(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-border rounded-lg text-xs bg-background font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-semibold text-muted-foreground mb-1" htmlFor="matchWord">Match Target (Substring / Code)</label>
                    <input
                      type="text"
                      id="matchWord"
                      value={matchWord}
                      onChange={(e) => setMatchWord(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-border rounded-lg text-xs bg-background font-mono"
                      placeholder="e.g. success or 200"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic leading-relaxed pt-2">
                  When enabled, jobs repeat executions immediately until the output matches a word limit, safeguarding webhook consistency.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
