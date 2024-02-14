import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty } from 'class-validator';

export class SearchDate {
  @ApiProperty({
    name: 'start_time',
    description: 'It receive a start time.',
    required: true,
  })
  @IsDate()
  @IsNotEmpty()
  start_time: Date;

  @ApiProperty({
    name: 'end_time',
    description: 'It receive a end time.',
    required: true,
  })
  @IsDate()
  @IsNotEmpty()
  end_time: Date;
}
