import { useState } from 'react';
import { Search, FileText } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { Dashboard } from './components/Dashboard';
import { FlyerCreator } from './components/FlyerCreator';
import GeminiPDFChat from './components/GeminiPDFChat';
import { DocumentManager } from './components/DocumentManager';
import { View } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'semantic-search':
      case 'ocr':
        return <GeminiPDFChat />;
      case 'documents':
        return <DocumentManager />;
      case 'dashboard':
        return <Dashboard />;
      case 'flyer-creator':
        return <FlyerCreator />;
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
