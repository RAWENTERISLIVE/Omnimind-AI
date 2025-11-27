import React, { useState } from 'react';
import { Search, Loader2, ExternalLink, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { searchGroundingRequest } from '../services/geminiService';
import { GroundingChunk } from '../types';
import { AVAILABLE_MODELS } from '../constants';

const SearchGrounding: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('auto');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setSources([]);

    try {
      const response = await searchGroundingRequest(query, selectedModel);
      if (response.text) {
        setResult(response.text);
      }
      if (response.groundingChunks) {
        setSources(response.groundingChunks);
      }
    } catch (err) {
      setError("Failed to fetch search results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
        <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
            <Search className="text-blue-600" />
            Smart Search with Grounding
            </h2>
            
             {/* Model Selector */}
            <div className="relative group">
                <select 
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-1.5 pl-3 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer hover:bg-slate-100"
                >
                    {AVAILABLE_MODELS.map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
        </div>
        
        <p className="text-slate-600 mb-6">
          Ask questions about recent events or specific data. Gemini will use Google Search to provide up-to-date answers with citations.
        </p>
        
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Who won the latest Super Bowl?"
            className="w-full pl-4 pr-12 py-4 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-lg shadow-sm"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-3 top-3 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-fade-in">
          <div className="prose prose-slate max-w-none mb-8">
             <ReactMarkdown>{result}</ReactMarkdown>
          </div>

          {sources.length > 0 && (
            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Sources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sources.map((chunk, idx) => (
                  chunk.web ? (
                    <a 
                      key={idx} 
                      href={chunk.web.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
                    >
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-md group-hover:bg-white group-hover:scale-110 transition-transform">
                        <ExternalLink size={16} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-slate-700 truncate">{chunk.web.title}</p>
                        <p className="text-xs text-slate-400 truncate">{chunk.web.uri}</p>
                      </div>
                    </a>
                  ) : null
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchGrounding;