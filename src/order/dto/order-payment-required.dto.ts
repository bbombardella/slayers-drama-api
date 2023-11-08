import { OrderEntity } from '../entities/order.entity';
import { ApiProperty } from '@nestjs/swagger';

export class OrderPaymentRequiredDto {
  @ApiProperty()
  url: string;

  @ApiProperty()
  order: OrderEntity;
}
