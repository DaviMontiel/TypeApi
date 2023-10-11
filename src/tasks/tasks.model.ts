import { TaskStatus } from './tasks.enum';

export interface Task {
  id: string;
  title: string;
  des: string;
  status: TaskStatus;
}
