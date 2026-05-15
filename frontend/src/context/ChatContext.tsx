import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { ChatMessage } from 'shared';

interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await axios.get(`${API_URL}/api/chat/history`);
        if (response.data.history) {
          setMessages(response.data.history.map((m: any) => ({
            role: m.role,
            content: m.content
          })));
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchHistory();
  }, []);

  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const clearMessages = async () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar todo el historial de chat? Esta acción no se puede deshacer.')) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        await axios.delete(`${API_URL}/api/chat/history`);
        setMessages([]);
      } catch (error) {
        console.error('Error clearing messages:', error);
        // Aún así limpiamos localmente por UX
        setMessages([]);
      }
    }
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
