import { ForbiddenException, Injectable } from '@nestjs/common';
import { ReservationEntity } from './entities/reservation.entity';
import { PrismaService } from '../prisma/prisma.service';
import { UserEntity } from '../auth/entities/user.entity';
import {
  PaginatedResult,
  PaginateOptions,
  paginator,
} from '../prisma/paginator';
import Stripe from 'stripe';
import { ProductService } from '../product/product.service';

@Injectable()
export class ReservationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
  ) {}

  private get reservationPaginator(): typeof paginator<
    ReservationEntity,
    Parameters<typeof this.prismaService.reservation.findMany>[0]
  > {
    return paginator<
      ReservationEntity,
      Parameters<typeof this.prismaService.reservation.findMany>[0]
    >;
  }

  async findAll(
    pageable?: PaginateOptions,
  ): Promise<PaginatedResult<ReservationEntity>> {
    const result = await this.reservationPaginator(
      this.prismaService.reservation,
      {
        include: {
          products: true,
        },
      },
      pageable,
    );
    result.data = result.data.map((r) => new ReservationEntity(r));

    return result;
  }

  async findOne(id: number, user: UserEntity): Promise<ReservationEntity> {
    const reservation = await this.prismaService.reservation.findUniqueOrThrow({
      where: { id },
      include: {
        products: true,
      },
    });

    if (
      !user?.id ||
      (user?.role !== 'ADMIN' && reservation.customerId !== user.id)
    ) {
      throw new ForbiddenException();
    }

    return new ReservationEntity(reservation);
  }

  mapReservationsToStripe(
    reservations: ReservationEntity[],
  ): Stripe.Checkout.SessionCreateParams.LineItem[] {
    return reservations
      .flatMap((r) => r.products)
      .map((p) => ({
        price_data: this.productService.mapProductToStripe(p.product),
        quantity: p.number,
      }));
  }
}
