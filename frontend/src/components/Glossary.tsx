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
    signImage: '🏗️'
  },
  {
    term: 'Objeto',
    definition: 'Es una cosa real creada a partir de una clase. Por ejemplo, si la clase es "Coche", el objeto es tu coche rojo.',
    signImage: '🚗'
  },
  {
    term: 'Herencia',
    definition: 'Es cuando una clase hija recibe las características y acciones de una clase padre.',
    signImage: '👪'
  },
  {
    term: 'Encapsulamiento',
    definition: 'Es proteger la información dentro de un objeto para que no se cambie por error. Como una caja fuerte.',
    signImage: '🔒'
  },
  {
    term: 'Polimorfismo',
    definition: 'Es cuando una misma acción (como "reproducir") se comporta diferente según quién la haga.',
    signImage: '🎭'
  },
  {
    term: 'Método',
    definition: 'Es una acción que un objeto puede realizar. Por ejemplo: acelerar, frenar, saludar.',
    signImage: '⚙️'
  },
  {
    term: 'Propiedad',
    definition: 'Es una característica de un objeto. Por ejemplo: color, marca, nombre, edad.',
    signImage: '📋'
  }
];

const Glossary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTerms = terms.filter(t => 
    t.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-purple-500">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          📖 Glosario de Señas POO
        </h2>
        <p className="text-gray-600 mb-6">
          Aprende los conceptos clave de la Programación Orientada a Objetos con explicaciones sencillas y apoyo visual en Lengua de Señas.
        </p>
        
        <div className="relative">
          <input 
            type="text"
            placeholder="Buscar término (ej. Herencia)..."
            className="w-full px-4 py-3 border-2 border-purple-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTerms.map((t, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden flex hover:shadow-xl transition-shadow border border-purple-50">
            <div className="w-1/3 bg-purple-100 flex items-center justify-center p-4 text-5xl">
              {t.signImage?.startsWith('http') ? (
                <img 
                  src={t.signImage} 
                  alt={`Seña para ${t.term}`} 
                  className="rounded-lg object-cover h-32 w-full"
                />
              ) : (
                <span>{t.signImage}</span>
              )}
            </div>
            <div className="w-2/3 p-4">
              <h3 className="text-xl font-bold text-purple-700 mb-2">{t.term}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t.definition}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No se encontraron términos que coincidan con tu búsqueda.
        </div>
      )}
    </div>
  );
};

export default Glossary;
