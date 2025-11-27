import React from 'react';
import { 
  Search, 
  MessageSquare, 
  Image as ImageIcon, 
  Zap, 
  BrainCircuit, 
  Globe,
  Settings
} from 'lucide-react';
import { AppMode } from '../types';

interface DashboardProps {
  onNavigate: (mode: AppMode) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const features = [
    { 
      mode: AppMode.SEARCH, 
      title: 'Smart Search', 
      desc: 'Get grounded answers using live Google Search data.',
      icon: Search,
      color: 'bg-blue-100 text-blue-600',
      border: 'hover:border-blue-300'
    },
    { 
      mode: AppMode.CHAT, 
      title: 'Chat Assistant', 
      desc: 'Conversational AI powered by Gemini 3.0 Pro.',
      icon: MessageSquare,
      color: 'bg-purple-100 text-purple-600',
      border: 'hover:border-purple-300'
    },
    { 
      mode: AppMode.VISION, 
      title: 'Vision & Docs', 
      desc: 'Multimodal analysis for images and PDF documents.',
      icon: ImageIcon,
      color: 'bg-pink-100 text-pink-600',
      border: 'hover:border-pink-300'
    },
    { 
      mode: AppMode.FAST, 
      title: 'Fast Tasks', 
      desc: 'Ultra-low latency responses using Flash-Lite.',
      icon: Zap,
      color: 'bg-yellow-100 text-yellow-600',
      border: 'hover:border-yellow-300'
    },
    { 
      mode: AppMode.THINKING, 
      title: 'Deep Thinking', 
      desc: 'Complex problem solving with extended thinking budget.',
      icon: BrainCircuit,
      color: 'bg-indigo-100 text-indigo-600',
      border: 'hover:border-indigo-300'
    },
    { 
      mode: AppMode.CUSTOM, 
      title: 'Universal Model', 
      desc: 'Connect to external APIs like OpenAI or Vertex.',
      icon: Globe,
      color: 'bg-emerald-100 text-emerald-600',
      border: 'hover:border-emerald-300'
    },
    { 
      mode: AppMode.SETTINGS, 
      title: 'Settings', 
      desc: 'Configure AI providers and custom model endpoints.',
      icon: Settings,
      color: 'bg-slate-100 text-slate-600',
      border: 'hover:border-slate-300'
    },
  ];

  return (
    <div className="max-w-6xl mx-auto pt-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Welcome to OmniMind AI</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Your complete workspace for AI-powered productivity. Select a tool to get started with the latest Gemini models.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <button
              key={feature.mode}
              onClick={() => onNavigate(feature.mode)}
              className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${feature.border}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;