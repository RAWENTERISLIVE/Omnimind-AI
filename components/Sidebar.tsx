import React from 'react';
import { 
  Search, 
  MessageSquare, 
  Image as ImageIcon, 
  Zap, 
  BrainCircuit, 
  Globe, 
  LayoutDashboard,
  LogOut,
  Settings
} from 'lucide-react';
import { AppMode } from '../types';

interface SidebarProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  onLogout: () => void;
  userEmail?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentMode, onModeChange, onLogout, userEmail }) => {
  const menuItems = [
    { mode: AppMode.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { mode: AppMode.SEARCH, label: 'Smart Search', icon: Search },
    { mode: AppMode.CHAT, label: 'Chat Assistant', icon: MessageSquare },
    { mode: AppMode.VISION, label: 'Vision & Docs', icon: ImageIcon },
    { mode: AppMode.FAST, label: 'Fast Tasks', icon: Zap },
    { mode: AppMode.THINKING, label: 'Deep Thinking', icon: BrainCircuit },
    { mode: AppMode.CUSTOM, label: 'Universal Model', icon: Globe },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 shadow-xl z-50">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          OmniMind AI
        </h1>
        <p className="text-xs text-slate-400 mt-1">Powered by Gemini 2.5 & 3.0</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentMode === item.mode;
            return (
              <li key={item.mode}>
                <button
                  onClick={() => onModeChange(item.mode)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        
        {/* Settings Divider */}
        <div className="my-4 border-t border-slate-800 mx-4"></div>
        
        <div className="px-3">
            <button
              onClick={() => onModeChange(AppMode.SETTINGS)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                currentMode === AppMode.SETTINGS
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Settings size={20} />
              <span className="font-medium text-sm">Settings</span>
            </button>
        </div>
      </nav>
      
      <div className="p-4 border-t border-slate-700">
        {userEmail && (
          <div className="mb-3 px-2">
            <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Signed in as</p>
            <p className="text-sm font-medium text-white truncate">{userEmail}</p>
          </div>
        )}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-300 hover:bg-red-900/30 hover:text-red-300 transition-all duration-200"
        >
          <LogOut size={18} />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
        <div className="mt-4 text-xs text-slate-500 text-center">
          v1.2.0 • OmniMind AI
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;