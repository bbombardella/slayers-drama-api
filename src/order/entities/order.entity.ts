import { Order } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ReservationEntity } from '../../reservation/entities/reservation.entity';
import { UserEntity } from '../../auth/entities/user.entity';

export class OrderEntity implements Order {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  status: 'PAYING' | 'PAYED' | 'CANCELLED';

  @Exclude()
  stripeSessionId: string | null;

  @ApiProperty()
  customerId: number;

  @ApiProperty()
  customer?: UserEntity;

  @ApiProperty({ type: ReservationEntity, isArray: true })
  reservations?: ReservationEntity[];

  constructor({ reservations, customer, ...partial }: Partial<OrderEntity>) {
    if (reservations) {
      this.reservations = reservations.map((r) => new ReservationEntity(r));
    }

    if (customer) {
      this.customer = new UserEntity(customer);
    }

    Object.assign(this, partial);
  }
}
