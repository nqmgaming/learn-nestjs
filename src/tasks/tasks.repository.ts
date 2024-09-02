import { DataSource, Repository } from 'typeorm';
import { TasksEntity } from './tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UserEntity } from '../auth/user.entity';

@Injectable()
export class TasksRepository extends Repository<TasksEntity> {
  constructor(private dataSource: DataSource) {
    super(TasksEntity, dataSource.createEntityManager());
  }

  async getAllTasks(user: UserEntity): Promise<TasksEntity[]> {
    try {
      return await this.find({ where: { user } });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve tasks');
    }
  }

  async getTaskById(id: string, user: UserEntity): Promise<TasksEntity> {
    const task = await this.findOne({ where: { id, user } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async getTasksWithFilters(
    filterDto: GetTaskFilterDto,
    user: UserEntity,
  ): Promise<TasksEntity[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    try {
      return await query.getMany();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve tasks with filters',
      );
    }
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: UserEntity,
  ): Promise<TasksEntity> {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    try {
      await this.save(task);
      return task;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create a new task');
    }
  }

  async updateTask(
    updateTaskDto: UpdateTaskDto,
    user: UserEntity,
  ): Promise<TasksEntity> {
    const { id, title, description, status } = updateTaskDto;

    const task = await this.getTaskById(id, user);

    task.title = title;
    task.description = description;
    task.status = status;

    try {
      await this.save(task);
      return task;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update the task');
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: UserEntity,
  ): Promise<TasksEntity> {
    const task = await this.getTaskById(id, user);

    task.status = status;

    try {
      await this.save(task);
      return task;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update task status');
    }
  }

  async deleteTask(id: string, user: UserEntity): Promise<void> {
    try {
      const result = await this.delete({ id, user });

      if (result.affected === 0) {
        throw new NotFoundException(`Task with ID "${id}" not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete the task');
    }
  }
}
