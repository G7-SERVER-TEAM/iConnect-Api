import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { DatabaseModule } from '../../../../libs/common/src/database';
import { News } from './entities/news.entity';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([News])],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
