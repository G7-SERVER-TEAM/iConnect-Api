import { NestFactory } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RoleModule } from './role/role.module';
import { AclModule } from './acl/acl.module';
import { UserInformationModule } from '../../../libs/common/src/app/info.module';

async function bootstrap() {
  const app = await NestFactory.create(UserInformationModule);

  app.enableCors();

  const userOptions = new DocumentBuilder()
    .setTitle('User Module.')
    .setDescription('This is a list of user module.')
    .setVersion('1.0.0')
    .addTag('User')
    .addBearerAuth()
    .build();

  const roleOptions = new DocumentBuilder()
    .setTitle('Role Module.')
    .setDescription('This is a list of role module.')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Role')
    .build();

  const aclOptions = new DocumentBuilder()
    .setTitle('ACLs Module.')
    .setDescription('This is a list of acls module.')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('ACLs')
    .build();

  const userDocument = SwaggerModule.createDocument(app, userOptions, {
    include: [UserModule],
  });

  const roleDocument = SwaggerModule.createDocument(app, roleOptions, {
    include: [RoleModule],
  });

  const aclDocument = SwaggerModule.createDocument(app, aclOptions, {
    include: [AclModule],
  });

  SwaggerModule.setup('/api/user', app, userDocument);

  SwaggerModule.setup('/api/role', app, roleDocument);

  SwaggerModule.setup('/api/acl', app, aclDocument);

  await app.listen(8080);
}
bootstrap();
