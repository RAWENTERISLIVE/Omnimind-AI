import React, { useState } from 'react';
import { BrainCircuit, Loader2, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { thinkingRequest } from '../services/geminiService';
import { AVAILABLE_MODELS } from '../constants';

const ThinkingMode: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('auto');

  const handleRun = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setOutput('');

    try {
      const responseText = await thinkingRequest(input, selectedModel);
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
            <BrainCircuit className="text-indigo-600" />
            Deep Thinking Mode
            </h2>

            {/* Model Selector */}
            <div className="relative group">
                <select 
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-1.5 pl-3 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer hover:bg-slate-100"
                >
                    {AVAILABLE_MODELS.map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
        </div>

        <p className="text-slate-600 mb-6">
          Solves complex reasoning problems using the full thinking budget (32k tokens). 
          Expect a longer wait time for higher quality, thoroughly reasoned answers.
        </p>

        <div className="space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe a complex logic puzzle, math problem, or coding challenge..."
            className="w-full p-4 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all h-40"
          />
          
          <button
            onClick={handleRun}
            disabled={loading || !input.trim()}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Thinking deeply...
              </>
            ) : (
              <>
                <BrainCircuit size={20} />
                Solve Complex Problem
              </>
            )}
          </button>
        </div>
      </div>

      {output && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-fade-in border-t-4 border-t-indigo-500">
           <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Reasoned Response</h3>
           <div className="prose prose-slate max-w-none">
             <ReactMarkdown>{output}</ReactMarkdown>
           </div>
        </div>
      )}
    </div>
  );
};

export default ThinkingMode;