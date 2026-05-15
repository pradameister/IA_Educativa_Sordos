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

console.log('--- INICIANDO SERVIDOR ---');

const app: Express = express()
const PORT = process.env.PORT || 3000

// Middlewares globales
app.use(cors())
app.use(express.json())

// Conectar a la base de datos y realizar seed automático
connectDB().then(async () => {
  try {
    const count = await Lesson.countDocuments();
    if (count === 0) {
      console.log('🌱 Base de datos vacía. Ejecutando seed de lecciones...');
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
        },
        {
          title: 'Herencia en JavaScript',
          description: 'Cómo reutilizar código mediante herencia',
          difficulty: 'intermediate',
          topic: 'POO',
          content: `¡Imagina que tienes una familia! Tú heredas características de tus padres, ¿verdad? En POO, la **Herencia** funciona de manera similar: una clase puede heredar características y acciones de otra clase.

**Analogía Visual: Padres e Hijos**
*   **Clase Padre (Superclase):** Es como el padre. Define características y acciones generales.
*   **Clase Hija (Subclase):** Es como el hijo. Hereda todo del padre y, además, puede tener sus propias características y acciones especiales.

**Ejemplo en JavaScript:**
\`\`\`javascript
class Vehiculo {
  constructor(ruedas) { this.ruedas = ruedas; }
  arrancar() { console.log("Arrancando..."); }
}
class Coche extends Vehiculo {
  constructor(marca, ruedas) {
    super(ruedas);
    this.marca = marca;
  }
}
const miCoche = new Coche("Tesla", 4);
miCoche.arrancar();
\`\`\``
        },
        {
          title: 'Encapsulamiento',
          description: 'Protegiendo la información de nuestros objetos',
          difficulty: 'intermediate',
          topic: 'POO',
          content: `Imagina que tienes una caja fuerte. El **Encapsulamiento** se trata de **proteger la información** dentro de un objeto y controlar cómo se accede a ella.

**Analogía Visual: Una Caja Fuerte**
*   **Caja Fuerte (Objeto):** Contiene datos y métodos.
*   **Contenido (Datos Privados):** Solo se puede acceder a ellos de forma controlada.

**Ejemplo en JavaScript:**
\`\`\`javascript
class CuentaBancaria {
  #saldo;
  constructor(saldo) { this.#saldo = saldo; }
  verSaldo() { return this.#saldo; }
}
const cuenta = new CuentaBancaria(100);
console.log(cuenta.verSaldo());
\`\`\``
        },
        {
          title: 'Polimorfismo',
          description: 'Muchas formas de realizar una acción',
          difficulty: 'advanced',
          topic: 'POO',
          content: `**Polimorfismo** significa "muchas formas". Es la capacidad de un método de comportarse de **diferentes maneras** según el objeto que lo llama.

**Analogía Visual: Un Botón de "Reproducir"**
El mismo botón reproduce música en un reproductor de audio y video en uno de cine. La acción cambia según el contexto.

**Ejemplo en JavaScript:**
\`\`\`javascript
class Animal { hacerSonido() { console.log("Sonido..."); } }
class Perro extends Animal { hacerSonido() { console.log("Guau!"); } }
class Gato extends Animal { hacerSonido() { console.log("Miau!"); } }

const animales = [new Perro(), new Gato()];
animales.forEach(a => a.hacerSonido());
\`\`\``
        }
      ];
      await Lesson.insertMany(initialLessons);
      console.log('✅ Lecciones iniciales creadas con éxito');
    }
  } catch (error) {
    console.error('❌ Error al realizar el seed automático:', error);
  }
});

// --- RUTAS DE LA API ---

// Autenticación
app.use('/api/auth', authRoutes)

// Salud
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' })
})

// --- HISTORIAL DE CHAT ---

// Obtener historial de chat del usuario (Protegido)
app.get('/api/chat/history', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const messages = await Message.find({ user: req.userId })
      .sort({ createdAt: 1 })
      .limit(50); // Limitamos a los últimos 50 mensajes por rendimiento
    
    res.json({ history: messages });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el historial de chat' });
  }
});

// Lecciones
app.get('/api/lessons', async (req: Request, res: Response) => {
  try {
    const lessons = await Lesson.find()
    res.json({ lessons })
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las lecciones' })
  }
})

// Chat con IA (Protegido)
app.post('/api/chat', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { message, history } = req.body as ChatRequest

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const systemPrompt: ChatMessage = {
      role: 'system',
      content: `Eres un profesor virtual de Programación Orientada a Objetos (POO) para personas sordas.
Tu estilo de comunicación debe ser:
1. **Visual y Estructurado**: Usa muchos saltos de línea, negritas y listas.
2. **Lenguaje Claro**: Frases cortas y directas. Evita párrafos largos.
3. **Código Limpio**: Cuando pongas código, explica brevemente qué hace cada parte.
4. **Interactivo**: Haz una pregunta a la vez para no abrumar.

REGLAS DE FORMATO:
- Usa siempre Markdown.
- Usa encabezados (###) para separar secciones.
- Los bloques de código deben estar claramente delimitados con \`\`\`javascript.
- Si el usuario se sale del tema de POO, invítalo amablemente a volver a la lección.`,
    }

    const messages: ChatMessage[] = [
      systemPrompt,
      ...(history && Array.isArray(history)
        ? history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
        : []),
      { role: 'user', content: message.trim() },
    ]

    const aiResponse = await getAIResponse(messages)

    // Guardar la interacción en la base de datos de forma asíncrona
    Promise.all([
      Message.create({ user: req.userId, role: 'user', content: message.trim() }),
      Message.create({ user: req.userId, role: 'assistant', content: aiResponse })
    ]).catch(err => console.error('Error al guardar mensajes en DB:', err));

    res.json({ response: aiResponse })
  } catch (error: any) {
    console.error('❌ Chat error:', error.message)
    res.status(500).json({ error: 'Error al procesar tu mensaje.', details: error.message })
  }
})

// Completar lección (Protegido)
app.post('/api/lessons/:id/complete', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const lessonId = req.params.id;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (!user.progress.completedLessons.includes(lessonId as any)) {
      user.progress.completedLessons.push(lessonId as any);
      await user.save();
    }
    res.json({ message: 'Lección marcada como completada', progress: user.progress });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el progreso' });
  }
});

// Progreso del usuario (Protegido)
app.get('/api/user/progress', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).populate('progress.completedLessons');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ progress: user.progress });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el progreso' });
  }
});

// Manejo de rutas no encontradas (DEBE IR AL FINAL)
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`)
})
