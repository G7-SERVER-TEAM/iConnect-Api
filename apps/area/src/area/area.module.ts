import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { DatabaseModule } from '../../../../libs/common/src/database';
import { Area } from './entities/area.entity';
import { Province } from './entities/province.entity';
import { City } from './entities/city.entity';
import { District } from './entities/district.entity';
import { ZipCode } from './entities/zip.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Area, Province, City, District, ZipCode]),
  ],
  controllers: [AreaController],
  providers: [AreaService, JwtService],
})
export class AreaModule {}
