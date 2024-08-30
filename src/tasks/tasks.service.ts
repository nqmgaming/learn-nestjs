import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskModel, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
  private tasks: TaskModel[] = [];

  async getAllTasks(): Promise<TaskModel[]> {
    return this.tasks;
  }

  async getTaskById(id: string): Promise<TaskModel> {
    const found = this.tasks.find((task) => task.id === id);
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  async getTasksWithFilters(filterDto: GetTaskFilterDto): Promise<TaskModel[]> {
    const { status, search } = filterDto;
    let tasks = this.tasks;
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskModel> {
    const task: TaskModel = {
      id: uuid(),
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  async updateTask(updateTaskDto: UpdateTaskDto): Promise<TaskModel> {
    const task = await this.getTaskById(updateTaskDto.id);
    task.title = updateTaskDto.title;
    task.description = updateTaskDto.description;
    task.status = updateTaskDto.status;
    return task;
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<TaskModel> {
    const task = await this.getTaskById(id);
    task.status = status;
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const found = await this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== found.id);
  }
}
