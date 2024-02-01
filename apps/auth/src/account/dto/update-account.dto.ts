import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAccountDto } from './create-account.dto';
import {
  IsNotEmpty,
  IsStrongPassword,
  Matches,
  MinLength,
} from 'class-validator';

const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
  @ApiProperty({
    example: 'dev',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5, { message: 'Username must has at least 5 characters.' })
  username: string;

  @ApiProperty({
    example: 'P@ssw0rd',
    required: true,
  })
  @IsStrongPassword()
  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 and maximum 20 characters, 
      at least one uppercase letter, 
      one lowercase letter, 
      one number and 
      one special character`,
  })
  password: string;
}
