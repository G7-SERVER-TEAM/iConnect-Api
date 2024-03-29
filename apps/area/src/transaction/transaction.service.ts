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
import { Status as PaymentStatus } from '../payment/enum/status.enum';
import { Status as TransactionStatus } from './enum/status.enum';
import { User } from '../../../user/src/user/entities/user.entity';
import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';
import { LPRData } from './dto/lpr-data.dto';
import { UpdateAfterQRCode } from './dto/update-after-qr.dto';
import { SearchHistory } from './dto/search-history.dto';
import { UserService } from '../../../user/src/user/user.service';

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
    private readonly userService: UserService,
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

  async calculateCurrentPrice(
    transaction_id: string,
  ): Promise<{ totalPrice: number; currentRate: number }> {
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
    const end_time = new Date();

    console.log({ start_time, end_time });

    let totalTime: number = this.calculateDifferentTime(start_time, end_time);

    console.log(totalTime);
    let totalPrice = 0;

    let counter = 0;

    let isNotEnd = true;
    let currentRate = 0;

    while (counter < setting.configuration.length && isNotEnd) {
      const config = setting.configuration[counter];
      const start_hour = config.start_hour;
      const end_hour = config.end_hour;
      const rate = config.rate;

      console.log(`Round: ${counter}`);

      console.log({ start_hour, end_hour });

      if (totalTime > end_hour) {
        const diff = end_hour - start_hour;
        totalPrice += diff * rate;
        totalTime -= diff;
        currentRate = rate;
        console.log({ counter, totalTime, totalPrice });
      } else if (end_hour > totalTime) {
        if (counter !== 0) {
          totalPrice += Math.ceil(totalTime) * rate;
          currentRate = rate;
        } else {
          const diff = totalTime - start_hour;
          totalPrice += diff * rate;
          isNotEnd = false;
          currentRate = rate;
        }
        console.log({ counter, totalTime, totalPrice });
      } else if (totalTime == end_hour) {
        const diff = end_hour - start_hour;
        totalPrice += diff * rate;
        currentRate = rate;
      }
      counter++;
    }
    return {
      totalPrice: totalPrice,
      currentRate: currentRate,
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

    console.log({ start_time, end_time });

    let totalTime: number = this.calculateDifferentTime(start_time, end_time);

    console.log(totalTime);
    let totalPrice = 0;

    let counter = 0;

    let isNotEnd = true;

    while (counter < setting.configuration.length && isNotEnd) {
      const config = setting.configuration[counter];
      const start_hour = config.start_hour;
      const end_hour = config.end_hour;
      const rate = config.rate;

      console.log(`Round: ${counter}`);

      console.log({ start_hour, end_hour });

      if (totalTime > end_hour) {
        const diff = end_hour - start_hour;
        totalPrice += diff * rate;
        totalTime -= diff;
        console.log({ counter, totalTime, totalPrice });
      } else if (end_hour > totalTime) {
        if (counter !== 0) {
          totalPrice += Math.ceil(totalTime) * rate;
        } else {
          const diff = totalTime - start_hour;
          totalPrice += diff * rate;
          isNotEnd = false;
        }
        console.log({ counter, totalTime, totalPrice });
      } else if (totalTime == end_hour) {
        const diff = end_hour - start_hour;
        totalPrice += diff * rate;
      }
      counter++;
    }
    return totalPrice;
  }

  async createPayment(transaction_id: string): Promise<Payment> {
    const transaction: Transaction = await this.transactionRepository.findOneBy(
      { transaction_id },
    );
    const user: User = await this.userService.findByUID(transaction.uid);
    console.log(user);
    const payment: CreatePaymentDto = {
      total_price: await this.calculateTotalPrice(transaction_id),
      uid: user.uid,
      transaction_id: transaction.transaction_id,
      payment_id: '',
      status: PaymentStatus.WAITING,
    };
    return await this.paymentService.create(payment);
  }

  async createCashPayment(transaction_id: string): Promise<Payment> {
    const transaction: Transaction = await this.transactionRepository.findOneBy(
      { transaction_id },
    );
    const user: User = await this.userService.findByUID(transaction.uid);
    const payment: CreatePaymentDto = {
      total_price: await this.calculateTotalPrice(transaction_id),
      uid: user.uid,
      transaction_id: transaction.transaction_id,
      payment_id: '',
      status: PaymentStatus.WAITING,
    };
    return await this.paymentService.createWithCash(payment);
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

  async findAllComplete(uid: number, data: SearchHistory) {
    const completeTransaction: Transaction[] =
      await this.transactionRepository.find({
        where: {
          uid: uid,
          status: data.status,
        },
      });
    const modifyCompleteTransaction: Promise<Transaction[]> = Promise.all(
      completeTransaction.map(async (transaction) => {
        const area = await this.areaRepository.findOneBy({
          area_id: transaction.area_id,
        });
        return {
          ...transaction,
          area_id: area?.area_id,
        };
      }),
    );
    return modifyCompleteTransaction;
  }

  async findOneByStatusAndUID(uid: number, data: SearchHistory) {
    const transaction: Transaction = await this.transactionRepository.findOneBy(
      {
        uid: uid,
        status: data.status,
      },
    );
    const area: Area = await this.areaRepository.findOneBy({
      area_id: transaction.area_id,
    });
    return {
      ...transaction,
      area_id: area.area_id,
    };
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
    id: string,
    transactionData: UpdateAfterQRCode,
  ) {
    const transaction: Transaction = await this.transactionRepository.findOneBy(
      { transaction_id: id },
    );
    const updateTransaction: Transaction = {
      ...transaction,
      uid: transactionData.uid,
    };
    return this.transactionRepository.save(updateTransaction);
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

    const newData = {
      ...data,
      transaction_id: transaction.transaction_id,
    };

    try {
      const base64Image = await QRCode.toDataURL(JSON.stringify(newData));
      const base64Data = base64Image.replace(/^data:image\/png;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');
      // Specify the directory path where the JPEG image will be saved
      const directory = path.join(
        process.cwd(),
        './apps/area/src/transaction/images/',
      );

      // Create the directory if it doesn't exist
      await fs.promises.mkdir(directory, { recursive: true });

      // Specify the file path including the directory
      const file = path.join(directory, `${transaction.transaction_id}.jpeg`);

      console.log(file);

      await fs.promises.writeFile(file, imageBuffer, 'binary');

      console.log('JPEG file saved successfully:', file);

      return this.transactionRepository.save(transaction);
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
