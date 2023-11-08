import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { StripeModule } from '../stripe/stripe.module';
import { ReservationModule } from '../reservation/reservation.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [StripeModule, ReservationModule, MailModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
