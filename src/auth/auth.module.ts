import { forwardRef, Module } from '@nestjs/common';
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
import { UserModule } from 'src/user/user.module';
import { MovieModule } from 'src/movie/movie.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    ResetpassModule,
    MovieModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') },
      }),
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [UserService, AuthService, ResetpassService, JwtService],
  exports: [AuthService, JwtService],
})
export class AuthModule {}
