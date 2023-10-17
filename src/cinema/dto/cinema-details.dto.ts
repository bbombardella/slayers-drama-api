import { GroupedScreeningDto } from '../../screening/dto/grouped-screening.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CinemaEntity } from '../entities/cinema.entity';
import { MovieEntity } from '../../movie/entities/movie.entity';

export class CinemaMoviesDetailsDto extends MovieEntity {
  @ApiProperty()
  screenings: GroupedScreeningDto;
}

export class CinemaDetailsDto {
  @ApiProperty()
  cinema: CinemaEntity;

  @ApiProperty({ type: CinemaMoviesDetailsDto, isArray: true })
  movies: CinemaMoviesDetailsDto[];
}
