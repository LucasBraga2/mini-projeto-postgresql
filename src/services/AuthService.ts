import prisma from '../database/prisma';
import { User } from '@prisma/client'; 
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client'; 

class AuthService {
  
  // Remove a senha do objeto de usuário para retorno seguro
  private omitPassword(user: User): Omit<User, 'password'> {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  public async register(userData: Partial<User>): Promise<Omit<User, 'password'>> {
    const { name, email, password } = userData;

    if (!name || !email || !password) {
      throw new Error('Nome, email e senha são obrigatórios.');
    }

    // 1. Hashear a senha (Lógica que estava no Mongoose Model)
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // 2. Criar usuário com Prisma
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      console.log(`[AuthService] Usuário ${email} registrado.`);
      return this.omitPassword(user);

    } catch (error) {
      // 3. Tratar erro de email duplicado
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new Error('Email já cadastrado.');
      }
      throw error;
    }
  }

  public async login(email?: string, password?: string): Promise<string> {
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios.');
    }

    // 1. Encontra o usuário (o Prisma agora retorna a senha por padrão)
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new Error('Credenciais inválidas.');
    }

    // 2. Compara a senha (lógica igual)
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error('Credenciais inválidas.');
    }

    // 3. Gera o token (lógica igual)
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('Chave JWT não configurada no servidor.');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email }, // Usamos o 'id' (String) do Prisma
      secret,
      { expiresIn: '1h' }
    );

    console.log(`[AuthService] Usuário ${email} logado com sucesso.`);
    return token;
  }
}

export default new AuthService();