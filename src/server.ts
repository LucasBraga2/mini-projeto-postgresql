import 'dotenv/config'; 
import express, { Application, Request, Response, NextFunction } from 'express';
import db from './models';
import authRoutes from './routes/authRoutes';
import movieRoutes from './routes/movieRoutes'; 

const app: Application = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// --- Rotas ---
app.use('/api', authRoutes);

// Prefixa todas as rotas de filmes com /api
app.use('/api', movieRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'API está online!' });
});

const startServer = async () => {
  try {
    // 1. Testa a conexão com o banco
    if (!db.sequelize) {
      throw new Error('Database connection not initialized');
    }
    await db.sequelize.authenticate();
    console.log('PostgreSQL conectado com sucesso.');

    // 2. Sincroniza os modelos com o banco de dados
    // Isso cria as tabelas (users, movies) se elas não existirem
    // 'alter: true' tenta alterar as tabelas para bater com os modelos (bom para dev)
    await db.sequelize.sync({ alter: true }); 
    console.log('Modelos sincronizados com o banco de dados.');

    // 3. Inicia o servidor Express APÓS a conexão
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
      console.log(`Ambiente: ${process.env.NODE_ENV}`);
    });

  } catch (error: any) {
    console.error('Erro ao conectar ou sincronizar o banco de dados:', error);
    process.exit(1);
  }
};

startServer();