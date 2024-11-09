import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from 'src/user/entities/user';

@Entity()
export class Category {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToMany(() => User, (user) => user.categories)
    users: User[];
}
