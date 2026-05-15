import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { ChatRequest, ChatResponse, ChatMessage } from 'shared';

const ChatInterface: React.FC = () => {
  const { messages, addMessage, clearMessages } = useChat();
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
      const response = await axios.post<ChatResponse>(`${API_URL}/api/chat`, payload);

      addMessage({ role: 'assistant', content: response.data.response });
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage({ role: 'assistant', content: 'Lo siento, hubo un error al procesar tu mensaje.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] md:h-[650px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header del Chat */}
      <div className="bg-indigo-600 p-4 text-white flex justify-between items-center shrink-0 shadow-md">
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

      {/* Área de Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/50">
        {messages.length === 0 && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="text-5xl mb-4 animate-bounce">👋</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¡Hola! Soy tu Profesor IA</h3>
            <p className="text-gray-500 max-w-xs">¿Tienes alguna duda sobre clases, objetos o herencia? ¡Pregúntame lo que quieras!</p>
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
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
              }`}
            >
              <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : 'prose-p:leading-relaxed'}`}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
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
      <div className="p-3 md:p-4 bg-white border-t border-gray-100 shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu duda..."
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm md:text-base"
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
      </div>
    </div>
  );
};

export default ChatInterface;
