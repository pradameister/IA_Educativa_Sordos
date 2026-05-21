import axios from 'axios'
import { Groq } from 'groq-sdk'
import { ChatMessage } from 'shared'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const GROQ_API_KEY = process.env.GROQ_API_KEY
const AI_PROVIDER = process.env.AI_PROVIDER || (GROQ_API_KEY ? 'groq' : 'openai')
const MODEL = process.env.AI_MODEL || (AI_PROVIDER === 'groq' ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini')

if (!OPENAI_API_KEY && !GROQ_API_KEY) {
  console.warn('Neither OPENAI_API_KEY nor GROQ_API_KEY is set — AI requests will fail')
}

console.log(`🤖 AI Provider: ${AI_PROVIDER} | Model: ${MODEL}`)

const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null

export { ChatMessage }

export async function getAIResponse(messages: ChatMessage[]) {
  if (AI_PROVIDER === 'groq' && GROQ_API_KEY) {
    return await getGroqResponse(messages)
  } else {
    return await getOpenAIResponse(messages)
  }
}

async function getGroqResponse(messages: ChatMessage[]) {
  if (!groq) throw new Error('Groq SDK not initialized')
  
  try {
    const completion = await groq.chat.completions.create({
      messages: messages as any,
      model: MODEL,
      temperature: 0.2,
      max_tokens: 800,
    })

    const text = completion.choices[0]?.message?.content
    if (!text) throw new Error('Formato de respuesta de Groq no reconocido')
    
    return String(text)
  } catch (error: any) {
    console.error('Groq API Error:', error.message)
    throw new Error(`Error de Groq: ${error.message}`)
  }
}

async function getOpenAIResponse(messages: ChatMessage[]) {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined')
  }

  const payload = {
    model: MODEL,
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
