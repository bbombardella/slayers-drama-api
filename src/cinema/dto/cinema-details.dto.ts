import { GroupedScreeningDto } from '../../screening/dto/grouped-screening.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CinemaEntity } from '../entities/cinema.entity';
import { MovieEntity } from '../../movie/entities/movie.entity';

export class CinemaMoviesDetailsDto extends OmitType(MovieEntity, [
  'screenings',
] as const) {
  @ApiProperty()
  screenings: GroupedScreeningDto;
}

export class CinemaDetailsDto {
  @ApiProperty()
  cinema: CinemaEntity;

  @ApiProperty({ type: CinemaMoviesDetailsDto, isArray: true })
  movies: CinemaMoviesDetailsDto[];
}
