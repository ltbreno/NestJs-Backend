import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../../user/entities/user';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  reason: string;

  @ManyToOne(() => User, (user) => user.reportsMade)
  reporter: User;

  @Column()
  reporterId: string;

  @ManyToOne(() => User, (user) => user.reportsReceived)
  reportedUser: User;

  @Column()
  reportedUserId: string;
}
