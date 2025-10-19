import { Request, Response } from 'express';
import AuthService from '../services/AuthService';

class AuthController {
  
  /**
   * POST /register
   */
  public async register(req: Request, res: Response): Promise<Response> {
    try {
      const user = await AuthService.register(req.body);
      console.log(`[AuthController] Usuário ${user.email} registrado.`);
      return res.status(201).json({ message: 'Usuário criado com sucesso!', user });
    
    } catch (error: any) {
      console.error(`[AuthController] Erro no registro: ${error.message}`);
      
      // Trata erros específicos do serviço
      if (error.message === 'Email já cadastrado.') {
        return res.status(409).json({ error: error.message }); // 409 Conflict
      }
      if (error.message.includes('Erro de validação') || 
          error.message === 'Nome, email e senha são obrigatórios.') {
        return res.status(400).json({ error: error.message }); // 400 Bad Request
      }
      
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  /**
   * POST /login
   */
  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const token = await AuthService.login(email, password);
      
      return res.status(200).json({ message: 'Login bem-sucedido!', token });

    } catch (error: any) {
      console.error(`[AuthController] Erro no login: ${error.message}`);
      
      // Trata erros específicos do serviço
      if (error.message === 'Credenciais inválidas.' ||
          error.message === 'Email e senha são obrigatórios.') {
        return res.status(401).json({ error: error.message }); // 401 Unauthorized
      }
      
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  /**
   * GET /protected
   * A lógica de proteção está no middleware, aqui só respondemos.
   */
  public async getProtectedData(req: Request, res: Response): Promise<Response> {
    // Os dados do usuário vêm do middleware (veremos a seguir)
    // Usamos (req as any) por simplicidade, mas o ideal é estender a interface Request
    const userEmail = (req as any).user?.email || 'usuário desconhecido';

    console.log(`[AuthController] Acesso à rota protegida por ${userEmail}.`);
    
    return res.status(200).json({ 
      message: 'Acesso autorizado!',
      data: `Este é um dado protegido. Olá, ${userEmail}!`
    });
  }
}

export default new AuthController();