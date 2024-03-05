import { Module } from '@nestjs/common';
import { AuthModule } from '../../../../apps/auth/src/auth/auth.module';
import { AccountModule } from '../../../../apps/auth/src/account/account.module';
import { UserModule } from '../../../../apps/user/src/user/user.module';
import { RoleModule } from '../../../../apps/user/src/role/role.module';
import { AreaModule } from '../../../../apps/area/src/area/area.module';
import { NewsModule } from '../../../../apps/auth/src/news/news.module';

@Module({
  imports: [
    AuthModule,
    AccountModule,
    UserModule,
    RoleModule,
    AreaModule,
    NewsModule,
  ],
})
export class AuthenticationModule {}
