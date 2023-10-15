import { Injectable } from '@nestjs/common';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  PaginatedResult,
  PaginateOptions,
  paginator,
} from '../prisma/paginator';
import { Cinema } from '@prisma/client';
import { CinemaDetailsDto } from './dto/cinema-details.dto';
import { ScreeningService } from '../screening/screening.service';

@Injectable()
export class CinemaService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly screeningService: ScreeningService,
  ) {}

  private get cinemaPaginator(): typeof paginator<
    Cinema,
    Parameters<typeof this.prismaService.cinema.findMany>[0]
  > {
    return paginator<
      Cinema,
      Parameters<typeof this.prismaService.cinema.findMany>[0]
    >;
  }

  async create(createCinemaDto: CreateCinemaDto): Promise<Cinema> {
    return this.prismaService.cinema.create({
      data: createCinemaDto,
    });
  }

  async findAll(pageable?: PaginateOptions): Promise<PaginatedResult<Cinema>> {
    return this.cinemaPaginator(this.prismaService.cinema, undefined, pageable);
  }

  async findOneDetails(id: number): Promise<CinemaDetailsDto> {
    const promises = await Promise.all([
      this.findOne(id),
      this.findLatestMovies(id),
    ]);

    return {
      cinema: promises[0],
      movies: promises[1].map((m) => ({
        ...m,
        screenings: this.screeningService.groupScreeningByDate(m.screenings),
      })),
    };
  }

  private async findLatestMovies(cinemaId: number) {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0);

    return this.prismaService.movie.findMany({
      where: {
        screenings: {
          some: {
            cinemaId,
            start: {
              gte: startOfDay,
            },
          },
        },
      },
      include: {
        screenings: {
          orderBy: {
            start: 'asc',
          },
          where: {
            start: {
              gte: startOfDay,
            },
          },
        },
      },
    });
  }

  async findOne(id: number): Promise<Cinema> {
    return this.prismaService.cinema.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateCinemaDto: UpdateCinemaDto): Promise<Cinema> {
    return this.prismaService.cinema.update({
      where: { id },
      data: {
        ...updateCinemaDto,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: number): Promise<Cinema> {
    return this.prismaService.cinema.delete({
      where: { id },
    });
  }

  async search(query: string): Promise<PaginatedResult<Cinema>> {
    return this.cinemaPaginator(this.prismaService.cinema, {
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            city: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }
}
