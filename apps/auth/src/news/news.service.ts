import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateNewsDto } from './dto/create-news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
    private jwtService: JwtService,
  ) {}

  async create(news: CreateNewsDto, file: Express.Multer.File) {
    const pathParts = file.path.split('/');
    const filename = pathParts[pathParts.length - 1];

    const createNews: News = new News();
    createNews.title = news.title;
    createNews.description = news.description;
    createNews.path = `/news/asset/${filename}`;

    return this.newsRepository.save(createNews);
  }

  findNewsImage(imageName: string) {
    return `./apps/auth/src/news/images/${imageName}`;
  }
}
