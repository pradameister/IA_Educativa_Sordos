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

  const resp = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    timeout: 60000,
  })

  // Defensive parsing
  const data = resp.data
  const choice = data?.choices && data.choices[0]
  const text = choice?.message?.content ?? (typeof data === 'string' ? data : JSON.stringify(data))
  return String(text)
}
