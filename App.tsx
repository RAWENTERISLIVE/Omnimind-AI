import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SearchGrounding from './components/SearchGrounding';
import ChatAssistant from './components/ChatAssistant';
import VisualAnalysis from './components/VisualAnalysis';
import FastTasks from './components/FastTasks';
import ThinkingMode from './components/ThinkingMode';
import CustomModel from './components/CustomModel';
import Settings from './components/Settings';
import Login from './components/Login';
import Signup from './components/Signup';
import { AppMode, User } from './types';
import { getCurrentUser, logout } from './services/authService';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.DASHBOARD);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setInitializing(false);
  }, []);

  const handleLoginSuccess = (user: User) => {
    setUser(user);
    setCurrentMode(AppMode.DASHBOARD);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setAuthView('login');
  };

  const renderContent = () => {
    switch (currentMode) {
      case AppMode.DASHBOARD:
        return <Dashboard onNavigate={setCurrentMode} />;
      case AppMode.SEARCH:
        return <SearchGrounding />;
      case AppMode.CHAT:
        return <ChatAssistant />;
      case AppMode.VISION:
        return <VisualAnalysis />;
      case AppMode.FAST:
        return <FastTasks />;
      case AppMode.THINKING:
        return <ThinkingMode />;
      case AppMode.CUSTOM:
        return <CustomModel />;
      case AppMode.SETTINGS:
        return <Settings />;
      default:
        return <Dashboard onNavigate={setCurrentMode} />;
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        {authView === 'login' ? (
          <Login onSuccess={handleLoginSuccess} onSwitchToSignup={() => setAuthView('signup')} />
        ) : (
          <Signup onSuccess={handleLoginSuccess} onSwitchToLogin={() => setAuthView('login')} />
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar 
        currentMode={currentMode} 
        onModeChange={setCurrentMode} 
        onLogout={handleLogout}
        userEmail={user.email}
      />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;