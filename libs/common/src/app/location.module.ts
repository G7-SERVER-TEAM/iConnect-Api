import { Module } from '@nestjs/common';
import { AreaModule } from '../../../../apps/area/src/area/area.module';
import { TransactionModule } from '../../../../apps/area/src/transaction/transaction.module';

@Module({
  imports: [AreaModule, TransactionModule],
})
export class LocationModule {}
