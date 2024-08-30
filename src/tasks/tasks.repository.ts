import { DataSource, Repository } from 'typeorm';
import { TasksEntity } from './tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Injectable } from '@nestjs/common';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksRepository extends Repository<TasksEntity> {
  constructor(private dataSource: DataSource) {
    super(TasksEntity, dataSource.createEntityManager());
  }

  async getAllTasks(): Promise<TasksEntity[]> {
    return this.find();
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
    return query.getMany();
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TasksEntity> {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.insert(task);
    return task;
  }
}
