import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/entities/user'

@Entity()
export class LocationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal', { precision: 10, scale: 6, nullable:true })
    latitude: number;

    @Column('decimal', { precision: 10, scale: 6, nullable:true })
    longitude: number;

    @Column()
    name: string;

    @ManyToOne(() => User, user => user.locations)
    user: User

}
