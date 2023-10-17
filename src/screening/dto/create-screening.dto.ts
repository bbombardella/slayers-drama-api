import { IsDate, IsNumber, IsPositive } from 'class-validator';

export class CreateScreeningDto {
  @IsDate()
  start: Date;

  @IsDate()
  end: Date;

  @IsNumber()
  @IsPositive()
  cinemaId: number;

  @IsNumber()
  @IsPositive()
  movieId: number;
}
