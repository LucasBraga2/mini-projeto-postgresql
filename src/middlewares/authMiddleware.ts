import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Estendendo a interface Request para incluir a propriedade 'user'
// (Alternativa ao 'req as any')
interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

export const authMiddleware = (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  
  // O header vem como "Bearer TOKEN"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.warn('[AuthMiddleware] Acesso negado. Token não fornecido.');
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('[AuthMiddleware] Chave JWT não configurada.');
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }

  try {
    // Verifica e decodifica o token
    const decodedPayload = jwt.verify(token, secret) as { id: string; email: string };
    
    // Adiciona o payload do usuário ao objeto 'req'
    req.user = decodedPayload;
    
    console.log(`[AuthMiddleware] Token válido para ${req.user.email}.`);
    next(); // Passa para o próximo handler (o controller)

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.warn(`[AuthMiddleware] Token inválido: ${errorMessage}`);
    return res.status(403).json({ error: 'Token inválido ou expirado.' }); // 403 Forbidden
  }
};