import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  user: mongoose.Types.ObjectId;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Índice para buscar mensajes por usuario rápidamente y ordenados por fecha
MessageSchema.index({ user: 1, createdAt: 1 });

export default mongoose.model<IMessage>('Message', MessageSchema);
