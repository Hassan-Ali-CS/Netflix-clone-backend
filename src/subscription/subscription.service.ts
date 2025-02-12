import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Subscription } from "./entities/subscription.entity";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { UpdateSubscriptionDto } from "./dto/update-subscription.dto";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
    const subscription = this.subscriptionRepository.create(createSubscriptionDto);
    return this.subscriptionRepository.save(subscription);
  }

  async findAll(): Promise<Subscription[]> {
    return this.subscriptionRepository.find({ relations: ["user"] });
  }


  async subscribeUser(userId: number, subscriptionId: number): Promise<string> {
    // Find the user
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["subscriptions"], // Ensure user relations are loaded
    });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
  
    // Find the subscription
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: subscriptionId },
    });
    if (!subscription) throw new NotFoundException(`Subscription with ID ${subscriptionId} not found`);
  
    // Calculate subscription end date based on duration
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + subscription.duration);
  
    // Assign subscription to the user and Update subscription details
    user.subscriptions = subscription;
    
    subscription.isActive = true;
    subscription.created_at = startDate;
    subscription.updated_at = endDate;
    await this.userRepository.save(user)
    
  
    return `User ${user.name} has been subscribed to ${subscription.plan}`;
  }
  

  async findOne(id: number): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ["user"],
    });
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
    return subscription;
  }

  async update(id: number, updateSubscriptionDto: UpdateSubscriptionDto): Promise<Subscription> {
    const subscription = await this.findOne(id);
    Object.assign(subscription, updateSubscriptionDto);
    return this.subscriptionRepository.save(subscription);
  }

  async remove(id: number): Promise<void> {
    const subscription = await this.findOne(id);
    await this.subscriptionRepository.remove(subscription);
  }
}
