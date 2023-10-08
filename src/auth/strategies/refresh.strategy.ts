import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { User } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any): Promise<User> {
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    if (!payload?.username || !accessToken) {
      throw new UnauthorizedException();
    }

    const user = await this.authService.validateRefreshToken(
      payload.username,
      accessToken,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
