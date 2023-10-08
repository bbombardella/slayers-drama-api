import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '@prisma/client';

import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      audience: process.env.MICROSOFT_CLIENT_ID,
      issuer: 'https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0',
      secretOrKeyProvider: passportJwtSecret({
        jwksUri: 'https://login.microsoftonline.com/common/discovery/v2.0/keys',
      }),
    });
  }

  async validate(payload: any): Promise<User> {
    if (!payload?.sub) {
      throw new UnauthorizedException();
    }

    const user = await this.authService.findUserByMicrosoftId(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
