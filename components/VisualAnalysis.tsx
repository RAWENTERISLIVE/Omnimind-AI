import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, FileText, X, AlertCircle, Loader2, Sparkles, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { analyzeFileRequest } from '../services/geminiService';
import { AVAILABLE_MODELS } from '../constants';

const VisualAnalysis: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('auto');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
      setResult(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/png;base64," or "data:application/pdf;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setResult(null);

    try {
      const base64 = await convertFileToBase64(selectedFile);
      const responseText = await analyzeFileRequest(base64, selectedFile.type, prompt, selectedModel);
      
      if (responseText) {
        setResult(responseText);
      } else {
        setResult("No analysis returned.");
      }
    } catch (error) {
      console.error(error);
      setResult("Error analyzing content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
        <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
            <ImageIcon className="text-pink-600" />
            Vision & Document Analysis
            </h2>

            {/* Model Selector */}
            <div className="relative group">
                <select 
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-1.5 pl-3 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-100 cursor-pointer hover:bg-slate-100"
                >
                    {AVAILABLE_MODELS.map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
        </div>
        
        <p className="text-slate-600 mb-6">
          Upload an image or a PDF document. Gemini will analyze the visual or textual content to answer your questions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div 
              className={`border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center transition-colors relative ${
                selectedFile ? 'border-slate-300 bg-slate-50' : 'border-slate-300 hover:border-pink-400 hover:bg-pink-50 cursor-pointer'
              }`}
              onClick={() => !selectedFile && fileInputRef.current?.click()}
            >
              {selectedFile ? (
                <>
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="h-full w-full object-contain rounded-xl p-2" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <FileText size={48} className="text-pink-500 mb-2" />
                      <span className="font-medium text-sm">{selectedFile.name}</span>
                      <span className="text-xs text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                    </div>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }}
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white text-slate-700 p-1.5 rounded-full shadow-sm transition-all"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <Upload size={48} className="text-slate-400 mb-2" />
                  <p className="text-slate-500 font-medium">Click to upload file</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, PDF supported</p>
                </>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*,application/pdf" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe this image, summarize this document, or ask a question..."
              className="w-full p-4 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none transition-all h-32 resize-none"
            />
            
            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || loading}
              className="w-full bg-pink-600 text-white py-3 rounded-xl font-medium hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              {loading ? 'Analyzing...' : 'Analyze Content'}
            </button>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 min-h-[300px]">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Analysis Result</h3>
            {result ? (
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                {loading ? (
                   <div className="flex flex-col items-center animate-pulse">
                     <div className="w-12 h-12 bg-slate-200 rounded-full mb-3"></div>
                     <div className="h-4 w-32 bg-slate-200 rounded mb-2"></div>
                     <div className="h-4 w-24 bg-slate-200 rounded"></div>
                   </div>
                ) : (
                  <>
                    <AlertCircle size={32} className="mb-2 opacity-50" />
                    <p>Analysis will appear here</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualAnalysis;