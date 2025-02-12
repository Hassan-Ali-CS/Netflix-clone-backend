import { IsString, IsEmail, MinLength } from "class-validator";

export class loginUserDto{

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6, {message: 'password must be 6 characters long'})
    password: string;
}