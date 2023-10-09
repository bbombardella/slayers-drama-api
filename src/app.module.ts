import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ApiConfigModule } from './api-config/api-config.module';

@Module({
  imports: [PrismaModule, AuthModule, ApiConfigModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
