/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { Between, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from '../area/entities/area.entity';
import { Price } from '../area/entities/price.entity';
import { CreatePaymentDto } from '../payment/dto/create-payment.dto';
import { PaymentService } from '../payment/payment.service';
import { Payment } from '../payment/entities/payment.entity';
import { Status as PaymentStatus } from '../payment/enum/status.enum';
import { Status, Status as TransactionStatus } from './enum/status.enum';
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
    const endTimeMilliseconds = new Date().getTime();
    const UTC7OffsetMilliseconds = 7 * 60 * 60 * 1000;
    const end_time = new Date(endTimeMilliseconds + UTC7OffsetMilliseconds);

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
    const updateTransaction = {
      ...transaction,
      price: await this.calculateTotalPrice(transaction_id),
    };
    const user: User = await this.userService.findByUID(transaction.uid);
    const payment: CreatePaymentDto = {
      total_price: await this.calculateTotalPrice(transaction_id),
      uid: user.uid,
      transaction_id: transaction.transaction_id,
      payment_id: '',
      status: PaymentStatus.WAITING,
    };
    await this.transactionRepository.save(updateTransaction);
    return await this.paymentService.create(payment);
  }

  async createCashPayment(transaction_id: string): Promise<Payment> {
    const transaction: Transaction = await this.transactionRepository.findOneBy(
      { transaction_id },
    );
    const updateTransaction = {
      ...transaction,
      price: await this.calculateTotalPrice(transaction_id),
    };
    const user: User = await this.userService.findByUID(transaction.uid);
    const payment: CreatePaymentDto = {
      total_price: await this.calculateTotalPrice(transaction_id),
      uid: user.uid,
      transaction_id: transaction.transaction_id,
      payment_id: '',
      status: PaymentStatus.WAITING,
    };
    await this.transactionRepository.save(updateTransaction);
    return await this.paymentService.createWithCash(payment);
  }

  async getTransactionBetweenTime(start_time: Date, end_time: Date) {
    const transaction: Transaction[] = await this.transactionRepository.find({
      where: {
        start_time: Between(start_time, end_time),
      },
    });
    return transaction.length;
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
    const startTimeMilliseconds = new Date(
      createTransactionDto.start_time,
    ).getTime();
    const endTimeMilliseconds = new Date(
      createTransactionDto.end_time,
    ).getTime();
    const UTC7OffsetMilliseconds = 7 * 60 * 60 * 1000;
    const startDateInUTC7 = new Date(
      startTimeMilliseconds + UTC7OffsetMilliseconds,
    );
    const endDateInUTC7 = new Date(
      endTimeMilliseconds + UTC7OffsetMilliseconds,
    );
    const transaction: Transaction = {
      transaction_id: this.generateTransactionID(await this.findAllLength()),
      area_id: createTransactionDto.area_id,
      uid: createTransactionDto.uid,
      license_plate: createTransactionDto.license_plate,
      status: createTransactionDto.status,
      start_time: startDateInUTC7,
      end_time: endDateInUTC7,
      price: null,
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
    const startTimeMilliseconds = new Date(data.start_time).getTime();

    const UTC7OffsetMilliseconds = 7 * 60 * 60 * 1000;
    const startDateInUTC7 = new Date(
      startTimeMilliseconds + UTC7OffsetMilliseconds,
    );
    const transaction: Transaction = {
      transaction_id: await this.generateTransactionID(
        await this.findAllLength(),
      ),
      area_id: data.area_id,
      uid: null,
      license_plate: data.license_plate,
      status: data.status,
      start_time: startDateInUTC7,
      end_time: null,
      price: null,
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
    const endTimeMilliseconds = new Date(
      updateTransactionDto.end_time,
    ).getTime();
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

  async findAllTransactionWhenComplete(data: SearchHistory) {
    const completeTransaction: Transaction[] =
      await this.transactionRepository.find({
        where: {
          status: data.status,
        },
      });
    return completeTransaction;
  }

  async findAllUserPerYear() {
    const currentDate = this.getTimDescription(new Date());
    const transactions: Transaction[] = await this.transactionRepository.find({
      where: {
        start_time: Between(
          new Date(currentDate.year, 0, 1, 0, 0, 0, 0),
          new Date(currentDate.year, 11, 31, 23, 59, 59, 59),
        ),
      },
    });
    // eslint-disable-next-line prefer-const
    let totalUser = [];
    transactions.forEach((transaction) => {
      if (!totalUser.includes(transaction.uid)) totalUser.push(transaction.uid);
    });
    return totalUser.length;
  }

  isLeapYear(year: number): boolean {
    if (year % 4 === 0) {
      if (year % 100 === 0) {
        return year % 400 === 0;
      }
      return true;
    }
    return false;
  }

  async showOverview() {
    const currentDate = this.getTimDescription(new Date());

    const result = {
      January: {
        lastYear: await this.getTransactionBetweenTime(
          new Date(currentDate.year - 1, 0, 1, 0, 0, 0, 0),
          new Date(currentDate.year - 1, 0, 31, 23, 59, 59, 59),
        ),
        currentYear: await this.getTransactionBetweenTime(
          new Date(currentDate.year, 0, 1, 0, 0, 0, 0),
          new Date(currentDate.year, 0, 31, 23, 59, 59, 59),
        ),
      },
      February: {
        lastYear: await this.getTransactionBetweenTime(
          new Date(currentDate.year - 1, 1, 1, 0, 0, 0, 0),
          new Date(currentDate.year - 1, 1, 29, 23, 59, 59, 59),
        ),
        currentYear: await this.getTransactionBetweenTime(
          new Date(currentDate.year, 1, 1, 0, 0, 0, 0),
          new Date(currentDate.year, 1, 29, 23, 59, 59, 59),
        ),
      },
      March: {
        lastYear: await this.getTransactionBetweenTime(
          new Date(currentDate.year - 1, 2, 1, 0, 0, 0, 0),
          new Date(currentDate.year - 1, 2, 31, 23, 59, 59, 59),
        ),
        currentYear: await this.getTransactionBetweenTime(
          new Date(currentDate.year, 2, 1, 0, 0, 0, 0),
          new Date(currentDate.year, 2, 31, 23, 59, 59, 59),
        ),
      },
      April: {
        lastYear: await this.getTransactionBetweenTime(
          new Date(currentDate.year - 1, 3, 1, 0, 0, 0, 0),
          new Date(currentDate.year - 1, 3, 31, 23, 59, 59, 59),
        ),
        currentYear: await this.getTransactionBetweenTime(
          new Date(currentDate.year, 3, 1, 0, 0, 0, 0),
          new Date(currentDate.year, 3, 30, 23, 59, 59, 59),
        ),
      },
      May: {
        lastYear: await this.getTransactionBetweenTime(
          new Date(currentDate.year - 1, 4, 1, 0, 0, 0, 0),
          new Date(currentDate.year - 1, 4, 31, 23, 59, 59, 59),
        ),
        currentYear: await this.getTransactionBetweenTime(
          new Date(currentDate.year, 4, 1, 0, 0, 0, 0),
          new Date(currentDate.year, 4, 31, 23, 59, 59, 59),
        ),
      },
      June: {
        lastYear: await this.getTransactionBetweenTime(
          new Date(currentDate.year - 1, 5, 1, 0, 0, 0, 0),
          new Date(currentDate.year - 1, 5, 30, 23, 59, 59, 59),
        ),
        currentYear: await this.getTransactionBetweenTime(
          new Date(currentDate.year, 5, 1, 0, 0, 0, 0),
          new Date(currentDate.year, 5, 30, 23, 59, 59, 59),
        ),
      },
      July: {
        lastYear: await this.getTransactionBetweenTime(
          new Date(currentDate.year - 1, 6, 1, 0, 0, 0, 0),
          new Date(currentDate.year - 1, 6, 31, 23, 59, 59, 59),
        ),
        currentYear: await this.getTransactionBetweenTime(
          new Date(currentDate.year, 6, 1, 0, 0, 0, 0),
          new Date(currentDate.year, 6, 31, 23, 59, 59, 59),
        ),
      },
      August: {
        lastYear: await this.getTransactionBetweenTime(
          new Date(currentDate.year - 1, 7, 1, 0, 0, 0, 0),
          new Date(currentDate.year - 1, 7, 31, 23, 59, 59, 59),
        ),
        currentYear: await this.getTransactionBetweenTime(
          new Date(currentDate.year, 7, 1, 0, 0, 0, 0),
          new Date(currentDate.year, 7, 31, 23, 59, 59, 59),
        ),
      },
      September: {
        lastYear: await this.getTransactionBetweenTime(
          new Date(currentDate.year - 1, 8, 1, 0, 0, 0, 0),
          new Date(currentDate.year - 1, 8, 30, 23, 59, 59, 59),
        ),
        currentYear: await this.getTransactionBetweenTime(
          new Date(currentDate.year, 8, 1, 0, 0, 0, 0),
          new Date(currentDate.year, 8, 30, 23, 59, 59, 59),
        ),
      },
      October: {
        lastYear: await this.getTransactionBetweenTime(
          new Date(currentDate.year - 1, 9, 1, 0, 0, 0, 0),
          new Date(currentDate.year - 1, 9, 31, 23, 59, 59, 59),
        ),
        currentYear: await this.getTransactionBetweenTime(
          new Date(currentDate.year, 9, 1, 0, 0, 0, 0),
          new Date(currentDate.year, 9, 31, 23, 59, 59, 59),
        ),
      },
      November: {
        lastYear: await this.getTransactionBetweenTime(
          new Date(currentDate.year - 1, 10, 1, 0, 0, 0, 0),
          new Date(currentDate.year - 1, 10, 30, 23, 59, 59, 59),
        ),
        currentYear: await this.getTransactionBetweenTime(
          new Date(currentDate.year, 10, 1, 0, 0, 0, 0),
          new Date(currentDate.year, 10, 30, 23, 59, 59, 59),
        ),
      },
      December: {
        lastYear: await this.getTransactionBetweenTime(
          new Date(currentDate.year - 1, 11, 1, 0, 0, 0, 0),
          new Date(currentDate.year - 1, 11, 31, 23, 59, 59, 59),
        ),
        currentYear: await this.getTransactionBetweenTime(
          new Date(currentDate.year, 11, 1, 0, 0, 0, 0),
          new Date(currentDate.year, 11, 31, 23, 59, 59, 59),
        ),
      },
    };
    return result;
  }

  async getAllTransactionPerHour() {
    // eslint-disable-next-line prefer-const
    let transactions = [];
    for (let i = 0; i < 24; i++) {
      const transaction: Transaction[] = await this.transactionRepository.find({
        where: {
          start_time: Between(
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate(),
              i,
              0,
              0,
              0,
            ),
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate(),
              i,
              59,
              59,
              59,
            ),
          ),
        },
      });
      transactions.push({ [i]: transaction });
    }
    return transactions;
  }

  async getMaxTransactionPerTime() {
    let time = 0;
    let maxTransaction = 0;
    for (let i = 0; i < 24; i++) {
      const transaction: Transaction[] = await this.transactionRepository.find({
        where: {
          start_time: Between(
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate(),
              i,
              0,
              0,
              0,
            ),
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate(),
              i,
              59,
              59,
              59,
            ),
          ),
        },
      });
      if (transaction.length > maxTransaction) {
        time = i;
        maxTransaction = transaction.length;
      }
    }
    return {
      time: time < 10 ? `0${time}.00` : `${time}.00`,
      transaction: maxTransaction,
    };
  }

  async getMinTransactionPerTime() {
    let time = 0;
    let minTransaction = Number.MAX_VALUE;
    for (let i = 0; i < 24; i++) {
      const transaction: Transaction[] = await this.transactionRepository.find({
        where: {
          start_time: Between(
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate(),
              i,
              0,
              0,
              0,
            ),
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate(),
              i,
              59,
              59,
              59,
            ),
          ),
        },
      });
      if (transaction.length < minTransaction && transaction.length !== 0) {
        time = i;
        minTransaction = transaction.length;
      }
    }
    return {
      time: time < 10 ? `0${time}.00` : `${time}.00`,
      transaction: minTransaction,
    };
  }

  async getCurrentUserInDay() {
    // eslint-disable-next-line prefer-const
    let currentUser = [];
    for (let i = 0; i < 24; i++) {
      const transaction: Transaction[] = await this.transactionRepository.find({
        where: {
          start_time: Between(
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate(),
              i,
              0,
              0,
              0,
            ),
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate(),
              i,
              59,
              59,
              59,
            ),
          ),
        },
      });
      transaction.forEach((txn) => {
        currentUser.push(txn.uid);
      });
    }
    return Array.from(new Set(currentUser)).length;
  }

  async getMaxUsageTransaction() {
    // eslint-disable-next-line prefer-const
    let maxUsageTransaction = 0;
    for (let i = 0; i < 24; i++) {
      const transaction: Transaction[] = await this.transactionRepository.find({
        where: {
          start_time: Between(
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate(),
              i,
              0,
              0,
              0,
            ),
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate(),
              i,
              59,
              59,
              59,
            ),
          ),
        },
      });
      transaction.forEach((txn) => {
        const differentTime = this.calculateDifferentTime(
          txn.start_time,
          txn.end_time,
        );
        if (differentTime > maxUsageTransaction)
          maxUsageTransaction = differentTime;
      });
    }
    return Math.floor(maxUsageTransaction);
  }

  async getTransactionPerHour() {
    // eslint-disable-next-line prefer-const
    let averageTransactionPerHour = [];
    for (let i = 9; i < 22; i++) {
      const transaction: Transaction[] = await this.transactionRepository.find({
        where: {
          start_time: Between(
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate(),
              i,
              0,
              0,
              0,
            ),
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate(),
              i,
              59,
              59,
              59,
            ),
          ),
        },
      });
      averageTransactionPerHour.push(transaction.length);
    }
    return averageTransactionPerHour;
  }

  async getNumberOfCurrentTransactionAfterUpdatePrice(id) {
    const price: Price = await this.priceRepository.findOne({
      where: { price_id: id },
    });
    const values: string = JSON.stringify(price.after);

    const setting: { start_time: string; configuration: any[] } =
      JSON.parse(values);

    const datePickUp = this.getTimDescription(new Date(setting.start_time));
    const currentDate = new Date();
    const transactionBeforeNine = await this.transactionRepository.find({
      where: {
        start_time: Between(
          new Date(
            datePickUp.year,
            datePickUp.month,
            datePickUp.day,
            2,
            0,
            0,
            0,
          ),
          new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            1,
            59,
            59,
            59,
          ),
        ),
      },
    });
    const transactionAtNine = await this.transactionRepository.find({
      where: {
        start_time: Between(
          new Date(
            datePickUp.year,
            datePickUp.month,
            datePickUp.day,
            2,
            0,
            0,
            0,
          ),
          new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            4,
            59,
            59,
            59,
          ),
        ),
      },
    });
    const transactionAtTwelve = await this.transactionRepository.find({
      where: {
        start_time: Between(
          new Date(
            datePickUp.year,
            datePickUp.month,
            datePickUp.day,
            2,
            0,
            0,
            0,
          ),
          new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            7,
            59,
            59,
            59,
          ),
        ),
      },
    });
    const transactionAtFifteen = await this.transactionRepository.find({
      where: {
        start_time: Between(
          new Date(
            datePickUp.year,
            datePickUp.month,
            datePickUp.day,
            2,
            0,
            0,
            0,
          ),
          new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            10,
            59,
            59,
            59,
          ),
        ),
      },
    });
    const transactionAtEighteen = await this.transactionRepository.find({
      where: {
        start_time: Between(
          new Date(
            datePickUp.year,
            datePickUp.month,
            datePickUp.day,
            2,
            0,
            0,
            0,
          ),
          new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            13,
            59,
            59,
            59,
          ),
        ),
      },
    });
    return {
      9: 0,
      12: transactionAtNine.length - transactionBeforeNine.length,
      15: transactionAtTwelve.length - transactionAtNine.length,
      18: transactionAtFifteen.length - transactionAtTwelve.length,
      21: transactionAtEighteen.length - transactionAtFifteen.length,
    };
  }

  async getNumberOfCurrentTransactionBeforeUpdatePrice(id) {
    const price: Price = await this.priceRepository.findOne({
      where: { price_id: id },
    });
    const values: string = JSON.stringify(price.before);

    const setting: { start_time: string; configuration: any[] } =
      JSON.parse(values);

    const datePickUp = this.getTimDescription(new Date(setting.start_time));
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const transactionBeforeNine = await this.transactionRepository.find({
      where: {
        start_time: Between(
          new Date(
            datePickUp.year,
            datePickUp.month,
            datePickUp.day,
            2,
            0,
            0,
            0,
          ),
          new Date(
            yesterday.getFullYear(),
            yesterday.getMonth(),
            yesterday.getDate(),
            1,
            59,
            59,
            59,
          ),
        ),
      },
    });
    const transactionAtNine = await this.transactionRepository.find({
      where: {
        start_time: Between(
          new Date(
            datePickUp.year,
            datePickUp.month,
            datePickUp.day,
            2,
            0,
            0,
            0,
          ),
          new Date(
            yesterday.getFullYear(),
            yesterday.getMonth(),
            yesterday.getDate(),
            4,
            59,
            59,
            59,
          ),
        ),
      },
    });
    const transactionAtTwelve = await this.transactionRepository.find({
      where: {
        start_time: Between(
          new Date(
            datePickUp.year,
            datePickUp.month,
            datePickUp.day,
            2,
            0,
            0,
            0,
          ),
          new Date(
            yesterday.getFullYear(),
            yesterday.getMonth(),
            yesterday.getDate(),
            7,
            59,
            59,
            59,
          ),
        ),
      },
    });
    const transactionAtFifteen = await this.transactionRepository.find({
      where: {
        start_time: Between(
          new Date(
            datePickUp.year,
            datePickUp.month,
            datePickUp.day,
            2,
            0,
            0,
            0,
          ),
          new Date(
            yesterday.getFullYear(),
            yesterday.getMonth(),
            yesterday.getDate(),
            10,
            59,
            59,
            59,
          ),
        ),
      },
    });
    const transactionAtEighteen = await this.transactionRepository.find({
      where: {
        start_time: Between(
          new Date(
            datePickUp.year,
            datePickUp.month,
            datePickUp.day,
            2,
            0,
            0,
            0,
          ),
          new Date(
            yesterday.getFullYear(),
            yesterday.getMonth(),
            yesterday.getDate(),
            13,
            59,
            59,
            59,
          ),
        ),
      },
    });
    return {
      9: 0,
      12: transactionAtNine.length - transactionBeforeNine.length,
      15: transactionAtTwelve.length - transactionAtNine.length,
      18: transactionAtFifteen.length - transactionAtTwelve.length,
      21: transactionAtEighteen.length - transactionAtFifteen.length,
    };
  }

  async getPriceConfigurationRate() {
    const price: Price = await this.priceRepository.findOne({
      where: {
        price_id: 1,
      },
    });
    const values: string = JSON.stringify(price.after);

    const setting: { start_time: string; configuration: any[] } =
      JSON.parse(values);

    const result: number[] = Array(12).fill(0);

    for (const item of setting.configuration) {
      const rate: number = parseInt(item.rate);
      const startHour: number = parseInt(item.start_hour);
      const endHour: number = parseInt(item.end_hour);
      for (let i = startHour; i < endHour && i < 12; i++) {
        result[i] = rate;
      }
    }
    return result;
  }
}
