import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  username: string;
  email: string;
  password?: string;
  progress: {
    completedLessons: mongoose.Types.ObjectId[];
    currentLevel: string;
  };
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Opcional si se usa OAuth después
  progress: {
    completedLessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    currentLevel: { type: String, default: 'beginner' }
  }
}, {
  timestamps: true
});

export default mongoose.model<UserDocument>('User', UserSchema);
