import { Body, Controller, Get, Post, UseGuards, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { signupUserDto } from './DTO/signup-user.dto';
import { loginUserDto } from './DTO/login-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

@Controller('user') //Base route: /user
export class UserController {
    // const userService =  new UserService()
    constructor(private readonly userService: UserService) {}    

    @Post('signup')
    signup(@Body()signupDto: signupUserDto){ 
        return this.userService.signup(signupDto); //calls the signup mrthod in the UserService, passing the extracted body signupDto as an argument. 
    }

    @Post('login')
    login(@Body() loginDto: loginUserDto){
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

    // @Post(':userId/favourites/:movieId')
    // async addToFavorites(@Param('userId') userId: number, @Param('movieId') movieId: number) {
    //     return this.userService.addToFavourites(userId, movieId);
    // }

    // @Delete(':userId/favourites/:movieId')
    // async removeFromFavorites(@Param('userId') userId: number, @Param('movieId') movieId: number) {
    //     return this.userService.removeFromFavorites(userId, movieId);
    // }

    // @Get(':userId/favourites')
    // async getFavorites(@Param('userId') userId: number) {
    //     return this.userService.getFavoriteMovies(userId);
    // }

}
