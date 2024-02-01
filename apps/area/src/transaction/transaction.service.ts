import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  findAll() {
    return this.transactionRepository.find();
  }

  findOne(transaction_id: string) {
    return this.transactionRepository.findOneBy({ transaction_id });
  }

  create(createTransactionDto: CreateTransactionDto) {
    return this.transactionRepository.save(createTransactionDto);
  }

  update(transaction_id: string, updateTransactionDto: UpdateTransactionDto) {
    return this.transactionRepository.update(
      transaction_id,
      updateTransactionDto,
    );
  }

  remove(transaction_id: string) {
    return this.transactionRepository.delete(transaction_id);
  }
}
