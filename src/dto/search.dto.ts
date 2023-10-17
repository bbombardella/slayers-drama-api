import { IsString, MinLength } from 'class-validator';

export class SearchDto {
  @IsString()
  @MinLength(3)
  query: string;
}
