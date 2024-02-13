import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from '../../../auth/src/auth/auth.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SearchDate } from '../payment/dto/search-date.dto';

@UseGuards(AuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiResponse({
    status: 201,
    description: 'CREATED',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiBearerAuth()
  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    return {
      status: 201,
      message: 'created',
      result: await this.transactionService.create(createTransactionDto),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Get()
  async findAll() {
    return {
      status: 200,
      message: 'success',
      result: await this.transactionService.findAll(),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      status: 200,
      message: 'success',
      result: await this.transactionService.findOne(id),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiBearerAuth()
  @Get('/find/date')
  async getTransactionByDate(@Body() searchDate: SearchDate) {
    return {
      status: 200,
      message: 'success',
      result: await this.transactionService.getTransactionBetweenTime(
        searchDate.start_time,
        searchDate.end_time,
      ),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiBearerAuth()
  @Get('/price/:id')
  async getTotalPrice(@Param('id') id: string) {
    return {
      status: 200,
      message: 'success',
      result: await this.transactionService.calculateTotalPrice(id),
    };
  }

  @ApiResponse({
    status: 201,
    description: 'CREATED',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiBearerAuth()
  @Post('/payment/create/:id')
  async createBillForPayment(@Param('id') id: string) {
    return {
      status: 201,
      message: 'created',
      result: await this.transactionService.createPayment(id),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'UPDATED',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return {
      status: 200,
      message: 'updated',
      result: await this.transactionService.update(id, updateTransactionDto),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'DELETED',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      status: 200,
      message: 'deleted',
      result: await this.transactionService.remove(id),
    };
  }
}
