import 'dotenv/config'; 
import express, { Application, Request, Response, NextFunction } from 'express';
import db from './models';
import authRoutes from './routes/authRoutes';
import movieRoutes from './routes/movieRoutes'; 
import cors from 'cors'; 


const app: Application = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

const allowedFrontends = [
  'http://localhost:5173',                        // Local
  'https://cinelistpostgresql.lucasmineiro.app' //frontend de produção (Postgres)
];

app.use(cors({
 origin: allowedFrontends
}));

// --- Rotas ---
app.use('/api', authRoutes);

// Prefixa todas as rotas de filmes com /api
app.use('/api', movieRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'API está online!' });
});

const startServer = async () => {
  try {
    if (!db.sequelize) {
      throw new Error('Database connection not initialized');
    }
    
    await db.sequelize.authenticate();
    console.log('PostgreSQL conectado com sucesso.');

    if (process.env.NODE_ENV === 'development') {
      await db.sequelize.sync({ alter: true }); 
      console.log('Modelos sincronizados com o banco de dados (modo dev).');
    }

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