import { Screening } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

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
}
