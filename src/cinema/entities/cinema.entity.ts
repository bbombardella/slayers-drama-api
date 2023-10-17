import { Cinema } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CinemaEntity implements Cinema {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
