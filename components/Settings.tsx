import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Info, Check, Cloud, Code, Key, Globe, LayoutGrid } from 'lucide-react';
import { getSettings, saveSettings, defaultSettings } from '../services/settingsService';
import { AppSettings } from '../types';
import { 
  MODEL_SEARCH, MODEL_CHAT, MODEL_VISION, MODEL_FAST, MODEL_THINKING,
  DEFAULT_VERTEX_SEARCH, DEFAULT_VERTEX_CHAT, DEFAULT_VERTEX_VISION, DEFAULT_VERTEX_FAST, DEFAULT_VERTEX_THINKING
} from '../constants';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const handleChange = (field: keyof AppSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleProviderChange = (provider: 'studio' | 'vertex') => {
    let newSettings = { ...settings, provider };
    
    if (provider === 'vertex') {
        newSettings = {
            ...newSettings,
            modelSearch: DEFAULT_VERTEX_SEARCH,
            modelChat: DEFAULT_VERTEX_CHAT,
            modelVision: DEFAULT_VERTEX_VISION,
            modelFast: DEFAULT_VERTEX_FAST,
            modelThinking: DEFAULT_VERTEX_THINKING,
        }
    } else {
        newSettings = {
            ...newSettings,
            modelSearch: MODEL_SEARCH,
            modelChat: MODEL_CHAT,
            modelVision: MODEL_VISION,
            modelFast: MODEL_FAST,
            modelThinking: MODEL_THINKING,
        }
    }
    setSettings(newSettings);
    setSaved(false);
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto mb-10">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
          <div className="p-2 bg-slate-200 rounded-lg text-slate-700">
            <SettingsIcon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Application Settings</h2>
            <p className="text-sm text-slate-500">Configure AI providers, API keys, and model preferences</p>
          </div>
        </div>

        <div className="p-8 space-y-10">
          
          {/* Main Provider Selection */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Cloud size={16} /> Primary Gemini Provider
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => handleProviderChange('studio')}
                className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all ${
                  settings.provider === 'studio' 
                    ? 'border-blue-500 bg-blue-50/50' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${settings.provider === 'studio' ? 'border-blue-500' : 'border-slate-300'}`}>
                    {settings.provider === 'studio' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                  </div>
                  <span className="font-semibold text-slate-800">Google AI Studio</span>
                </div>
                <p className="text-xs text-slate-500 pl-6 text-left">
                  Simplest setup. Uses an API key directly. Recommended for personal use.
                </p>
              </button>

              <button
                onClick={() => handleProviderChange('vertex')}
                className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all ${
                  settings.provider === 'vertex' 
                    ? 'border-blue-500 bg-blue-50/50' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${settings.provider === 'vertex' ? 'border-blue-500' : 'border-slate-300'}`}>
                    {settings.provider === 'vertex' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                  </div>
                  <span className="font-semibold text-slate-800">Vertex AI (GCP)</span>
                </div>
                <p className="text-xs text-slate-500 pl-6 text-left">
                  Connects to Google Cloud. Best for enterprise production and long-term token usage.
                </p>
              </button>
            </div>

            {/* AI Studio Configuration */}
            {settings.provider === 'studio' && (
               <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 animate-fade-in">
                 <div className="mb-4">
                   <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Google AI Studio API Key</label>
                   <div className="relative">
                      <Key className="absolute left-3 top-3.5 text-slate-400" size={16} />
                      <input 
                        type="password" 
                        value={settings.googleApiKey}
                        onChange={(e) => handleChange('googleApiKey', e.target.value)}
                        placeholder="Paste your API key here (starts with AIza...)"
                        className="w-full pl-10 p-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                   </div>
                   <p className="text-xs text-slate-500 mt-2">
                     Leave blank to use the system environment variable if configured.
                     <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-600 underline ml-1">Get API Key</a>
                   </p>
                 </div>
               </div>
            )}

            {/* Vertex AI Credentials */}
            {settings.provider === 'vertex' && (
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Project ID</label>
                    <input 
                      type="text" 
                      value={settings.vertexProjectID}
                      onChange={(e) => handleChange('vertexProjectID', e.target.value)}
                      placeholder="e.g. my-genai-project"
                      className="w-full p-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Location</label>
                    <input 
                      type="text" 
                      value={settings.vertexLocation}
                      onChange={(e) => handleChange('vertexLocation', e.target.value)}
                      placeholder="e.g. us-central1"
                      className="w-full p-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Access Token (Bearer)</label>
                    <input 
                      type="password" 
                      value={settings.vertexAccessToken}
                      onChange={(e) => handleChange('vertexAccessToken', e.target.value)}
                      placeholder="ya29.a0..."
                      className="w-full p-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                    <div className="flex justify-between items-start mt-2">
                       <p className="text-xs text-slate-400">
                        Tokens are saved locally for long-term use until they expire (usually 1 hour). 
                      </p>
                      <a href="https://console.cloud.google.com/vertex-ai" target="_blank" rel="noreferrer" className="text-blue-600 text-xs hover:underline flex items-center gap-1">
                         Open GCP Console <Info size={12}/>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
          
          <hr className="border-slate-100" />

          {/* Universal Model Integrations */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Globe size={16} /> Universal Model Integrations
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Configure credentials for the "Universal Model" feature to access OpenAI, Anthropic, or other providers.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-5 border border-slate-200 rounded-xl">
                 <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                   OpenAI
                 </h4>
                 <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">API Key</label>
                 <input 
                    type="password" 
                    value={settings.openAIKey}
                    onChange={(e) => handleChange('openAIKey', e.target.value)}
                    placeholder="sk-..."
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-emerald-500 outline-none text-sm"
                  />
               </div>
               
               <div className="p-5 border border-slate-200 rounded-xl">
                 <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                   Anthropic (Claude)
                 </h4>
                 <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">API Key</label>
                 <input 
                    type="password" 
                    value={settings.anthropicKey}
                    onChange={(e) => handleChange('anthropicKey', e.target.value)}
                    placeholder="sk-ant-..."
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-emerald-500 outline-none text-sm"
                  />
               </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Advanced Model Configuration */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <LayoutGrid size={16} /> Advanced Default Map
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              When "Auto" is selected in features, these are the underlying models used.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 opacity-80 hover:opacity-100 transition-opacity">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Smart Search Default</label>
                <input 
                  type="text" 
                  value={settings.modelSearch}
                  onChange={(e) => handleChange('modelSearch', e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 focus:border-blue-500 outline-none font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Chat Default</label>
                <input 
                  type="text" 
                  value={settings.modelChat}
                  onChange={(e) => handleChange('modelChat', e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 focus:border-blue-500 outline-none font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Vision Default</label>
                <input 
                  type="text" 
                  value={settings.modelVision}
                  onChange={(e) => handleChange('modelVision', e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 focus:border-blue-500 outline-none font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Fast Default</label>
                <input 
                  type="text" 
                  value={settings.modelFast}
                  onChange={(e) => handleChange('modelFast', e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 focus:border-blue-500 outline-none font-mono text-sm"
                />
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
             {saved && (
                <span className="flex items-center gap-2 text-emerald-600 font-medium animate-fade-in">
                  <Check size={18} /> Settings Saved
                </span>
             )}
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-100"
            >
              <Save size={18} />
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;