import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenResponseDto } from './dto/token-response.dto';
import { ApiConfigService } from '../api-config/api-config.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
    this.validatePassword(signUp.password, signUp.confirmPassword);

    delete signUp.confirmPassword;

    return new UserEntity(
      await this.prismaService.user.create({
        data: {
          ...signUp,
          email: signUp.email.toLowerCase(),
          password: await this.encryptPassword(signUp.password),
          createdAt: new Date(),
        },
      }),
    );
  }

  private validatePassword(password: string, confirmPassword: string): void {
    if (password !== confirmPassword) {
      throw new ConflictException(
        'Confirm does not correspond to the original password',
      );
    }
  }

  private encryptPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
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

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    currentUser: UserEntity,
  ): Promise<UserEntity> {
    if (currentUser.id !== id) {
      throw new ForbiddenException('Not allowed to edit other users');
    }

    if (updateUserDto.password) {
      this.validatePassword(
        updateUserDto.password,
        updateUserDto.confirmPassword,
      );

      updateUserDto.password = await this.encryptPassword(
        updateUserDto.password,
      );
    }

    delete updateUserDto.confirmPassword;

    if (updateUserDto.email) {
      updateUserDto.email = updateUserDto.email.toLowerCase();
    }

    return new UserEntity(
      await this.prismaService.user.update({
        where: { id },
        data: {
          ...updateUserDto,
          updatedAt: new Date(),
        },
      }),
    );
  }
}
