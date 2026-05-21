import React, { useState } from 'react';

interface GlossaryTerm {
  term: string;
  emoji: string;
  definition: string;
  analogy: string; // Analogía visual para facilitar comprensión
  signImage?: string; // Espacio para la URL de la imagen/GIF de la seña
  category: 'core' | 'advanced' | 'methods'; // Categoría para organizar mejor
}

const terms: GlossaryTerm[] = [
  {
    term: 'Clase',
    emoji: '🏗️',
    definition: 'Es como un molde o plantilla para crear objetos. Define qué características y acciones tendrán.',
    analogy: 'Imagina un molde de galletas. El molde es la clase, y cada galleta es un objeto.',
    signImage: '/assets/signs/clase.gif',
    category: 'core'
  },
  {
    term: 'Objeto',
    emoji: '📦',
    definition: 'Es una cosa real creada a partir de una clase. Por ejemplo, si la clase es "Coche", el objeto es tu coche rojo.',
    analogy: 'Si la clase es el plano de una casa, el objeto es la casa construida.',
    signImage: '/assets/signs/objeto.gif',
    category: 'core'
  },
  {
    term: 'Herencia',
    emoji: '👨‍👩‍👧',
    definition: 'Es cuando una clase hija recibe las características y acciones de una clase padre.',
    analogy: 'Así como heredas el color de ojos de tus padres, una clase hija hereda propiedades de su clase padre.',
    signImage: '/assets/signs/herencia.gif',
    category: 'core'
  },
  {
    term: 'Encapsulamiento',
    emoji: '🔒',
    definition: 'Es proteger la información dentro de un objeto para que no se cambie por error. Como una caja fuerte.',
    analogy: 'Es como guardar dinero en una caja fuerte. Solo tú tienes la llave para acceder.',
    signImage: '/assets/signs/encapsulamiento.gif',
    category: 'core'
  },
  {
    term: 'Polimorfismo',
    emoji: '🎭',
    definition: 'Es cuando una misma acción (como "reproducir") se comporta diferente según quién la haga.',
    analogy: 'Un botón de "reproducir" funciona diferente en un reproductor de música vs. un reproductor de video.',
    signImage: '/assets/signs/polimorfismo.gif',
    category: 'core'
  },
  {
    term: 'Método',
    emoji: '⚙️',
    definition: 'Es una acción que un objeto puede realizar. Por ejemplo: acelerar, frenar, saludar.',
    analogy: 'Son como los botones de un control remoto. Cada botón hace una acción diferente.',
    signImage: '/assets/signs/metodo.gif',
    category: 'methods'
  },
  {
    term: 'Propiedad',
    emoji: '🏷️',
    definition: 'Es una característica de un objeto. Por ejemplo: color, marca, nombre, edad.',
    analogy: 'Son como las etiquetas de un producto. Cada etiqueta describe algo del objeto.',
    signImage: '/assets/signs/propiedad.gif',
    category: 'core'
  },
  {
    term: 'Constructor',
    emoji: '🔨',
    definition: 'Es un método especial que se ejecuta cuando creas un nuevo objeto. Sirve para inicializar sus propiedades.',
    analogy: 'Es como el acta de nacimiento de un objeto. Define sus características iniciales.',
    signImage: 'https://via.placeholder.com/150?text=Seña+Constructor',
    category: 'methods'
  },
  {
    term: 'Instancia',
    emoji: '✨',
    definition: 'Es un objeto específico creado a partir de una clase. Cada instancia es diferente.',
    analogy: 'Si una clase es "Persona", una instancia es "Juan" o "María" con sus características únicas.',
    signImage: 'https://via.placeholder.com/150?text=Seña+Instancia',
    category: 'core'
  },
  {
    term: 'Superclase',
    emoji: '👑',
    definition: 'Es la clase padre de la que otras clases heredan propiedades y métodos.',
    analogy: 'Es como el abuelo de la familia. Todos heredan de él.',
    signImage: 'https://via.placeholder.com/150?text=Seña+Superclase',
    category: 'advanced'
  },
  {
    term: 'Subclase',
    emoji: '👶',
    definition: 'Es una clase que hereda de otra clase (la superclase) y puede tener sus propias características.',
    analogy: 'Es como el nieto que hereda características del abuelo pero también tiene las suyas propias.',
    signImage: 'https://via.placeholder.com/150?text=Seña+Subclase',
    category: 'advanced'
  },
  {
    term: 'Atributo',
    emoji: '📝',
    definition: 'Es lo mismo que una propiedad. Es una característica que almacena información sobre el objeto.',
    analogy: 'Son como los datos personales de una persona: nombre, edad, correo.',
    signImage: 'https://via.placeholder.com/150?text=Seña+Atributo',
    category: 'core'
  }
];

