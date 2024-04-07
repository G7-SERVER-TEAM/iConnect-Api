import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from '../../../auth/src/auth/auth.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SearchDate } from './dto/search-date.dto';
import { LPRData } from './dto/lpr-data.dto';
import * as fs from 'fs';
import { UpdateAfterQRCode } from './dto/update-after-qr.dto';
import { PaymentService } from '../payment/payment.service';
import { SearchHistory } from './dto/search-history.dto';

@UseGuards(AuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly paymentService: PaymentService,
  ) {}

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
    status: 201,
    description: 'CREATED',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiBearerAuth()
  @Post('/qrcode/create')
  async createQRCode(@Body() lpr: LPRData) {
    return {
      status: 201,
      message: 'created',
      result: await this.transactionService.generateQRCode(lpr),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Get('/qrcode/:imageName')
  async getQRCode(@Param('imageName') imageName: string, @Res() res) {
    const image = this.transactionService.findQRCodeImage(imageName);
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
    description: 'OK.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Patch('/qrcode/update/:id')
  async updateTransactionAfterQRCodeValidation(
    @Param('id') id: string,
    @Body() data: UpdateAfterQRCode,
  ) {
    return {
      status: 200,
      message: 'updated',
      result: await this.transactionService.updateTransactionAfterScanQRCode(
        id,
        data,
      ),
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
  @Post('/allcomplete')
  async findAllTransactionComplete(@Body() data: SearchHistory) {
    return {
      status: 201,
      message: 'success',
      result:
        await this.transactionService.findAllTransactionWhenComplete(data),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Get('/allUser')
  async findAllUser() {
    return {
      status: 200,
      message: 'success',
      result: await this.transactionService.findAllUserPerYear(),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Get('/overview')
  async sendOverview() {
    return {
      status: 200,
      message: 'success',
      result: await this.transactionService.showOverview(),
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
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Post('/progress/:id')
  async findOneByUIDAndStatus(
    @Param('id') id: number,
    @Body() data: SearchHistory,
  ) {
    return {
      status: 200,
      message: 'success',
      result: await this.transactionService.findOneByStatusAndUID(id, data),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Post('/history/:id')
  async findHistory(@Param('id') id: number, @Body() data: SearchHistory) {
    return {
      status: 200,
      message: 'success',
      result: await this.transactionService.findAllComplete(id, data),
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
      result: await this.transactionService.calculateCurrentPrice(id),
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
  @Get('/price/complete/:id')
  async getTotalCompletePrice(@Param('id') id: string) {
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
  async createBillForQRCodePayment(@Param('id') id: string) {
    return {
      status: 200,
      message: 'success',
      result: await this.transactionService.createPayment(id),
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
  @Post('/payment/cash/create/:id')
  async createBillForCashPayment(@Param('id') id: string) {
    return {
      status: 201,
      message: 'created',
      result: await this.transactionService.createCashPayment(id),
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

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Get('/current/update/after/:id')
  async getCurrentAfterUpdatePrice(@Param('id') id: string) {
    return {
      status: 200,
      message: 'success',
      result:
        await this.transactionService.getNumberOfCurrentTransactionAfterUpdatePrice(
          id,
        ),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Get('/current/update/before/:id')
  async getCurrentBeforeUpdatePrice(@Param('id') id: string) {
    return {
      status: 200,
      message: 'success',
      result:
        await this.transactionService.getNumberOfCurrentTransactionBeforeUpdatePrice(
          id,
        ),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Get('/current/max/transaction')
  async getMaxTransactionPerTime() {
    return {
      status: 200,
      message: 'success',
      result: await this.transactionService.getMaxTransactionPerTime(),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Get('/current/min/transaction')
  async getMinTransactionPerTime() {
    return {
      status: 200,
      message: 'success',
      result: await this.transactionService.getMinTransactionPerTime(),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Get('/current/user')
  async getCurrentUserInDay() {
    return {
      status: 200,
      message: 'success',
      result: await this.transactionService.getCurrentUserInDay(),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Get('/current/max/usage')
  async getMaxUsageTransaction() {
    return {
      status: 200,
      message: 'success',
      result: await this.transactionService.getMaxUsageTransaction(),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Get('/current/usage/transaction')
  async getTransactionPerHour() {
    return {
      status: 200,
      message: 'success',
      result: await this.transactionService.getTransactionPerHour(),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Get('/current/configuration/rate')
  async getPriceConfigurationRate() {
    return {
      status: 200,
      message: 'success',
      result: await this.transactionService.getPriceConfigurationRate(),
    };
  }
}
