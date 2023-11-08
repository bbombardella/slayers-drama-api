import { PartialType } from '@nestjs/swagger';
import { CreateScreeningDto } from './create-screening.dto';

export class UpdateScreeningDto extends PartialType(CreateScreeningDto) {}
