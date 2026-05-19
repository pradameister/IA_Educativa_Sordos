import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { ChatRequest, ChatResponse, ChatMessage } from 'shared';
import { authService } from '../services/auth';

// Mapeo de conceptos de POO a emojis para referencia visual
const POO_CONCEPTS = {
  clase: '🏗️',
  objeto: '📦',
  herencia: '👨‍👩‍👧',
  encapsulamiento: '🔒',
  polimorfismo: '🎭',
  metodo: '⚙️',
  propiedad: '🏷️',
  constructor: '🔨',
  instancia: '✨',
};

// Función para procesar y enriquecer el contenido del mensaje con emojis
const enrichMessageContent = (content: string): React.ReactNode => {
  let enriched = content;
  
  const conceptRegex = new RegExp(
    `\\b(${Object.keys(POO_CONCEPTS).join('|')})\\b`,
    'gi'
  );
  
  const parts = content.split(conceptRegex);
  
  return parts.map((part, index) => {
    const lowerPart = part?.toLowerCase() || '';
    const emoji = POO_CONCEPTS[lowerPart as keyof typeof POO_CONCEPTS];
    
    if (emoji) {
      return (
        <span key={index} className="inline-block">
          <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded mx-1">
            {emoji} {part}
          </span>
        </span>
      );
    }
    return part;
  });
};

const ChatInterface: React.FC = () => {
  const { messages, addMessage, clearMessages, isLoadingHistory } = useChat();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    if (!authService.isAuthenticated()) {
      addMessage({ role: 'assistant', content: '⚠️ Debes iniciar sesión para usar el chat.' });
      return;
    }

    const userMessage: ChatMessage = { role: 'user', content: input };
    addMessage(userMessage);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const payload: ChatRequest = {
        message: currentInput,
        history: messages,
      };

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      // El interceptor de axios en auth.ts ya añade el token
      const response = await axios.post<ChatResponse>(`${API_URL}/api/chat`, payload);

      addMessage({ role: 'assistant', content: response.data.response });
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMsg = error.response?.data?.error === 'Token inválido' 
        ? '⚠️ Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.'
        : 'Lo siento, hubo un error al procesar tu mensaje. Inténtalo de nuevo.';
      addMessage({ role: 'assistant', content: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingHistory) {
    return (
      <div className="flex items-center justify-center h-[650px] bg-white dark:bg-gray-900 rounded-2xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] md:h-[650px] bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
      {/* Header del Chat */}
      <div className="bg-indigo-600 dark:bg-indigo-700 p-4 text-white flex justify-between items-center shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg text-xl">🤖</div>
          <div>
            <h2 className="text-lg font-bold leading-none">Profesor de POO</h2>
            <span className="text-xs text-indigo-100">En línea para ayudarte</span>
          </div>
        </div>
        <button 
          onClick={clearMessages}
          className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-all border border-white/20"
        >
          Reiniciar
        </button>
      </div>

      {/* Barra de información sobre iconografía */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-3 border-b border-indigo-200">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Conceptos de POO:</span> 
          <span className="ml-2">🏗️ Clase • 📦 Objeto • 👨‍👩‍👧 Herencia • 🔒 Encapsulamiento • 🎭 Polimorfismo</span>
        </p>
      </div>

      {/* Área de Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/50 dark:bg-gray-950/50">
        {messages.length === 0 && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="text-5xl mb-4 animate-bounce">👋</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">¡Hola! Soy tu Profesor IA</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs">¿Tienes alguna duda sobre clases, objetos o herencia? ¡Pregúntame lo que quieras!</p>
            <div className="mt-6 grid grid-cols-1 gap-2 text-xs">
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg border border-indigo-100 dark:border-indigo-800">
                Uso esquemas visuales: 🏗️ ➔ 🚗
              </div>
            </div>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            <div
              className={`max-w-[90%] md:max-w-[80%] p-4 rounded-2xl shadow-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-600 dark:bg-indigo-700 text-white rounded-tr-none'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700'
              }`}
            >
              {msg.role === 'assistant' ? (
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {enrichMessageContent(msg.content)}
                </div>
              ) : (
                <div className="text-sm">{msg.content}</div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de Mensajes */}
      <div className="p-3 md:p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu duda sobre POO aquí..."
            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all text-sm md:text-base"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 text-white p-3 md:px-6 md:py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:bg-indigo-400 transition-all shadow-lg active:scale-95 flex items-center justify-center"
          >
            <span className="hidden md:inline">Enviar</span>
            <svg className="h-5 w-5 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Consejo: Usa palabras como "clase", "objeto", "herencia" para obtener respuestas más visuales
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
