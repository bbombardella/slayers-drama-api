import { IsNotEmpty, IsString, IsDate } from 'class-validator';

export class GenreDto {
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    @IsString()
    title: string;
}
