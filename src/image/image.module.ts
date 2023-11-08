import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
