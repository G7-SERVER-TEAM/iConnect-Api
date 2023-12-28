import { Module } from '@nestjs/common';
import { AreaModule } from '../../../../apps/area/src/area/area.module';

@Module({
  imports: [AreaModule],
})
export class LocationModule {}
