import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { TmdbApiModule } from '../tmdb-api/tmdb-api.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ImageModule } from '../image/image.module';
import { ScreeningModule } from '../screening/screening.module';

@Module({
  imports: [TmdbApiModule, CloudinaryModule, ImageModule, ScreeningModule],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
