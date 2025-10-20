import User, { IUser } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Error } from 'mongoose';

class AuthService {

  public async register(userData: Partial<IUser>): Promise<IUser> {
    const { name, email, password } = userData;

    if (!name || !email || !password) {
      throw new Error('Nome, email e senha são obrigatórios.');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email já cadastrado.');
    }

    try {
      const user = await User.create({ name, email, password });
      
      delete user.password;
      return user;

    } catch (error) {
      if (error instanceof Error.ValidationError) {
        throw new Error(`Erro de validação: ${error.message}`);
      }
      throw error;
    }
  }

  public async login(email?: string, password?: string): Promise<string> {
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios.');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      throw new Error('Credenciais inválidas.'); 
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error('Credenciais inválidas.'); 
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('Chave JWT não configurada no servidor.');
    }

    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      secret,
      { expiresIn: '1h' } 
    );

    console.log(`[AuthService] Usuário ${email} logado com sucesso.`);
    return token;
  }
}

export default new AuthService();