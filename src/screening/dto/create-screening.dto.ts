import { IsBoolean, IsDate, IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateScreeningDto {
  @ApiProperty({ type: 'string' })
  @Transform(({ value }) => { new Date(value) })
  start: Date;

  @ApiProperty({ type: 'string' })
  @Transform(({ value }) => { new Date(value) })
  end: Date;

  @ApiProperty()
  @IsBoolean()
  active: boolean;

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
