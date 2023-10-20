import { Reservation } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { ReservationProductEntity } from './reservation-product.entity';
import { ScreeningEntity } from '../../screening/entities/screening.entity';

export class ReservationEntity implements Reservation {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  screeningId: number;

  @ApiProperty()
  customerId: number;

  @ApiProperty()
  orderId: number;

  @ApiProperty({ type: ReservationProductEntity, isArray: true })
  products: ReservationProductEntity[];

  @ApiProperty()
  screening: ScreeningEntity;

  constructor({ products, screening, ...data }: Partial<ReservationEntity>) {
    if (products) {
      this.products = products.map((p) => new ReservationProductEntity(p));
    }

    if (screening) {
      this.screening = new ScreeningEntity(screening);
    }

    Object.assign(this, data);
  }
}
