import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { config } from './db.config';
import { DataSource, DataSourceOptions } from 'typeorm/data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
})
export class DatabaseModule {
  static forFeature(
    entities?: EntityClassOrSchema[],
    dataSource?: DataSource | DataSourceOptions | string,
  ): DynamicModule {
    return TypeOrmModule.forFeature(entities, dataSource);
  }
}
