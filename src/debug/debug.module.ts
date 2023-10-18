import { Module } from '@nestjs/common';
import { DebugController } from './debug.controller';
import { MovieService } from 'src/movie/movie.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ImageService } from 'src/image/image.service';
import { ImageModule } from 'src/image/image.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { TmdbApiModule } from 'src/tmdb-api/tmdb-api.module';

@Module({
  imports: [TmdbApiModule, CloudinaryModule, ImageModule],
  providers: [MovieService, PrismaService, CloudinaryService, ImageService],
  controllers: [DebugController]
})
export class DebugModule {}
