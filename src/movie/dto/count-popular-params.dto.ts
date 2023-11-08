import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsPositive, Max } from 'class-validator';

export class CountPopularParamsDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Max(25)
  count: number;
}
