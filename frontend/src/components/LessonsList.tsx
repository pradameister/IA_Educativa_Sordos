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
    try {
      await axios.post(`${API_URL}/api/lessons/${lessonId}/complete`);
      setCompletedIds(prev => [...prev, lessonId]);
    } catch (error) {
      console.error('Error completing lesson:', error);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lessons.map((lesson: any) => {
          const lessonId = lesson._id || lesson.id;
          const isCompleted = completedIds.includes(lessonId.toString());
          return (
            <div key={lessonId} className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 ${isCompleted ? 'border-green-500' : 'border-indigo-500'}`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  {lesson.title}
                  {isCompleted && <span className="text-green-500 text-sm">✅ Completada</span>}
                </h3>
                <span className={`px-2 py-1 text-xs rounded ${
                  lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {lesson.difficulty}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{lesson.description}</p>
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setSelectedLesson(lesson)}
                  className="text-indigo-600 font-semibold hover:text-indigo-800"
                >
                  Comenzar lección →
                </button>
                {!isCompleted && (
                  <button 
                    onClick={() => handleComplete(lessonId.toString())}
                    className="text-xs bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-700 px-3 py-1 rounded transition-colors"
                  >
                    Marcar como completada
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
