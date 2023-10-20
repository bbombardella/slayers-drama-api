import { IsDate, IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScreeningDto {
  @ApiProperty()
  @IsDate()
  start: Date;

  @ApiProperty()
  @IsDate()
  end: Date;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  initialAvailableSeats: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  cinemaId: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  movieId: number;
}
