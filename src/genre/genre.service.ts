import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  PaginatedResult,
  PaginateOptions,
  paginator,
} from '../prisma/paginator';
import { Genre } from '@prisma/client';
import { GenreEntity } from './entities/genre.entity';

@Injectable()
export class GenreService {
  constructor(private readonly prismaService: PrismaService) {}

  private get genrePaginator(): typeof paginator<
    Genre,
    Parameters<typeof this.prismaService.genre.findMany>[0]
  > {
    return paginator<
      Genre,
      Parameters<typeof this.prismaService.genre.findMany>[0]
    >;
  }

  async create(createGenreDto: CreateGenreDto): Promise<GenreEntity> {
    return new GenreEntity(
      await this.prismaService.genre.create({
        data: {
          ...createGenreDto,
        },
      }),
    );
  }

  async findAll(
    pageable?: PaginateOptions,
  ): Promise<PaginatedResult<GenreEntity>> {
    const result = await this.genrePaginator(
      this.prismaService.genre,
      undefined,
      pageable,
    );
    result.data.forEach((g) => new GenreEntity(g));

    return result;
  }

  async findOne(id: number): Promise<GenreEntity> {
    return new GenreEntity(
      await this.prismaService.genre
        .findUniqueOrThrow({
          where: { id },
        })
        .catch(() => {
          throw new NotFoundException();
        }),
    );
  }

  async update(
    id: number,
    updateGenreDto: UpdateGenreDto,
  ): Promise<GenreEntity> {
    return new GenreEntity(
      await this.prismaService.genre.update({
        where: { id },
        data: {
          ...updateGenreDto,
          updatedAt: new Date(),
        },
      }),
    );
  }

  async remove(id: number): Promise<GenreEntity> {
    return new GenreEntity(
      await this.prismaService.genre.delete({
        where: { id },
      }),
    );
  }
}
