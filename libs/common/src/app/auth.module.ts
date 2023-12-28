import { Module } from '@nestjs/common';
import { AuthModule } from '../../../../apps/auth/src/auth/auth.module';
import { AccountModule } from '../../../../apps/auth/src/account/account.module';
import { UserModule } from '../../../../apps/user/src/user/user.module';
import { RoleModule } from '../../../../apps/user/src/role/role.module';

@Module({
  imports: [AuthModule, AccountModule, UserModule, RoleModule],
})
export class AuthenticationModule {}
