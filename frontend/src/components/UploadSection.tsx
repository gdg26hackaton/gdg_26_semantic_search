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


const UploadSection = ({ onFileSelect, disabled }) => (
  <label className={`
    flex flex-col items-center justify-center w-full h-32 
    border-2 border-dashed rounded-xl cursor-pointer
    transition-all duration-200
    ${disabled 
      ? 'bg-gray-100 border-gray-200 cursor-not-allowed' 
      : 'bg-gray-50 border-gray-300 hover:bg-blue-50 hover:border-blue-400'}
  `}>
    <div className="flex flex-col items-center justify-center pt-5 pb-6">
      <Upload className={`mb-2 ${disabled ? 'text-gray-300' : 'text-gray-400'}`} size={24} />
      <p className="text-xs text-gray-500 font-semibold">Haz clic para subir</p>
      <p className="text-[10px] text-gray-400">PDF (Máx. 10MB)</p>
    </div>
    <input 
      type="file" 
      className="hidden" 
      accept=".pdf" 
      disabled={disabled}
      onChange={(e) => onFileSelect(e.target.files[0])} 
    />
  </label>
);