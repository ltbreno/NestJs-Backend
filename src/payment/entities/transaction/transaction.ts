import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  paymentIntentId: string;

  @Column('int')
  amount: number;

  @Column()
  currency: string;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  paymentMethodId: string;
}
