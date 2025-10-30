import db from '../models'; // Importa o db (que contém Movie)
import Movie from '../models/Movie'; // Importa a interface/tipo

// Interface para os dados do filme
interface MovieData {
  title?: string;
  director?: string;
  genre?: string;
  releaseYear?: number;
}

class MovieService {
  
  public async create(movieData: MovieData, userId: string): Promise<any> {
    if (!movieData.title) {
      throw new Error('Erro de validação: O título é obrigatório.');
    }
    
    const movie = await db.Movie.create({
      ...movieData,
      userId: userId, 
    });
    return movie.toJSON();
  }

  public async getAll(userId: string): Promise<any[]> {
    const movies = await db.Movie.findAll({
      where: { userId: userId },
    });
    return movies;
  }

  public async getById(movieId: string, userId: string): Promise<any> {
    const movie = await db.Movie.findOne({
      where: {
        id: movieId,
        userId: userId, 
      },
    });

    if (!movie) {
      throw new Error('Filme não encontrado ou não pertence ao usuário.');
    }
    return movie.toJSON();
  }

  public async update(
    movieId: string,
    movieData: MovieData,
    userId: string
  ): Promise<any> {
    const movie = await db.Movie.findOne({
      where: {
        id: movieId,
        userId: userId,
      },
    });

    if (!movie) {
      throw new Error('Filme não encontrado ou não pertence ao usuário.');
    }
    
    await movie.update(movieData);
    return movie.toJSON();
  }

  public async delete(movieId: string, userId: string): Promise<void> {
    const movie = await db.Movie.findOne({
      where: {
        id: movieId,
        userId: userId,
      },
    });

    if (!movie) {
      throw new Error('Filme não encontrado ou não pertence ao usuário.');
    }

    await movie.destroy();
  }
}

export default new MovieService();