import { Module } from '@nestjs/common';
import { UserModule } from '../../../../apps/user/src/user/user.module';
import { RoleModule } from '../../../../apps/user/src/role/role.module';
import { AreaModule } from '../../../../apps/area/src/area/area.module';

@Module({
  imports: [UserModule, RoleModule, AreaModule],
})
export class UserInformationModule {}
