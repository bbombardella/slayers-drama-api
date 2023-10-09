import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

import * as bcrypt from 'bcrypt';
import { SignUpDto } from './models/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenResponse } from './models/token-response.model';
import { ApiConfigService } from '../api-config/api-config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly apiConfigService: ApiConfigService,
  ) {}

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.prismaService.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findUserByGoogleId(id: string): Promise<User | undefined> {
    return this.prismaService.user.findUnique({
      where: { googleId: id },
    });
  }

  async findUserByMicrosoftId(id: string): Promise<User | undefined> {
    return this.prismaService.user.findUnique({
      where: { microsoftId: id },
    });
  }

  async signUp(signUp: SignUpDto): Promise<User> {
    if (signUp.password !== signUp.confirmPassword) {
      throw new ConflictException(
        'Confirm does not correspond to the original password',
      );
    }

    return this.prismaService.user.create({
      data: {
        email: signUp.email.toLowerCase(),
        password: await bcrypt.hash(signUp.password, 10),
        createdAt: new Date(),
      },
    });
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<User | undefined> {
    const user = await this.findUserByEmail(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async validateRefreshToken(
    username: string,
    token: string,
  ): Promise<User | undefined> {
    const user = await this.findUserByEmail(username);

    if (
      user?.refreshToken &&
      (await bcrypt.compare(token, user.refreshToken))
    ) {
      return user;
    }

    return null;
  }

  async login(user: User): Promise<TokenResponse> {
    const [accessToken, refreshTokenOriginal] = await Promise.all([
      this.jwtService.signAsync(this.getUserPayloadToken(user)),
      this.jwtService.signAsync(this.getUserPayloadToken(user), {
        secret: this.apiConfigService.providers.jwt.refreshSecret,
      }),
    ]);

    user = await this.prismaService.user.update({
      data: {
        refreshToken: await bcrypt.hash(refreshTokenOriginal, 10),
      },
      where: {
        id: user.id,
      },
    });

    const { password, refreshToken, ...userInfo } = user;

    return {
      access_token: accessToken,
      refresh_token: refreshTokenOriginal,
      user: userInfo,
    };
  }

  async logout(user: User): Promise<void> {
    await this.prismaService.user.update({
      data: {
        refreshToken: null,
      },
      where: {
        id: user.id,
      },
    });
  }

  private getUserPayloadToken(user: User): { id: number; username: string } {
    return { id: user.id, username: user.email };
  }
}
