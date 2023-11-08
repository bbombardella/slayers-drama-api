import { Movie } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ImageEntity } from 'src/image/entities/image.entity';
import { GenreEntity } from 'src/genre/entities/genre.entity';
import { ScreeningEntity } from 'src/screening/entities/screening.entity';

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
  duration: number;

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

  @ApiProperty({ type: GenreEntity, isArray: true })
  genres?: Array<GenreEntity>;

  @ApiProperty({type: ScreeningEntity, isArray: true})
  screenings?: Array<ScreeningEntity>;

  constructor({ poster, genres, screenings, ...data }: Partial<MovieEntity>) {
    if (poster) {
      this.poster = new ImageEntity(poster);
    }

    if (genres) {
      this.genres = genres.map((g) => new GenreEntity(g));
    }

    if (screenings) {
      this.screenings = screenings.map((s) => new ScreeningEntity(s));
    }

    Object.assign(this, data);
  }
}
