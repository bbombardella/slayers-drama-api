import { IsDate, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScreeningDto {
  @ApiProperty()
  @IsDate()
  start: Date;

  @ApiProperty()
  @IsDate()
  end: Date;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  cinemaId: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  movieId: number;
}
