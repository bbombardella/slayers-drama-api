import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './strategies/google.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MicrosoftStrategy } from "./strategies/microsoft.strategy";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    GoogleStrategy,
    MicrosoftStrategy,
    RefreshStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
