import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { getAIResponse } from './openai'
import { ChatMessage, ChatRequest, ChatResponse, LessonsResponse } from 'shared'
import { connectDB } from './db'
import Lesson from './models/Lesson'
import User from './models/User'
import authRoutes from './auth'
import { authMiddleware, AuthRequest } from './middleware'

dotenv.config() // Cargar .env estándar para producción

console.log('--- INICIANDO SERVIDOR ---');
console.log('Variables de entorno cargadas:', {
  PORT: process.env.PORT,
  MONGO_URL: process.env.DATABASE_URL ? 'CONFIGURADA' : 'NO CONFIGURADA',
  JWT_SECRET: process.env.JWT_SECRET ? 'CONFIGURADA' : 'NO CONFIGURADA',
  OPENAI_KEY: process.env.OPENAI_API_KEY ? 'CONFIGURADA' : 'NO CONFIGURADA'
});

const app: Express = express()
connectDB()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' })
})

// Get lessons
app.get('/api/lessons', async (req: Request, res: Response) => {
  try {
    const lessons = await Lesson.find()
    res.json({ lessons })
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las lecciones' })
  }
})

// Seed lessons (Helper endpoint to populate DB)
app.post('/api/lessons/seed', async (req: Request, res: Response) => {
  try {
    const initialLessons = [
      {
        title: 'Introducción a la Programación Orientada a Objetos',
        description: 'Conceptos fundamentales de POO y sus ventajas',
        difficulty: 'beginner',
        topic: 'POO',
        content: `¡Hola! Bienvenido a tu primera lección de Programación Orientada a Objetos, o POO. Imagina que la programación es como construir cosas. Antes, construíamos pieza por pieza, como un castillo de arena. Con POO, es como usar bloques de LEGO: cada bloque ya tiene una forma y una función, y podemos unirlos para crear algo más grande y complejo.\n\n**¿Qué es POO?**\nPOO es una forma de organizar tu código para que se parezca más al mundo real. En lugar de pensar en "acciones" que el programa debe hacer, pensamos en "cosas" (objetos) que tienen características y pueden hacer cosas.\n\n**Analogía Visual: Un Coche**\nPiensa en un coche. Un coche tiene características (color, marca, modelo, velocidad) y puede hacer acciones (acelerar, frenar, girar). En POO, el "coche" sería un **objeto**.\n\n**Beneficios de POO:**\n1.  **Organización:** Tu código es más fácil de entender y mantener.\n2.  **Reutilización:** Puedes usar los mismos "bloques" (objetos) en diferentes partes de tu programa.\n3.  **Flexibilidad:** Es más fácil añadir nuevas características o cambiar las existentes.`,
        exercise: 'Describe con tus propias palabras qué es un objeto en el mundo real y menciona 3 características que podría tener.',
        expectedCode: 'objeto, caracteristicas, propiedades'
      },
      {
        title: 'Clases y Objetos',
        description: 'Aprende a crear clases e instanciar objetos en JavaScript',
        difficulty: 'beginner',
        topic: 'POO',
        content: `En la lección anterior, hablamos de los "bloques de LEGO" de la POO. Ahora, vamos a ver cómo se crean: con **Clases** y **Objetos**.\n\n**Analogía Visual: Un Molde de Galletas y las Galletas**\nImagina que quieres hacer muchas galletas iguales. No haces cada galleta desde cero, ¿verdad? Usas un **molde de galletas**. El molde es la **Clase**. Todas las galletas que haces con ese molde son los **Objetos**.\n\n*   **Clase:** Es el **plano, el molde, la plantilla** para crear objetos. Define las características (propiedades) y las acciones (métodos) que tendrán todos los objetos de ese tipo.\n*   **Objeto:** Es una **instancia real** de una clase. Es la galleta hecha con el molde. Cada objeto tiene sus propios valores para las características definidas por la clase.\n\n**Ejemplo en JavaScript:**\n\`\`\`javascript\nclass Coche {\n  constructor(marca, modelo, color) {\n    this.marca = marca;\n    this.modelo = modelo;\n    this.color = color;\n  }\n  mostrarInfo() {\n    console.log(\`Este es un \${this.color} \${this.marca} \${this.modelo}.\`);\n  }\n}\nconst miCoche = new Coche("Toyota", "Corolla", "rojo");\nmiCoche.mostrarInfo();\n\`\`\``,
        exercise: 'Crea una clase llamada "Persona" que tenga un constructor con "nombre" y "edad". Luego crea un objeto llamado "estudiante" con tu nombre.',
        expectedCode: 'class Persona, constructor, new Persona'
      },
      {
        title: 'Herencia en JavaScript',
        description: 'Cómo reutilizar código mediante herencia',
        difficulty: 'intermediate',
        topic: 'POO',
        content: `¡Imagina que tienes una familia! Tú heredas características de tus padres, ¿verdad? En POO, la **Herencia** funciona de manera similar: una clase puede heredar características y acciones de otra clase.\n\n**Analogía Visual: Padres e Hijos**\n*   **Clase Padre (Superclase):** Es como el padre. Define características y acciones generales.\n*   **Clase Hija (Subclase):** Es como el hijo. Hereda todo del padre y, además, puede tener sus propias características y acciones especiales.\n\n**Ejemplo en JavaScript:**\n\`\`\`javascript\nclass Vehiculo {\n  constructor(ruedas) { this.ruedas = ruedas; }\n  arrancar() { console.log("Arrancando..."); }\n}\nclass Coche extends Vehiculo {\n  constructor(marca, ruedas) {\n    super(ruedas);\n    this.marca = marca;\n  }\n}\nconst miCoche = new Coche("Tesla", 4);\nmiCoche.arrancar();\n\`\`\``
      },
      {
        title: 'Encapsulamiento',
        description: 'Protegiendo la información de nuestros objetos',
        difficulty: 'intermediate',
        topic: 'POO',
        content: `Imagina que tienes una caja fuerte. El **Encapsulamiento** se trata de **proteger la información** dentro de un objeto y controlar cómo se accede a ella.\n\n**Analogía Visual: Una Caja Fuerte**\n*   **Caja Fuerte (Objeto):** Contiene datos y métodos.\n*   **Contenido (Datos Privados):** Solo se puede acceder a ellos de forma controlada.\n\n**Ejemplo en JavaScript:**\n\`\`\`javascript\nclass CuentaBancaria {\n  #saldo;\n  constructor(saldo) { this.#saldo = saldo; }\n  verSaldo() { return this.#saldo; }\n}\nconst cuenta = new CuentaBancaria(100);\nconsole.log(cuenta.verSaldo());\n\`\`\``
      },
      {
        title: 'Polimorfismo',
        description: 'Muchas formas de realizar una acción',
        difficulty: 'advanced',
        topic: 'POO',
        content: `**Polimorfismo** significa "muchas formas". Es la capacidad de un método de comportarse de **diferentes maneras** según el objeto que lo llama.\n\n**Analogía Visual: Un Botón de "Reproducir"**\nEl mismo botón reproduce música en un reproductor de audio y video en uno de cine. La acción cambia según el contexto.\n\n**Ejemplo en JavaScript:**\n\`\`\`javascript\nclass Animal { hacerSonido() { console.log("Sonido..."); } }\nclass Perro extends Animal { hacerSonido() { console.log("Guau!"); } }\nclass Gato extends Animal { hacerSonido() { console.log("Miau!"); } }\n\nconst animales = [new Perro(), new Gato()];\nanimales.forEach(a => a.hacerSonido());\n\`\`\``
      }
    ]

    await Lesson.deleteMany({}) // Limpiar anteriores para el seed real
    await Lesson.insertMany(initialLessons)
    res.json({ message: 'Lecciones iniciales creadas con éxito' })
  } catch (error) {
    res.status(500).json({ error: 'Error al crear lecciones iniciales' })
  }
})

