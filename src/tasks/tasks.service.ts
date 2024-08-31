import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TasksRepository } from './tasks.repository';
import { TasksEntity } from './tasks.entity';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async getAllTasks(): Promise<TasksEntity[]> {
    return await this.tasksRepository.getAllTasks();
  }

  async getTaskById(id: string): Promise<TasksEntity> {
    const found = await this.tasksRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  async getTasksWithFilters(
    filterDto: GetTaskFilterDto,
  ): Promise<TasksEntity[]> {
    return await this.tasksRepository.getTasksWithFilters(filterDto);
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TasksEntity> {
    return await this.tasksRepository.createTask(createTaskDto);
  }

  async updateTask(updateTaskDto: UpdateTaskDto): Promise<TasksEntity> {
    return await this.tasksRepository.updateTask(updateTaskDto);
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<TasksEntity> {
    return await this.tasksRepository.updateTaskStatus(id, status);
  }

  async deleteTask(id: string): Promise<void> {
    await this.tasksRepository.deleteTask(id);
  }
}
