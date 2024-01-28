import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../../../../libs/common/src/database';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RoleService } from '../role/role.service';
import { Role } from '../role/entities/role.entity';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([User, Role])],
  controllers: [UserController],
  providers: [UserService, JwtService, RoleService],
  exports: [UserService],
})
export class UserModule {}
