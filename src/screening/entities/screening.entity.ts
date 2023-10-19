import { Screening } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { CinemaEntity } from '../../cinema/entities/cinema.entity';

export class ScreeningEntity implements Screening {
  @ApiProperty()
  id: number;

  @ApiProperty()
  start: Date;

  @ApiProperty()
  end: Date;

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

  constructor({ cinema, ...partial }: Partial<ScreeningEntity>) {
    if (cinema) {
      this.cinema = new CinemaEntity(cinema);
    }

    Object.assign(this, partial);
  }
}
