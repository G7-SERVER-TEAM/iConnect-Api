import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    example: 'Business Analysis',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Role name must has at least 2 characters.' })
  @MaxLength(30)
  role_name: string;

  @ApiProperty({
    example: [1, 2, 3],
    required: true,
  })
  @IsArray()
  acls: JSON;
}
