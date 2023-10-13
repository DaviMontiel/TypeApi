import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './tasks.entity';
import { CreateTaskDto } from './dto/create_task.dto';
import { GetTaskFilterDto } from './dto/get_task_filter.dto';
import { TaskStatusDto } from './dto/task_status.dto';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TasksPost, TasksPostStatus } from './tasks.schema';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@UseGuards(AuthGuard())
@ApiBearerAuth()
@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  /*
   * GET
   */

  @Get()
  public getTasks(
    @Query() dto: GetTaskFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.getTasks(dto, user);
  }

  @Get('/:id')
  public getTaskById(
    @Param('id') idTask: string,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(idTask, user);
  }

  // @Get('/:id/status')
  // getTaskStatus(@Param('id') idTask: string): TaskStatusDto {
  //   return this.tasksService.getTaskStatus(idTask);
  // }

  /*
   * POST
   */

  @Post()
  @ApiBody(TasksPost)
  public createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  /*
   * PATCH
   */

  @Patch('/:id/status')
  @ApiBody(TasksPostStatus)
  public updateTaskStatus(
    @Param('id') idTask: string,
    @Body() dto: TaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(idTask, dto, user);
  }

  /*
   * DELETE
   */

  @Delete('/:id')
  public deleteTask(@Param('id') idTask: string, user: User): Promise<boolean> {
    return this.tasksService.remove(idTask, user);
  }
}
