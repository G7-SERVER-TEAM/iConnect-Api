import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from '../../../../libs/common/src/database';
import { Transaction } from './entities/transaction.entity';
import { Area } from '../area/entities/area.entity';
import { Price } from '../area/entities/price.entity';
import { AreaService } from '../area/area.service';
import { PaymentService } from '../payment/payment.service';
import { Province } from '../area/entities/province.entity';
import { City } from '../area/entities/city.entity';
import { District } from '../area/entities/district.entity';
import { ZipCode } from '../area/entities/zip.entity';
import { Payment } from '../payment/entities/payment.entity';
import { User } from '../../../user/src/user/entities/user.entity';
import { Role } from '../../../user/src/role/entities/role.entity';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      Transaction,
      Area,
      Price,
      Province,
      City,
      District,
      ZipCode,
      Payment,
      User,
      Role,
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, JwtService, AreaService, PaymentService],
})
export class TransactionModule {}
