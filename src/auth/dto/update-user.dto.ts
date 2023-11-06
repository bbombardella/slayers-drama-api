import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  googleId?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  microsoftId?: string;
}
