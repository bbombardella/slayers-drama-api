import { ApiProperty } from '@nestjs/swagger';
import { Image } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class ImageEntity implements Image {
  @ApiProperty()
  id: number;
  @ApiProperty()
  url: string;
  @Exclude()
  cloudinaryPublicId: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;

  constructor(data: Partial<ImageEntity>) {
    Object.assign(this, data);
  }
}
