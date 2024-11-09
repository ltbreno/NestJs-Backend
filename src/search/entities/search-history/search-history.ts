import { User } from "src/user/entities/user";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SearchHistory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  query: string;
  
  @Column({ nullable: true })
  category: string;
  
  @Column()
  type: string;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  
  @ManyToOne(() => User, user => user.searchHistories)
  user: User;
}