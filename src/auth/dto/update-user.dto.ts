import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  googleId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  microsoftId?: string;
}
