import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { AccountModule } from '../account/account.module';
import { UserService } from '../../../user/src/user/user.service';
import { DatabaseModule } from '../../../../libs/common/src/database';
import { User } from '../../../user/src/user/entities/user.entity';
import { Role } from '../../../user/src/role/entities/role.entity';
import { RoleService } from '../../../user/src/role/role.service';

@Module({
  imports: [
    AccountModule,
    DatabaseModule.forFeature([User, Role]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: `${process.env.JWT_EXPIRATION}s` },
    }),
  ],
  providers: [
    AuthService,
    UserService,
    RoleService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
