import User, { IUser } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Error } from 'mongoose';

class AuthService {
  /**
   * Registra um novo usuário
   */
  public async register(userData: Partial<IUser>): Promise<IUser> {
    const { name, email, password } = userData;

    if (!name || !email || !password) {
      throw new Error('Nome, email e senha são obrigatórios.');
    }

    // 1. Verifica se o email já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email já cadastrado.');
    }

    // 2. Cria o usuário (o hook pre-save no Model irá hashear a senha)
    try {
      const user = await User.create({ name, email, password });
      
      // Remove a senha do objeto de retorno
      (user as any).password = undefined;
      return user;

    } catch (error) {
      // Captura erros de validação do Mongoose (ex: email inválido, senha curta)
      if (error instanceof Error.ValidationError) {
        throw new Error(`Erro de validação: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Autentica um usuário e retorna um token JWT
   */
  public async login(email?: string, password?: string): Promise<string> {
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios.');
    }

    // 1. Encontra o usuário e seleciona a senha (que está oculta por padrão)
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      throw new Error('Credenciais inválidas.'); // Mensagem genérica
    }

    // 2. Compara a senha fornecida com a senha hasheada
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error('Credenciais inválidas.'); // Mensagem genérica
    }

    // 3. Gera o token JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('Chave JWT não configurada no servidor.');
    }

    const token = jwt.sign(
      { id: user._id, email: user.email }, // Payload
      secret,
      { expiresIn: '1h' } // Opções (ex: expira em 1 hora)
    );

    console.log(`[AuthService] Usuário ${email} logado com sucesso.`);
    return token;
  }
}

export default new AuthService();