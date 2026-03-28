import React from 'react';
import { Search, Bell, Settings, User } from 'lucide-react';

export const TopNav: React.FC = () => {
  return (
    <header className="h-20 border-b border-border bg-white flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Global search..." 
          className="w-full bg-slate-100 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
        />
      </div>

      <div className="flex items-center gap-8">
        <nav className="flex items-center gap-6">
          <a href="#" className="text-sm font-bold text-brand-blue border-b-2 border-brand-blue pb-1">Overview</a>
          <a href="#" className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Analytics</a>
        </nav>

        <div className="flex items-center gap-4 border-l border-border pl-8">
          <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
            <Settings size={20} />
          </button>
          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden border border-border">
            <img src="https://picsum.photos/seed/user/100/100" alt="User" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
    </header>
  );
};
