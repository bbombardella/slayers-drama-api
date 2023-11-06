import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
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
import { $Enums } from '.prisma/client';
import { MailService } from '../mail/mail.service';
import { MailSend } from '../mail/models/mail-send.model';

@Injectable()
export class OrderService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly stripeService: StripeService,
    private readonly reservationService: ReservationService,
    private readonly mailService: MailService,
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
    if (!(await this.checkSeats(createOrderDto))) {
      throw new BadRequestException('Not enough seats');
    }

    let order;

    try {
      order = await this.prismaService.order.create({
        data: {
          status: 'PAYING',
          customerId: user.id,
          reservations: {
            create: createOrderDto.reservations.map(
              ({ screeningId, ...r }) => ({
                ...r,
                customer: {
                  connect: {
                    id: user.id,
                  },
                },
                products: {
                  create: r.products.map((p) => p),
                },
                screening: {
                  connect: {
                    id: screeningId,
                    active: true,
                    cinema: {
                      active: true,
                    },
                    movie: {
                      published: true,
                    },
                  },
                },
              }),
            ),
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
    args?: Parameters<typeof this.prismaService.order.findMany>[0],
  ): Promise<PaginatedResult<OrderEntity>> {
    const result = await this.orderPaginator(
      this.prismaService.order,
      args,
      pageable,
    );
    result.data.forEach((o) => (o = new OrderEntity(o)));

    return result;
  }

  async findAllMine(
    id: number,
    pageable?: PaginateOptions,
  ): Promise<PaginatedResult<OrderEntity>> {
    return this.findAll(pageable, {
      where: {
        customer: { id },
      },
    });
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

  async verify(sessionId: string, user: UserEntity): Promise<OrderEntity> {
    let status: $Enums.OrderStatus = 'CANCELLED';

    const order = await this.prismaService.order.findUniqueOrThrow({
      where: {
        stripeSessionId: sessionId,
        customerId: user.id,
      },
      include: {
        reservations: {
          include: {
            products: true,
          },
        },
      },
    });
    const canCapture = await this.checkSeats(order);
    //TODO add also a cron to verify status

    try {
      const captured = await this.stripeService.handleCallbackPayment(
        sessionId,
        canCapture,
      );

      status = captured ? 'PAYED' : 'CANCELLED';
    } catch (e) {
      status = 'CANCELLED';
    }

    const finalOrder = new OrderEntity(
      await this.prismaService.order.update({
        where: { id: order.id },
        data: { status },
        include: {
          customer: true,
        },
      }),
    );

    await this.handleMailOrder(finalOrder);

    return finalOrder;
  }

  private async handleMailOrder(order: OrderEntity) {
    let config: MailSend;

    switch (order.status) {
      case 'PAYING':
        return;
      case 'CANCELLED':
        config = {
          to: order.customer.email,
          subject: `Annulation de votre commande n°${order.id}`,
          html: `<h1>A propos de votre commande n°${order.id}</h1>
                <p>Votre commande a été annulé, le montant de votre commande n'a pas été débité.</p>`,
        };
        break;
      case 'PAYED':
        config = {
          to: order.customer.email,
          subject: `Votre commande n°${order.id}`,
          html: `<h1>A propos de votre commande n°${order.id}</h1>
                <p>Félicitations ! Votre commande a été validé avec succès.</p>`,
        };
        break;
    }

    if (!config) {
      return;
    }

    return this.mailService.sendMail(config).catch(null);
  }

  private checkSeats(order: CreateOrderDto | OrderEntity): Promise<boolean> {
    return this.reservationService.checkSeats(order.reservations);
  }
}
