import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { ProductModule } from '../product/product.module';
import { ScreeningModule } from '../screening/screening.module';

@Module({
  imports: [ProductModule, ScreeningModule],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
