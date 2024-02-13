import { IsDate, IsNotEmpty } from 'class-validator';

export class SearchDate {
  @IsDate()
  @IsNotEmpty()
  start_time: Date;

  @IsDate()
  @IsNotEmpty()
  end_time: Date;
}
