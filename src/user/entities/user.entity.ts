import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, BeforeInsert, BeforeUpdate, JoinTable, ManyToMany } from "typeorm";
import * as bcrypt from "bcrypt";
import { Subscription } from "src/subscription/entities/subscription.entity";
import {  Movie } from "src/movie/entities/movie.entity";
  
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
  
    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    resetToken: string;

    @Column({ type: 'timestamp', nullable: true })
    tokenExpiry: Date;

    @ManyToMany(() => Movie, (movie) => movie.users, { cascade: true })
    @JoinTable() //This will create a linking table: user_movies
    favouriteMovies: Movie[];
  
    @ManyToOne(() => Subscription, (subscription) => subscription.user, { nullable: true, onDelete: "SET NULL" })
    subscriptions: Subscription;
  
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
      if (this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      }
    }
  
    async validatePassword(plainPassword: string): Promise<boolean> {
      console.log(" Validating password for user:", this.email);
  
      if (!this.password) {
          console.log(" No password stored for user");
          return false;
      }
  
      console.log(" Comparing:", plainPassword, "with", this.password);
      
      const isValid = await bcrypt.compare(plainPassword, this.password);
      
      console.log(" Password comparison result:", isValid);
      return isValid;
  }
  
  }
  