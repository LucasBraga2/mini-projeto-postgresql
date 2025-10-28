import { Router } from 'express';
import MovieController from '../controllers/MovieController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// === APLICA O MIDDLEWARE DE AUTENTICAÇÃO EM TODAS AS ROTAS ABAIXO ===
// Nenhuma rota deste arquivo pode ser acessada sem um token JWT válido.
router.use(authMiddleware);

// --- Rotas do CRUD de Filmes ---

// Criar um novo filme
// POST /api/movies
router.post('/movies', MovieController.createMovie);

// Listar todos os filmes (do usuário logado)
// GET /api/movies
router.get('/movies', MovieController.getAllMovies);

// Ver detalhes de um filme (do usuário logado)
// GET /api/movies/:id
router.get('/movies/:id', MovieController.getMovieById);

// Atualizar um filme (do usuário logado)
// PUT /api/movies/:id
router.put('/movies/:id', MovieController.updateMovie);

// Deletar um filme (do usuário logado)
// DELETE /api/movies/:id
router.delete('/movies/:id', MovieController.deleteMovie);

export default router;