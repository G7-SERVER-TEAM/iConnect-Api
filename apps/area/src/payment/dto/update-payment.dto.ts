import { PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from './create-payment.dto';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Status } from '../enum/status.enum';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @IsNumber()
  @IsNotEmpty()
  total_price?: number;

  @IsEnum(Status)
  @IsNotEmpty()
  status?: Status;

  @IsNumber()
  @IsNotEmpty()
  uid?: number;

  @IsString()
  @IsNotEmpty()
  transaction_id?: string;
}
