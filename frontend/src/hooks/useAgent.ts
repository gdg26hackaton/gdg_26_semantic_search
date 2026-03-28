import { useState, useEffect, useCallback, useRef } from 'react';

export type MessageRole = 'user' | 'ai' | 'system';

export interface ChatMessage {
  role: MessageRole;
  content: string;
  source?: string;
  page?: number;
}

export interface ClientAction {
  tool: string;
  tool_input: any;
}

export interface SearchResult {
  id: string;
  title: string;
}

export const useAgent = (url: string = 'ws://127.0.0.1:8000/ws/chat') => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [connected, setConnected] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      setConnected(true);
      console.log('✅ Connected to Agent WebSocket');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'chat') {
          setMessages((prev) => [...prev, { role: 'ai', content: data.content }]);
          setIsThinking(false);
        } else if (data.type === 'client_action') {
          handleClientAction(data.action);
        }
      } catch (err) {
        console.warn('⚠️ Received non-JSON message:', event.data);
        setMessages((prev) => [...prev, { role: 'ai', content: event.data }]);
        setIsThinking(false);
      }
    };

    socket.onclose = () => {
      setConnected(false);
      console.log('❌ Disconnected from Agent WebSocket');
    };

    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, [url]);

  const handleClientAction = (action: ClientAction) => {
    console.log('🛠️ Dispatching Client Action:', action);
    
    switch (action.tool) {
      case 'cli_show_documents':
        // Map inputs to SearchResult objects
        const results = action.tool_input.document_ids.map((id: string, index: number) => ({
          id,
          title: action.tool_input.titles[index] || `Document ${id}`
        }));
        setSearchResults(results);
        setMessages((prev) => [...prev, { 
          role: 'system', 
          content: `🔍 Encontré ${results.length} documentos relacionados con tu consulta.` 
        }]);
        break;
      case 'cli_preview_template':
        setMessages((prev) => [...prev, { 
          role: 'system', 
          content: `📊 Previsualizando plantilla: ${action.tool_input.template_id}` 
        }]);
        break;
      default:
        console.warn('Unknown client tool:', action.tool);
    }
  };

  const sendMessage = useCallback((content: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      setMessages((prev) => [...prev, { role: 'user', content }]);
      setIsThinking(true);
      socketRef.current.send(JSON.stringify({ message: content }));
    }
  }, []);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name); // Ensure backend has a title

    try {
      const response = await fetch('http://localhost:8000/documents', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      setMessages((prev) => [...prev, { 
        role: 'system', 
        content: `✅ Archivo "${file.name}" subido e indexado correctamente.` 
      }]);
      return data;
    } catch (err) {
      console.error('Upload Error:', err);
      setMessages((prev) => [...prev, { 
        role: 'system', 
        content: `❌ Error al subir "${file.name}". Inténtalo de nuevo.` 
      }]);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    messages,
    searchResults,
    setMessages,
    sendMessage,
    uploadFile,
    connected,
    isThinking,
    isUploading
  };
};
