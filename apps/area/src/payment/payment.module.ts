import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from '../../../../libs/common/src/database';
import { Payment } from './entities/payment.entity';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([Payment])],
  controllers: [PaymentController],
  providers: [PaymentService, JwtService],
  exports: [PaymentService],
})
export class PaymentModule {}
