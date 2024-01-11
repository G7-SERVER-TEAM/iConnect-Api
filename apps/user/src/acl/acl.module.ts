import { Module } from '@nestjs/common';
import { AclService } from './acl.service';
import { AclController } from './acl.controller';
import { DatabaseModule } from '../../../../libs/common/src/database';
import { Acl } from './entities/acl.entity';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([Acl])],
  controllers: [AclController],
  providers: [AclService],
})
export class AclModule {}
