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
         
        </nav>

    
      
      </div>
    </header>
  );
};
