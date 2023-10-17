import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ConfigCloudinary,
  ConfigDatabase,
  ConfigProviders,
  ConfigTMDB,
} from './model';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get database(): ConfigDatabase {
    return this.configService.get<ConfigDatabase>('database');
  }

  get providers(): ConfigProviders {
    return this.configService.get<ConfigProviders>('providers');
  }

  get tmdb(): ConfigTMDB {
    return this.configService.get<ConfigTMDB>('tmdb');
  }

  get cloudinary(): ConfigCloudinary {
    return this.configService.get<ConfigCloudinary>('cloudinary');
  }
}
