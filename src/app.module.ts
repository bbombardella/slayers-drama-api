import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ApiConfigModule } from './api-config/api-config.module';
import { TmdbApiModule } from './tmdb-api/tmdb-api.module';

@Module({
  imports: [PrismaModule, AuthModule, ApiConfigModule, TmdbApiModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
