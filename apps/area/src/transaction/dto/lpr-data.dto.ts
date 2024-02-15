import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDate,
  IsNumber,
} from 'class-validator';
import { Status } from '../enum/status.enum';

export class LPRData {
  @ApiProperty({
    name: 'license_plate',
    description: 'It receive only characters.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  license_plate: string;

  @ApiProperty({
    name: 'area_id',
    description: 'It receive only number.',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  area_id: number;

  @ApiProperty({
    name: 'status',
    description:
      'It receive only characters and that contain in a enum collection.',
    enum: Status,
    required: true,
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @ApiProperty({
    name: 'start_time',
    description: 'It receive only timestamp.',
    required: true,
  })
  @IsDate()
  @IsNotEmpty()
  start_time: Date;
}
