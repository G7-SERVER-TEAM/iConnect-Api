import { Module } from '@nestjs/common';
import { AuthModule } from '../../../../apps/auth/src/auth/auth.module';
import { AccountModule } from '../../../../apps/auth/src/account/account.module';

@Module({
  imports: [AuthModule, AccountModule],
})
export class AuthenticationModule {}
