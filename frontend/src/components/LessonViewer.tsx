import React from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

interface LessonViewerProps {
  lesson: any; // Usamos any temporalmente para acceder a campos nuevos como exercise
  onBack: () => void;
  onComplete: (id: string) => void;
  isCompleted: boolean;
}

const LessonViewer: React.FC<LessonViewerProps> = ({ lesson, onBack, onComplete, isCompleted }) => {
  const [userCode, setUserCode] = React.useState('');
  const [feedback, setFeedback] = React.useState<{ message: string; success: boolean } | null>(null);
  const [isEvaluating, setIsEvaluating] = React.useState(false);

  const handleEvaluate = async () => {
    if (!userCode.trim()) return;
    setIsEvaluating(true);
    setFeedback(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${API_URL}/api/chat`, {
        message: `Actúa como un profesor de programación para personas sordas. Evalúa el siguiente ejercicio de la lección "${lesson.title}". 
        Reto: ${lesson.exercise}
        Código/Respuesta del alumno: ${userCode}
        
        Responde de forma muy visual, sencilla y motivadora. Si es correcto, di "¡Excelente trabajo!". Si hay errores, explica cómo corregirlos usando analogías sencillas.`
      });

      const aiResponse = response.data.response;
      const isSuccess = aiResponse.toLowerCase().includes('excelente') || aiResponse.toLowerCase().includes('correcto') || aiResponse.toLowerCase().includes('bien');
      
      setFeedback({
        message: aiResponse,
        success: isSuccess
      });
    } catch (error) {
      setFeedback({ message: 'Error al conectar con el profesor IA. Inténtalo de nuevo.', success: false });
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl mx-auto mb-10">
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
        <div className="mb-12 text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
          {lesson.content || "Esta lección aún no tiene contenido detallado."}
        </div>

        {/* Sección de Ejercicio */}
        {lesson.exercise && (
          <div className="mt-12 p-8 bg-purple-50 rounded-2xl border-2 border-purple-100 shadow-inner">
            <h3 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              🧠 Reto de Práctica
            </h3>
            <p className="text-purple-700 mb-6 text-lg font-medium italic">
              "{lesson.exercise}"
            </p>
            
            <textarea
              className="w-full h-40 p-4 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-0 font-mono text-gray-800 mb-4 shadow-sm"
              placeholder="Escribe tu código o respuesta aquí..."
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
            />

            <div className="flex justify-end mb-6">
              <button
                onClick={handleEvaluate}
                disabled={isEvaluating || !userCode.trim()}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 transition-all disabled:bg-purple-300 flex items-center gap-2"
              >
                {isEvaluating ? 'Evaluando...' : '🚀 Enviar al Profesor IA'}
              </button>
            </div>

            {feedback && (
              <div className={`p-6 rounded-xl border-l-8 shadow-md animate-fade-in ${
                feedback.success ? 'bg-green-50 border-green-500 text-green-800' : 'bg-orange-50 border-orange-500 text-orange-800'
              }`}>
                <h4 className="font-bold text-xl mb-2">{feedback.success ? '¡Muy bien! 🎉' : 'Sigue intentándolo 💪'}</h4>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{feedback.message}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h4 className="text-xl font-bold text-blue-800 mb-1">¿Has terminado la lección?</h4>
            <p className="text-blue-600">Márcala como completada para registrar tu progreso.</p>
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
