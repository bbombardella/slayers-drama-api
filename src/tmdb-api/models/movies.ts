import {
  Genre,
  MovieTmdb,
  ProductionCompany,
  ProductionCountry,
  SpokenLanguage,
} from './';
import { ApiProperty } from '@nestjs/swagger';

export class BelongsToCollection {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  poster_path: string;

  @ApiProperty()
  backdrop_path: string;
}

export class MovieDetails {
  @ApiProperty()
  adult: boolean;

  @ApiProperty()
  backdrop_path: string;

  @ApiProperty()
  belongs_to_collection?: BelongsToCollection;

  @ApiProperty()
  budget: number;

  @ApiProperty({ type: Genre, isArray: true })
  genres: Genre[];

  @ApiProperty()
  homepage: string;

  @ApiProperty()
  id: number;

  @ApiProperty()
  imdb_id: string;

  @ApiProperty()
  original_language: string;

  @ApiProperty()
  original_title: string;

  @ApiProperty()
  overview: string;

  @ApiProperty()
  popularity: number;

  @ApiProperty()
  poster_path?: string;

  @ApiProperty({ type: ProductionCompany, isArray: true })
  production_companies: ProductionCompany[];

  @ApiProperty({ type: ProductionCountry, isArray: true })
  production_countries: ProductionCountry[];

  @ApiProperty()
  release_date: string;

  @ApiProperty()
  revenue: number;

  @ApiProperty()
  runtime: number;

  @ApiProperty()
  spoken_languages: SpokenLanguage[];

  @ApiProperty()
  status: string;

  @ApiProperty()
  tagline: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  video: boolean;

  @ApiProperty()
  vote_average: number;

  @ApiProperty()
  vote_count: number;
}

export enum ReleaseDateType {
  'Premiere' = 1,
  'Theatrical (limited)',
  'Theatrical',
  'Digital',
  'Physical',
  'TV',
}

export interface ReleaseDate {
  certification: string;
  iso_639_1: string;
  release_date: Date;
  type: ReleaseDateType;
  note: string;
}

export interface ReleaseDateResult {
  iso_3166_1: string;
  release_dates: ReleaseDate[];
}

export interface ReleaseDates {
  id: number;
  results: ReleaseDateResult[];
}

export interface SimilarMovies {
  page: number;
  results: MovieTmdb[];
  total_pages: number;
  total_results: number;
}

export interface MovieList {
  description: string;
  favorite_count: number;
  id: number;
  item_count: number;
  iso_639_1: string;
  list_type: string;
  name: string;
  poster_path: string;
}

export interface MovieLists {
  id: number;
  page: number;
  results: MovieList[];
  total_pages: number;
  total_results: number;
}

export interface LatestMovie {
  adult: boolean;
  backdrop_path?: string;
  belongs_to_collection?: BelongsToCollection;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface Dates {
  maximum: string;
  minimum: string;
}

export interface MoviesPlayingNow {
  page: number;
  results: MovieTmdb[];
  dates: Dates;
  total_pages: number;
  total_results: number;
}

export interface PopularMovies {
  page: number;
  results: MovieTmdb[];
  total_results: number;
  total_pages: number;
}

export interface TopRatedMovies {
  page: number;
  results: MovieTmdb[];
  total_results: number;
  total_pages: number;
}

export interface UpcomingMovies {
  page: number;
  results: MovieTmdb[];
  total_results: number;
  total_pages: number;
}

export type MovieChangeValue =
  | string
  | {
      person_id: number;
      character: string;
      order: number;
      cast_id: number;
      credit_id: string;
    }
  | unknown;
