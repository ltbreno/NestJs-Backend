import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../../user/entities/user';
@Entity()
export class Photo {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  url: string;

  @Column()
  fileName: string;

  @ManyToOne(() => User, (user) => user.photos)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
