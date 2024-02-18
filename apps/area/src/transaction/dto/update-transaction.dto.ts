import { PartialType } from '@nestjs/swagger';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsEnum, IsNotEmpty, IsDate } from 'class-validator';
import { Status } from '../enum/status.enum';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @IsEnum(Status)
  @IsNotEmpty()
  status?: Status;

  @IsDate()
  @IsNotEmpty()
  end_time?: Date;
}
