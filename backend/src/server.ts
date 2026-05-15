import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { getAIResponse } from './openai'
import { ChatMessage, ChatRequest, ChatResponse, LessonsResponse } from 'shared'
import { connectDB } from './db'
import Lesson from './models/Lesson'
import User from './models/User'
import Message from './models/Message'
import authRoutes from './auth'
import { authMiddleware, AuthRequest } from './middleware'

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 3000

// 1. Middlewares globales
app.use(cors())
app.use(express.json())

// Log de peticiones para depuración
app.use((req, res, next) => {
  console.log(`📡 Petición recibida: ${req.method} ${req.url}`);
  next();
});

// 2. Conexión y Seed
connectDB().then(async () => {
  try {
    const count = await Lesson.countDocuments();
    if (count === 0) {
      console.log('🌱 Ejecutando seed...');
      const initialLessons = [
        {
          title: 'Introducción a la Programación Orientada a Objetos',
          description: 'Conceptos fundamentales de POO y sus ventajas',
          difficulty: 'beginner',
          topic: 'POO',
          content: `¡Hola! Bienvenido a tu primera lección de POO.`,
          exercise: '¿Qué es un objeto?',
          expectedCode: 'objeto'
        }
      ];
      await Lesson.insertMany(initialLessons);
    }
  } catch (e) {}
});

// 3. Definición de Rutas (Soportando con y sin /api)

// Auth
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

// Chat History
const chatHistoryHandler = async (req: AuthRequest, res: Response) => {
  try {
    const messages = await Message.find({ user: req.userId }).sort({ createdAt: 1 }).limit(50);
    res.json({ history: messages });
  } catch (error) {
    res.status(500).json({ error: 'Error historial' });
  }
};
app.get('/api/chat/history', authMiddleware, chatHistoryHandler);
app.get('/chat/history', authMiddleware, chatHistoryHandler);

// Lessons
const lessonsHandler = async (req: Request, res: Response) => {
  try {
    const lessons = await Lesson.find();
    res.json({ lessons });
  } catch (error) {
    res.status(500).json({ error: 'Error lecciones' });
  }
};
app.get('/api/lessons', lessonsHandler);
app.get('/lessons', lessonsHandler);

// Chat AI
const chatHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { message, history } = req.body as ChatRequest;
    if (!message) return res.status(400).json({ error: 'Message required' });
    const aiResponse = await getAIResponse([{ role: 'system', content: 'Profesor de POO.' }, { role: 'user', content: message }]);
    Message.create([{ user: req.userId, role: 'user', content: message }, { user: req.userId, role: 'assistant', content: aiResponse }]).catch(() => {});
    res.json({ response: aiResponse });
  } catch (error: any) {
    res.status(500).json({ error: 'Error chat' });
  }
};
app.post('/api/chat', authMiddleware, chatHandler);
app.post('/chat', authMiddleware, chatHandler);

// Salud
app.get('/health', (req, res) => res.json({ status: 'OK' }));
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// 4. Manejador 404 Detallado
app.use((req, res) => {
  const fullUrl = `${req.method} ${req.url}`;
  console.log(`❌ 404 detectado en: ${fullUrl}`);
  res.status(404).json({ 
    error: 'Ruta no encontrada', 
    requestedUrl: fullUrl,
    hint: 'Verifica si la URL en el frontend coincide con las rutas del backend.'
  });
});

app.listen(PORT, () => console.log(`🚀 Servidor listo en puerto ${PORT}`));
