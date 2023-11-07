import { Screening } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { CinemaEntity } from '../../cinema/entities/cinema.entity';
import { MovieEntity } from '../../movie/entities/movie.entity';

export class ScreeningEntity implements Screening {
  @ApiProperty()
  id: number;

  @ApiProperty()
  start: Date;

  @ApiProperty()
  end: Date;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  initialAvailableSeats: number;

  @ApiProperty()
  availableSeats?: number;

  @ApiProperty()
  cinemaId: number;

  @ApiProperty()
  movieId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  cinema?: CinemaEntity;

  @ApiProperty({ type: () => MovieEntity })
  movie?: MovieEntity;

  constructor({ cinema, movie, ...partial }: Partial<ScreeningEntity>) {
    if (cinema) {
      this.cinema = new CinemaEntity(cinema);
    }

    if (movie) {
      this.movie = new MovieEntity(movie);
    }

    Object.assign(this, partial);
  }
}
