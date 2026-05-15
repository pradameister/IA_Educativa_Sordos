import Groq from 'groq-sdk';
import { ChatMessage } from 'shared';

export { ChatMessage };

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const groq = new Groq({
  apiKey: GROQ_API_KEY || '',
});

export async function getAIResponse(messages: ChatMessage[]) {
  if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY no definida');

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messages.map(m => ({
        role: m.role as 'system' | 'user' | 'assistant',
        content: m.content
      })),
      temperature: 0.7,
      max_tokens: 1024,
    });

    return response.choices[0].message.content || 'Sin respuesta de la IA';
  } catch (error: any) {
    throw new Error(`Error de Groq: ${error.message}`);
  }
}
