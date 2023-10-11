import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '../api-config/api-config.service';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { Movie } from './models';
import { AxiosResponse } from 'axios';

@Injectable()
export class TmdbApiService {
  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly httpService: HttpService,
  ) {}

  get defaultQueryString(): any {
    return {
      api_key: this.apiConfigService.tmdb.apiKey,
      language: 'fr-FR',
    };
  }

  get root(): string {
    return this.apiConfigService.tmdb.url;
  }

  getMovie(id: string): Observable<AxiosResponse<Movie>> {
    return this.httpService.get<Movie>(`${this.root}movie/${id}`, {
      params: this.defaultQueryString,
    });
  }
}
