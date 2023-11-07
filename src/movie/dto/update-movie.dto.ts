import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateMovieDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ type: 'string' })
  @Transform(({ value }) => { new Date(value) })
  releaseDate: Date;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  overview: string;

  @ApiProperty({ type: 'number' })
  @Transform(({ value }) => {
    if (value) {
      return value as number;
    }else{
      return -1;
    }
  })
  popularity: number;

  @ApiProperty({ type: 'number' })
  @Transform(({ value }) => {
    if (value) {
      return value as number;
    }else{
      return -1;
    }
  })
  voteAverage: number;

  @ApiProperty({ type: 'number' })
  @Transform(({ value }) => {
    if (value) {
      return value as number;
    }else{
      return -1;
    }
  })
  budget: number;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  tagline: string;

  @ApiProperty()
  @IsBoolean()
  published: boolean;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  duration: number;
}
