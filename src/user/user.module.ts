import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { ResetpassModule } from 'src/resetpass/resetpass.module';
import { Movie } from 'src/movie/entities/movie.entity';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { MovieModule } from 'src/movie/movie.module';

@Module({
    imports: [TypeOrmModule.forFeature([User, Movie]), ResetpassModule,MovieModule,  forwardRef(() => AuthModule)], //Register User Entity
  
    controllers: [UserController],
    providers: [UserService, AuthService],
    exports: [UserService]
})
export class UserModule {}
