import { ProductsInReservation } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { ProductEntity } from '../../product/entities/product.entity';

export class ReservationProductEntity implements ProductsInReservation {
  @ApiProperty()
  reservationId: number;

  @ApiProperty()
  productId: number;

  @ApiProperty()
  product?: ProductEntity;

  @ApiProperty()
  number: number;

  constructor({ product, ...partial }: Partial<ReservationProductEntity>) {
    if (product) {
      this.product = new ProductEntity(product);
    }

    Object.assign(this, partial);
  }
}
