/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from '../area/entities/area.entity';
import { Price } from '../area/entities/price.entity';
import { CreatePaymentDto } from '../payment/dto/create-payment.dto';
import { PaymentService } from '../payment/payment.service';
import { Payment } from '../payment/entities/payment.entity';
import { Status } from '../payment/enum/status.enum';
import { User } from '../../../user/src/user/entities/user.entity';
import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';
import { LPRData } from './dto/lpr-data.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Area) private readonly areaRepository: Repository<Area>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
    private readonly paymentService: PaymentService,
  ) {}

  generateTransactionID(length) {
    return `TXID${String(length).padStart(6, '0')}`;
  }

  calculateDifferentTime(start_time: Date, end_time: Date): number {
    const timeDifference = end_time.getTime() - start_time.getTime();
    return timeDifference / (1000 * 60 * 60);
  }

  calculateStartAndEndTime(
    start_time: Date,
    end_time: Date,
  ): {
    start_hours: number;
    start_minutes: number;
    end_hours: number;
    end_minutes: number;
  } {
    return {
      start_hours: start_time.getHours(),
      start_minutes: start_time.getMinutes(),
      end_hours: end_time.getHours(),
      end_minutes: end_time.getMinutes(),
    };
  }

  getTimDescription(time: Date): {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
  } {
    return {
      year: time.getFullYear(),
      month: time.getMonth(),
      day: time.getDate(),
      hour: time.getHours(),
      minute: time.getMinutes(),
      second: time.getSeconds(),
      millisecond: time.getMilliseconds(),
    };
  }

  async calculateTotalPrice(transaction_id: string): Promise<number> {
    const transaction: Transaction = await this.transactionRepository.findOneBy(
      { transaction_id },
    );
    const area_id = transaction.area_id;
    const price_id = (await this.areaRepository.findOneBy({ area_id }))
      .price_id;

    const price: Price = await this.priceRepository.findOneBy({
      price_id,
    });
    const values: string = JSON.stringify(price.after);

    const setting: { start_time: string; configuration: any[] } =
      JSON.parse(values);

    const start_time = transaction.start_time;
    const end_time = transaction.end_time;

    let transactionTime = this.calculateStartAndEndTime(start_time, end_time);

    const totalTime: number = this.calculateDifferentTime(start_time, end_time);

    let totalPrice = 0;

    let counter = 0;

    let isNotEnd = true;

    while (counter < setting.configuration.length && isNotEnd) {
      const config = setting.configuration[counter];
      const configurationTime = this.calculateStartAndEndTime(
        new Date(config.start_time),
        new Date(config.end_time),
      );
      console.log(transactionTime);
      console.log(configurationTime);
      // Use Case 1 ✅
      // Rate: 10.00 - 13.00
      // Used: 10.00 - 12.59 = 30

      // Use Case 2 ✅
      // Rate: 10.00 - 13.00, 13.00 - 21.00
      // Used: 10.00 - 15.30 => 10.00 - 13.00, 13.00 - 15.30 = 84

      // Use Case 3 ✅
      // Rate: 10.00 - 13.00
      // Used: 10.00 - 13.00 = 30

      // Use Case 4 ✅
      // Rate: 10.00 - 13.00
      // Used: 10.00 - 10.45 = 0

      // Use Case 5 ✅
      // Rate: 10.00 - 13.00, 13.00 - 15.00
      // Used: 10.00 - 13.30 = 40

      // Use Case 6 ✅
      // Rate: 10.00 - 13.00, 13.00 - 15.00
      // Used: 13.00 - 15.30 = 54

      // Use Case 7 ✅
      // Rate: 10.00 - 13.00, 13.00 - 15.00
      // Used: 10.00 - 14.30 = 62

      if (totalTime < 1) isNotEnd = false;
      else if (
        transactionTime.start_hours === configurationTime.end_hours &&
        transactionTime.start_minutes === configurationTime.start_minutes
      ) {
      } else if (
        // End time equal End time rate but minute digits more than end time rate.
        transactionTime.end_hours === configurationTime.end_hours &&
        transactionTime.end_minutes > configurationTime.end_minutes
      ) {
        const usedTime = this.calculateDifferentTime(
          new Date(config.start_time),
          new Date(config.end_time),
        );
        console.log(usedTime);
        const usedPrice =
          (Math.ceil(usedTime) - 1) * config.rate + config.start;
        console.log(usedPrice);
        totalPrice += usedPrice;
        let splitTime = this.getTimDescription(new Date(config.end_time));
        splitTime = {
          ...splitTime,
          year: end_time.getFullYear(),
          month: end_time.getMonth(),
          day: end_time.getDate(),
        };
        const newDate = new Date(
          splitTime.year,
          splitTime.month,
          splitTime.day,
          splitTime.hour,
          splitTime.minute,
          splitTime.millisecond,
        );
        transactionTime = this.calculateStartAndEndTime(
          newDate,
          transaction.end_time,
        );
      } else if (
        // End time less than End time rate.
        transactionTime.start_hours >= configurationTime.start_hours &&
        transactionTime.start_minutes >= configurationTime.start_minutes &&
        (transactionTime.end_hours < configurationTime.end_hours ||
          transactionTime.end_hours === configurationTime.end_hours) &&
        transactionTime.end_minutes >= configurationTime.end_minutes
      ) {
        console.log(transaction.start_time);
        let splitTime = this.getTimDescription(new Date(config.start_time));
        splitTime = {
          ...splitTime,
          year: end_time.getFullYear(),
          month: end_time.getMonth(),
          day: end_time.getDate(),
        };
        const newDate = new Date(
          splitTime.year,
          splitTime.month,
          splitTime.day,
          splitTime.hour,
          splitTime.minute,
          splitTime.millisecond,
        );
        console.log(newDate);
        console.log(end_time);
        const usedTime = this.calculateDifferentTime(newDate, end_time);
        console.log(usedTime);
        const usedPrice =
          (Math.ceil(usedTime) - 1) * config.rate + config.start;
        console.log(usedPrice);
        console.log(totalPrice);
        totalPrice += usedPrice;
        isNotEnd = false;
      } else if (
        // End time more than End time rate.
        transactionTime.start_hours >= configurationTime.start_hours &&
        transactionTime.start_minutes >= configurationTime.start_minutes &&
        transactionTime.end_hours > configurationTime.end_hours &&
        transactionTime.end_minutes >= configurationTime.end_minutes
      ) {
        const usedTime = this.calculateDifferentTime(
          new Date(config.start_time),
          new Date(config.end_time),
        );
        console.log(usedTime);
        const usedPrice =
          (Math.ceil(usedTime) - 1) * config.rate + config.start;
        console.log(usedPrice);
        totalPrice += usedPrice;
        let splitTime = this.getTimDescription(new Date(config.end_time));
        splitTime = {
          ...splitTime,
          year: end_time.getFullYear(),
          month: end_time.getMonth(),
          day: end_time.getDate(),
        };
        const newDate = new Date(
          splitTime.year,
          splitTime.month,
          splitTime.day,
          splitTime.hour,
          splitTime.minute,
          splitTime.millisecond,
        );
        console.log(new Date(newDate));
        transactionTime = this.calculateStartAndEndTime(
          newDate,
          transaction.end_time,
        );
      }
      counter++;
    }
    return totalPrice;
  }

  async createPayment(transaction_id: string): Promise<Payment> {
    const transaction: Transaction = await this.transactionRepository.findOneBy(
      { transaction_id },
    );
    const uid = transaction.uid;
    const user: User = await this.userRepository.findOneBy({ uid });
    const payment: CreatePaymentDto = {
      total_price: await this.calculateTotalPrice(transaction_id),
      uid: user.uid,
      transaction_id: transaction.transaction_id,
      payment_id: '',
      status: Status.WAITING,
    };
    return await this.paymentService.create(payment);
  }

  async getTransactionBetweenTime(
    start_time: Date,
    end_time: Date,
  ): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: {
        start_time: Between(start_time, end_time),
      },
    });
  }

  async findAllLength() {
    return (await this.findAll()).length + 1;
  }

  findAll() {
    return this.transactionRepository.find();
  }

  findOne(transaction_id: string) {
    return this.transactionRepository.findOneBy({ transaction_id });
  }

  async create(createTransactionDto: CreateTransactionDto) {
    const transaction: Transaction = {
      transaction_id: this.generateTransactionID(await this.findAllLength()),
      area_id: createTransactionDto.area_id,
      uid: createTransactionDto.uid,
      license_plate: createTransactionDto.license_plate,
      status: createTransactionDto.status,
      start_time: createTransactionDto.start_time,
      end_time: createTransactionDto.end_time,
    };
    return this.transactionRepository.save(transaction);
  }

  async updateTransactionAfterScanQRCode(
    createTransactionDto: CreateTransactionDto,
  ) {
    const transaction: Transaction = await this.transactionRepository.findOneBy(
      { transaction_id: createTransactionDto.transaction_id },
    );
    const updateTransaction: Transaction = {
      ...transaction,
      area_id: createTransactionDto.area_id,
      uid: createTransactionDto.uid,
    };
  }

  async generateQRCode(data: LPRData) {
    const transaction: Transaction = {
      transaction_id: await this.generateTransactionID(
        await this.findAllLength(),
      ),
      area_id: data.area_id,
      uid: null,
      license_plate: data.license_plate,
      status: data.status,
      start_time: data.start_time,
      end_time: null,
    };
    try {
      const base64Image = await QRCode.toDataURL(JSON.stringify(data));
      const base64Data = base64Image.replace(/^data:image\/png;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');
      const file = path.join(
        process.cwd(),
        `./apps/area/src/transaction/images/${transaction.transaction_id}.jpeg`,
      );
      console.log(file);
      await fs.writeFileSync(file, imageBuffer, 'binary');

      console.log('PNG file saved successfully:', file);
    } catch (err) {
      console.error(err);
    }
  }

  findQRCodeImage(imageName: string) {
    return `./apps/area/src/transaction/images/${imageName}.jpeg`;
  }

  async update(
    transaction_id: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const transaction: Transaction = await this.transactionRepository.findOneBy(
      { transaction_id },
    );
    const updateTransaction: Transaction = {
      ...transaction,
      status: updateTransactionDto.status,
      end_time: updateTransactionDto.end_time,
    };
    return this.transactionRepository.save(updateTransaction);
  }

  remove(transaction_id: string) {
    return this.transactionRepository.delete(transaction_id);
  }
}
