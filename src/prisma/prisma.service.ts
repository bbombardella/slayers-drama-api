import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ApiConfigService } from '../api-config/api-config.service';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private readonly apiConfigService: ApiConfigService) {
    super({
      datasources: {
        db: {
          url: apiConfigService.database.url,
        },
      },
    });
  }
}
