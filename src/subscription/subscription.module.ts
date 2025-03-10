import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, User]), // Ensure these repositories are available
    forwardRef(() => UserModule),  // Resolve circular dependencies
    forwardRef(() => AuthModule),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService, TypeOrmModule],  // Export TypeOrmModule to make the repository accessible in other modules
})
export class SubscriptionModule {}