const fallbackIcons: Record<string, string> = {
  'Clase': '🏗️',
  'Objeto': '🚗',
  'Herencia': '👪',
  'Encapsulamiento': '🔒',
  'Polimorfismo': '🎭',
  'Método': '⚙️',
  'Propiedad': '📋'
};

const Glossary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'core' | 'advanced' | 'methods'>('all');

  const filteredTerms = terms.filter(t => {
    const matchesSearch = t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Agrupar términos por categoría
  const groupedTerms = {
    core: filteredTerms.filter(t => t.category === 'core'),
    advanced: filteredTerms.filter(t => t.category === 'advanced'),
    methods: filteredTerms.filter(t => t.category === 'methods')
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-8 rounded-xl shadow-lg text-white">
        <h2 className="text-4xl font-bold mb-2 flex items-center gap-3">
          📖 Glosario de Señas - POO
        </h2>
        <p className="text-purple-100 text-lg">
          Aprende los conceptos clave de la Programación Orientada a Objetos con explicaciones sencillas, emojis visuales y analogías para facilitar la comprensión.
        </p>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-4">
        <div className="relative">
          <input 
            type="text"
            placeholder="Buscar término (ej. Herencia, Constructor)..."
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-purple-100 dark:border-purple-900/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white transition-all text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-4 top-3 text-2xl">🔍</span>
        </div>

        {/* Botones de categoría */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            📚 Todos
          </button>
          <button
            onClick={() => setSelectedCategory('core')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedCategory === 'core'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            🎯 Principales
          </button>
          <button
            onClick={() => setSelectedCategory('advanced')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedCategory === 'advanced'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            🚀 Avanzados
          </button>
          <button
            onClick={() => setSelectedCategory('methods')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedCategory === 'methods'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            ⚙️ Métodos
          </button>
        </div>
      </div>

      {/* Términos organizados por categoría */}
      {filteredTerms.length > 0 ? (
        <div className="space-y-8">
          {/* Conceptos Principales */}
          {groupedTerms.core.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                🎯 Conceptos Principales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groupedTerms.core.map((t, index) => (
                  <TermCard key={index} term={t} />
                ))}
              </div>
            </div>
          )}

          {/* Métodos y Acciones */}
          {groupedTerms.methods.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                ⚙️ Métodos y Acciones
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groupedTerms.methods.map((t, index) => (
                  <TermCard key={index} term={t} />
                ))}
              </div>
            </div>
          )}

          {/* Conceptos Avanzados */}
          {groupedTerms.advanced.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                🚀 Conceptos Avanzados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groupedTerms.advanced.map((t, index) => (
                  <TermCard key={index} term={t} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No se encontraron términos que coincidan con tu búsqueda. 🔍
          </p>
        </div>
      )}
    </div>
  );
};

// Componente para cada tarjeta de término
const TermCard: React.FC<{ term: GlossaryTerm }> = ({ term }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border-l-4 border-purple-500 flex flex-col">
      <div className="p-6 flex-grow">
        {/* Encabezado con emoji */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{term.emoji}</span>
          <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-400">{term.term}</h3>
        </div>

        {/* Definición */}
        <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed font-semibold">
          {term.definition}
        </p>

        {/* Analogía visual */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border-l-4 border-indigo-400">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold text-indigo-700 dark:text-indigo-400">💡 Analogía:</span> {term.analogy}
          </p>
        </div>

        {/* Imagen de seña */}
        {term.signImage && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Representación visual:</p>
            <img 
              src={term.signImage} 
              alt={`Seña para ${term.term}`} 
              className="rounded-lg object-contain h-32 w-full bg-gray-100 dark:bg-gray-900"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/150?text=Seña+${term.term}`;
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Glossary;
