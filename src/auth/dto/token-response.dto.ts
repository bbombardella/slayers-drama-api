import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class TokenResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;

  @ApiProperty({ type: UserEntity })
  user: Omit<UserEntity, 'password' | 'refreshToken'>;
}
