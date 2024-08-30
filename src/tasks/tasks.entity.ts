import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './task-status.enum';

@Entity('task')
export class TasksEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column( )
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

}
