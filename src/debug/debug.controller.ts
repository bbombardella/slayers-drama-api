import { Controller, Get, Put, Query } from '@nestjs/common';
import { log } from 'console';
import e from 'express';
import { MovieService } from 'src/movie/movie.service';
import { MovieDetails } from 'src/tmdb-api/models';

const DELAY_BETWEEN_REQUESTS_MS = 450; // Délai d'une seconde (1000 millisecondes) entre les requêtes

@Controller('debug')
export class DebugController {
  constructor(private readonly movieService: MovieService) {}

  @Get('populate')
  async populate(
    @Query('s') start: number,
    @Query('e') end: number,
  ): Promise<void> {
    // Your code here
    console.log('populate start', start);
    console.log('populate end', end);

    const list = Array.from({ length: end - start }, (_, i) => start + 1 + i);

    await Promise.all(
      list.map(async (id, index) => {
        let throttling = DELAY_BETWEEN_REQUESTS_MS + index;

        if (throttling < 500) throttling += 2 * index;

        if (index > 0) {
          console.log(`throttling request ${id} from ${throttling}ms`);

          await new Promise((resolve) => setTimeout(resolve, throttling));
        }

        try {
          const contents = await this.movieService.create(id);
          console.log(`success ${id} : ${contents.title}`);
        } catch (e) {
          console.log(`error ${id} : ${e.message}`);
        }
      }),
    );

    console.log('populate/');
  }
}
