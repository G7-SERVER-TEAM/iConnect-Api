import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNewsDto {
  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File;
}
