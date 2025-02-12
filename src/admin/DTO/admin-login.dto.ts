import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class AdminLoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}