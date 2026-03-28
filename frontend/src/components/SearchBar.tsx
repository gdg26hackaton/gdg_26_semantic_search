import { 
  Files,       // Para el título de la sección de documentos
  FileText,    // Para el icono de cada archivo PDF
  Upload,      // Para el botón de carga
  Trash2,      // Para el botón de eliminar
  Search,      // Para la lupa en la barra de búsqueda
  Mic,         // Para el botón de voz (activado)
  MicOff,      // Para el botón de voz (desactivado)
  Lock,        // Para el banner de privacidad
  BookOpen,    // Para indicar la página en los resultados
  X            // Para cerrar modales o limpiar búsquedas
} from 'lucide-react';

export const SearchBar = ({ onSearch, isListening }) => (
  <div className="max-w-3xl mx-auto mb-8 relative">
    <div className={`flex items-center bg-white border-2 rounded-2xl p-2 shadow-lg transition-all ${isListening ? 'border-red-400 ring-4 ring-red-50' : 'focus-within:border-blue-500'}`}>
      <Search className="ml-3 text-gray-400" />
      <input 
        type="text" 
        placeholder="Pregunta algo sobre tus documentos..."
        className="flex-1 p-3 outline-none text-lg"
      />
      <button 
        className={`p-3 rounded-xl transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-gray-100 text-gray-500'}`}
        title="Búsqueda por voz"
      >
        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
      </button>
    </div>
    {isListening && (
      <p className="text-center text-red-500 text-xs mt-2 font-medium animate-bounce">
        Escuchando... hable ahora
      </p>
    )}
  </div>
);