import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
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
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '0956732548',
    required: true,
  })
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    example: '1: casual | 2: officer | 3: owner',
    required: true,
  })
  @IsNumber({ allowNaN: true, maxDecimalPlaces: 1 })
  role_id: number;
}
