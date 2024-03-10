import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { Status } from './enum/status.enum';
import { User } from '../../../user/src/user/entities/user.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  generatePaymentID(length: number) {
    return `PAYMENT${String(length).padStart(6, '0')}`;
  }

  async getAllLength() {
    return (await this.findAll()).length + 1;
  }

  async createWithCash(createPaymentDto: CreatePaymentDto) {
    const payment: Payment = {
      payment_id: this.generatePaymentID(await this.getAllLength()),
      total_price: createPaymentDto.total_price,
      status: Status.WAITING,
      uid: createPaymentDto.uid,
      transaction_id: createPaymentDto.transaction_id,
    };
    return this.paymentRepository.save(payment);
  }

  async create(createPaymentDto: CreatePaymentDto) {
    const payment: Payment = {
      payment_id: this.generatePaymentID(await this.getAllLength()),
      total_price: createPaymentDto.total_price,
      status: Status.WAITING,
      uid: createPaymentDto.uid,
      transaction_id: createPaymentDto.transaction_id,
    };
    try {
      const base64Image = await QRCode.toDataURL(JSON.stringify(payment));
      const base64Data = base64Image.replace(/^data:image\/png;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');
      // Specify the directory path where the JPEG image will be saved
      const directory = path.join(
        process.cwd(),
        './apps/area/src/payment/images/',
      );

      // Create the directory if it doesn't exist
      await fs.promises.mkdir(directory, { recursive: true });

      // Specify the file path including the directory
      const file = path.join(directory, `${payment.payment_id}.jpeg`);

      console.log(file);

      await fs.promises.writeFile(file, imageBuffer, 'binary');

      console.log('JPEG file saved successfully:', file);

      return this.paymentRepository.save(payment);
    } catch (err) {
      console.error(err);
    }
  }

  findQRCodeImage(imageName: string) {
    return `./apps/area/src/payment/images/${imageName}.jpeg`;
  }

  findAll() {
    return this.paymentRepository.find();
  }

  async findOne(payment_id: string) {
    const payment = await this.paymentRepository.findOneBy({ payment_id });
    const user: User = await this.userRepository.findOneBy({
      uid: payment.uid,
    });
    const transaction: Transaction = await this.transactionRepository.findOneBy(
      { transaction_id: payment.transaction_id },
    );
    return {
      payment_id: payment.payment_id,
      total_price: payment.total_price,
      status: payment.status,
      uid: user.uid,
      transaction_id: transaction.transaction_id,
    };
  }

  async update(payment_id: string) {
    const payment: Payment = await this.paymentRepository.findOneBy({
      payment_id: payment_id,
    });
    const updatePayment: Payment = {
      ...payment,
      status: Status.COMPLETE,
    };
    return this.paymentRepository.save(updatePayment);
  }

  remove(payment_id: string) {
    return this.paymentRepository.delete(payment_id);
  }
}
