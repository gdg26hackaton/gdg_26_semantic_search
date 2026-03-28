import React, { useState, useEffect } from 'react';
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
  Share2,
  Mic,
  MicOff
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useDictaphone } from '../hooks/useDictaphone';

export const Dashboard: React.FC = () => {
  const { transcript, listening, supported, startListening, stopListening } = useDictaphone();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (transcript) {
      setQuery(transcript);
    }
  }, [transcript]);

  const handleMicClick = () => {
    if (!supported) {
      alert('Tu navegador no soporta el reconocimiento de voz (prueba en Chrome o Edge).');
      return;
    }
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query your entire knowledge base..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 pr-24 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
            />
            <div className="absolute right-14 top-1/2 -translate-y-1/2 z-10">
              <button
                onClick={handleMicClick}
                className={cn(
                  "relative flex items-center justify-center p-2 rounded-full transition-colors",
                  listening ? "bg-blue-50" : "text-slate-400 hover:bg-slate-100 hover:text-brand-blue"
                )}
                title={listening ? "Detener grabación" : "Búsqueda por voz"}
              >
                <span className="relative z-10 flex items-center justify-center w-[18px] h-[18px]">
                  {listening ? (
                    <div className="flex items-center gap-[3px]">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 bg-brand-blue rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.15
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <Mic size={18} />
                  )}
                </span>
              </button>
            </div>
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

      <footer className="pt-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-bold text-slate-400 tracking-widest uppercase">
        <div>
          <p className="text-brand-blue">
            GRUPO SAVE HELP <span className="text-slate-400 ml-2 font-medium">© 2026 GDG TACNA</span>
          </p>
          <p className="mt-1 text-slate-500">Creado por: Gustavo, Julio, Rogert, Alonso</p>
        </div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-brand-blue transition-colors">Privacidad</a>
          <a href="#" className="hover:text-brand-blue transition-colors">API</a>
          <a href="#" className="hover:text-brand-blue transition-colors">Soporte</a>
        </div>
      </footer>
    </div>
  );
};
