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
import GeminiPDFChat from './GeminiPDFChat';

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
        {/* <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Chat</h2> */}
        <p className="text-slate-500 mt-3 text-lg max-w-2xl leading-relaxed">
          Interactua con el chatbot para buscar coincidencias
        </p>
      </header>

      <div className="">
        {/* Semantic Search Card */}

        <GeminiPDFChat></GeminiPDFChat>


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
