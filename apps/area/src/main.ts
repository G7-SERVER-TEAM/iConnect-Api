import { NestFactory } from '@nestjs/core';
import { LocationModule } from '../../../libs/common/src/app/location.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AreaModule } from './area/area.module';
import { TransactionModule } from './transaction/transaction.module';
import { PaymentModule } from './payment/payment.module';

async function bootstrap() {
  const app = await NestFactory.create(LocationModule, { cors: true });

  const areaOptions = new DocumentBuilder()
    .setTitle('Area Module.')
    .setDescription('This is a list of area module.')
    .setVersion('1.0.0')
    .addTag('Area')
    .addBearerAuth()
    .build();

  const transactionOptions = new DocumentBuilder()
    .setTitle('Transaction Module')
    .setDescription('This is a list of transaction module')
    .setVersion('1.0.0')
    .addTag('Transaction')
    .addBearerAuth()
    .build();

  const areaDocument = SwaggerModule.createDocument(app, areaOptions, {
    include: [AreaModule],
  });

  const transactionDocument = SwaggerModule.createDocument(
    app,
    transactionOptions,
    {
      include: [TransactionModule, PaymentModule],
    },
  );

  SwaggerModule.setup('/api/area', app, areaDocument);
  SwaggerModule.setup('/api/transaction', app, transactionDocument);

  await app.listen(8082);
}
bootstrap();
