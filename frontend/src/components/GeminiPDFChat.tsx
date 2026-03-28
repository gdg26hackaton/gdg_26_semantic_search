import React, { useState, useEffect } from 'react';
import { 
  Paperclip, Mic, Send, Trash2, FileText, 
  User, Sparkles, X, MicOff, Loader2, Search 
} from 'lucide-react';
import { useAgent } from '../hooks/useAgent';
import { useDictaphone } from '../hooks/useDictaphone';

export default function GeminiPDFChat() {
  const { 
    messages, sendMessage, connected, isThinking, 
    setMessages, uploadFile, isUploading, searchResults 
  } = useAgent();
  const { transcript, listening, startListening, stopListening, resetTranscript } = useDictaphone();
  const [input, setInput] = useState("");

  // Sync dictaphone transcript with input area
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
    resetTranscript();
  };

  return (
    <div className="flex flex-col h-full bg-surface/30 text-slate-800 font-sans relative overflow-hidden">
      
      {/* Header sutil de Privacidad */}
      <header className="px-8 py-4 border-b flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
            <Sparkles size={18} />
          </div>
          <span className="font-bold text-slate-700 tracking-tight">Agente Documental IA</span>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border bg-white shadow-sm transition-all ${connected ? 'border-green-100' : 'border-red-100'}`}>
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              {connected ? 'Sincronizado' : 'Buscando Backend...'}
            </span>
          </div>
        </div>
      </header>

      {/* Área de Chat (Scrollable) */}
      <main className="flex-1 overflow-y-auto p-4 md:p-12 space-y-10 max-w-5xl mx-auto w-full scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 mt-32 max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-blue-500 animate-bounce-subtle">
              <Sparkles size={48} />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">¿Qué analizamos hoy?</h1>
            <p className="text-slate-500 leading-relaxed">
              Sube tus documentos legales, facturas o manuales. Puedo extraer datos, 
              cruzar información semántica y generar nuevos borradores por ti.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] px-6 py-4 rounded-[24px] shadow-sm ${
              msg.role === 'user' 
              ? 'bg-blue-600 text-white !shadow-blue-500/20' 
              : msg.role === 'system'
              ? 'bg-amber-50 border border-amber-200 text-amber-900 border-dashed'
              : 'bg-white border text-slate-700'
            }`}>
              <div className="flex items-center gap-2 mb-2 text-[10px] uppercase font-bold tracking-widest opacity-60">
                {msg.role === 'user' ? <User size={12}/> : msg.role === 'system' ? <Paperclip size={12}/> : <Sparkles size={12}/>}
                <span>{msg.role === 'user' ? 'Usuario' : msg.role === 'system' ? 'Evento del Sistema' : 'Asistente IA'}</span>
              </div>
              <p className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              
              {/* Citation (from origin/main feature) */}
              {msg.source && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-tighter">
                  <FileText size={12} /> {msg.source} • Pág {msg.page}
                </div>
              )}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-4 justify-start animate-in fade-in duration-300">
            <div className="bg-white/50 backdrop-blur-sm border px-4 py-3 rounded-full flex items-center gap-3 text-slate-500 text-sm font-medium italic shadow-sm">
              <Loader2 className="animate-spin text-blue-500" size={16} />
              El agente está procesando...
            </div>
          </div>
        )}

        {/* Global Search Results (Action Cards) */}
        {searchResults.length > 0 && (
          <div className="bg-white border shadow-xl rounded-[32px] p-8 space-y-6 animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2">
                <Search size={16} /> Hallazgos Semánticos
              </h3>
              <button 
                onClick={() => setMessages(m => [...m, {role: 'system', content: 'Resultados cerrados.'}])}
                className="text-slate-400 hover:text-red-500 p-1"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((res) => (
                <div key={res.id} className="bg-slate-50 border p-4 rounded-2xl flex items-center gap-4 hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer group shadow-sm active:scale-95">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    <FileText size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{res.title}</p>
                    <p className="text-[10px] text-slate-400 font-mono font-bold">ID: {res.id.split('-')[0]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer: Gestión de archivos y Barra de entrada */}
      <footer className="p-6 bg-gradient-to-t from-surface via-surface to-transparent max-w-5xl mx-auto w-full">
        
        {/* Floating Super Bar */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[36px] blur opacity-20 group-focus-within:opacity-40 transition duration-1000 group-focus-within:duration-200"></div>
          
          <div className="relative flex items-end gap-2 bg-white rounded-[32px] p-2 pr-4 shadow-2xl border border-slate-100 transition-all focus-within:ring-2 focus-within:ring-blue-100">
            
            {/* Botón Subir Archivo */}
            <label className="p-3.5 cursor-pointer hover:bg-slate-50 rounded-full transition-all relative group/btn overflow-hidden">
              <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
              {isUploading ? (
                <Loader2 size={24} className="text-blue-500 animate-spin relative z-10" />
              ) : (
                <Paperclip size={24} className="text-slate-500 relative z-10 group-hover/btn:text-blue-600 transition-colors" />
              )}
              <input 
                type="file" 
                className="hidden" 
                disabled={isUploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) await uploadFile(file);
                }} 
              />
            </label>

            {/* Input de Texto */}
            <textarea 
              rows={1}
              placeholder="Dime algo como: 'Busca el contrato de ayer'..."
              className="flex-1 bg-transparent border-none focus:ring-0 py-4 text-[16px] resize-none text-slate-800 placeholder:text-slate-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            {/* Botón de Voz */}
            <button 
              onClick={listening ? stopListening : startListening}
              className={`p-3.5 rounded-full transition-all relative ${listening ? 'bg-red-500 text-white shadow-lg shadow-red-200 animate-pulse' : 'hover:bg-slate-50 text-slate-500'}`}
              title={listening ? 'Detener dictado' : 'Iniciar dictado (Voz)'}
            >
              {listening ? <MicOff size={24} /> : <Mic size={24} />}
            </button>

            {/* Botón Enviar */}
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className={`p-3.5 rounded-full transition-all ${input.trim() ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0' : 'text-slate-200'}`}
            >
              <Send size={24} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-6 mt-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Privacidad Local Garantizada
          </p>
          <div className="h-1 w-1 bg-slate-300 rounded-full" />
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Hecho con DeepSeek & FastEmbed
          </p>
        </div>
      </footer>
    </div>
  );
}