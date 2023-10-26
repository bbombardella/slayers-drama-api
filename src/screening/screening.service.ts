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
import { GroupedScreeningDto } from './dto/grouped-screening.dto';
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
    return new ScreeningEntity(
      await this.prismaService.screening.create({
        data: createScreeningDto,
      }),
    );
  }

  async findAll(
    pageable?: PaginateOptions,
  ): Promise<PaginatedResult<ScreeningEntity>> {
    const result = await this.screeningPaginator(
      this.prismaService.screening,
      undefined,
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
      await this.prismaService.screening.delete({
        where: { id },
      }),
    );
  }

  groupScreeningByDate(screenings: ScreeningEntity[]): GroupedScreeningDto {
    return screenings.reduce((grouped, item) => {
      // Vérifie si le groupe existe déjà
      const startDate = new Date(item.start);
      startDate.setUTCHours(0, 0, 0);

      const dateKey = startDate.toISOString().split('T')[0];
      if (!grouped[dateKey]) {
        // Si le groupe n'existe pas, créez-le en utilisant la propriété comme clé
        grouped[dateKey] = [];
      }

      // Ajoutez l'élément à la catégorie appropriée
      grouped[dateKey].push(item);

      return grouped;
    }, {});
  }

  async initialSeats(id: number): Promise<number> {
    const idk: { initialAvailableSeats: number } =
      await this.prismaService.screening.findUniqueOrThrow({
        where: { id },
        select: {
          initialAvailableSeats: true,
        },
      });

    return idk.initialAvailableSeats;
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
