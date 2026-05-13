import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface UserDocument extends Document {
  username: string;
  email: string;
  password?: string;
  progress: {
    completedLessons: mongoose.Types.ObjectId[];
    currentLevel: string;
  };
  comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  progress: {
    completedLessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    currentLevel: { type: String, default: 'beginner' }
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre<UserDocument>('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password!);
};

export default mongoose.model<UserDocument>('User', UserSchema);
