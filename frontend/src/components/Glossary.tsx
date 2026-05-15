import React, { useState } from 'react';

interface GlossaryTerm {
  term: string;
  definition: string;
  signImage?: string; // Espacio para la URL de la imagen/GIF de la seña
}

const terms: GlossaryTerm[] = [
  {
    term: 'Clase',
    definition: 'Es como un molde o plantilla para crear objetos. Define qué características y acciones tendrán.',
    signImage: '/assets/signs/clase.gif' // Intentará cargar el GIF, si no existe mostrará el icono por defecto
  },
  {
    term: 'Objeto',
    definition: 'Es una cosa real creada a partir de una clase. Por ejemplo, si la clase es "Coche", el objeto es tu coche rojo.',
    signImage: '/assets/signs/objeto.gif'
  },
  {
    term: 'Herencia',
    definition: 'Es cuando una clase hija recibe las características y acciones de una clase padre.',
    signImage: '/assets/signs/herencia.gif'
  },
  {
    term: 'Encapsulamiento',
    definition: 'Es proteger la información dentro de un objeto para que no se cambie por error. Como una caja fuerte.',
    signImage: '/assets/signs/encapsulamiento.gif'
  },
  {
    term: 'Polimorfismo',
    definition: 'Es cuando una misma acción (como "reproducir") se comporta diferente según quién la haga.',
    signImage: '/assets/signs/polimorfismo.gif'
  },
  {
    term: 'Método',
    definition: 'Es una acción que un objeto puede realizar. Por ejemplo: acelerar, frenar, saludar.',
    signImage: '/assets/signs/metodo.gif'
  },
  {
    term: 'Propiedad',
    definition: 'Es una característica de un objeto. Por ejemplo: color, marca, nombre, edad.',
    signImage: '/assets/signs/propiedad.gif'
  }
];

// Mapeo de iconos de respaldo si no hay imagen
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

  const filteredTerms = terms.filter(t => 
    t.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border-t-4 border-purple-500">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          📖 Glosario de Señas POO
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Aprende los conceptos clave de la Programación Orientada a Objetos con explicaciones sencillas y apoyo visual en Lengua de Señas.
        </p>
        
        <div className="relative">
          <input 
            type="text"
            placeholder="Buscar término (ej. Herencia)..."
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-purple-100 dark:border-purple-900/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTerms.map((t, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden flex hover:shadow-xl transition-all border border-purple-50 dark:border-gray-700 group">
            <div className="w-1/3 bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center p-2 text-5xl group-hover:scale-110 transition-transform min-h-[120px]">
              <img 
                src={t.signImage} 
                alt={`Seña para ${t.term}`} 
                className="rounded-lg object-contain h-full w-full"
                onError={(e) => {
                  // Si la imagen falla, ponemos el emoji de respaldo
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const span = document.createElement('span');
                    span.innerText = fallbackIcons[t.term] || '📖';
                    parent.appendChild(span);
                  }
                }}
              />
            </div>
            <div className="w-2/3 p-4">
              <h3 className="text-xl font-bold text-purple-700 dark:text-purple-400 mb-2">{t.term}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {t.definition}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No se encontraron términos que coincidan con tu búsqueda.
        </div>
      )}
    </div>
  );
};

export default Glossary;
