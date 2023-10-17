import { Screening } from '@prisma/client';

export class GroupedScreeningDto {
  [date: string]: Screening[];
}
