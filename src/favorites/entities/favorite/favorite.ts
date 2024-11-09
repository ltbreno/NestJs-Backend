import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from "src/user/entities/user";
@Entity()
export class Favorite {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.favorites)
    user: User;

    @ManyToOne(() => User, user => user.favoritedBy)
    favoriteUser: User;
}
