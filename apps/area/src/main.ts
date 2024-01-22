import { NestFactory } from '@nestjs/core';
import { LocationModule } from '../../../libs/common/src/app/location.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AreaModule } from './area/area.module';

async function bootstrap() {
  const app = await NestFactory.create(LocationModule, { cors: true });

  const areaOptions = new DocumentBuilder()
    .setTitle('Area Module.')
    .setDescription('This is a list of area module.')
    .setVersion('1.0.0')
    .addTag('Area')
    .addBearerAuth()
    .build();

  const areaDocument = SwaggerModule.createDocument(app, areaOptions, {
    include: [AreaModule],
  });

  SwaggerModule.setup('/api/area', app, areaDocument);

  await app.listen(8082);
}
bootstrap();
