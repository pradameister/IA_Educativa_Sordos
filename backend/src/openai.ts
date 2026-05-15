import OpenAI from 'openai';
import { ChatMessage } from 'shared';

export { ChatMessage };

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY || '',
});

export async function getAIResponse(messages: ChatMessage[]) {
  if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY no definida');

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages.map(m => ({
        role: m.role as 'system' | 'user' | 'assistant',
        content: m.content
      })),
      temperature: 0.7,
    });

    return response.choices[0].message.content || 'Sin respuesta de la IA';
  } catch (error: any) {
    throw new Error(`Error de OpenAI: ${error.message}`);
  }
}
