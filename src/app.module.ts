import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ApiConfigModule } from './api-config/api-config.module';
import { MovieModule } from './movie/movie.module';
import { GenreModule } from './genre/genre.module';
import { TmdbApiModule } from './tmdb-api/tmdb-api.module';
import { CinemaModule } from './cinema/cinema.module';
import { ScreeningModule } from './screening/screening.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ImageModule } from './image/image.module';
import { DebugModule } from './debug/debug.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ApiConfigModule,
    MovieModule,
    GenreModule,
    TmdbApiModule,
    CinemaModule,
    ScreeningModule,
    CloudinaryModule,
    ImageModule,
    DebugModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
