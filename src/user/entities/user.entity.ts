import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity,  JoinTable, ManyToMany } from "typeorm";
import { Subscription } from "src/subscription/entities/subscription.entity";
import {  Movie } from "src/movie/entities/movie.entity";
import { IsOptional } from "class-validator";
  
  @Entity()
  export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column()
    password: string;
  
    @Column({ default: false })
    isActive: boolean;

    @Column({ nullable: true })
    resetToken: string;

    @Column({ type: 'timestamp', nullable: true })
    tokenExpiry: Date;

    @Column({ nullable: true })
    verficationCode: string;

    @Column({ default: "customer", nullable: false })
    role: string;

    @ManyToMany(() => Movie, (movie) => movie.users, { cascade: true })
    @JoinTable() //This will create a linking table: user_movies
    favouriteMovies: Movie[];
    
    @IsOptional()
    @ManyToOne(() => Subscription, (subscription) => subscription.user, { nullable: true, onDelete: "SET NULL" })
    subscriptions?: Subscription;
  
  }
  