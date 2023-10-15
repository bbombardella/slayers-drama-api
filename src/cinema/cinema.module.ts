import { Module } from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { CinemaController } from './cinema.controller';
import { ScreeningModule } from '../screening/screening.module';

@Module({
  imports: [ScreeningModule],
  controllers: [CinemaController],
  providers: [CinemaService],
})
export class CinemaModule {}
