import { IsEnum, IsJSON, IsNotEmpty, IsNumber } from 'class-validator';
import { Status } from '../enum/status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { price } from '../mock/load.data';

export class CreatePriceDTO {
  @ApiProperty({
    example: '1',
    required: true,
    name: 'price_id',
  })
  @IsNumber()
  @IsNotEmpty()
  price_id: number;

  @ApiProperty({
    enum: Status,
    example: 'ACTIVE | INACTIVE',
    required: true,
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @ApiProperty({
    example: price.after,
    required: true,
  })
  @IsJSON()
  @IsNotEmpty()
  after: JSON;
}
