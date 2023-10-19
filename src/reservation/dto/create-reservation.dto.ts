import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNumber, IsPositive } from 'class-validator';
import { CreateReservationProduct } from './create-reservation-product.dto';
import { Exclude } from 'class-transformer';

export class CreateReservationDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  screeningId: number;

  @Exclude()
  @IsNumber()
  @IsPositive()
  customerId: number;

  @ApiProperty({ type: CreateReservationProduct, isArray: true })
  @IsArray()
  @ArrayNotEmpty()
  products: CreateReservationProduct[];
}
