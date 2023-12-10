import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../../../../libs/common/src/database';
import { User } from './entities/user.entity';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
