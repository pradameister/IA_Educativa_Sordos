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

// 2. Conexión y Seed automático
connectDB().then(async () => {
  try {
    const count = await Lesson.countDocuments();
    if (count === 0) {
      console.log('🌱 Ejecutando seed de lecciones...');
      const initialLessons = [
        {
          title: 'Introducción a la Programación Orientada a Objetos',
          description: 'Conceptos fundamentales de POO y sus ventajas',
          difficulty: 'beginner',
          topic: 'POO',
          content: `¡Hola! Bienvenido a tu primera lección de POO.`,
          exercise: '¿Qué es un objeto?',
          expectedCode: 'objeto'
        },
        {
          title: 'Clases y Objetos',
          description: 'Aprende a crear clases e instanciar objetos',
          difficulty: 'beginner',
          topic: 'POO',
          content: `Las clases son moldes y los objetos son las instancias reales.`,
          exercise: 'Crea una clase Persona.',
          expectedCode: 'class Persona'
        }
      ];
      await Lesson.insertMany(initialLessons);
      console.log('✅ Seed completado');
    }
  } catch (e) {
    console.error('❌ Error en seed:', e);
  }
});

// 3. Definición de Rutas

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

// Lessons List
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

// Complete Lesson
const completeLessonHandler = async (req: AuthRequest, res: Response) => {
  console.log(`📝 Intento de completar lección. User: ${req.userId}, Lesson: ${req.params.id}`);
  try {
    const lessonId = req.params.id;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const alreadyCompleted = user.progress.completedLessons.some(id => id.toString() === lessonId);
    if (!alreadyCompleted) {
      user.progress.completedLessons.push(lessonId as any);
      await user.save();
      console.log('✅ Lección guardada');
    }
    res.json({ message: 'OK', progress: user.progress });
  } catch (error: any) {
    console.error('❌ Error en complete:', error.message);
    res.status(500).json({ error: 'Error progress' });
  }
};
app.post('/api/lessons/:id/complete', authMiddleware, completeLessonHandler);
app.post('/lessons/:id/complete', authMiddleware, completeLessonHandler);

// User Progress
const progressHandler = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).populate('progress.completedLessons');
    res.json({ progress: user?.progress });
  } catch (error) {
    res.status(500).json({ error: 'Error progress fetch' });
  }
};
app.get('/api/user/progress', authMiddleware, progressHandler);
app.get('/user/progress', authMiddleware, progressHandler);

// Chat AI
const chatHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { message, history } = req.body as ChatRequest;
    if (!message) return res.status(400).json({ error: 'Message required' });
    const aiResponse = await getAIResponse([
      { 
        role: 'system', 
        content: `Eres un Profesor de Programación experto en POO y accesibilidad para personas sordas.
        
        Tus superpoderes:
        1. **Empatía**: Si el alumno se siente frustrado, sé su mayor fan. Anímalo con emojis y palabras sencillas.
        2. **Claridad Visual**: Usa Markdown (negritas, listas, bloques de código) para que todo se entienda sin leer párrafos largos.
        3. **Enseñanza por Pasos**: No des toda la respuesta de golpe. Guía al alumno para que él mismo descubra la solución.` 
      }, 
      { role: 'user', content: message }
    ]);
    Message.create([{ user: req.userId, role: 'user', content: message }, { user: req.userId, role: 'assistant', content: aiResponse }]).catch(() => {});
    res.json({ response: aiResponse });
  } catch (error: any) {
    res.status(500).json({ error: 'Error chat' });
  }
};
app.post('/api/chat', authMiddleware, chatHandler);
app.post('/chat', authMiddleware, chatHandler);

// Evaluación de Retos (NO guarda en historial)
const evaluateHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body;
    const aiResponse = await getAIResponse([
      { 
        role: 'system', 
        content: `Eres un Profesor de Programación experto en accesibilidad para personas sordas. 
        Tu objetivo es enseñar POO de forma INTERACTIVA, VISUAL y EMPÁTICA.
        
        REGLAS DE INTELIGENCIA AVANZADA:
        1. **Análisis de Sentimiento**: Si el mensaje del alumno denota frustración ("no entiendo", "es difícil", "ayuda"), cambia tu tono a uno EXTREMADAMENTE paciente y alentador. Simplifica las analogías.
        2. **Retos Dinámicos**: Si el alumno falla, además del feedback, propón un "Mini-Reto de Refuerzo" más sencillo.
        3. **Estructura Visual**: Usa negritas, listas y muchos emojis. Párrafos muy cortos.
        
        FORMATO DE RESPUESTA:
        ### ✅ Lo que lograste
        - ...
        ### 💡 Sugerencia del Profe
        - ...
        ### 🎯 Mini-Reto de Refuerzo (Solo si falló)
        - ...
        ### 🚀 ¡Ánimo, tú puedes!
        ...` 
      },
      { role: 'user', content: message }
    ]);
    res.json({ response: aiResponse });
  } catch (error: any) {
    res.status(500).json({ error: 'Error evaluación' });
  }
};
app.post('/api/evaluate', authMiddleware, evaluateHandler);
app.post('/evaluate', authMiddleware, evaluateHandler);

// Salud
app.get('/health', (req, res) => res.json({ status: 'OK' }));
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// 4. Manejador 404
app.use((req, res) => {
  console.log(`❌ 404 detectado en: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Ruta no encontrada', url: req.url });
});

app.listen(PORT, () => console.log(`🚀 Servidor listo en puerto ${PORT}`));
