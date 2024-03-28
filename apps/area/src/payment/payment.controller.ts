import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../../../auth/src/auth/auth.guard';
import * as fs from 'fs';
import { Public } from '../../../auth/src/auth/decorators/public.decorator';

@UseGuards(AuthGuard)
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
  async update(@Param('id') id: string) {
    return {
      status: 200,
      message: 'success',
      result: await this.paymentService.update(id),
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

  @Public()
  @ApiResponse({
    status: 200,
    description: 'DELETED',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiBearerAuth()
  @Get('/qrcode/:paymentId')
  async getPaymentImage(@Param('paymentId') paymentId: string, @Res() res) {
    const image = this.paymentService.findQRCodeImage(paymentId);
    try {
      // Check if the image file exists
      if (fs.existsSync(image)) {
        // Set the appropriate content type for the image
        res.setHeader('Content-Type', 'image/jpeg');

        // Read the image file and send it as the response
        fs.createReadStream(image).pipe(res);
      } else {
        // If the image file does not exist, return a 404 error
        res.status(HttpStatus.NOT_FOUND).send('Image not found');
      }
    } catch (error) {
      // Handle other errors, if any
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
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
  @Get('/total/income/:month')
  async getTotalInCome(@Param('month') month: string) {
    return {
      status: 200,
      message: 'success',
      result: await this.paymentService.calculateTotalInCome(+month),
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
  @Get('/total/income/day/:month')
  async getTotalInComePerDay(@Param('month') month: string) {
    return {
      status: 200,
      message: 'success',
      result: await this.paymentService.calculateInComePerDay(+month),
    };
  }
}
