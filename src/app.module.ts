import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ApiConfigModule } from './api-config/api-config.module';
import { MovieModule } from './movie/movie.module';
import { GenreModule } from './genre/genre.module';
import { TmdbApiModule } from './tmdb-api/tmdb-api.module';
import { CinemaModule } from './cinema/cinema.module';
import { ScreeningModule } from './screening/screening.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ImageModule } from './image/image.module';
import { DebugModule } from './debug/debug.module';
import { StripeModule } from './stripe/stripe.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ApiConfigModule,
    MovieModule,
    GenreModule,
    TmdbApiModule,
    CinemaModule,
    ScreeningModule,
    CloudinaryModule,
    ImageModule,
    DebugModule,
    StripeModule,
    OrderModule,
    ProductModule,
    ReservationModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
