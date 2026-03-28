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

export const Dashboard: React.FC = () => {
  const recentAssets = [
    { id: '1', name: 'Q4 Market Analysis.pdf', modified: 'Modified 2 hours ago', type: 'pdf' },
    { id: '2', name: 'Project_Budget_Final.xlsx', modified: 'Modified yesterday', type: 'xlsx' },
  ];

  return (
    <div className="p-12 space-y-12 max-w-7xl mx-auto">
      <header>
        <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Workspace Overview</h2>
        <p className="text-slate-500 mt-3 text-lg max-w-2xl leading-relaxed">
          Streamline your documentation workflow with AI-powered semantic search and high-fidelity OCR extraction.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Semantic Search Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8 space-y-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-brand-blue">
                <Search size={24} />
              </div>
              <h3 className="text-xl font-bold">Semantic Search</h3>
            </div>
            <span className="bg-blue-100 text-brand-blue text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Neural Engine</span>
          </div>

          <div className="relative">
            <input 
              type="text" 
              placeholder="Query your entire knowledge base..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 pr-16 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-blue text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Recent Assets</h4>
            <div className="space-y-3">
              {recentAssets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      asset.type === 'pdf' ? "bg-red-50 text-red-500" : "bg-green-50 text-green-500"
                    )}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{asset.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{asset.modified}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      {/* OCR Processing Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-8 space-y-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-brand-blue">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-bold">OCR Processing</h3>
            </div>
            <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Pro Ready</span>
          </div>

          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4 bg-slate-50/50">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-blue">
              <Upload size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Drag & drop source files here</p>
              <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">Supports PDF, PNG, JPG (Max 50MB)</p>
            </div>
            <button className="bg-slate-100 hover:bg-slate-200 text-brand-blue px-6 py-2 rounded-lg text-xs font-bold transition-colors">
              Browse Files
            </button>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl flex gap-4">
            <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center text-white shrink-0">
              <Info size={16} />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our advanced OCR engine automatically detects 40+ languages and preserves formatting structure for complex tables.
            </p>
          </div>
        </motion.div>
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
