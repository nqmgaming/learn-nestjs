import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TasksEntity } from './tasks.entity';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(
    private tasksService: TasksService,
    private configService: ConfigService,
  ) {
    this.logger.verbose(`ConfigService: ${configService.get('TEST_VALUE')}`);
  }

  @Get()
  async getTasks(
    @Query() filterDto: GetTaskFilterDto,
    @GetUser() user: UserEntity,
  ): Promise<TasksEntity[]> {
    if (Object.keys(filterDto).length) {
      this.logger.verbose(
        `User "${user.username}" retrieving tasks with filters: ${JSON.stringify(filterDto)}`,
      );
      return this.tasksService.getTasksWithFilters(filterDto, user);
    } else {
      this.logger.verbose(`User "${user.username}" retrieving all tasks`, true);
      return this.tasksService.getAllTasks(user);
    }
  }

  @Get('/:id')
  async getTaskById(
    @Param('id') id: string,
    @GetUser() user: UserEntity,
  ): Promise<TasksEntity> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: UserEntity,
  ): Promise<TasksEntity> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Put('/:id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: UserEntity,
  ): Promise<TasksEntity> {
    return this.tasksService.updateTask(updateTaskDto, user);
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: UserEntity,
  ): Promise<TasksEntity> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status, user);
  }

  @Delete('/:id')
  async deleteTask(
    @Param('id') id: string,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }
}
