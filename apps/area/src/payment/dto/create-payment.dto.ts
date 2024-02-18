import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Status } from '../enum/status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    name: 'payment_id',
    description: 'It can generate automation when use it.',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  payment_id: string;

  @ApiProperty({
    name: 'total_price',
    description: 'It receive only number.',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  total_price: number;

  @ApiProperty({
    name: 'payment_status',
    description:
      'It receive only characters and that contain in a enum collection.',
    enum: Status,
    required: true,
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @ApiProperty({
    name: 'UID',
    description: 'It receive only number.',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  uid: number;

  @ApiProperty({
    name: 'Transaction id',
    description: 'It receive only characters.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  transaction_id: string;
}
