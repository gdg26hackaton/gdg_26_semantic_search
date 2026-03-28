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

export const FileItem = ({ name, onDelete }) => (
  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm group hover:border-red-200 transition-colors">
    <div className="flex items-center gap-3 overflow-hidden">
      <FileText className="text-red-500 shrink-0" size={18} />
      <span className="text-sm truncate text-gray-700 font-medium">{name}</span>
    </div>
    <button 
      onClick={onDelete}
      className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-md transition-all"
      title="Eliminar documento"
    >
      <Trash2 size={16} />
    </button>
  </div>
);