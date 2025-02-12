import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MovieModule } from './movie/movie.module';
import { AuthModule } from './auth/auth.module';
import { MovieController } from './movie/movie.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { SubscriptionModule } from './subscription/subscription.module';
import { AdminModule } from './admin/admin.module';
import { UserController } from './user/user.controller';
import { ResetpassModule } from './resetpass/resetpass.module';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),//Makes ConfigModule(.env) available across the application
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,MovieModule, AuthModule, SubscriptionModule, AdminModule, ResetpassModule, ],
  controllers: [AppController, MovieController, UserController],
  providers: [UserService, AppService, AuthService],
  
})
export class AppModule {}
