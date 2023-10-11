import { Injectable, NotFoundException } from '@nestjs/common';
// import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { CreateTaskDto } from './dto/create_task.dto';
import { TaskStatus } from './tasks.enum';
import { Repository } from 'typeorm';
import { TaskStatusDto } from './dto/task_status.dto';
import { GetTaskFilterDto } from './dto/get_task_filter.dto';
import { User } from 'src/auth/user.entity';

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { Task, TaskStatus } from './task.model';
// import { v4 as uuid } from 'uuid';
// import { CreateTaskDto } from './dto/create_task.dto';
// import { TaskStatusDto } from './dto/task_status.dto';
// import { GetTaskFilterDto } from './dto/get_task_filter.dto';
// import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private repository: Repository<Task>,
  ) {}

  /*
   * GET
   */

  async getTasks(filter: GetTaskFilterDto): Promise<Task[]> {
    const { status, search } = filter;

    const query = this.repository.createQueryBuilder('task');

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

  // getTasksWithFilters(dto: GetTaskFilterDto): Task[] {
  //   const { status, search } = dto;

  //   // GET ALL TASKS
  //   let tasks = this.getAllTasks();

  //   // FILTER BY STATUS
  //   if (status) {
  //     tasks = this.tasks.filter((task) => task.status == status);
  //   }

  //   // FILTER WITH SEARCH
  //   if (search) {
  //     tasks = this.tasks.filter((task) => {
  //       if (task.title.includes(search) || task.des.includes(search)) {
  //         return true;
  //       }

  //       return false;
  //     });
  //   }

  //   return tasks;
  // }

  async getTaskById(id: string): Promise<Task> {
    try {
      const found = await this.repository.findOneBy({
        id: id,
      });

      if (!found) {
        throw new NotFoundException();
      }

      return found;
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
      user: user,
    });

    await this.repository.save(task);

    return task;
  }

  /*
   * UPDATE
   */

  async updateTaskStatus(id: string, newStatus: TaskStatusDto): Promise<Task> {
    // GET TASK
    const task = await this.getTaskById(id);

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

  async remove(id: string): Promise<boolean> {
    const deleted = await this.repository.delete(id);

    if (deleted.affected != 1) throw new NotFoundException();

    return true;
  }
}
