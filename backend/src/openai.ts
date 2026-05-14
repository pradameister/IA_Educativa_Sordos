import axios from 'axios'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

if (!OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY not set — OpenAI requests will fail')
}

import { ChatMessage } from 'shared'
export { ChatMessage }

export async function getAIResponse(messages: ChatMessage[]) {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined')
  }

  const payload = {
    model: OPENAI_MODEL,
    messages,
    temperature: 0.2,
    max_tokens: 800,
  }

  try {
    const resp = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    })

    const data = resp.data
    const text = data?.choices?.[0]?.message?.content
    
    if (!text) {
      console.error('OpenAI response format error:', JSON.stringify(data))
      throw new Error('Formato de respuesta de OpenAI no reconocido')
    }

    return String(text)
  } catch (error: any) {
    if (error.response) {
      console.error('OpenAI API Error:', error.response.status, error.response.data)
      throw new Error(`Error de OpenAI: ${error.response.data?.error?.message || error.response.statusText}`)
    }
    throw error
  }
}
