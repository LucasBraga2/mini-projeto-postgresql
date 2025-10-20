import 'dotenv/config'; 
import express, { Application, Request, Response, NextFunction } from 'express';
import connectDB from './database/config';
import authRoutes from './routes/authRoutes';

const app: Application = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

connectDB();


// --- Rotas ---
app.use('/api', authRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'API está online!' });
});


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV}`);
}); 