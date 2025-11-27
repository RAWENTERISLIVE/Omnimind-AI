import React, { useState } from 'react';
import { Globe, Server, Terminal, Play, Loader2, Settings } from 'lucide-react';
import { customModelRequest } from '../services/geminiService';
import { AppMode } from '../types';

const CustomModel: React.FC = () => {
  const [provider, setProvider] = useState('openai');
  const [endpoint, setEndpoint] = useState('https://api.openai.com/v1/chat/completions');
  const [modelName, setModelName] = useState('gpt-4');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const p = e.target.value;
    setProvider(p);
    if (p === 'openai') {
      setEndpoint('https://api.openai.com/v1/chat/completions');
      setModelName('gpt-4');
    } else if (p === 'anthropic') {
      setEndpoint('https://api.anthropic.com/v1/messages');
      setModelName('claude-3-opus-20240229');
    } else if (p === 'vertex') {
      setEndpoint('https://us-central1-aiplatform.googleapis.com/v1/projects/YOUR_PROJECT/locations/us-central1/publishers/google/models/gemini-1.5-pro:streamGenerateContent');
      setModelName('gemini-1.5-pro');
    } else {
      setEndpoint('');
      setModelName('');
    }
  };

  const handleRun = async () => {
    if (!prompt.trim() || !endpoint.trim()) return;
    setLoading(true);
    setResponse('');
    
    try {
      // API Key is now retrieved inside the service from settings
      const res = await customModelRequest(endpoint, '', modelName, prompt, provider);
      setResponse(res);
    } catch (err: any) {
      setResponse(`Error: ${err.message}\n\nHint: Check if your API Key is set in Settings.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Globe className="text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-800">Universal Model Client</h2>
          </div>
        </div>
        
        <div className="p-8 space-y-6">
          <p className="text-slate-600 text-sm">
            Connect to external AI providers (OpenAI, Anthropic, Vertex AI) using credentials configured in Settings.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Provider</label>
                <div className="relative">
                  <select 
                    value={provider} 
                    onChange={handleProviderChange}
                    className="w-full p-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none appearance-none"
                  >
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic (Claude)</option>
                    <option value="vertex">Vertex AI (GCP)</option>
                    <option value="other">Custom / Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Model Name</label>
                <input 
                  type="text" 
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                  placeholder="e.g. gpt-4"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Endpoint URL</label>
              <div className="relative mb-4">
                <Server className="absolute left-3 top-3.5 text-slate-400" size={16} />
                <input 
                  type="text" 
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  className="w-full pl-10 p-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-mono text-sm"
                  placeholder="https://api..."
                />
              </div>

              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none h-32 resize-none"
                placeholder="Enter your prompt here..."
              />
            </div>
          </div>

          <button
            onClick={handleRun}
            disabled={loading || !prompt}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
            Send Request
          </button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-6 min-h-[200px] text-emerald-400 font-mono text-sm overflow-x-auto relative">
        <div className="flex items-center gap-2 mb-4 text-slate-500 pb-2 border-b border-slate-800">
          <Terminal size={16} />
          <span>Output Console</span>
        </div>
        <pre className="whitespace-pre-wrap">{response || '// Waiting for response...'}</pre>
        {response.includes('Hint:') && (
            <div className="absolute bottom-4 right-4 text-xs text-slate-500">
                Are your keys set? Go to Settings.
            </div>
        )}
      </div>
    </div>
  );
};

export default CustomModel;