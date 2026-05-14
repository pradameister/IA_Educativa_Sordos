import { GoogleGenerativeAI, Content } from '@google/generative-ai';
import { ChatMessage } from 'shared';

// Usaremos la nueva variable de entorno de Railway
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY no configurada — Las peticiones fallarán');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');

export async function getAIResponse(messages: ChatMessage[]) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY no está definida en Railway');
  }

  try {
    // 1. Extraemos el mensaje del sistema (instrucciones) y el último mensaje del usuario
    const systemInstruction = messages.find(m => m.role === 'system')?.content || '';
    const userMessages = messages.filter(m => m.role !== 'system');
    const lastUserMessage = userMessages.pop()?.content || '';

    // 2. Configuramos el modelo con las instrucciones del sistema
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction 
    });

    // 3. Convertimos el historial de OpenAI/Shared al formato de Gemini
    const history: Content[] = userMessages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // 4. Iniciamos el chat y enviamos el mensaje
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastUserMessage);
    const response = result.response;
    
    return response.text();

  } catch (error: any) {
    console.error('❌ Error en Gemini API:', error);
    throw new Error(`Error de Gemini: ${error.message || 'Error desconocido'}`);
  }
}
