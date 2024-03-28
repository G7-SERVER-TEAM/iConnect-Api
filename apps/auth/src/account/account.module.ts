import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { Account } from './entities/account.entity';
import { DatabaseModule } from '../../../../libs/common/src/database';
import { Role } from '../../../user/src/role/entities/role.entity';
import { User } from '../../../user/src/user/entities/user.entity';
import { Area } from '../../../area/src/area/entities/area.entity';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Account, User, Role, Area]),
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
