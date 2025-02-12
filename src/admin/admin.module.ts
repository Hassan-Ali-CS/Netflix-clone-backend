import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { User } from 'src/user/entities/user.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { Movie } from 'src/movie/entities/movie.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SeedService } from './seed.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, User, Subscription, Movie]),
    ConfigModule, // To use environment Vairiables
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') },
      }),
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, SeedService],
  exports: [AdminService, SeedService, TypeOrmModule],
})
export class AdminModule implements OnModuleInit {
  constructor(private readonly seedService: SeedService) {}

  async onModuleInit() {
    await this.seedService.seedAdminUser(); //seed admin user on module initilization
  }
}
