import { Module } from '@nestjs/common';
import { AreaModule } from '../../../../apps/area/src/area/area.module';
import { TransactionModule } from '../../../../apps/area/src/transaction/transaction.module';
import { UserModule } from '../../../../apps/user/src/user/user.module';
import { RoleModule } from '../../../../apps/user/src/role/role.module';
import { PaymentModule } from '../../../../apps/area/src/payment/payment.module';

@Module({
  imports: [
    AreaModule,
    TransactionModule,
    UserModule,
    RoleModule,
    PaymentModule,
  ],
})
export class LocationModule {}
