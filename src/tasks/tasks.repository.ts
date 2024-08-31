import { DataSource, Repository } from 'typeorm';
import { TasksEntity } from './tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksRepository extends Repository<TasksEntity> {
  constructor(private dataSource: DataSource) {
    super(TasksEntity, dataSource.createEntityManager());
  }

  async getAllTasks(): Promise<TasksEntity[]> {
    try {
      return await this.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve tasks');
    }
  }

  async getTasksWithFilters(filterDto: GetTaskFilterDto): Promise<TasksEntity[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'task.title ILIKE :search OR task.description ILIKE :search',
        { search: `%${search}%` },
      );
    }

    try {
      return await query.getMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve tasks with filters');
    }
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TasksEntity> {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    try {
      await this.insert(task);
      return task;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create a new task');
    }
  }

  async updateTask(updateTaskDto: UpdateTaskDto): Promise<TasksEntity> {
    const { id, title, description, status } = updateTaskDto;

    const task = await this.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

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

  async updateTaskStatus(id: string, status: TaskStatus): Promise<TasksEntity> {
    const task = await this.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    task.status = status;

    try {
      await this.save(task);
      return task;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update task status');
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      const result = await this.delete(id);
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
