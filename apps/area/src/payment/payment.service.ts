import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { Status } from './enum/status.enum';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  generatePaymentID(length: number) {
    return `PAYMENT${String(length).padStart(6, '0')}`;
  }

  async getAllLength() {
    return (await this.findAll()).length + 1;
  }

  async create(createPaymentDto: CreatePaymentDto) {
    const payment: Payment = {
      payment_id: this.generatePaymentID(await this.getAllLength()),
      total_price: createPaymentDto.total_price,
      status: Status.WAITING,
      uid: createPaymentDto.uid,
      transaction_id: createPaymentDto.transaction_id,
    };
    return this.paymentRepository.save(payment);
  }

  findAll() {
    return this.paymentRepository.find();
  }

  findOne(payment_id: string) {
    return this.paymentRepository.findOneBy({ payment_id });
  }

  update(payment_id: string, updatePaymentDto: UpdatePaymentDto) {
    const payment: Payment = {
      payment_id: payment_id,
      total_price: updatePaymentDto.total_price,
      status: Status.COMPLETE,
      uid: updatePaymentDto.uid,
      transaction_id: updatePaymentDto.transaction_id,
    };
    return this.paymentRepository.update(payment_id, payment);
  }

  remove(payment_id: string) {
    return this.paymentRepository.delete(payment_id);
  }
}
