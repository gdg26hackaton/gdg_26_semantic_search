import React, { useState, useEffect } from 'react';
import { Trash2, FileText, Upload, RefreshCw, X, Loader2 } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  file_path?: string;
}

export const DocumentManager: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/documents/');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este documento?')) return;
    
    try {
      const response = await fetch(`http://localhost:8000/documents/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setDocuments(documents.filter(doc => doc.id !== id));
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name); // Required by backend

    try {
      const response = await fetch('http://localhost:8000/documents/', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        fetchDocuments();
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestor de Documentos</h2>
          <p className="text-sm text-slate-500">Administra los PDFs indexados en el sistema local.</p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={fetchDocuments}
            className="p-3 hover:bg-slate-100 rounded-full transition-colors"
            title="Refrescar"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          
          <label className="flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-full font-bold text-xs tracking-wider hover:bg-blue-600 transition-colors cursor-pointer shadow-lg shadow-blue-500/20">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            <span>SUBIR PDF</span>
            <input type="file" className="hidden" accept=".pdf" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && documents.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center opacity-20">
            <Loader2 size={40} className="animate-spin mb-4" />
            <p>Cargando biblioteca...</p>
          </div>
        )}
        
        {!loading && documents.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center opacity-30 border-2 border-dashed rounded-3xl">
            <FileText size={48} className="mb-4" />
            <p className="font-medium">No hay documentos indexados</p>
            <p className="text-sm">Empieza subiendo un archivo PDF.</p>
          </div>
        )}

        {documents.map((doc) => (
          <div key={doc.id} className="group bg-white p-6 rounded-3xl border border-transparent shadow-sm hover:shadow-xl hover:border-blue-100 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => deleteDocument(doc.id)}
                className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-brand-blue mb-4 group-hover:bg-brand-blue group-hover:text-white transition-colors">
              <FileText size={24} />
            </div>
            
            <h3 className="font-bold text-slate-800 line-clamp-1 mb-1">{doc.title}</h3>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest truncate">
              ID: {doc.id}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
