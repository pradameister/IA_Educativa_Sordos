import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Lesson {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  topic: string;
}

const LessonsList: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/lessons');
        setLessons(response.data.lessons);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  if (loading) return <div className="text-center py-10">Cargando lecciones...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {lessons.map((lesson) => (
        <div key={lesson.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-indigo-500">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-800">{lesson.title}</h3>
            <span className={`px-2 py-1 text-xs rounded ${
              lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {lesson.difficulty}
            </span>
          </div>
          <p className="text-gray-600 mb-4">{lesson.description}</p>
          <button className="text-indigo-600 font-semibold hover:text-indigo-800">
            Comenzar lección →
          </button>
        </div>
      ))}
    </div>
  );
};

export default LessonsList;
