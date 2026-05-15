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

// 1. Middlewares globales (Deben ir primero)
app.use(cors())
app.use(express.json())

// 2. Conexión y Seed
connectDB().then(async () => {
  try {
    const count = await Lesson.countDocuments();
    if (count === 0) {
      console.log('🌱 Seed automático de lecciones...');
      const initialLessons = [
        {
          title: 'Introducción a la Programación Orientada a Objetos',
          description: 'Conceptos fundamentales de POO y sus ventajas',
          difficulty: 'beginner',
          topic: 'POO',
          content: `¡Hola! Bienvenido a tu primera lección de Programación Orientada a Objetos, o POO. Imagina que la programación es como construir cosas. Antes, construíamos pieza por pieza, como un castillo de arena. Con POO, es como usar bloques de LEGO: cada bloque ya tiene una forma y una función, y podemos unirlos para crear algo más grande y complejo.

**¿Qué es POO?**
POO es una forma de organizar tu código para que se parezca más al mundo real. En lugar de pensar en "acciones" que el programa debe hacer, pensamos en "cosas" (objetos) que tienen características y pueden hacer cosas.

**Analogía Visual: Un Coche**
Piensa en un coche. Un coche tiene características (color, marca, modelo, velocidad) y puede hacer acciones (acelerar, frenar, girar). En POO, el "coche" sería un **objeto**.

**Beneficios de POO:**
1.  **Organización:** Tu código es más fácil de entender y mantener.
2.  **Reutilización:** Puedes usar los mismos "bloques" (objetos) en diferentes partes de tu programa.
3.  **Flexibilidad:** Es más fácil añadir nuevas características o cambiar las existentes.`,
          exercise: 'Describe con tus propias palabras qué es un objeto en el mundo real y menciona 3 características que podría tener.',
          expectedCode: 'objeto, caracteristicas, propiedades'
        },
        {
          title: 'Clases y Objetos',
          description: 'Aprende a crear clases e instanciar objetos en JavaScript',
          difficulty: 'beginner',
          topic: 'POO',
          content: `En la lección anterior, hablamos de los "bloques de LEGO" de la POO. Ahora, vamos a ver cómo se crean: con **Clases** y **Objetos**.

**Analogía Visual: Un Molde de Galletas y las Galletas**
Imagina que quieres hacer muchas galletas iguales. No haces cada galleta desde cero, ¿verdad? Usas un **molde de galletas**. El molde es la **Clase**. Todas las galletas que haces con ese molde son los **Objetos**.

*   **Clase:** Es el **plano, el molde, la plantilla** para crear objetos. Define las características (propiedades) y las acciones (métodos) que tendrán todos los objetos de ese tipo.
*   **Objeto:** Es una **instancia real** de una clase. Es la galleta hecha con el molde. Cada objeto tiene sus propios valores para las características definidas por la clase.

**Ejemplo en JavaScript:**
\`\`\`javascript
class Coche {
  constructor(marca, modelo, color) {
    this.marca = marca;
    this.modelo = modelo;
    this.color = color;
  }
  mostrarInfo() {
    console.log(\`Este es un \${this.color} \${this.marca} \${this.modelo}.\`);
  }
}
const miCoche = new Coche("Toyota", "Corolla", "rojo");
miCoche.mostrarInfo();
\`\`\``,
          exercise: 'Crea una clase llamada "Persona" que tenga un constructor con "nombre" y "edad". Luego crea un objeto llamado "estudiante" con tu nombre.',
          expectedCode: 'class Persona, constructor, new Persona'
        }
      ];
      await Lesson.insertMany(initialLessons);
      console.log('✅ Seed completado');
    }
  } catch (error) {
    console.error('❌ Error seed:', error);
  }
});

// 3. Definición de Rutas (Orden crítico)

// Rutas de Autenticación
app.use('/api/auth', authRoutes)

// Rutas de Historial de Chat (Protegido)
app.get('/api/chat/history', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const messages = await Message.find({ user: req.userId }).sort({ createdAt: 1 }).limit(50);
    res.json({ history: messages });
  } catch (error) {
    res.status(500).json({ error: 'Error historial' });
  }
});

// Rutas de Lecciones
app.get('/api/lessons', async (req: Request, res: Response) => {
  try {
    const lessons = await Lesson.find()
    res.json({ lessons })
  } catch (error) {
    res.status(500).json({ error: 'Error lecciones' })
  }
})

// Chat con IA (Protegido)
app.post('/api/chat', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { message, history } = req.body as ChatRequest
    if (!message) return res.status(400).json({ error: 'Message required' })

    const systemPrompt: ChatMessage = {
      role: 'system',
      content: `Eres un profesor virtual de POO para personas sordas. Usa Markdown, frases cortas y muchos saltos de línea.`,
    }

    const messages: ChatMessage[] = [
      systemPrompt,
      ...(history && Array.isArray(history) ? history.map(m => ({ role: m.role as any, content: m.content })) : []),
      { role: 'user', content: message.trim() },
    ]

    const aiResponse = await getAIResponse(messages)

    // Guardar en DB
    Message.create([
      { user: req.userId, role: 'user', content: message.trim() },
      { user: req.userId, role: 'assistant', content: aiResponse }
    ]).catch(e => console.error('Error saving msg:', e));

    res.json({ response: aiResponse })
  } catch (error: any) {
    res.status(500).json({ error: 'Error chat', details: error.message })
  }
})

// Progreso y Completado
app.post('/api/lessons/:id/complete', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.progress.completedLessons.includes(req.params.id as any)) {
      user.progress.completedLessons.push(req.params.id as any);
      await user.save();
    }
    res.json({ message: 'OK', progress: user.progress });
  } catch (error) {
    res.status(500).json({ error: 'Error progress' });
  }
});

app.get('/api/user/progress', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).populate('progress.completedLessons');
    res.json({ progress: user?.progress });
  } catch (error) {
    res.status(500).json({ error: 'Error progress fetch' });
  }
});

// Salud
app.get('/api/health', (req, res) => res.json({ status: 'OK' }))

// 4. Manejador 404 (SIEMPRE AL FINAL)
app.use((req, res) => {
  console.log(`404 en ruta: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Ruta no encontrada' })
})

app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`))
