import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './DTO/create-movie.dto';
import { updateMovieDto } from './DTO/update-movie.dto';
// import { S3 } from 'aws-sdk';
import * as AWS from 'aws-sdk';
import multer from 'multer';
import { Express } from 'express';
// import * as fs from 'fs';
// import * as path from 'path';

@Injectable()
export class MovieService {
   private s3: AWS.S3;
   private bucketName: string;

    constructor(
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>,
    ) { 
        this.s3 = new AWS.S3({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });

        this.bucketName = process.env.AWS_BUCKET_NAME;
    }

    async uploadFiletoS3(file: Express.Multer.File): Promise<string> {
        if (!file){throw new BadRequestException('File is required');}

        const uploadParams = {
            Bucket: this.bucketName,
            Key: `${Date.now()}-${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        };

    try{
        const data =  await this.s3.upload(uploadParams).promise();
        return data.Location ;
    }catch (error) {
        console.error('S3 upload Error', error);
        throw new BadRequestException('Failed to upload file to S3');
        }
    }

    async create(createMovieDto: CreateMovieDto): Promise<Movie> {
        const movie = this.movieRepository.create({ ...createMovieDto });
        return this.movieRepository.save(movie);
    }
    

    async findAll(): Promise<Movie[]> {         //Retrievs all movies
        return this.movieRepository.find();
    }

    async findOne(id: number): Promise<Movie> {         //Fetch a movie by id throws a not found exception if not found
        const movie = await this.movieRepository.findOne({ where : { id } });
        if (!movie) throw new NotFoundException(`Movie with ID ${id} not found`);
        return movie;
    }


    async update(id: number, UpdateMovieDto: updateMovieDto): Promise<Movie> {      //Updates an existing movie
        const { imageUrl, ...movieData } = UpdateMovieDto;

        const movie = await this.findOne(id);
        if (imageUrl) {
            movie.imageUrl = imageUrl;
        }
        
        Object.assign(movie, movieData);
        return this.movieRepository.save(movie);
    }

    async remove(id: number): Promise<void> {       //Deletes a movie
        const movie = await this.findOne(id);
        await this.movieRepository.remove(movie);
    }
    

    async searchMovies(keyword: string): Promise<Movie[]> {
        if (!keyword) {
            throw new BadRequestException('Keyword is required');
        }
    
        try {
            const movies = await this.movieRepository.find({
                where: { title: ILike(`%${keyword}%`) }, //  Use `ILike` for case-insensitive search
            });
    
            if (movies.length === 0) {
                throw new NotFoundException(`No movies found matching "${keyword}"`);
            }
    
            return movies;
        } catch (error) {
            console.error(" Error searching movies:", error);
            throw new BadRequestException('Error while searching movies');
        }
    }
    
    }

