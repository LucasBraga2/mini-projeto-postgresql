import db from '../models'; // Importa o db (que contém User)
import { UniqueConstraintError } from 'sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Interface para os dados do usuário (opcional, mas boa prática)
interface UserData {
  name?: string;
  email?: string;
  password?: string;
}

class AuthService {
  
  public async register(userData: UserData): Promise<any> {
    const { name, email, password } = userData;

    if (!name || !email || !password) {
      throw new Error('Nome, email e senha são obrigatórios.');
    }

    try {
      const user = await db.User.create({
        name,
        email,
        password,
      });

      const userJson = user.toJSON();
      delete userJson.password;
      
      console.log(`[AuthService] Usuário ${email} registrado.`);
      return userJson;

    } catch (error: any) {
      if (error instanceof UniqueConstraintError) {
        throw new Error('Email já cadastrado.');
      }
      throw error;
    }
  }

  public async login(email?: string, password?: string): Promise<string> {
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios.');
    }

    const user = await db.User.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new Error('Credenciais inválidas.');
    }

    const isPasswordMatch = await user.isValidPassword(password);
    if (!isPasswordMatch) {
      throw new Error('Credenciais inválidas.');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('Chave JWT não configurada no servidor.');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      secret,
      { expiresIn: '1h' }
    );

    console.log(`[AuthService] Usuário ${email} logado com sucesso.`);
    return token;
  }
}

export default new AuthService();