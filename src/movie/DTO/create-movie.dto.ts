import { IsString, IsNumber, Min, Max, IsNotEmpty, IsOptional } from "class-validator";

export class CreateMovieDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    releaseDate: string;

    @IsNumber({}, { message: "Rating must be a number" })
    @Min(0)
    @Max(10)
    rating: number;

    @IsNumber({}, { message: "Duration must be a number" })
    duration: number;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional() 
    @IsString()
    videoUrl?: string;
}
