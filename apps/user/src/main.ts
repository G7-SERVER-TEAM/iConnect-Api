import { NestFactory } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RoleModule } from './role/role.module';
import { UserInformationModule } from '../../../libs/common/src/app/info.module';

async function bootstrap() {
  const app = await NestFactory.create(UserInformationModule, { cors: true });

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

  const userDocument = SwaggerModule.createDocument(app, userOptions, {
    include: [UserModule],
  });

  const roleDocument = SwaggerModule.createDocument(app, roleOptions, {
    include: [RoleModule],
  });

  SwaggerModule.setup('/api/user', app, userDocument);

  SwaggerModule.setup('/api/role', app, roleDocument);

  await app.listen(8080);
}
bootstrap();
