import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { passportJwtSecret } from 'jwks-rsa';
import { ApiConfigService } from '../../api-config/api-config.service';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(
    private readonly authService: AuthService,
    private readonly apiConfigService: ApiConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      audience: apiConfigService.providers.microsoft.clientId,
      issuer:
        'https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0',
      secretOrKeyProvider: passportJwtSecret({
        jwksUri: 'https://login.microsoftonline.com/common/discovery/v2.0/keys',
      }),
    });
  }

  async validate(payload: any): Promise<UserEntity> {
    if (!payload?.oid) {
      throw new UnauthorizedException();
    }

    const user = await this.authService.findUserByMicrosoftId(payload.oid);

    if (!user?.id) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
