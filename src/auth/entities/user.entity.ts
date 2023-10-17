import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @Exclude()
  password: string;

  @ApiProperty()
  googleId: string | null;

  @ApiProperty()
  microsoftId: string | null;

  @Exclude()
  refreshToken: string | null;

  @ApiProperty()
  role: 'USER' | 'ADMIN';

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
