import { useState } from 'react';
import { Search, FileText } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { Dashboard } from './components/Dashboard';
import { FlyerCreator } from './components/FlyerCreator';
import { View } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'flyer-creator':
        return <FlyerCreator />;
      case 'semantic-search':
      case 'ocr':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-12 space-y-4">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-brand-blue">
              {currentView === 'semantic-search' ? <Search size={40} /> : <FileText size={40} />}
            </div>
            <h2 className="text-2xl font-bold tracking-tight uppercase">Module Initializing</h2>
            <p className="text-slate-500 max-w-md">
              The {currentView.replace('-', ' ')} engine is currently being optimized for your workspace. 
              Please check back in a moment.
            </p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-surface">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <div className="flex-1 overflow-y-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
}
