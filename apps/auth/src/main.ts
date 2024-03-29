import { NestFactory } from '@nestjs/core';
import { AuthenticationModule } from '../../../libs/common/src/app/auth.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { NewsModule } from './news/news.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthenticationModule, { cors: true });

  const authOptions = new DocumentBuilder()
    .setTitle('Authentication Module.')
    .setDescription('This is a list of authentication module.')
    .setVersion('1.0.0')
    .addTag('Auth')
    .addBearerAuth()
    .build();

  const accountOptions = new DocumentBuilder()
    .setTitle('Account Module.')
    .setDescription('This is a list of account module.')
    .setVersion('1.0.0')
    .addTag('Account')
    .addBearerAuth()
    .build();

  const newsOptions = new DocumentBuilder()
    .setTitle('News Module.')
    .setDescription('This is a list of news module.')
    .setVersion('1.0.0')
    .addTag('News')
    .addBearerAuth()
    .build();

  const authDocument = SwaggerModule.createDocument(app, authOptions, {
    include: [AuthModule],
  });

  const accountDocument = SwaggerModule.createDocument(app, accountOptions, {
    include: [AccountModule],
  });

  const newsDocument = SwaggerModule.createDocument(app, newsOptions, {
    include: [NewsModule],
  });

  SwaggerModule.setup('/api/auth', app, authDocument);

  SwaggerModule.setup('/api/account', app, accountDocument);

  SwaggerModule.setup('/api/news', app, newsDocument);

  await app.listen(8081);
}
bootstrap();
