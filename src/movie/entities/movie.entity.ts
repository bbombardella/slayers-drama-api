import { Movie } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ImageEntity } from 'src/image/entities/image.entity';

export class MovieEntity implements Movie {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  releaseDate: Date;

  @ApiProperty()
  overview: string;

  @ApiProperty({ type: 'number' })
  @Transform(({ value }) => value.toNumber())
  popularity: Decimal;

  @ApiProperty({ type: 'number' })
  @Transform(({ value }) => value.toNumber())
  voteAverage: Decimal;

  @ApiProperty({ type: 'number' })
  @Transform(({ value }) => value.toNumber())
  budget: Decimal;

  @ApiProperty()
  tagline: string;

  @ApiProperty()
  published: boolean;

  @ApiProperty()
  tmdbId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  posterImageId: number;

  @ApiProperty()
  poster?: ImageEntity;

  constructor({poster, ...data}: Partial<MovieEntity>) {
    if (poster) {
      this.poster = new ImageEntity(poster);
    }
    Object.assign(this, data);
  }
}
