import { User } from "src/user/entities/user";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcryptjs';

@Entity()
export class Credentials {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ nullable: true })
    password: string;

    @Column({ nullable: true })
    otpCode: string;

    @Column({ unique: true, nullable: true })
    email: string;

    @OneToOne(() => User, ( user ) => user.credentials )
    user: User;

    @Column({ type: 'timestamp', nullable: true })
    otpExpiresAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if ( this.password ) {
            const isHashed = await bcrypt.getRounds(this.password) > 0;
            if(!isHashed) {
                this.password = await bcrypt.hash(this.password, 10);
            }
        }
    }
}
