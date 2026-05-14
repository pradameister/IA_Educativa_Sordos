import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatMessage } from 'shared';

export { ChatMessage };

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');

export async function getAIResponse(messages: ChatMessage[]) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY no está definida en Railway');
  }

  try {
    // 1. Extraemos las instrucciones y los mensajes
    const systemInstruction = messages.find(m => m.role === 'system')?.content || 'Eres un profesor de POO.';
    const userMessages = messages.filter(m => m.role !== 'system');
    const lastUserMessage = userMessages.pop()?.content || '';

    // 2. Usamos el nombre de modelo más básico y compatible
    // Si este falla, cambia "gemini-1.5-flash" por "gemini-pro"
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. PASO CLAVE: Iniciamos el chat con las instrucciones como si fueran el primer mensaje
    // Esto es compatible con absolutamente todas las versiones de la API
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: `Instrucción importante: ${systemInstruction}` }] },
        { role: "model", parts: [{ text: "Entendido. Hola, soy tu profesor virtual de Programación Orientada a Objetos. ¿En qué puedo ayudarte hoy?" }] },
        ...userMessages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
      ],
    });

    const result = await chat.sendMessage(lastUserMessage);
    return result.response.text();

  } catch (error: any) {
    console.error('❌ Error detallado en Gemini API:', error);
    throw new Error(`Error de Gemini: ${error.message || 'Error desconocido'}`);
  }
}
