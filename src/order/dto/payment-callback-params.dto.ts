import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentCallbackParamsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sessionId: string;
}
