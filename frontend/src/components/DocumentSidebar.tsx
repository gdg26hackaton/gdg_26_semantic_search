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

export const DocumentSidebar = ({ documents, onUpload, onDelete, isUploading }) => (
  <aside className="w-80 border-r bg-gray-50 h-screen p-4 flex flex-col">
    <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
      <Files size={20} /> Mis Documentos
    </h2>
    
    {/* Dropzone / Upload Button */}
    <button 
      onClick={onUpload}
      disabled={documents.length >= 5 || isUploading}
      className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all mb-6 group"
    >
      <Upload className="mx-auto mb-2 text-gray-400 group-hover:text-blue-500" />
      <span className="text-sm text-gray-600 font-medium">Subir PDF (Máx 5)</span>
    </button>

    {/* Lista de Documentos */}
    <div className="flex-1 overflow-y-auto space-y-2">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-center justify-between p-3 bg-white rounded-lg border shadow-sm group">
          <div className="flex items-center gap-3 overflow-hidden">
            <FileText className="text-red-500 shrink-0" size={18} />
            <span className="text-sm truncate text-gray-700">{doc.name}</span>
          </div>
          <button 
            onClick={() => onDelete(doc.id)}
            className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  </aside>
);