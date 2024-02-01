import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from '../../../../libs/common/src/database';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([Transaction])],
  controllers: [TransactionController],
  providers: [TransactionService, JwtService],
})
export class TransactionModule {}
