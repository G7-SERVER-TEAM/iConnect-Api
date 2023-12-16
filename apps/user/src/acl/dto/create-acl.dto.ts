import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAclDto {
  @ApiProperty({
    example: 'Login',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2, { message: 'The acl name must contain at least 2 characters.' })
  @MaxLength(30, { message: 'The acl name must contain lower 30 characters.' })
  acl_name: string;
}
