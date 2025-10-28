import { Request, Response } from 'express';
import MovieService from '../services/MovieService';

// Interface para estender o Request e incluir o 'user' do middleware
interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

class MovieController {
  
  // POST /api/movies
  public async createMovie(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
      }

      const movie = await MovieService.create(req.body, userId);
      console.log(`[MovieController] Filme criado: ${movie.title} por ${req.user?.email}`);
      return res.status(201).json(movie);

    } catch (error: any) {
      console.error(`[MovieController] Erro ao criar filme: ${error.message}`);
      if (error.message.includes('Erro de validação')) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  // GET /api/movies
  public async getAllMovies(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
      }

      const movies = await MovieService.getAll(userId);
      console.log(`[MovieController] Buscando filmes de ${req.user?.email}`);
      return res.status(200).json(movies);

    } catch (error: any) {
      console.error(`[MovieController] Erro ao buscar filmes: ${error.message}`);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  // GET /api/movies/:id
  public async getMovieById(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
      }

      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'ID do filme é obrigatório.' });
      }
      const movie = await MovieService.getById(id, userId);
      
      console.log(`[MovieController] Buscando filme ${id} de ${req.user?.email}`);
      return res.status(200).json(movie);

    } catch (error: any) {
      console.error(`[MovieController] Erro ao buscar filme por ID: ${error.message}`);
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  // PUT /api/movies/:id
  public async updateMovie(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
      }

      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'ID do filme é obrigatório.' });
      }
      const movie = await MovieService.update(id, req.body, userId);

      console.log(`[MovieController] Filme ${id} atualizado por ${req.user?.email}`);
      return res.status(200).json(movie);

    } catch (error: any) {
      console.error(`[MovieController] Erro ao atualizar filme: ${error.message}`);
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('Erro de validação')) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  // DELETE /api/movies/:id
  public async deleteMovie(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
      }

      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'ID do filme é obrigatório.' });
      }
      await MovieService.delete(id, userId);

      console.log(`[MovieController] Filme ${id} deletado por ${req.user?.email}`);
      return res.status(200).json({ message: 'Filme deletado com sucesso.' });
    
    } catch (error: any) {
      console.error(`[MovieController] Erro ao deletar filme: ${error.message}`);
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
}

export default new MovieController();