import React from 'react';
import { 
  Search, 
  ArrowRight, 
  FileText, 
  MoreVertical, 
  Upload, 
  Info, 
  Sparkles, 
  Plus,
  Calendar,
  ShoppingBag,
  Share2
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import GeminiPDFChat from './GeminiPDFChat';

export const Dashboard: React.FC = () => {
  const recentAssets = [
    { id: '1', name: 'Q4 Market Analysis.pdf', modified: 'Modified 2 hours ago', type: 'pdf' },
    { id: '2', name: 'Project_Budget_Final.xlsx', modified: 'Modified yesterday', type: 'xlsx' },
  ];

  return (
    <div className="p-12 space-y-12 max-w-7xl mx-auto">
      <header>
        {/* <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Chat</h2> */}
        <p className="text-slate-500 mt-3 text-lg max-w-2xl leading-relaxed">
          Interactua con el chatbot para buscar coincidencias
        </p>
      </header>

      <div className="">
        {/* Semantic Search Card */}
  
      <GeminiPDFChat></GeminiPDFChat>
     
      
      </div>

      {/* Flyer Creator Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-8 space-y-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-brand-blue">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-bold">Flyer Creator</h3>
          </div>
          <button className="btn-primary">
            <Plus size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">New Canvas</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 relative h-80 rounded-2xl overflow-hidden group">
            <img 
              src="https://picsum.photos/seed/workspace/1200/800" 
              alt="Smart Layout" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
              <h4 className="text-2xl font-bold text-white tracking-tight">Smart Layout Engine</h4>
              <p className="text-slate-300 mt-2 text-sm max-w-md">
                Let our AI arrange your assets into professional, grid-aligned marketing materials in seconds.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { icon: Calendar, title: 'Event Promotions', desc: '12 New templates added', color: 'bg-blue-50 text-blue-500' },
              { icon: ShoppingBag, title: 'Product Catalogs', desc: 'Optimized for conversion', color: 'bg-indigo-50 text-indigo-500' },
              { icon: Share2, title: 'Social Briefs', desc: 'Multi-channel presets', color: 'bg-violet-50 text-violet-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 transition-all cursor-pointer">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", item.color)}>
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{item.title}</p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <footer className="pt-12 border-t border-border flex items-center justify-between text-[10px] font-bold text-slate-400 tracking-widest uppercase">
        <p>© 2024 SAVE HELP • SECURE PRODUCTIVITY SUITE</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-brand-blue transition-colors">Privacy Protocol</a>
          <a href="#" className="hover:text-brand-blue transition-colors">API Documentation</a>
          <a href="#" className="hover:text-brand-blue transition-colors">Support Portal</a>
        </div>
      </footer>
    </div>
  );
};
