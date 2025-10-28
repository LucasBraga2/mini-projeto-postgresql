import 'dotenv/config'; 
import express, { Application, Request, Response, NextFunction } from 'express';
import prisma from './database/prisma';
import authRoutes from './routes/authRoutes';
import movieRoutes from './routes/movieRoutes'; 

const app: Application = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

prisma.$connect()
  .then(() => {
    console.log('PostgreSQL conectado com sucesso.');
  })
  .catch((error) => {
    console.error('Erro ao conectar ao PostgreSQL:', error);
    process.exit(1);
  });

// --- Rotas ---
app.use('/api', authRoutes);

// Prefixa todas as rotas de filmes com /api
app.use('/api', movieRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'API está online!' });
});


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV}`);
}); 