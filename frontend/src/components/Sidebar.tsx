import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  Sparkles, 
  Settings, 
  HelpCircle, 
  LogOut,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { View } from '@/types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
    { id: 'semantic-search', label: 'SEMANTIC SEARCH', icon: Search },
    
  ];

  return (
    <aside className="w-64 border-r border-border h-screen flex flex-col bg-surface/50">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-brand-blue tracking-tight">Save Help</h1>
        <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-1 uppercase">Productivity Suite</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onViewChange(item.id as View)}
            className={cn(
              "sidebar-item",
              currentView === item.id && "active"
            )}
          >
            <item.icon size={18} />
            <span className="text-xs font-bold tracking-wider">{item.label}</span>
          </div>
        ))}
        
      
      </nav>


    </aside>
  );
};
