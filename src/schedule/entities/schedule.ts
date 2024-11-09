// src/schedule/schedule.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user'

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid') // Certifique-se de que o ID seja gerado como string
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.schedules, { nullable: true, onDelete: 'CASCADE' })
  user: User;
}
