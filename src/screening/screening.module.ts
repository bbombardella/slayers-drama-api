import { Module } from '@nestjs/common';
import { ScreeningService } from './screening.service';
import { ScreeningController } from './screening.controller';

@Module({
  controllers: [ScreeningController],
  providers: [ScreeningService],
})
export class ScreeningModule {}
