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
    const systemPrompt = messages.find(m => m.role === 'system')?.content || 'Eres un profesor de POO.';
    const userMessages = messages.filter(m => m.role !== 'system');
    const lastUserMessage = userMessages.pop()?.content || '';

    // 2. Usamos el modelo Flash que es el más rápido
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. Iniciamos el chat metiendo la instrucción como contexto inicial
    // Esto funciona en TODAS las regiones y versiones
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: `Instrucción: ${systemPrompt}` }] },
        { role: "model", parts: [{ text: "Entendido, profesor virtual listo." }] },
        ...userMessages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
      ],
    });

    const result = await chat.sendMessage(lastUserMessage);
    return result.response.text();

  } catch (error: any) {
    console.error('❌ Error de Gemini:', error);
    throw new Error(`Error de Gemini: ${error.message}`);
  }
}
