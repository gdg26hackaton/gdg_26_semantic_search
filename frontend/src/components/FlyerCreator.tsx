import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Type, 
  Image as ImageIcon, 
  LayoutGrid, 
  Download, 
  ChevronDown,
  Plus,
  Command,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { motion } from 'motion/react';
import { Layer } from '@/types';

export const FlyerCreator: React.FC = () => {
  const [layers, setLayers] = useState<Layer[]>([
    { id: '1', name: 'Headline', visible: true, type: 'text' },
    { id: '2', name: 'Hero Visual', visible: true, type: 'image' },
    { id: '3', name: 'Services Grid', visible: true, type: 'grid' },
  ]);

  const toggleVisibility = (id: string) => {
    setLayers(layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  };

  return (
    <div className="flex h-full">
      {/* Editor Controls */}
      <div className="w-80 border-r border-border bg-white p-8 space-y-12 overflow-y-auto">
        <header>
          <h2 className="text-2xl font-bold tracking-tight">Flyer Editor</h2>
        </header>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Project Name</label>
            <input 
              type="text" 
              defaultValue="Marketing Campaign 2024"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Preset Size</label>
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-brand-blue text-white py-2 rounded-lg text-xs font-bold">A4 Vertical</button>
              <button className="bg-slate-100 text-slate-600 py-2 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors">US Letter</button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-brand-blue">
            <LayoutGrid size={16} />
            <h3 className="text-xs font-bold uppercase tracking-wider">Active Layers</h3>
          </div>
          
          <div className="space-y-2">
            {layers.map((layer) => (
              <div key={layer.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  {layer.type === 'text' && <Type size={14} className="text-slate-400" />}
                  {layer.type === 'image' && <ImageIcon size={14} className="text-slate-400" />}
                  {layer.type === 'grid' && <LayoutGrid size={14} className="text-slate-400" />}
                  <span className="text-xs font-bold text-slate-700">{layer.name}</span>
                </div>
                <button 
                  onClick={() => toggleVisibility(layer.id)}
                  className="text-slate-400 hover:text-brand-blue transition-colors"
                >
                  {layer.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-12 space-y-4">
          <button className="btn-primary w-full justify-center py-3">
            <Plus size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">New Project</span>
          </button>
          
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-slate-600 transition-colors text-xs font-bold">
              <HelpCircle size={16} />
              Support
            </button>
            <button className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-500 transition-colors text-xs font-bold">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 bg-slate-50 p-12 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-8 right-8 flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-border">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zoom</span>
            <span className="text-xs font-bold">85%</span>
            <ChevronDown size={14} className="text-slate-400" />
          </div>
        </div>

        {/* The Flyer Preview */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-[500px] aspect-[1/1.4] bg-white shadow-2xl rounded-sm flex flex-col p-12 relative overflow-hidden"
        >
          {/* Brand Header */}
          <div className="flex items-center gap-3 mb-20">
            <div className="w-10 h-10 bg-brand-blue rounded-lg flex items-center justify-center text-white">
              <Sparkles size={20} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Save Help</h1>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <p className="text-brand-blue text-xs font-bold tracking-[0.3em] uppercase">Evolución Digital</p>
            <h2 className="text-7xl font-black text-slate-900 leading-[0.85] tracking-tighter uppercase">
              Potencia<br />tu<br />
              <span className="text-brand-blue">Escritorio</span>
            </h2>
          </div>

          {/* Features Grid */}
          <div className="mt-auto grid grid-cols-3 gap-8 pt-12 border-t border-slate-100">
            <div>
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-brand-blue mb-3">
                <Search size={16} />
              </div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider mb-1">Search</h4>
              <p className="text-[8px] text-slate-400 leading-relaxed">Localización inteligente de activos con algoritmos de IA semántica.</p>
            </div>
            <div>
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-brand-blue mb-3">
                <FileText size={16} />
              </div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider mb-1">OCR</h4>
              <p className="text-[8px] text-slate-400 leading-relaxed">Extracción masiva de datos con precisión industrial de documentos.</p>
            </div>
            <div>
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-brand-blue mb-3">
                <Sparkles size={16} />
              </div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider mb-1">Design</h4>
              <p className="text-[8px] text-slate-400 leading-relaxed">Generación de material corporativo dinámico y visualmente premium.</p>
            </div>
          </div>
        </motion.div>

        {/* Command Bar */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-xl">
          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl rounded-2xl p-2 flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-brand-blue shrink-0">
              <Command size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Type a command (e.g. /export, /print)" 
              className="flex-1 bg-transparent border-none outline-none text-sm font-medium"
            />
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
              <Download size={20} />
            </button>
            <button className="btn-primary px-6">
              <span className="text-xs font-bold uppercase tracking-wider">Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
