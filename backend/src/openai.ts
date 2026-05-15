import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatMessage } from 'shared';

export { ChatMessage };

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');

export async function getAIResponse(messages: ChatMessage[]) {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY no definida');

  try {
    const systemPrompt = messages.find(m => m.role === 'system')?.content || 'Eres un profesor de POO.';
    const userMessages = messages.filter(m => m.role !== 'system');
    const lastUserMessage = userMessages.pop()?.content || 'Hola';

    // Usaremos "gemini-pro", que es el modelo más compatible del mundo
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Entendido, profesor listo." }] },
        ...userMessages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
      ],
    });

    const result = await chat.sendMessage(lastUserMessage);
    return result.response.text();
  } catch (error: any) {
    throw new Error(`Error de Gemini: ${error.message}`);
  }
}
