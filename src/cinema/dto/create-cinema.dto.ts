import { IsString, MinLength } from 'class-validator';

export class CreateCinemaDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  city: string;
}
