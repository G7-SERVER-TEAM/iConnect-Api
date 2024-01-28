import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({
    example: 'ฟิวเจอร์พาร์ค รังสิต',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Area name should not be empty.' })
  area_name: string;

  @ApiProperty({
    example: '94',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  house_number: string;

  @ApiProperty({
    example: 'พหลโยธิน',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({
    example: 304,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  district: number;

  @ApiProperty({
    example: 65,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  city: number;

  @ApiProperty({
    example: 4,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  province: number;

  @ApiProperty({
    example: 43,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  zip_code: number;
}
