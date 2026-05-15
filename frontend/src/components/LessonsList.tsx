import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Lesson, LessonsResponse } from 'shared';
import LessonViewer from './LessonViewer';

const LessonsList: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonsRes, progressRes] = await Promise.all([
          axios.get<LessonsResponse>(`${API_URL}/api/lessons`),
          axios.get(`${API_URL}/api/user/progress`).catch(() => ({ data: { progress: { completedLessons: [] } } }))
        ]);
        
        setLessons(lessonsRes.data.lessons);
        const completed = progressRes.data.progress?.completedLessons?.map((l: any) => 
          typeof l === 'string' ? l : l._id || l.id
        ) || [];
        setCompletedIds(completed);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  const handleComplete = async (lessonId: string) => {
    console.log('🎯 Intentando completar lección ID:', lessonId);
    try {
      const response = await axios.post(`${API_URL}/api/lessons/${lessonId}/complete`);
      console.log('✅ Respuesta del servidor:', response.data);
      setCompletedIds(prev => [...prev, lessonId]);
      // Forzar actualización visual
      window.location.reload(); 
    } catch (error: any) {
      console.error('❌ Error detallado al completar:', error.response?.data || error.message);
      alert('Hubo un error al guardar tu progreso. Revisa la consola.');
    }
  };

  if (loading) return <div className="text-center py-10">Cargando lecciones...</div>;

  if (selectedLesson) {
    const lessonId = (selectedLesson as any)._id || (selectedLesson as any).id;
    return (
      <LessonViewer 
        lesson={selectedLesson} 
        onBack={() => setSelectedLesson(null)} 
        onComplete={handleComplete}
        isCompleted={completedIds.includes(lessonId.toString())}
      />
    );
  }

  const progressPercentage = lessons.length > 0 ? Math.round((completedIds.length / lessons.length) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Barra de Progreso General */}
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-gray-800">Tu Progreso General</h3>
          <span className="text-green-600 font-bold">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-green-500 h-4 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Has completado {completedIds.length} de {lessons.length} lecciones. ¡Sigue así!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {lessons.map((lesson: any) => {
          const lessonId = lesson._id || lesson.id;
          const isCompleted = completedIds.includes(lessonId.toString());
          return (
            <div key={lessonId} className={`bg-white p-5 md:p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 border-l-4 ${isCompleted ? 'border-l-green-500' : 'border-l-indigo-500'}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">
                    {lesson.title}
                  </h3>
                  {isCompleted && (
                    <span className="inline-flex items-center text-green-600 text-xs font-bold mt-1">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      COMPLETADA
                    </span>
                  )}
                </div>
                <span className={`shrink-0 ml-2 px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${
                  lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {lesson.difficulty}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-6 line-clamp-2">{lesson.description}</p>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-auto">
                <button 
                  onClick={() => setSelectedLesson(lesson)}
                  className="w-full sm:w-auto bg-indigo-50 text-indigo-600 font-bold px-4 py-2 rounded-lg hover:bg-indigo-600 hover:text-white transition-all text-center"
                >
                  Estudiar →
                </button>
                {!isCompleted && (
                  <button 
                    onClick={() => handleComplete(lessonId.toString())}
                    className="w-full sm:w-auto text-xs font-bold text-gray-400 hover:text-green-600 transition-colors uppercase tracking-widest"
                  >
                    Marcar terminada
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LessonsList;
