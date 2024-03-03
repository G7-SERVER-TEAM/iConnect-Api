import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@UseGuards(AuthGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiBearerAuth()
  @Get()
  async findAllAccount() {
    const res: JSON = <JSON>(<unknown>{
      status: 200,
      message: 'success',
      result: await this.accountService.findAll(),
    });
    return res;
  }

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiBearerAuth()
  @Get('/id/:id')
  async findByAccountId(@Param('id') id: string) {
    const account: Account | null = await this.accountService.findById(+id);
    const res: JSON = <JSON>(<unknown>{
      status: 200,
      message: 'success',
      findBy: 'id',
      result: account != null ? account : [],
    });
    return res;
  }

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiBearerAuth()
  @Get('/uid/:id')
  async findByUid(@Param('id') id: string) {
    const account: Account | null = await this.accountService.findByUid(id);
    const res: JSON = <JSON>(<unknown>{
      status: 200,
      message: 'success',
      findBy: 'id',
      result: account != null ? account : [],
    });
    return res;
  }

  @Public()
  @ApiResponse({
    status: 201,
    description: 'This account has been successfully created.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiBody({
    type: CreateAccountDto,
  })
  @Post('/create')
  async createProfile(@Body() account: CreateAccountDto) {
    const res: JSON = <JSON>(<unknown>{
      status: 201,
      message: 'success',
      result: await this.accountService.create(account),
    });
    return res;
  }

  @ApiResponse({
    status: 204,
    description: 'This account has been successfully updated.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiBody({
    type: UpdateAccountDto,
  })
  @ApiBearerAuth()
  @Patch('/update/:id')
  async update(@Param('id') id: string, @Body() account: UpdateAccountDto) {
    const res: JSON = <JSON>(<unknown>{
      status: 204,
      message: 'success',
      findBy: 'id',
      result: await this.accountService.update(+id, account),
    });
    return res;
  }

  @ApiResponse({
    status: 200,
    description: 'This account has been successfully deleted.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiBearerAuth()
  @Delete('/delete/:id')
  async removeProfile(@Param('id') id: string) {
    const res: JSON = <JSON>(<unknown>{
      status: 200,
      message: 'success',
      findBy: 'id',
      result: await this.accountService.remove(+id),
    });
    return res;
  }
}
