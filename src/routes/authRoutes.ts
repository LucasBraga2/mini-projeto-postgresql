import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/authMiddleware'; // Importa o middleware

const router = Router();

// === Rotas Públicas ===
// POST /api/register
router.post('/register', AuthController.register);

// POST /api/login
router.post('/login', AuthController.login);


// === Rotas Protegidas ===
// GET /api/protected
// O authMiddleware é executado antes do AuthController.getProtectedData
router.get(
  '/protected', 
  authMiddleware, // 1º: Verifica o token
  AuthController.getProtectedData // 2º: Se o token for válido, executa o controller
);


export default router;