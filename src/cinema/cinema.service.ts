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

@Injectable()
export class CinemaService {
  constructor(private readonly prismaService: PrismaService) {}

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
}
