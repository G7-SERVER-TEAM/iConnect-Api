import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { DatabaseModule } from '../../../../libs/common/src/database';
import { Role } from './entities/role.entity';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
