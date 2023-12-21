import { Module } from '@nestjs/common';
import { UserModule } from '../../../../apps/user/src/user/user.module';
import { RoleModule } from '../../../../apps/user/src/role/role.module';
import { AclModule } from '../../../../apps/user/src/acl/acl.module';

@Module({
  imports: [UserModule, RoleModule, AclModule],
})
export class UserInformationModule {}
