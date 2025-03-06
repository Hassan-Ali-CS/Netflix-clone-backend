import { Body, Controller, Delete, Get, Param, Patch, Post, Query, BadRequestException, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './DTO/create-movie.dto';
import { updateMovieDto } from './DTO/update-movie.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

@Controller('movie')
export class MovieController {
    constructor(private readonly movieService: MovieService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createMovieDto: CreateMovieDto) {
        return this.movieService.create(createMovieDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.movieService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: number, @Body() updateMovieDto: updateMovieDto) {
        return this.movieService.update(id, updateMovieDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.movieService.remove(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('search')
    async searchMovies(@Query('keyword') keyword: string) {
        if (!keyword) {
            throw new BadRequestException('Keyword is required');
        }
        return this.movieService.searchMovies(keyword);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id') //  Ensure this only works for numbers
        findOne(@Param('id') id: string) {
            if (isNaN(Number(id))) {
                throw new BadRequestException('Invalid movie ID');
            }
        return this.movieService.findOne(Number(id));
    }

}




