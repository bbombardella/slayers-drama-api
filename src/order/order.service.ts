import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { StripeService } from '../stripe/stripe.service';
import { UserEntity } from '../auth/entities/user.entity';
import { PrismaService } from '../prisma/prisma.service';
import { OrderEntity } from './entities/order.entity';
import { ReservationService } from '../reservation/reservation.service';
import {
  PaginatedResult,
  PaginateOptions,
  paginator,
} from '../prisma/paginator';
import { Order } from '@prisma/client';
import { OrderPaymentRequiredDto } from './dto/order-payment-required.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly stripeService: StripeService,
    private readonly reservationService: ReservationService,
  ) {}

  private get orderPaginator(): typeof paginator<
    Order,
    Parameters<typeof this.prismaService.order.findMany>[0]
  > {
    return paginator<
      Order,
      Parameters<typeof this.prismaService.order.findMany>[0]
    >;
  }

  async create(
    createOrderDto: CreateOrderDto,
    user: UserEntity,
  ): Promise<OrderPaymentRequiredDto> {
    let order;

    try {
      order = await this.prismaService.order.create({
        data: {
          status: 'PAYING',
          customerId: user.id,
          reservations: {
            create: createOrderDto.reservations.map((r) => ({
              ...r,
              customerId: user.id,
              products: {
                create: r.products.map((p) => p),
              },
            })),
          },
        },
        include: {
          reservations: {
            include: {
              products: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });

      const checkout = await this.stripeService.create(
        this.reservationService.mapReservationsToStripe(order.reservations),
        user.email,
      );

      return {
        url: checkout.url,
        order: new OrderEntity(
          await this.prismaService.order.update({
            where: { id: order.id },
            data: {
              stripeSessionId: checkout.id,
            },
          }),
        ),
      };
    } catch (e) {
      if (order) {
        await this.updateStatus(order.id, 'CANCELLED');
      }

      throw e;
    }
  }

  async findAll(
    pageable?: PaginateOptions,
  ): Promise<PaginatedResult<OrderEntity>> {
    const result = await this.orderPaginator(
      this.prismaService.order,
      undefined,
      pageable,
    );
    result.data.forEach((o) => (o = new OrderEntity(o)));

    return result;
  }

  async findOne(id: number, user: UserEntity): Promise<OrderEntity> {
    const order = await this.prismaService.order.findUniqueOrThrow({
      where: { id },
      include: {
        reservations: {
          include: {
            products: {
              include: {
                product: true,
              },
            },
            screening: {
              include: {
                cinema: true,
              },
            },
          },
        },
      },
    });

    if (!user?.id || (user?.role !== 'ADMIN' && order.customerId !== user.id)) {
      throw new ForbiddenException();
    }

    return new OrderEntity(order);
  }

  private async updateStatus(id: number, status: 'PAYED' | 'CANCELLED') {
    return this.prismaService.order.update({
      where: { id },
      data: { status },
    });
  }

  async verify(sessionId: string, user: UserEntity): Promise<string> {
    //TODO if it's user's order
    //TODO update checkout status
    //TODO add also a cron to verify status

    return (await this.stripeService.handleCallbackPayment(sessionId, false))
      ? 'Payé !'
      : 'Pas payé';
  }
}
