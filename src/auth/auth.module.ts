import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { ResetpassService } from 'src/resetpass/resetpass.service';
import { ResetpassModule } from 'src/resetpass/resetpass.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Movie } from 'src/movie/entities/movie.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule, // Imports config Module
    ResetpassModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], //imports configmodule here
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [UserService, AuthService, ResetpassService, JwtService],
  exports: [AuthService, JwtService], 
})
export class AuthModule {}
