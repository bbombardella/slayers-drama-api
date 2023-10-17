import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MovieDto } from './models/movie.dto';
import { TmdbApiService } from '../tmdb-api/tmdb-api.service';
import { lastValueFrom } from 'rxjs';
import { MovieDetails } from '../tmdb-api/models';
import { Movie } from '@prisma/client';
import {
  PaginatedResult,
  PaginateOptions,
  paginator,
} from '../prisma/paginator';

@Injectable()
export class MovieService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tmdbApiService: TmdbApiService,
  ) {}

  private get moviePaginator(): typeof paginator<
    Movie,
    Parameters<typeof this.prismaService.movie.findMany>[0]
  > {
    return paginator<
      Movie,
      Parameters<typeof this.prismaService.movie.findMany>[0]
    >;
  }

  async findAll(pageable?: PaginateOptions): Promise<PaginatedResult<Movie>> {
    return this.moviePaginator(this.prismaService.movie, undefined, pageable);
  }

  async findOne(id: number): Promise<Movie> {
    return this.prismaService.movie.findUnique({
      where: { id },
      include: {
        genres: true,
      },
    });
  }

  async findOneTmdb(id: number): Promise<MovieDetails> {
    const movieTmdb = (await lastValueFrom(this.tmdbApiService.getMovie(id)))
      ?.data;

    if (!movieTmdb) {
      throw new NotFoundException(
        "The movie hasn't been found in The Movie Database API",
      );
    }

    return movieTmdb;
  }

  async create(id: number): Promise<Movie> {
    const movieTmdb = await this.findOneTmdb(id);

    return this.prismaService.movie.create({
      data: {
        title: movieTmdb.title,
        release_date: new Date(movieTmdb.release_date),
        overview: movieTmdb.overview,
        popularity: movieTmdb.popularity,
        vote_average: movieTmdb.vote_average,
        budget: movieTmdb.budget,
        poster_path: movieTmdb.poster_path,
        tagline: movieTmdb.tagline,
        tmdb_id: movieTmdb.id,
        updatedAt: new Date(),
        genres: {
          connectOrCreate: movieTmdb.genres.map((g) => ({
            where: {
              tmdb_id: g.id,
            },
            create: {
              title: g.name,
              tmdb_id: g.id,
              updatedAt: new Date(),
            },
          })),
        },
      },
    });
  }

  async update(id: number, dto: MovieDto): Promise<Movie> {
    return this.prismaService.movie.update({
      where: { id },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: number): Promise<Movie> {
    return this.prismaService.movie.delete({
      where: { id },
    });
  }

  async search(query: string): Promise<PaginatedResult<Movie>> {
    return this.moviePaginator(this.prismaService.movie, {
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            overview: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            tagline: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }

  async attachGenre(movieId: number, ids: number[]): Promise<Movie> {
    return this.prismaService.movie.update({
      where: { id: movieId },
      data: {
        genres: {
          connect: ids.map((i) => ({ id: i })),
        },
      },
      include: { genres: true },
    });
  }

  async detachGenre(movieId: number, ids: number[]): Promise<Movie> {
    return this.prismaService.movie.update({
      where: { id: movieId },
      data: {
        genres: {
          disconnect: ids.map((i) => ({ id: i })),
        },
      },
      include: { genres: true },
    });
  }
}
