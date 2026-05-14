import mongoose, { Schema, Document } from 'mongoose';
import { Lesson as ILesson } from '../types';
 
export interface LessonDocument extends Omit<ILesson, 'id'>, Document {}
 
const LessonSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'], 
    default: 'beginner' 
  },
  topic: { type: String, required: true },
  content: { type: String },
  exercise: { type: String }, // Descripción del reto
  expectedCode: { type: String }, // Código de referencia o palabras clave
}, {
  timestamps: true,
  toJSON: {
    transform: (_doc, ret) => {
      (ret as any).id = ret._id.toString();
      delete (ret as any)._id;
      delete (ret as any)["__v"];
    }
  }
});
 
export default mongoose.model<LessonDocument>('Lesson', LessonSchema);
