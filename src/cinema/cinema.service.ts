import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  PaginatedResult,
  PaginateOptions,
  paginator,
} from '../prisma/paginator';
import { Cinema } from '@prisma/client';
import { ScreeningService } from '../screening/screening.service';
import { CinemaEntity } from './entities/cinema.entity';

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

  async create(createCinemaDto: CreateCinemaDto): Promise<CinemaEntity> {
    return new CinemaEntity(
      await this.prismaService.cinema.create({
        data: createCinemaDto,
      }),
    );
  }

  async findAll(
    pageable?: PaginateOptions,
    withNonActive: boolean = false,
  ): Promise<PaginatedResult<CinemaEntity>> {
    return this.cinemaPaginator(
      this.prismaService.cinema,
      withNonActive
        ? undefined
        : {
            where: {
              active: true,
            },
          },
      pageable,
    );
  }

  async findOne(id: number): Promise<CinemaEntity> {
    return new CinemaEntity(
      await this.prismaService.cinema
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
    updateCinemaDto: UpdateCinemaDto,
  ): Promise<CinemaEntity> {
    return new CinemaEntity(
      await this.prismaService.cinema.update({
        where: { id },
        data: {
          ...updateCinemaDto,
          updatedAt: new Date(),
        },
      }),
    );
  }

  async remove(id: number): Promise<CinemaEntity> {
    return new CinemaEntity(
      await this.prismaService.cinema.update({
        where: { id },
        data: { active: false },
      }),
    );
  }

  async search(query: string): Promise<PaginatedResult<CinemaEntity>> {
    const result = await this.cinemaPaginator(this.prismaService.cinema, {
      where: {
        active: true,
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
    result.data.forEach((c) => new CinemaEntity(c));

    return result;
  }
}
