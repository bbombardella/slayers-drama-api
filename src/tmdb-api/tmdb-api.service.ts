import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '../api-config/api-config.service';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { MovieDetails } from './models';
import { AxiosResponse } from 'axios';

@Injectable()
export class TmdbApiService {
  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly httpService: HttpService,
  ) {}

  get defaultQueryString(): { api_key: string; language: string } {
    return {
      api_key: this.apiConfigService.tmdb.apiKey,
      language: 'fr-FR',
    };
  }

  get root(): string {
    return this.apiConfigService.tmdb.url;
  }

  getImageUrl(path: string): string {
    return `${this.apiConfigService.tmdb.urlImageBase}${path}`;
  }

  getMovie(id: number): Observable<AxiosResponse<MovieDetails>> {
    return this.httpService.get<MovieDetails>(`${this.root}movie/${id}`, {
      params: this.defaultQueryString,
    });
  }
}
