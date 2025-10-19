import 'dotenv/config'; // -> IMPORTANTE: Carrega o .env logo no início
import express, { Application, Request, Response, NextFunction } from 'express';
import connectDB from './database/config';
import authRoutes from './routes/authRoutes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares Essenciais ---

// 1. Para o Express entender JSON no body das requisições
app.use(express.json());

// 2. Middleware de Log simples (requisito "Faça logs apropriados")
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// --- Conexão com o Banco de Dados ---
connectDB();


// --- Rotas ---
// Prefixa todas as rotas de autenticação com /api
app.use('/api', authRoutes);

// Rota "Health Check"
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'API está online!' });
});


// --- Inicialização do Servidor ---
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV}`);
}); 