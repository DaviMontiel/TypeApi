import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { CreateTaskDto } from './dto/create_task.dto';
import { TaskStatus } from './tasks.enum';
import { Repository } from 'typeorm';
import { TaskStatusDto } from './dto/task_status.dto';
import { GetTaskFilterDto } from './dto/get_task_filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private repository: Repository<Task>,
  ) {}

  /*
   * GET
   */

  async getTasks(filter: GetTaskFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filter;

    const query = this.repository.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    return query.getMany();
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    try {
      // FIND
      const task = await this.repository.findOne({ where: { id, user } });

      // NOT FOUND
      if (!task) throw new NotFoundException();

      // Calculate seconds elapsed since task creation
      const currentTime = new Date();
      const createdTime = task.created;
      const timeDifference =
        (currentTime.getTime() - createdTime.getTime()) / 1000;

      // Assign the seconds elapsed to task.seconds
      task.seconds = timeDifference > 15 ? 15 : timeDifference;

      return task;
    } catch (ex) {
      throw new NotFoundException();
    }
  }

  /*
   * CREATE
   */

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.repository.create({
      title: title,
      description: description,
      status: TaskStatus.OPEN,
      created: new Date(),
      timerCompleted: false,
      user: user,
    });

    await this.repository.save(task);

    // CHANGE VALUE AFTER 15 seconds
    const id: string = task.id;
    setTimeout(async () => {
      const updatedTask = await this.repository.findOneBy({ id });

      if (updatedTask) {
        updatedTask.timerCompleted = true;
        await this.repository.save(updatedTask);
      }
    }, 15 * 1000);

    return task;
  }

  /*
   * UPDATE
   */

  async updateTaskStatus(
    id: string,
    newStatus: TaskStatusDto,
    user: User,
  ): Promise<Task> {
    // GET TASK
    const task = await this.getTaskById(id, user);

    // RETURN IF IS EQUAL
    if (task.status == newStatus.status) return task;

    // CREATE NEW TASK
    task.status = newStatus.status;

    // SAVE TASK
    this.repository.save(task);

    return task;
  }

  /*
   * REMOVE
   */

  async remove(id: string, user: User): Promise<boolean> {
    const deleted = await this.repository.delete({ id, user });

    if (deleted.affected != 1) throw new NotFoundException();

    return true;
  }
}
