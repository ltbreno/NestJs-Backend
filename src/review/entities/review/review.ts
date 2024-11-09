import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../../user/entities/user';
import { Company } from '../../../company/entities/company';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column()
  userId: string;

  @Column()
  reviewerId: string;

  @ManyToOne(() => User, (user) => user.receivedReviews)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => User, (user) => user.givenReviews)
  @JoinColumn({ name: 'reviewerId' })
  reviewer: User;

  @ManyToOne(() => Company, company => company.reviews)
  company: Company;
}
