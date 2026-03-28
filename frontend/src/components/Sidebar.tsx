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
    { id: 'ocr', label: 'OCR PROCESSING', icon: FileText },
    { id: 'flyer-creator', label: 'FLYER CREATOR', icon: Sparkles },
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
        
        <div className="pt-8 pb-4">
          <div className="sidebar-item">
            <Settings size={18} />
            <span className="text-xs font-bold tracking-wider uppercase">Settings</span>
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-border space-y-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-border flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-blue rounded-lg flex items-center justify-center text-white font-bold">SH</div>
          <div>
            <p className="text-xs font-bold">System Status</p>
            <p className="text-[10px] text-green-500 font-medium">All systems operational</p>
          </div>
        </div>

        <button className="btn-primary w-full justify-center py-3">
          <Plus size={18} />
          <span className="text-xs font-bold uppercase tracking-wider">New Project</span>
        </button>

        <div className="flex items-center justify-between px-2 pt-2">
          <button className="text-slate-400 hover:text-brand-dark transition-colors">
            <HelpCircle size={18} />
          </button>
          <button className="text-slate-400 hover:text-red-500 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};
