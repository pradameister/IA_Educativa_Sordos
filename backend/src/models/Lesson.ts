import mongoose, { Schema, Document } from 'mongoose';
import { Lesson as ILesson } from 'shared';

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
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

export default mongoose.model<LessonDocument>('Lesson', LessonSchema);
