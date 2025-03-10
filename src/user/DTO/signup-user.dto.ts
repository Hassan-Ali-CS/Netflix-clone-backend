import { IsString, IsEmail, MinLength, IsNotEmpty } from "class-validator"


export class signupUserDto{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;
   
    @IsString()
    @MinLength(6,{ message: 'Password must be at least six characters long' })
    password: string;
    
    @IsString()
    role: string;
};

