import { IsEnum } from 'class-validator';
import { TaskStatus } from '../tasks.enum';

export class TaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
