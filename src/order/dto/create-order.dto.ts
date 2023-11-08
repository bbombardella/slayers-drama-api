import { CreateReservationDto } from '../../reservation/dto/create-reservation.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ type: CreateReservationDto, isArray: true })
  @IsArray()
  @ArrayNotEmpty()
  reservations: CreateReservationDto[];
}
