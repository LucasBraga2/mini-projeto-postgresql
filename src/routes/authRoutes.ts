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
router.get(
  '/protected', 
  authMiddleware, 
  AuthController.getProtectedData 
);


export default router;