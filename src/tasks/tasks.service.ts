import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TasksRepository } from './tasks.repository';
import { TasksEntity } from './tasks.entity';
import { UserEntity } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async getAllTasks(user: UserEntity): Promise<TasksEntity[]> {
    return await this.tasksRepository.getAllTasks(user);
  }

  async getTaskById(id: string, user: UserEntity): Promise<TasksEntity> {
    return await this.tasksRepository.getTaskById(id, user);
  }

  async getTasksWithFilters(
    filterDto: GetTaskFilterDto,
    user: UserEntity,
  ): Promise<TasksEntity[]> {
    return await this.tasksRepository.getTasksWithFilters(filterDto, user);
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: UserEntity,
  ): Promise<TasksEntity> {
    return await this.tasksRepository.createTask(createTaskDto, user);
  }

  async updateTask(
    updateTaskDto: UpdateTaskDto,
    user: UserEntity,
  ): Promise<TasksEntity> {
    return await this.tasksRepository.updateTask(updateTaskDto, user);
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: UserEntity,
  ): Promise<TasksEntity> {
    return await this.tasksRepository.updateTaskStatus(id, status, user);
  }

  async deleteTask(id: string, user: UserEntity): Promise<void> {
    await this.tasksRepository.deleteTask(id, user);
  }
}
