import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

@Module({
    imports: [TypeOrmModule.forFeature([Movie])],   //Register Movie entity
    controllers:[MovieController],
    providers:[MovieService],
    exports:[MovieService, TypeOrmModule,],
})
export class MovieModule {}
