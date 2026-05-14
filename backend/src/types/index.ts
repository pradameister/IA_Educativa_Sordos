// Tipos para el Chat
export type Role = 'system' | 'user' | 'assistant';
 
export interface ChatMessage {
  role: Role;
  content: string;
}
 
export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}
 
export interface ChatResponse {
  response: string;
  error?: string;
}
 
// Tipos para Lecciones
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
 
export interface Lesson {
  id: number;
  title: string;
  description: string;
  difficulty: Difficulty;
  topic: string;
  content?: string;
  exercise?: string;
  expectedCode?: string;
}
 
export interface LessonsResponse {
  lessons: Lesson[];
}
 
// Tipos para Usuario
export interface User {
  id: string;
  username: string;
  email: string;
  progress: {
    completedLessons: number[];
    currentLevel: string;
  };
}
