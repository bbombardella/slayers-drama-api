import { Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CloudinaryImage } from '../cloudinary/models/cloudinary-image.model';
import { PrismaService } from '../prisma/prisma.service';
import { Image } from '@prisma/client';
import { ImageEntity } from './entities/image.entity';

@Injectable()
export class ImageService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findOne(id: number): Promise<Image> {
    return new ImageEntity(
      await this.prismaService.image
        .findUniqueOrThrow({
          where: { id },
        })
        .catch(() => {
          throw new NotFoundException();
        }),
    );
  }

  async update(id: number, newImage: CloudinaryImage): Promise<void> {
    const oldImage = await this.findOne(id);

    await this.prismaService.image.update({
      where: { id },
      data: { ...newImage },
    });

    await this.cloudinaryService.destroy(oldImage.cloudinaryPublicId);
  }
}
