import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Category } from '../../../category/entities/category/category';
import { User } from 'src/user/entities/user';

@Entity()
export class Subcategory {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToMany(() => Category)
    categories: Category[];

    @ManyToMany(() => User, (user) => user.subcategories)
    users: User[];
}
