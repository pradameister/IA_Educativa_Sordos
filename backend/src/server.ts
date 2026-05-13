import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { getAIResponse } from './openai'
import { ChatMessage, ChatRequest, ChatResponse, LessonsResponse } from 'shared'

dotenv.config({ path: '.env.local' })

const app: Express = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' })
})

// Get lessons
app.get('/api/lessons', (req: Request, res: Response) => {
  res.json({
    lessons: [
      {
        id: 1,
        title: 'Introducción a la Programación Orientada a Objetos',
        description: 'Conceptos fundamentales de POO y sus ventajas',
        difficulty: 'beginner',
        topic: 'POO',
      },
      {
        id: 2,
        title: 'Clases y Objetos',
        description: 'Aprende a crear clases e instanciar objetos en JavaScript',
        difficulty: 'beginner',
        topic: 'POO',
      },
      {
        id: 3,
        title: 'Herencia en JavaScript',
        description: 'Cómo reutilizar código mediante herencia',
        difficulty: 'intermediate',
        topic: 'POO',
      },
      {
        id: 4,
        title: 'Polimorfismo y Encapsulación',
        description: 'Conceptos avanzados de POO',
        difficulty: 'intermediate',
        topic: 'POO',
      },
    ],
  })
})

// Chat endpoint with OpenAI
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body as ChatRequest

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // System prompt para profesor virtual
    const systemPrompt: ChatMessage = {
      role: 'system',
      content: `Eres un profesor virtual especializado en Programación Orientada a Objetos (POO). 
Tu objetivo es enseñar de forma clara, paso a paso, con ejemplos en JavaScript.
- Responde de forma accesible para personas sordas: lenguaje simple, estructura clara
- Incluye ejemplos de código cuando sea apropiado
- Si el usuario pregunta algo fuera de programación, redirígelo al tema de POO
- Sé paciente y amable
- Ofrece ejercicios prácticos cuando sea apropiado`,
    }

    // Construir mensaje para OpenAI
    const messages: ChatMessage[] = [
      systemPrompt,
      ...(history && Array.isArray(history)
        ? history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
        : []),
      { role: 'user', content: message.trim() },
    ]

    console.log(`📨 Chat request: ${message.substring(0, 50)}...`)
    const aiResponse = await getAIResponse(messages)

    const response: ChatResponse = { response: aiResponse }
    res.json(response)
  } catch (error: any) {
    console.error('❌ Chat error:', error?.response?.data ?? error.message ?? error)
    res.status(500).json({
      error: 'Error al procesar tu mensaje. Por favor, intenta de nuevo.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    })
  }
})

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`)
  console.log(`📚 API health: http://localhost:${PORT}/api/health`)
  console.log(`💬 Chat endpoint: POST http://localhost:${PORT}/api/chat`)
})
