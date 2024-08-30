import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
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

  // async updateTask(updateTaskDto: UpdateTaskDto): Promise<TaskStatusEnum> {
  //   const task = await this.getTaskById(updateTaskDto.id);
  //   task.title = updateTaskDto.title;
  //   task.description = updateTaskDto.description;
  //   task.status = updateTaskDto.status;
  //   return task;
  // }
  //
  // async updateTaskStatus(id: string, status: TaskStatus): Promise<TaskStatusEnum> {
  //   const task = await this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
  //
  // async deleteTask(id: string): Promise<void> {
  //   const found = await this.getTaskById(id);
  //   this.tasks = this.tasks.filter((task) => task.id !== found.id);
  // }
}
