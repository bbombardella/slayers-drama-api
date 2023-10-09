import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '@prisma/client';
import { AuthService } from '../auth.service';
import { ApiConfigService } from '../../api-config/api-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly apiConfigService: ApiConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: apiConfigService.providers.jwt.secret,
    });
  }

  async validate(payload: any): Promise<User> {
    if (!payload?.username) {
      throw new UnauthorizedException();
    }

    const user = await this.authService.findUserByEmail(payload.username);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
