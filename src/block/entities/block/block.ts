import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "src/user/entities/user";

@Entity()
export class Block {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.blockedUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blockerId' })
  blocker: User;

  @ManyToOne(() => User, (user) => user.blockedBy, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blockedId' })
  blocked: User;
}
