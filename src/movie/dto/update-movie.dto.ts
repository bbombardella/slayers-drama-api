import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateMovieDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty()
  @IsDate()
  releaseDate: Date;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  overview: string;

  @ApiProperty()
  @IsNumber()
  popularity: number;

  @ApiProperty()
  @IsNumber()
  voteAverage: number;

  @ApiProperty()
  @IsNumber()
  budget: number;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  tagline: string;

  @ApiProperty()
  @IsBoolean()
  published: boolean;
}
