import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { TmdbApiModule } from '../tmdb-api/tmdb-api.module';

@Module({
  imports: [TmdbApiModule],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
