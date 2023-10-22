import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { ApiConfigService } from '../../api-config/api-config.service';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly authService: AuthService,
    private readonly apiConfigService: ApiConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: apiConfigService.providers.jwt.refreshSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any): Promise<UserEntity> {
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    if (!payload?.username || !accessToken) {
      throw new UnauthorizedException();
    }

    const user = await this.authService.validateRefreshToken(
      payload.username,
      accessToken,
    );

    if (!user?.id) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
