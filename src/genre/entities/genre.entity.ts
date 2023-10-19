import { Genre } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class GenreEntity implements Genre {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  tmdbId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(data: Partial<GenreEntity>) {
    Object.assign(this, data);
  }
  
}
