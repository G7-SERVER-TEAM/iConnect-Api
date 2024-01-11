import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'First Name must has at least 2 characters.' })
  name: string;

  @ApiProperty({
    example: 'Doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Last Name must has at least 2 characters.' })
  surname: string;

  @ApiProperty({
    example: '2023-11-14T03:39:21.210Z',
    required: true,
  })
  @IsDate()
  @IsNotEmpty()
  birth_date: Date;

  @ApiProperty({
    example: 'dev@local.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty({ message: 'Email must not be empty.' })
  email: string;

  @ApiProperty({
    example: '0956732548',
    required: true,
  })
  @MinLength(10, { message: 'Phone number must contain 10 digits.' })
  @MaxLength(10, { message: 'Phone number must contain 10 digits.' })
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    example: '1: Central World',
  })
  @IsNumber()
  area: number;

  @ApiProperty({
    example: '1: casual | 2: officer | 3: owner',
    required: true,
  })
  @IsNumber({ allowNaN: true, maxDecimalPlaces: 1 })
  @IsNotEmpty()
  role_id: number;
}
