import { Body, Controller, Get, Post, Param, Delete, Patch, UseGuards, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { signupUserDto } from './DTO/signup-user.dto';
import { loginUserDto } from './DTO/login-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { CreateMovieDto } from 'src/movie/dto/create-movie.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import * as path from 'path';
import { Response } from 'express';
import { updateMovieDto } from 'src/movie/dto/update-movie.dto';
import { RolesGuard } from 'src/auth/jwt-auth/roles.guard'; 
import {Roles} from "../auth/roles.decorator"; 
import { Role } from 'src/user/roles.enum'; 

@Controller('user') 
export class UserController {
    constructor(private readonly userService: UserService) {}

    
    @Post('signup')
    signup(@Body() signupDto: signupUserDto) {
        return this.userService.signup(signupDto);
    }

    @Post('verify-email/:userId')
    async verifyEmail(@Param('userId') userId: number, @Body('code') code: string) {
        return this.userService.verifyEmail(userId, code);
    }

    
    @Post('login')
    login(@Body() loginDto: loginUserDto) {
        return this.userService.login(loginDto);
    }

    
    @Post('forgot-password')
    async forgotPassword(@Body('email') email: string) {
        return this.userService.forgotPassword(email);
    }

    
    @Post('reset-password/:token')
    async resetPassword(@Param('token') token: string, @Body('password') password: string) {
        return this.userService.resetPassword(token, password);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':userId/favourites/:movieId')
    async addToFavorites(@Param('userId') userId: number, @Param('movieId') movieId: number) {
        return this.userService.addToFavourites(userId, movieId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':userId/favourites/:movieId')
    async removeFromFavorites(@Param('userId') userId: number, @Param('movieId') movieId: number) {
        return this.userService.removeFromFavorites(userId, movieId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId/favourites')
    async getFavorites(@Param('userId') userId: number) {
        return this.userService.getFavoriteMovies(userId);
    }

    // Admin Routes - Only accessible by admin users
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin) // Only users with 'admin' role can access this
    @Get('admin/users')
    getAllUsers() {
        return this.userService.getAllUsers();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete('admin/users/:id')
    deleteUser(@Param('id') id: number) {
        return this.userService.deleteUser(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('admin/subscriptions')
    getAllSubscriptions() {
        return this.userService.getAllSubscriptions();
    }

    // Movie management - Admin only
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('admin/movie')
    getAllMovies() {
        return this.userService.getAllMovies();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post('admin/movie')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (_, file, cb) => {
                const fileExtName = path.extname(file.originalname);
                const fileName = `${Date.now()}${fileExtName}`;
                console.log("Generated File Name:", fileName);
                cb(null, fileName);
            },
        }),
    }))
    async createMovie(@UploadedFile() file: Express.Multer.File, @Body() createMovieDto: CreateMovieDto) {
        console.log("Received File", file);
        console.log("Received Body:", createMovieDto);

        if (!file) { 
            throw new BadRequestException("No file uploaded");
        }
        return this.userService.create(file, createMovieDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('admin/image/:filename') // Route to serve images
    async getImage(@Param('filename') filename: string, @Res() res: Response) {
        const filePath = join(process.cwd(), 'uploads', filename);

        try {
            res.sendFile(filePath, (err) => {
                if (err) {
                    res.status(404).send('Image not found');
                }
            });
        } catch (error) {
            console.error('Error serving image:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Patch('admin/movie/:id')
    updateMovie(@Param('id') id: number, @Body() updateMovieDto: updateMovieDto) {
        return this.userService.updateMovie(id, updateMovieDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete('admin/movie/:id')
    deleteMovie(@Param('id') id: number) {
        return this.userService.deleteMovie(id);
    }
}
