import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Status } from '../enum/status.enum';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  payment_id: string;

  @IsNumber()
  @IsNotEmpty()
  total_price: number;

  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @IsNumber()
  @IsNotEmpty()
  uid: number;

  @IsString()
  @IsNotEmpty()
  transaction_id: string;
}
