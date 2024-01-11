import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches } from 'class-validator';

const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;

export class SignInWithEmailDto {
  @ApiProperty({
    example: 'dev@local.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'P@ssw0rd',
    required: true,
  })
  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 and maximum 20 characters, 
      at least one uppercase letter, 
      one lowercase letter, 
      one number and 
      one special character`,
  })
  password: string;
}
