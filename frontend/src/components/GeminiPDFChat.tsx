import React, { useState, useEffect } from 'react';
import { 
  Paperclip, Mic, Send, Trash2, FileText, 
  User, Sparkles, X, MicOff 
} from 'lucide-react';
import { useDictaphone } from '../hooks/useDictaphone';

export default function GeminiPDFChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState([]); // Lista de PDFs subidos

  const { transcript, listening: isListening, startListening, stopListening, resetTranscript } = useDictaphone();

  const baseInputRef = React.useRef("");

  useEffect(() => {
    if (isListening) {
      const currentVal = transcript.trim();
      if (currentVal) {
        setInput(baseInputRef.current ? `${baseInputRef.current} ${currentVal}` : currentVal);
      }
    }
  }, [transcript, isListening]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      baseInputRef.current = input.trim();
      resetTranscript();
      startListening();
    }
  };

  // Función para simular envío (aquí conectarás con tu Backend RAG)
  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput("");
    // Simular respuesta de IA
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "Según tus documentos, la cláusula 4 indica que...",
        source: "contrato_v1.pdf",
        page: 12
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-white text-gray-800 font-sans">
      
      {/* Header sutil de Privacidad */}
      <header className="p-4 border-b flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <Sparkles className="text-blue-500" size={20} />
          <span>Chat Bot [Save Help]</span>
        </div>
        <div className="text-xs text-gray-400 bg-white border px-3 py-1 rounded-full shadow-sm">
          Sesión Privada: {Math.random().toString(36).substr(2, 9)}
        </div>
      </header>

      {/* Área de Chat (Scrollable) */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 max-w-4xl mx-auto w-full">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50 mt-20">
            <h1 className="text-4xl font-medium mb-4">¿En qué puedo ayudarte hoy?</h1>
            <p>Sube tus PDFs y hablemos sobre su contenido.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.role === 'user' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-gray-100 text-gray-800'
            }`}>
              <div className="flex items-center gap-2 mb-1 text-xs opacity-70">
                {msg.role === 'user' ? <User size={14}/> : <Sparkles size={14}/>}
                <span>{msg.role === 'user' ? 'Tú' : 'Asistente IA'}</span>
              </div>
              <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
              
              {/* Cita del PDF (Solo si es respuesta de IA) */}
              {msg.source && (
                <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase">
                  <FileText size={12}/> {msg.source} • Pág {msg.page}
                </div>
              )}
            </div>
          </div>
        ))}
      </main>

      {/* Footer: Gestión de archivos y Barra de entrada */}
      <footer className="p-4 bg-white max-w-4xl mx-auto w-full">
        
        {/* Chips de archivos subidos (Eliminar 1x1) */}
        <div className="flex flex-wrap gap-2 mb-4">
          {files.map((file, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 text-xs">
              <FileText size={14} className="text-red-500" />
              <span className="truncate max-w-[120px]">{file.name}</span>
              <button onClick={() => setFiles(files.filter((_, i) => i !== idx))} className="hover:text-red-500">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* La "Super Barra" estilo Gemini */}
        <div className="relative flex items-end gap-2 bg-gray-100 rounded-[32px] p-2 focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-300 transition-all shadow-sm">
          
          {/* Botón Subir Archivo */}
          <label className="p-3 cursor-pointer hover:bg-gray-200 rounded-full transition-colors">
            <Paperclip size={24} className="text-gray-500" />
            <input 
              type="file" 
              className="hidden" 
              multiple 
              onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])} 
            />
          </label>

          {/* Input de Texto */}
          <textarea 
            rows="1"
            placeholder="Pregúntale a tus documentos..."
            className="flex-1 bg-transparent border-none focus:ring-0 py-3 text-base resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          {/* Botón de Voz */}
          <button 
            onClick={toggleListening}
            className={`p-3 rounded-full transition-all flex items-center justify-center w-12 h-12 ${isListening ? 'bg-blue-50 text-blue-600 shadow-inner' : 'hover:bg-gray-200 text-gray-500'}`}
          >
            {isListening ? (
              <div className="flex gap-1 items-center justify-center">
                <style>{`
                  @keyframes bounceDot {
                    0%, 100% { transform: translateY(-3px); }
                    50% { transform: translateY(5px); }
                  }
                  .animate-bounce-dot {
                    animation: bounceDot 0.8s ease-in-out infinite;
                  }
                `}</style>
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce-dot" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce-dot" style={{ animationDelay: '200ms' }}></div>
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce-dot" style={{ animationDelay: '400ms' }}></div>
              </div>
            ) : (
              <Mic size={24} />
            )}
          </button>

          {/* Botón Enviar */}
          <button 
            onClick={handleSend}
            disabled={!input}
            className={`p-3 rounded-full transition-all ${input ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300'}`}
          >
            <Send size={24} />
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-400 mt-2">
          MVP: Los documentos se borran al refrescar la página. Tu privacidad está garantizada.
        </p>
      </footer>
    </div>
  );
}