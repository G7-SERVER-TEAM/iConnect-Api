import { IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from '../enum/status.enum';

export class SearchHistory {
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
