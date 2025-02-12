import { Controller, Post, Body, Get, Delete, Param, Patch, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { CreateMovieDto } from 'src/movie/dto/create-movie.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import * as path from 'path';
import { Response } from 'express';
import { updateMovieDto } from 'src/movie/dto/update-movie.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  login(@Body() adminLoginDto: AdminLoginDto) {
    const { email, password } = adminLoginDto;
    return this.adminService.login(email, password);
  }

  // User management
  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: number) {
    return this.adminService.deleteUser(id);
  }

  // Subscription management
  @Get('subscriptions')
  getAllSubscriptions() {
    return this.adminService.getAllSubscriptions();
  }

  // Movie management
  @Get('movie')
  getAllMovies() {
    return this.adminService.getAllMovies();
  }

 @Post()
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
     async create(@UploadedFile() file: Express.Multer.File, @Body() createMovieDto: CreateMovieDto) {
         console.log("Recieved File", file);
         console.log("Recieved Body:", CreateMovieDto);
 
         if (!file) { 
             throw new BadRequestException("no file uploaded");
         }
         return this.adminService.create(file, createMovieDto);
     }

    @Get('image/:filename') //New route to serve images
    async getImage(@Param('filename') filename: string, @Res() res: Response){
        const filePath = join(process.cwd(), 'uploads', filename)

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

  @Patch('movie/:id')
  updateMovie(@Param('id') id: number, @Body() updateMovieDto: updateMovieDto) {
    return this.adminService.updateMovie(id, updateMovieDto);
  }

  @Delete('movie/:id')
  deleteMovie(@Param('id') id: number) {
    return this.adminService.deleteMovie(id);
  }

}