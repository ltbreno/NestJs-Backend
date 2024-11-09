import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Review } from '../../review/entities/review/review';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  address: string;

  @OneToMany(() => Review, review => review.company)
  reviews: Review[];
}
