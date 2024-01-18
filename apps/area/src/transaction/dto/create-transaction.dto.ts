import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Status } from '../enum/status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    name: 'Transaction id',
    description: 'It receive only characters.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  transaction_id: string;

  @ApiProperty({
    name: 'Area id',
    description: 'It receive only number.',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  area_id: number;

  @ApiProperty({
    name: 'UID',
    description: 'It receive only number.',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  uid: number;

  @ApiProperty({
    name: 'License Plate',
    description: 'It receive only characters.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  license_plate: string;

  @ApiProperty({
    name: 'Parking Status',
    description:
      'It receive only characters and that contain in a enum collection.',
    enum: Status,
    required: true,
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @ApiProperty({
    name: 'Start time',
    description: 'It receive only timestamp.',
    required: true,
  })
  @IsDate()
  @IsNotEmpty()
  start_time: Date;

  @ApiProperty({
    name: 'End time',
    description: 'It receive only timestamp.',
    required: true,
  })
  @IsDate()
  @IsNotEmpty()
  end_time: Date;
}
