import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenResponseDto } from './dto/token-response.dto';
import { ApiConfigService } from '../api-config/api-config.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly apiConfigService: ApiConfigService,
  ) {}

  async findUserByEmail(email: string): Promise<UserEntity | undefined> {
    return new UserEntity(
      await this.prismaService.user.findUnique({
        where: { email: email.toLowerCase() },
      }),
    );
  }

  async findUserByGoogleId(id: string): Promise<UserEntity | undefined> {
    return new UserEntity(
      await this.prismaService.user.findUnique({
        where: { googleId: id },
      }),
    );
  }

  async findUserByMicrosoftId(id: string): Promise<UserEntity | undefined> {
    return new UserEntity(
      await this.prismaService.user.findUnique({
        where: { microsoftId: id },
      }),
    );
  }

  async signUp(signUp: CreateUserDto): Promise<UserEntity> {
    if (signUp.password !== signUp.confirmPassword) {
      throw new ConflictException(
        'Confirm does not correspond to the original password',
      );
    }

    return new UserEntity(
      await this.prismaService.user.create({
        data: {
          firstName: signUp.firstName,
          lastName: signUp.lastName,
          email: signUp.email.toLowerCase(),
          password: await bcrypt.hash(signUp.password, 10),
          createdAt: new Date(),
        },
      }),
    );
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserEntity | undefined> {
    const user = await this.findUserByEmail(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      return new UserEntity(user);
    }

    return null;
  }

  async validateRefreshToken(
    username: string,
    token: string,
  ): Promise<UserEntity | undefined> {
    const user = await this.findUserByEmail(username);

    if (
      user?.refreshToken &&
      (await bcrypt.compare(token, user.refreshToken))
    ) {
      return new UserEntity(user);
    }

    return null;
  }

  async login(user: UserEntity): Promise<TokenResponseDto> {
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

    return {
      access_token: accessToken,
      refresh_token: refreshTokenOriginal,
      user: new UserEntity(user),
    };
  }

  async logout(user: UserEntity): Promise<void> {
    await this.prismaService.user.update({
      data: {
        refreshToken: null,
      },
      where: {
        id: user.id,
      },
    });
  }

  private getUserPayloadToken(user: UserEntity): {
    id: number;
    username: string;
  } {
    return { id: user.id, username: user.email };
  }
}
