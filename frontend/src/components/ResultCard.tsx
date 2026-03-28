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


const ResultCard = ({ content, source, page, score }) => (
  <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow mb-4">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-2">
        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
          Relevancia: {(score * 100).toFixed(0)}%
        </span>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <BookOpen size={12} /> {source} • Pág. {page}
        </span>
      </div>
    </div>
    <p className="text-gray-700 leading-relaxed text-sm italic border-l-4 border-blue-500 pl-4">
      "...{content}..."
    </p>
  </div>
);