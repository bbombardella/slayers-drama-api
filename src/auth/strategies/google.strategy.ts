import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '@prisma/client';

import { passportJwtSecret } from 'jwks-rsa';
import { ApiConfigService } from '../../api-config/api-config.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly apiConfigService: ApiConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      audience: apiConfigService.providers.google.clientId,
      issuer: 'https://accounts.google.com',
      secretOrKeyProvider: passportJwtSecret({
        jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
      }),
    });
  }

  async validate(payload: any): Promise<User> {
    if (!payload?.sub) {
      throw new UnauthorizedException();
    }

    const user = await this.authService.findUserByGoogleId(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
