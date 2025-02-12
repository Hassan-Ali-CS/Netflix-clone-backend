import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { User } from 'src/user/entities/user.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { Movie } from 'src/movie/entities/movie.entity';
import { CreateMovieDto } from 'src/movie/dto/create-movie.dto';
import { updateMovieDto } from 'src/movie/dto/update-movie.dto';
import { JwtService } from '@nestjs/jwt';
import { S3 } from 'aws-sdk';
import * as AWS from 'aws-sdk';
import multer from 'multer';
import { Express } from 'express';

@Injectable()
export class AdminService {

  // private s3: AWS.S3;
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly jwtService: JwtService, //Inject JWT Service
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {
    // this.s3 = new AWS.S3({
    //         region: process.env.AWS_REGION,
    //         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //         })
  }

  // Admin login
  async login(email: string, password: string): Promise<{ message: string; token: string }> {
    const admin = await this.adminRepository.findOne({ where: { email } });
    if (!admin || !(await admin.validatePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    //Generate a JWT token for admin
    const payload = { sub: admin.id, email: admin.email } //JWT payload
    const token =  this.jwtService.sign(payload);

    return { message: 'Login successful', token }; // Replace with actual JWT generation logic
  }

  // Manage users
  async getAllUsers() {
    return this.userRepository.find();
  }

  async deleteUser(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    await this.userRepository.remove(user);
    return { message: 'User deleted successfully' };
  }

  // Manage subscriptions
  async getAllSubscriptions() {
    return this.subscriptionRepository.find({ relations: ['user'] });
  }

  // // Manage movies
  //  async uploadFiletoS3(file: Express.Multer.File): Promise<string> {
  //         if (!file){throw new BadRequestException('File is required');}
  
  //         const uploadParams = {
  //             Bucket: process.env.AWS_BUCKET_NAME,
  //             Key: `${Date.now()}-${file.originalname}`,
  //             Body: file.buffer,
  //             ContentType: file.mimetype,
  //             ACL: 'public-read',
  //         };
  
  //     try{
  //         const data =  await this.s3.upload(uploadParams).promise();
  //         return data.Location ;
  //     }catch (error) {
  //         console.error('S3 upload Error', error);
  //         throw new BadRequestException('Failed to upload file to S3');
  //         }
      // }
  async getAllMovies() {
    return this.movieRepository.find();
  }

  async create(file: Express.Multer.File, createMovieDto: CreateMovieDto): Promise<Movie> {
    if (!file) {
        throw new BadRequestException("No file uploaded");
    }

    const imageUrl = `/uploads/${file.filename}`;

    const movie = this.movieRepository.create({ ...createMovieDto, imageUrl });
    return this.movieRepository.save(movie);
}



  //update an existing movie
  async updateMovie(id: number, UpdateMovieDto: updateMovieDto): Promise<Movie> {
    const { imageUrl, ...movieData } = UpdateMovieDto;

    const movie = await this.movieRepository.findOne({ where: { id } });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }  

    if (imageUrl) {
      movie.imageUrl = imageUrl;
    }

    Object.assign(movie, movieData);
    return this.movieRepository.save(movie);
  }

  async deleteMovie(movieId: number): Promise<void> {
    const movie = await this.movieRepository.findOne({ where: { id: movieId } });
    if (!movie) throw new NotFoundException(`Movie with ID ${movieId} not found`);
    await this.movieRepository.remove(movie);
  }

 
}
