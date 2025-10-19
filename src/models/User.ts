import mongoose, { Schema, model, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

// Interface para o documento do usuário (para tipagem)
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // O '?' indica que pode não estar presente (ex: ao buscar)
}

// Interface para o Modelo (para métodos estáticos, se houver)
interface IUserModel extends Model<IUser> {
  // Você pode adicionar métodos estáticos aqui se precisar
}

const userSchema = new Schema<IUser, IUserModel>(
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
      // Validação simples de email
      match: [/\S+@\S+\.\S+/, 'Formato de email inválido.'],
    },
    password: {
      type: String,
      required: [true, 'A senha é obrigatória.'],
      select: false, // -> Requisito: "não selecionável"
      minlength: [6, 'A senha deve ter no mínimo 6 caracteres.'],
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt
  }
);

// Middleware (pre-save hook) para hashear a senha antes de salvar
userSchema.pre<IUser>('save', async function (next) {
  // 'this' se refere ao documento do usuário que está sendo salvo
  
  // Só hasheia a senha se ela foi modificada (ou é nova)
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    // Gera o salt e hasheia a senha
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

const User = model<IUser, IUserModel>('User', userSchema);

export default User;