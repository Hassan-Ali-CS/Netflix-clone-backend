import { User } from "src/user/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany } from "typeorm";

@Entity()
export class Movie extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    releaseDate: string;

    @Column({ type: 'float' })
    rating: number;

    @Column()
    duration: number;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ nullable: true }) 
    videoUrl: string;

    @ManyToMany(() => User, (user) => user.favouriteMovies)
    users: User[];
}
