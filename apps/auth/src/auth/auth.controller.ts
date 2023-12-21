import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { Public } from './decorators/public.decorator';
import { AccountService } from '../account/account.service';
import { CreateAccountDto } from '../account/dto/create-account.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private accountService: AccountService,
  ) {}

  @Public()
  @ApiResponse({
    status: 200,
    description: 'Login success.',
  })
  @ApiBody({
    type: SignInDto,
  })
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
  }

  @Public()
  @ApiResponse({
    status: 201,
    description: 'This account has been successfully created.',
  })
  @ApiBody({
    type: CreateAccountDto,
  })
  @Post('sign-up')
  async signUp(@Body() account: CreateAccountDto) {
    return await this.accountService.create(account);
  }
}
