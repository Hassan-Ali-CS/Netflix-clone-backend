import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn} from "typeorm";
import { User } from "src/user/entities/user.entity";
  
@Entity()
export class Subscription {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    plan: string;
  
    @Column("float")
    price: number;
  
    @Column()
    duration: number; // Duration in days
  
    @Column({ default: true })
    isActive: boolean;
  
    @OneToMany(() => User, (user) => user.subscriptions)
    user: User[];
  
    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
      })
      public created_at: Date;
    
      @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
      })
      public updated_at: Date;
  }
  