import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Movie]), forwardRef(() => AuthModule)],   //Register Movie entity
    controllers: [MovieController],
    providers: [MovieService],
    exports: [MovieService, TypeOrmModule],
})
export class MovieModule {}
