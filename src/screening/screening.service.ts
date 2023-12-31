import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateScreeningDto } from './dto/create-screening.dto';
import { UpdateScreeningDto } from './dto/update-screening.dto';
import {
  PaginatedResult,
  PaginateOptions,
  paginator,
} from '../prisma/paginator';
import { Screening } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ScreeningEntity } from './entities/screening.entity';

@Injectable()
export class ScreeningService {
  constructor(private readonly prismaService: PrismaService) {}

  private get screeningPaginator(): typeof paginator<
    Screening,
    Parameters<typeof this.prismaService.screening.findMany>[0]
  > {
    return paginator<
      Screening,
      Parameters<typeof this.prismaService.screening.findMany>[0]
    >;
  }

  async create(
    createScreeningDto: CreateScreeningDto,
  ): Promise<ScreeningEntity> {
    const { cinemaId, movieId, ...payload } = createScreeningDto;

    return new ScreeningEntity(
      await this.prismaService.screening.create({
        data: {
          ...payload,
          cinema: {
            connect: {
              id: cinemaId,
              active: true,
            },
          },
          movie: {
            connect: {
              id: movieId,
              published: true,
            },
          },
        },
      }),
    );
  }

  async findAll(
    pageable?: PaginateOptions,
  ): Promise<PaginatedResult<ScreeningEntity>> {
    const result = await this.screeningPaginator(
      this.prismaService.screening,
      {
        include: {
          movie: true,
          cinema: true,
        },
      },
      pageable,
    );
    result.data.forEach((s) => (s = new ScreeningEntity(s)));

    return result;
  }

  async findOne(id: number): Promise<ScreeningEntity> {
    return new ScreeningEntity(
      await this.prismaService.screening
        .findUniqueOrThrow({
          where: { id },
          include: {
            movie: true,
            cinema: true,
          },
        })
        .catch(() => {
          throw new NotFoundException();
        }),
    );
  }

  async update(
    id: number,
    updateScreeningDto: UpdateScreeningDto,
  ): Promise<ScreeningEntity> {
    return new ScreeningEntity(
      await this.prismaService.screening.update({
        where: { id },
        data: {
          ...updateScreeningDto,
          updatedAt: new Date(),
        },
      }),
    );
  }

  async remove(id: number): Promise<ScreeningEntity> {
    return new ScreeningEntity(
      await this.prismaService.screening.update({
        where: { id },
        data: { active: false },
      }),
    );
  }

  async initialSeats(id: number): Promise<number> {
    const idk: { initialAvailableSeats: number } =
      await this.prismaService.screening.findUniqueOrThrow({
        where: {
          id,
          active: true,
        },
        select: {
          initialAvailableSeats: true,
        },
      });

    return idk.initialAvailableSeats;
  }

  private takenSeat(id: number) {
    return this.prismaService.productsInReservation.aggregate({
      where: {
        reservation: {
          order: {
            status: {
              equals: 'PAYED',
            },
          },
          screening: { id },
        },
      },
      _sum: {
        number: true,
      },
    });
  }

  async addAvailableSeats(screenings: ScreeningEntity[]) {
    await Promise.all(
      screenings.map(async (s) => {
        const result = await this.takenSeat(s.id);
        s.availableSeats = s.initialAvailableSeats - result._sum.number ?? 0;
      }),
    );
  }

  async availableSeats(id: number): Promise<number> {
    const [initialSeats, takenSeats] = await Promise.all([
      this.initialSeats(id),
      this.prismaService.productsInReservation.aggregate({
        where: {
          reservation: {
            order: {
              status: {
                equals: 'PAYED',
              },
            },
            screening: { id },
          },
        },
        _sum: {
          number: true,
        },
      }),
    ]);

    return initialSeats - takenSeats._sum.number;
  }

  async isThereAvailableSeats(id: number, seats: number = 0): Promise<boolean> {
    if (seats < 0) {
      throw new BadRequestException();
    }

    const availableSeats = await this.availableSeats(id);

    if (seats === 0) {
      return availableSeats > seats;
    }

    return availableSeats >= seats;
  }
}
