import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCinemaDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  city: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
