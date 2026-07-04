import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/Button.jsx';
import { showToast } from '../utils/toast.js';
import { Globe, RefreshCw, Clipboard, Download, Upload } from 'lucide-react';

export function JsonFormatterPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [loadingApi, setLoadingApi] = useState(false);
  const [indentSpace, setIndentSpace] = useState('2'); // '2' | '4' | 'tab'

  const getIndent = () => {
    if (indentSpace === 'tab') return '\t';
    return parseInt(indentSpace, 10);
  };

  const handleFetchFromApi = async () => {
    if (!apiUrl) {
      showToast('Please enter an API URL.', 'error');
      return;
    }
    setLoadingApi(true);
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setInputText(JSON.stringify(data, null, 2));
      showToast('Data fetched successfully from API.', 'success');
    } catch (e) {
      showToast(`Fetch failed: ${e.message}`, 'error');
    } finally {
      setLoadingApi(false);
    }
  };

  const handleFormat = () => {
    try {
      if (!inputText.trim()) return;
      const parsed = JSON.parse(inputText);
      setOutputText(JSON.stringify(parsed, null, getIndent()));
      showToast('JSON Formatted & Beautified successfully.', 'success');
    } catch (e) {
      showToast(`Invalid JSON: ${e.message}`, 'error');
    }
  };

  const handleValidate = () => {
    try {
      if (!inputText.trim()) return;
      JSON.parse(inputText);
      showToast('Valid JSON Structure! ✅', 'success');
    } catch (e) {
      showToast(`Invalid JSON Structure: ${e.message} ❌`, 'error');
    }
  };

  const handleMinify = () => {
    try {
      if (!inputText.trim()) return;
      const parsed = JSON.parse(inputText);
      setOutputText(JSON.stringify(parsed));
      showToast('JSON Minified successfully.', 'success');
    } catch (e) {
      showToast(`Invalid JSON: ${e.message}`, 'error');
    }
  };

  const handleToOneLine = () => {
    try {
      if (!inputText.trim()) return;
      const parsed = JSON.parse(inputText);
      setOutputText(JSON.stringify(parsed).replace(/\n/g, ''));
      showToast('Converted to single line.', 'success');
    } catch (e) {
      showToast(`Invalid JSON: ${e.message}`, 'error');
    }
  };

  const handleSort = () => {
    try {
      if (!inputText.trim()) return;
      const parsed = JSON.parse(inputText);
      
      const sortObject = (obj) => {
        if (obj === null || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(sortObject);
        return Object.keys(obj).sort().reduce((sorted, key) => {
          sorted[key] = sortObject(obj[key]);
          return sorted;
        }, {});
      };

      const sorted = sortObject(parsed);
      setOutputText(JSON.stringify(sorted, null, getIndent()));
      showToast('JSON Keys sorted alphabetically.', 'success');
    } catch (e) {
      showToast(`Invalid JSON: ${e.message}`, 'error');
    }
  };

  // Converters
  const convertToXml = () => {
    try {
      if (!inputText.trim()) return;
      const parsed = JSON.parse(inputText);
      
      const jsonToXmlStr = (obj, nodeName = 'root') => {
        let xml = '';
        if (typeof obj !== 'object' || obj === null) {
          return `<${nodeName}>${obj}</${nodeName}>`;
        }
        if (Array.isArray(obj)) {
          obj.forEach(item => {
            xml += jsonToXmlStr(item, 'item');
          });
          return `<${nodeName}>${xml}</${nodeName}>`;
        }
        for (const prop in obj) {
          xml += jsonToXmlStr(obj[prop], prop);
        }
        return `<${nodeName}>${xml}</${nodeName}>`;
      };

      setOutputText(`<?xml version="1.0" encoding="UTF-8" ?>\n${jsonToXmlStr(parsed)}`);
      showToast('Converted JSON to XML.', 'success');
    } catch (e) {
      showToast(`Invalid JSON: ${e.message}`, 'error');
    }
  };

  const convertToYaml = () => {
    try {
      if (!inputText.trim()) return;
      const parsed = JSON.parse(inputText);

      const jsonToYamlStr = (obj, depth = 0) => {
        const spacing = '  '.repeat(depth);
        let yaml = '';
        if (typeof obj !== 'object' || obj === null) {
          return ` ${obj}\n`;
        }
        if (Array.isArray(obj)) {
          yaml += '\n';
          obj.forEach(item => {
            yaml += `${spacing}- ${jsonToYamlStr(item, depth + 1).trim()}\n`;
          });
          return yaml;
        }
        yaml += '\n';
        for (const prop in obj) {
          const valStr = jsonToYamlStr(obj[prop], depth + 1);
          yaml += `${spacing}${prop}:${valStr.startsWith('\n') ? valStr : ' ' + valStr.trim()}\n`;
        }
        return yaml;
      };

      setOutputText(jsonToYamlStr(parsed).trim());
      showToast('Converted JSON to YAML.', 'success');
    } catch (e) {
      showToast(`Invalid JSON: ${e.message}`, 'error');
    }
  };

  const convertToCsv = () => {
    try {
      if (!inputText.trim()) return;
      let parsed = JSON.parse(inputText);
      if (!Array.isArray(parsed)) {
        parsed = [parsed];
      }
      
      const keys = Object.keys(parsed[0] || {});
      const csvRows = [];
      csvRows.push(keys.join(','));

      for (const row of parsed) {
        const values = keys.map(key => {
          const val = row[key];
          return typeof val === 'object' ? `"${JSON.stringify(val).replace(/"/g, '""')}"` : `"${String(val).replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
      }

      setOutputText(csvRows.join('\n'));
      showToast('Converted JSON to CSV.', 'success');
    } catch (e) {
      showToast(`Invalid JSON: ${e.message}`, 'error');
    }
  };

  const convertToTsv = () => {
    try {
      if (!inputText.trim()) return;
      let parsed = JSON.parse(inputText);
      if (!Array.isArray(parsed)) {
        parsed = [parsed];
      }
      
      const keys = Object.keys(parsed[0] || {});
      const tsvRows = [];
      tsvRows.push(keys.join('\t'));

      for (const row of parsed) {
        const values = keys.map(key => {
          const val = row[key];
          return typeof val === 'object' ? `"${JSON.stringify(val).replace(/"/g, '""')}"` : `"${String(val).replace(/"/g, '""')}"`;
        });
        tsvRows.push(values.join('\t'));
      }

      setOutputText(tsvRows.join('\n'));
      showToast('Converted JSON to TSV.', 'success');
    } catch (e) {
      showToast(`Invalid JSON: ${e.message}`, 'error');
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!', 'success');
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'converted_data.txt';
    link.click();
  };

  return (
    <div className="space-y-6 animate-scale h-full flex flex-col">
      <Helmet>
        <title>JSON Formatting Suite & Converters | Api Coolie</title>
      </Helmet>

      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-bold font-sans">JSON Formatter Suite</h1>
          <p className="text-xs text-muted-foreground">Format, validate, prettify, sort, or convert JSON payloads instantly.</p>
        </div>
      </div>

      {/* Fetch API Bar */}
      <div className="flex gap-2 bg-muted/5 p-4 rounded-2xl border border-border/40 flex-wrap sm:flex-nowrap items-center">
        <Globe className="h-4 w-4 text-primary shrink-0" />
        <input
          type="url"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          placeholder="Fetch JSON from endpoint (e.g. https://api.ipify.org?format=json)"
          className="flex-grow px-3 py-1.5 border border-border rounded-lg text-xs bg-background focus:outline-none focus:border-primary font-mono"
        />
        <Button
          variant="primary"
          onClick={handleFetchFromApi}
          loading={loadingApi}
          className="text-xs py-1.5 shrink-0"
        >
          Get Data
        </Button>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 flex-grow items-stretch min-h-[500px]">
        {/* Left Side: Input JSON */}
        <div className="lg:col-span-3 border border-border/40 bg-card rounded-2xl p-4 flex flex-col space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-muted-foreground">Input Data</span>
            <button
              onClick={() => handleCopyToClipboard(inputText)}
              className="text-[10px] text-primary font-semibold hover:underline"
            >
              Copy
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste raw JSON here..."
            className="w-full flex-grow p-3 border border-border rounded-lg font-mono text-xs bg-background focus:outline-none resize-none min-h-[300px]"
          />
        </div>

        {/* Center: Conversion & Format Operations */}
        <div className="lg:col-span-1 flex flex-col justify-center gap-2 p-2 bg-muted/5 rounded-2xl border border-border/40">
          <select
            value={indentSpace}
            onChange={(e) => setIndentSpace(e.target.value)}
            className="px-2 py-1.5 border border-border rounded-lg bg-background text-xs text-center font-semibold mb-2"
          >
            <option value="2">2 Spaces</option>
            <option value="4">4 Spaces</option>
            <option value="tab">1 Tab</option>
          </select>

          <Button variant="primary" onClick={handleFormat} className="text-xs py-1.5 w-full">
            Format / Beautify
          </Button>
          <Button variant="outline" onClick={handleValidate} className="text-xs py-1.5 w-full">
            Validate JSON
          </Button>
          <Button variant="outline" onClick={handleMinify} className="text-xs py-1.5 w-full">
            Minify / Compact
          </Button>
          <Button variant="outline" onClick={handleToOneLine} className="text-xs py-1.5 w-full">
            JSON to One Line
          </Button>
          <Button variant="outline" onClick={handleSort} className="text-xs py-1.5 w-full">
            Sort Keys
          </Button>

          <hr className="border-border/50 my-2" />
          <span className="text-[9px] font-bold text-center text-muted-foreground uppercase tracking-wider block mb-1">Convert JSON to</span>

          <Button variant="outline" onClick={convertToXml} className="text-[11px] py-1 w-full">
            XML
          </Button>
          <Button variant="outline" onClick={convertToYaml} className="text-[11px] py-1 w-full">
            YAML
          </Button>
          <Button variant="outline" onClick={convertToCsv} className="text-[11px] py-1 w-full">
            CSV
          </Button>
          <Button variant="outline" onClick={convertToTsv} className="text-[11px] py-1 w-full">
            TSV
          </Button>
        </div>

        {/* Right Side: Output Formatted */}
        <div className="lg:col-span-3 border border-border/40 bg-card rounded-2xl p-4 flex flex-col space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-muted-foreground">Output / Formatted Result</span>
            <div className="flex gap-3 text-[10px]">
              <button
                onClick={() => handleCopyToClipboard(outputText)}
                className="text-primary font-semibold hover:underline"
              >
                Copy Output
              </button>
              <button
                onClick={handleDownload}
                className="text-primary font-semibold hover:underline"
              >
                Download
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={outputText}
            placeholder="Result will display here..."
            className="w-full flex-grow p-3 border border-border rounded-lg font-mono text-xs bg-muted/10 text-foreground resize-none min-h-[300px]"
          />
        </div>
      </div>
    </div>
  );
}
