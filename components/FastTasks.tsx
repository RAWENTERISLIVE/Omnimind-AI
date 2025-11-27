import React, { useState } from 'react';
import { Zap, Loader2, Play, ChevronDown } from 'lucide-react';
import { fastRequest } from '../services/geminiService';
import { AVAILABLE_MODELS } from '../constants';

const FastTasks: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [selectedModel, setSelectedModel] = useState('auto');

  const handleRun = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setOutput('');
    setLatency(null);
    const start = performance.now();

    try {
      const responseText = await fastRequest(input, selectedModel);
      const end = performance.now();
      setLatency(Math.round(end - start));
      setOutput(responseText || "No response generated.");
    } catch (error) {
      setOutput("Error: " + String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
        <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
            <Zap className="text-yellow-500 fill-yellow-500" />
            Fast Tasks (Flash-Lite)
            </h2>

            {/* Model Selector */}
            <div className="relative group">
                <select 
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-1.5 pl-3 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-100 cursor-pointer hover:bg-slate-100"
                >
                    {AVAILABLE_MODELS.map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
        </div>
        
        <p className="text-slate-600 mb-6">
          Designed for speed. Use this for quick summaries, translations, or simple Q&A where low latency is critical.
        </p>

        <div className="space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to process instantly..."
            className="w-full p-4 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 outline-none transition-all h-32"
          />
          
          <div className="flex justify-between items-center">
            <button
              onClick={handleRun}
              disabled={loading || !input.trim()}
              className="bg-yellow-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-yellow-600 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
              Generate Fast
            </button>
            
            {latency !== null && (
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                Latency: {latency}ms
              </span>
            )}
          </div>
        </div>
      </div>

      {output && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Response</h3>
          <p className="whitespace-pre-wrap text-slate-800">{output}</p>
        </div>
      )}
    </div>
  );
};

export default FastTasks;