// Chat endpoint with OpenAI (Protected)
app.post('/api/chat', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { message, history } = req.body as ChatRequest

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // System prompt para profesor virtual
    const systemPrompt: ChatMessage = {
      role: 'system',
      content: `Eres un profesor virtual especializado en Programación Orientada a Objetos (POO). \nTu objetivo es enseñar de forma clara, paso a paso, con ejemplos en JavaScript.\n\nPara hacer la comunicación más accesible para personas sordas, por favor sigue estas pautas:\n- Utiliza lenguaje simple y directo, evita jergas complejas.\n- Incorpora emojis y metáforas visuales para representar conceptos clave de POO. Por ejemplo:\n    - Clase: 🏗️ (como un plano o molde)\n    - Objeto: 📦 (como una instancia o un producto)\n    - Herencia: 👨‍👩‍👧 (como una familia que comparte características)\n    - Encapsulamiento: 🔒 (como una caja fuerte que protege información)\n    - Polimorfismo: 🎭 (como un actor con muchos roles)\n- Siempre que sea posible, ofrece analogías visuales claras (ej. "molde de galletas" para clase).\n- Incluye ejemplos de código en JavaScript cuando sea apropiado.\n- Si el usuario pregunta algo fuera de programación, redirígelo amablemente al tema de POO.\n- Sé paciente y amable en todas tus interacciones.\n- Ofrece ejercicios prácticos cuando sea apropiado.\n- Si un concepto es complejo, sugiere al usuario que consulte el "Glosario de Señas" para una explicación visual.`,
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
    // Log completo para depuración en producción (Railway)
    console.error('❌ Chat error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    })
    
    res.status(500).json({
      error: 'Error al procesar tu mensaje.',
      details: error.message // Lo enviamos temporalmente para que el usuario vea el error real
    })
  }
})

// Mark lesson as completed (Protected)
app.post('/api/lessons/:id/complete', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const lessonId = req.params.id;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Check if already completed
    if (!user.progress.completedLessons.includes(lessonId as any)) {
      user.progress.completedLessons.push(lessonId as any);
      await user.save();
    }

    res.json({ message: 'Lección marcada como completada', progress: user.progress });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el progreso' });
  }
});

// Get user progress (Protected)
app.get('/api/user/progress', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).populate('progress.completedLessons');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ progress: user.progress });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el progreso' });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`)
  console.log(`📚 API health: http://localhost:${PORT}/api/health`)
  console.log(`💬 Chat endpoint: POST http://localhost:${PORT}/api/chat`)
})
