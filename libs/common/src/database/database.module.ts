import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'iConnect_database',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'iConnect',
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
})
export class DatabaseModule {
  static forFeature(entities?: EntityClassOrSchema[]) {
    return TypeOrmModule.forFeature(entities);
  }
}
