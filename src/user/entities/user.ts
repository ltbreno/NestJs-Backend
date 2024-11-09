import { Block } from "src/block/entities/block/block";
import { Credentials } from "src/register/entities/credentials/credentials";
import { Report } from '../../report/entities/report/report';
import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, JoinTable } from "typeorm";
import { Favorite } from "src/favorites/entities/favorite/favorite";
import { Review } from "src/review/entities/review/review";
import { Message } from "src/message/entities/message";
import { SearchHistory } from "src/search/entities/search-history/search-history";
import { Photo } from "src/photo/entities/photo/photo";
import { Category } from "src/category/entities/category/category";
import { Subcategory } from "src/subcategory/entities/subcategory/subcategory";
import { LocationEntity } from "src/location/entities/location.entity";
import { Schedule } from "src/schedule/entities/schedule";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable:true, unique:true })
    phoneNumber: string;

    @Column({ nullable:true, unique:true })
    email: string;

    @Column({ type: 'text', nullable: true })
    bio: string;

    @Column({ type: 'varchar', nullable: true })
    address: string;

    @Column({ type: 'date', nullable: true })
    birthdate: Date;

    @OneToOne(() => Credentials, ( credentials ) => credentials.user, { cascade:true })
    @JoinColumn()
    credentials: Credentials

    @OneToMany(() => Block, (block) => block.blocker)
    blockedUsers: Block[];

    @OneToMany(() => Block, (block) => block.blocked)
    blockedBy: Block[];

    @OneToMany(() => Report, (report) => report.reporter)
    reportsMade: Report[];

    @OneToMany(() => Report, (report) => report.reportedUser)
    reportsReceived: Report[];

    @OneToMany(() => Favorite, (favorite) => favorite.user)
    favorites: Favorite[];

    @OneToMany(() => Favorite, (favorite) => favorite.favoriteUser)
    favoritedBy: Favorite[];

    @OneToMany(() => Review, (review) => review.user)
    receivedReviews: Review[];

    @OneToMany(() => Review, (review) => review.reviewer)
    givenReviews: Review[];

    @OneToMany(() => Message, message => message.sender)
    sentMessages: Message[];
  
    @OneToMany(() => Message, message => message.receiver)
    receivedMessages: Message[];

    @OneToMany(() => SearchHistory, searchHistory => searchHistory.user)
    searchHistories: SearchHistory[];

    @OneToMany(() => Photo, (photo) => photo.user)
    photos: Photo[];

    @ManyToMany(() => Category)
    @JoinTable() 
    categories: Category[];

    @ManyToMany(() => Subcategory)
    @JoinTable()
    subcategories: Subcategory[];

    @OneToMany(() => LocationEntity, location => location.user )
    locations: LocationEntity[]

    @OneToMany(() => Schedule, (schedule) => schedule.user)
    schedules: Schedule[];

}
