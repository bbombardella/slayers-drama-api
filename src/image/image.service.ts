import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CloudinaryImage } from '../cloudinary/models/cloudinary-image.model';
import { PrismaService } from '../prisma/prisma.service';
import { Image } from '@prisma/client';

@Injectable()
export class ImageService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findOne(id: number): Promise<Image> {
    return this.prismaService.image.findUnique({
      where: { id },
    });
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
