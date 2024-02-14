import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from '../../../../libs/common/src/database';
import { Payment } from './entities/payment.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import { Area } from '../area/entities/area.entity';
import { Price } from '../area/entities/price.entity';
import { Province } from '../area/entities/province.entity';
import { City } from '../area/entities/city.entity';
import { District } from '../area/entities/district.entity';
import { ZipCode } from '../area/entities/zip.entity';
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
  controllers: [PaymentController],
  providers: [PaymentService, JwtService],
  exports: [PaymentService],
})
export class PaymentModule {}
