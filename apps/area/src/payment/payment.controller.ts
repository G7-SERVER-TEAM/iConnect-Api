import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiResponse({
    status: 201,
    description: 'CREATE',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiBearerAuth()
  @Post('/create')
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return {
      status: 201,
      message: 'created',
      result: await this.paymentService.create(createPaymentDto),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'SUCCESS',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiBearerAuth()
  @Get()
  async findAll() {
    return {
      status: 200,
      message: 'success',
      result: await this.paymentService.findAll(),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'SUCCESS',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      status: 200,
      message: 'success',
      result: await this.paymentService.findOne(id),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'UPDATED',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return {
      status: 200,
      message: 'success',
      result: await this.paymentService.update(id, updatePaymentDto),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'DELETED',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      status: 200,
      message: 'deleted',
      result: await this.paymentService.remove(id),
    };
  }
}
