import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TasksEntity } from '../tasks/tasks.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => TasksEntity, (tasks) => tasks.user, { eager: true })
  tasks: TasksEntity[];
}
