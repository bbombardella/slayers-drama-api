import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MovieDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsDateString()
  release_date: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  overview: string;

  @ApiProperty()
  @IsNumber()
  popularity: number;

  @ApiProperty()
  @IsNumber()
  vote_average: number;

  @ApiProperty()
  @IsNumber()
  budget: number;

  @ApiProperty()
  @IsString()
  poster_path: string;

  @ApiProperty()
  @IsString()
  tagline: string;

  @ApiProperty()
  @IsNumber()
  tmdb_id: number;
}
