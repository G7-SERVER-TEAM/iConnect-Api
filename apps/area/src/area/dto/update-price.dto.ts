import { IsDate, IsEnum, IsJSON, IsNotEmpty } from 'class-validator';
import { Status } from '../enum/status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { priceConfig } from '../mock/load.data';

export class UpdatePriceDTO {
  @ApiProperty({
    enum: Status,
    example: 'ACTIVE | INACTIVE',
    required: true,
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @ApiProperty({
    example: '2023-11-14T03:39:21.210Z',
    required: true,
  })
  @IsDate()
  @IsNotEmpty()
  start_time: Date;

  @ApiProperty({
    example: priceConfig,
    required: true,
  })
  @IsJSON()
  @IsNotEmpty()
  configuration: JSON;
}
