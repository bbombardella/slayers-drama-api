import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class CreateReservationProduct {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  productId: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  number: number;
}
