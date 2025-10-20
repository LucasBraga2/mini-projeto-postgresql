import mongoose, { Schema, model, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; 
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'O nome é obrigatório.'],
    },
    email: {
      type: String,
      required: [true, 'O email é obrigatório.'],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Formato de email inválido.'],
    },
    password: {
      type: String,
      required: [true, 'A senha é obrigatória.'],
      select: false, 
      minlength: [6, 'A senha deve ter no mínimo 6 caracteres.'],
    },
  },
  {
    timestamps: true, 
  }
);

userSchema.pre<IUser>('save', async function (next) {
  
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

const User = model<IUser>('User', userSchema);

export default User;