import { Order } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ReservationEntity } from '../../reservation/entities/reservation.entity';

export class OrderEntity implements Order {
  @ApiProperty()
  id: number;

  @ApiProperty()
  status: 'PAYING' | 'PAYED' | 'CANCELLED';

  @Exclude()
  stripeSessionId: string | null;

  @ApiProperty()
  customerId: number;

  @ApiProperty({ type: ReservationEntity, isArray: true })
  reservations?: ReservationEntity[];

  constructor({ reservations, ...partial }: Partial<OrderEntity>) {
    if (reservations) {
      this.reservations = reservations.map((r) => new ReservationEntity(r));
    }

    Object.assign(this, partial);
  }
}
