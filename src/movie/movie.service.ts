import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TmdbApiService } from '../tmdb-api/tmdb-api.service';
import { lastValueFrom } from 'rxjs';
import { MovieDetails } from '../tmdb-api/models';
import { Movie, Prisma } from '@prisma/client';
import {
  PaginatedResult,
  PaginateOptions,
  paginator,
} from '../prisma/paginator';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ImageService } from '../image/image.service';
import { MovieEntity } from './entities/movie.entity';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ScreeningService } from '../screening/screening.service';

@Injectable()
export class MovieService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tmdbApiService: TmdbApiService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly imageService: ImageService,
    private readonly screeningService: ScreeningService,
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

  async findAll(
    pageable?: PaginateOptions,
    onlyPublished: boolean = true,
  ): Promise<PaginatedResult<Movie>> {
    return this.moviePaginator(
      this.prismaService.movie,
      {
        where: this.getOnlyPublishedWhereClause(onlyPublished),
        include: {
          poster: true,
          screenings: {
            where: {
              active: true,
            },
          },
        },
      },
      pageable,
    );
  }

  async findAllPlanned(
    pageable?: PaginateOptions,
    onlyPublished: boolean = true,
  ): Promise<PaginatedResult<MovieEntity>> {
    const result = await this.moviePaginator(
      this.prismaService.movie,
      {
        where: {
          AND: [
            this.getOnlyPublishedWhereClause(onlyPublished),
            {
              screenings: {
                some: {
                  start: {
                    gt: new Date(),
                  },
                  active: true,
                  cinema: {
                    active: true,
                  },
                },
              },
            },
          ],
        },
        include: {
          poster: true,
        },
      },
      pageable,
    );
    result.data.forEach((m) => (m = new MovieEntity(m)));

    return result;
  }

  async findOne(id: number, addSeats: boolean = false): Promise<MovieEntity> {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0);

    const movie = new MovieEntity(
      await this.prismaService.movie
        .findUniqueOrThrow({
          where: { id },
          include: {
            genres: true,
            poster: true,
            screenings: {
              orderBy: {
                start: 'asc',
              },
              where: {
                start: {
                  gte: startOfDay,
                },
                active: true,
              },
              include: {
                cinema: true,
              }
            },
          },
        })
        .catch(() => {
          throw new NotFoundException();
        }),
    );

    if (addSeats && movie.screenings?.length) {
      await this.screeningService.addAvailableSeats(movie.screenings);
    }

    return movie;
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

  async create(id: number): Promise<MovieEntity> {
    const movieTmdb = await this.findOneTmdb(id);
    const image = await this.cloudinaryService.uploadFromRemote(
      this.tmdbApiService.getImageUrl(movieTmdb.poster_path),
    );

    const newMovie = await this.prismaService.movie.create({
      data: {
        title: movieTmdb.title,
        releaseDate: new Date(movieTmdb.release_date),
        overview: movieTmdb.overview,
        popularity: movieTmdb.popularity,
        voteAverage: movieTmdb.vote_average,
        budget: movieTmdb.budget,
        tagline: movieTmdb.tagline,
        duration: movieTmdb.runtime,
        tmdbId: movieTmdb.id,
        updatedAt: new Date(),
        genres: {
          connectOrCreate: movieTmdb.genres.map((g) => ({
            where: {
              tmdbId: g.id,
            },
            create: {
              title: g.name,
              tmdbId: g.id,
              updatedAt: new Date(),
            },
          })),
        },
        poster: {
          create: {
            url: image.url,
            cloudinaryPublicId: image.public_id,
          },
        },
      },
    });

    return new MovieEntity(newMovie);
  }

  async update(id: number, dto: UpdateMovieDto): Promise<MovieEntity> {
    return new MovieEntity(
      await this.prismaService.movie.update({
        where: { id },
        data: {
          ...dto,
          updatedAt: new Date(),
        },
      }),
    );
  }

  async delete(id: number): Promise<MovieEntity> {
    return new MovieEntity(
      await this.prismaService.movie.update({
        where: { id },
        data: { published: false },
      }),
    );
  }

  async search(
    query: string,
    onlyPublished: boolean = true,
  ): Promise<PaginatedResult<MovieEntity>> {
    const result = await this.moviePaginator(this.prismaService.movie, {
      where: {
        ...this.getOnlyPublishedWhereClause(onlyPublished),
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
    result.data = result.data.map((m) => new MovieEntity(m));

    return result;
  }

  async attachGenre(movieId: number, ids: number[]): Promise<MovieEntity> {
    return new MovieEntity(
      await this.prismaService.movie.update({
        where: { id: movieId },
        data: {
          genres: {
            connect: ids.map((i) => ({ id: i })),
          },
        },
        include: { genres: true },
      }),
    );
  }

  async detachGenre(movieId: number, ids: number[]): Promise<MovieEntity> {
    return new MovieEntity(
      await this.prismaService.movie.update({
        where: { id: movieId },
        data: {
          genres: {
            disconnect: ids.map((i) => ({ id: i })),
          },
        },
        include: { genres: true },
      }),
    );
  }

  async updateImageFromFile(
    id: number,
    file: Express.Multer.File,
  ): Promise<MovieEntity> {
    const movie = await this.findOne(id);
    const image = await this.cloudinaryService.uploadFile(file);

    await this.imageService.update(movie.posterImageId, {
      url: image.url,
      publicId: image.public_id,
    });

    return this.findOne(id);
  }

  async updateImageFromTmdb(id: number): Promise<MovieEntity> {
    const movie = await this.findOne(id);
    const movieTmdb = await this.findOneTmdb(movie.tmdbId);

    if (movieTmdb.poster_path) {
      const image = await this.cloudinaryService.uploadFromRemote(
        this.tmdbApiService.getImageUrl(movieTmdb.poster_path),
      );

      await this.imageService.update(movie.posterImageId, {
        url: image.url,
        publicId: image.secure_url,
      });

      return this.findOne(id);
    }

    throw new BadRequestException();
  }

  findMostPopular(count: number): Promise<MovieEntity[]> {
    return this.prismaService.movie.findMany({
      take: count,
      orderBy: {
        popularity: 'desc',
      },
      include: {
        poster: true,
      },
    });
  }

  findMostPopularPlanned(count: number): Promise<MovieEntity[]> {
    return this.prismaService.movie.findMany({
      take: count,
      where: {
        screenings: {
          some: {
            start: {
              gt: new Date(),
            },
            active: true,
          },
        },
      },
      orderBy: {
        popularity: 'desc',
      },
      include: {
        poster: true,
      },
    });
  }

  private getOnlyPublishedWhereClause(
    onlyPublished: boolean = true,
  ): Prisma.MovieWhereInput {
    if (onlyPublished) {
      return {
        published: true,
      };
    }

    return {};
  }
}
