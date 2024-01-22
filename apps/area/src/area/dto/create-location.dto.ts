import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty({ message: 'Area name should not be empty.' })
  area_name: string;

  @IsString()
  @IsNotEmpty()
  house_number: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsNumber()
  @IsNotEmpty()
  district: number;

  @IsNumber()
  @IsNotEmpty()
  city: number;

  @IsNumber()
  @IsNotEmpty()
  province: number;

  @IsNumber()
  @IsNotEmpty()
  zip_code: number;
}
