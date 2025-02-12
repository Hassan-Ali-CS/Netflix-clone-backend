import { Body, Controller, Delete, Get, Param, Patch, Post, Query, BadRequestException } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './DTO/create-movie.dto';
import { updateMovieDto } from './DTO/update-movie.dto';

@Controller('movie')
export class MovieController {
    constructor(private readonly movieService: MovieService) {}

    @Post()
    async create(@Body() createMovieDto: CreateMovieDto) {
        return this.movieService.create(createMovieDto);
    }

    @Get()
    findAll() {
        return this.movieService.findAll();
    }


    @Patch(':id')
    update(@Param('id') id: number, @Body() updateMovieDto: updateMovieDto) {
        return this.movieService.update(id, updateMovieDto);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.movieService.remove(id);
    }

    @Get('search')
    async searchMovies(@Query('keyword') keyword: string) {
        if (!keyword) {
            throw new BadRequestException('Keyword is required');
        }
        return this.movieService.searchMovies(keyword);
    }

    @Get(':id') //  Ensure this only works for numbers
        findOne(@Param('id') id: string) {
            if (isNaN(Number(id))) {
                throw new BadRequestException('Invalid movie ID');
            }
        return this.movieService.findOne(Number(id));
    }

}




