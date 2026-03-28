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


      <div>
        <GeminiPDFChat />
      </div>

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
