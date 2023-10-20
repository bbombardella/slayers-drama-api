import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt, IsPositive } from 'class-validator';
import { CreateReservationProduct } from './create-reservation-product.dto';
import { Exclude } from 'class-transformer';

export class CreateReservationDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  screeningId: number;

  @Exclude()
  @IsInt()
  @IsPositive()
  customerId: number;

  @ApiProperty({ type: CreateReservationProduct, isArray: true })
  @IsArray()
  @ArrayNotEmpty()
  products: CreateReservationProduct[];
}
