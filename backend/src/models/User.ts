// backend/src/models/User.ts
import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: { 
    type: String, 
    required: [true, 'نام الزامی است'] 
  },
  email: { 
    type: String, 
    required: [true, 'ایمیل الزامی است'],
    unique: true,
    lowercase: true,
  },
  password: { 
    type: String, 
    required: [true, 'رمز عبور الزامی است'],
    minlength: [6, 'رمز عبور باید حداقل 6 کاراکتر باشد'] 
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'],
    default: 'user' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const User = model<IUser>('User', userSchema);