import { Cinema, Movie } from '@prisma/client';
import { GroupedScreeningDto } from '../../screening/dto/grouped-screening.dto';

export class CinemaDetailsDto {
  cinema: Cinema;
  movies: CinemaMoviesDetailsDto[];
}

interface CinemaMoviesDetailsDto extends Movie {
  screenings: GroupedScreeningDto;
}
