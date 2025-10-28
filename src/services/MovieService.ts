import prisma from '../database/prisma';
import { Movie } from '@prisma/client'; 

class MovieService {
  
  public async create(movieData: Partial<Movie>, userId: string): Promise<Movie> {
    const { title, director, genre, releaseYear } = movieData;
    
    if (!title) {
      throw new Error('Erro de validação: O título é obrigatório.');
    }

    const movie = await prisma.movie.create({
      data: {
        title,
        director: director ?? null,
        genre: genre ?? null,
        releaseYear: releaseYear ?? null,
        userId: userId, // Conecta ao usuário
      },
    });
    return movie;
  }

  public async getAll(userId: string): Promise<Movie[]> {
    const movies = await prisma.movie.findMany({
      where: { userId: userId },
    });
    return movies;
  }

  public async getById(movieId: string, userId: string): Promise<Movie> {
    const movie = await prisma.movie.findFirst({
      where: {
        id: movieId,
        userId: userId, // Garante que o filme é do usuário
      },
    });

    if (!movie) {
      throw new Error('Filme não encontrado ou não pertence ao usuário.');
    }
    return movie;
  }

  public async update(
    movieId: string,
    movieData: Partial<Movie>,
    userId: string
  ): Promise<Movie> {
    try {
      // O Prisma não nos deixa atualizar se a condição 'where' falhar
      // (incluindo o userId), o que garante a segurança.
      const updatedMovie = await prisma.movie.updateMany({
        where: {
          id: movieId,
          userId: userId,
        },
        data: movieData,
      });

      if (updatedMovie.count === 0) {
        throw new Error('Filme não encontrado ou não pertence ao usuário.');
      }
      
      // Como updateMany não retorna o objeto, buscamos ele novamente
      return this.getById(movieId, userId);

    } catch (error: any) {
      // Captura erro caso o ID não seja encontrado (pelo getById)
      if (error.message.includes('não encontrado')) {
        throw error;
      }
      throw new Error('Erro ao atualizar filme.');
    }
  }

  public async delete(movieId: string, userId: string): Promise<void> {
    // O deleteMany garante que só deletamos se o ID e o UserID baterem
    const deleteResult = await prisma.movie.deleteMany({
      where: {
        id: movieId,
        userId: userId,
      },
    });

    if (deleteResult.count === 0) {
      throw new Error('Filme não encontrado ou não pertence ao usuário.');
    }
  }
}

export default new MovieService();