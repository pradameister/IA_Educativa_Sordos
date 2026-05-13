import React from 'react';
import { Lesson } from 'shared';
import ReactMarkdown from 'react-markdown';

interface LessonViewerProps {
  lesson: Lesson;
  onBack: () => void;
  onComplete: (id: string) => void;
  isCompleted: boolean;
}

const LessonViewer: React.FC<LessonViewerProps> = ({ lesson, onBack, onComplete, isCompleted }) => {
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl mx-auto">
      <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
        <div>
          <button 
            onClick={onBack}
            className="text-indigo-200 hover:text-white mb-2 flex items-center gap-1 transition-colors"
          >
            ← Volver a la lista
          </button>
          <h2 className="text-3xl font-bold">{lesson.title}</h2>
        </div>
        <div className="text-right">
          <span className="bg-indigo-500 px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider">
            {lesson.difficulty}
          </span>
        </div>
      </div>

      <div className="p-8 prose prose-indigo max-w-none">
        <div className="mb-8 text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
          {lesson.content || "Esta lección aún no tiene contenido detallado."}
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h4 className="text-xl font-bold text-blue-800 mb-1">¿Has terminado de leer?</h4>
            <p className="text-blue-600">Marca esta lección como completada para seguir avanzando.</p>
          </div>
          <button
            onClick={() => onComplete(lesson.id.toString())}
            disabled={isCompleted}
            className={`px-8 py-3 rounded-lg font-bold text-lg transition-all shadow-md ${
              isCompleted 
                ? 'bg-green-500 text-white cursor-default' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
            }`}
          >
            {isCompleted ? '✅ ¡Lección Completada!' : 'Marcar como Completada'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;
