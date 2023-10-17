import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  query: string;
}
