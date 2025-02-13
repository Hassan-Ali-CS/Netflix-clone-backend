import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { signupUserDto } from 'src/user/DTO/signup-user.dto';
import { loginUserDto } from 'src/user/DTO/login-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtServices: JwtService,
        private readonly configService: ConfigService,
        @Inject(forwardRef(() => UserService))
                private readonly userService: UserService,
    ){}

    //Generate JWT Tokens
    generateToken (payload: any){
        return this.jwtServices.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
        }); //create a jwt token
    }

    //validate JWT Token
    validate (token: string){
        try{
            return this.jwtServices.verify(token); //verify and decode the token
        }
        catch(error){
            throw new Error('Invalid or Expired Token');
        }
    }

    //Handle signup and Token generation
    async signup(signupDto: signupUserDto){
        console.log('Signup request data:', signupDto);

        //call UserServices to create the user
        const result = await this.userService.signup(signupDto);

        //if the user already exists return the message without a token
        if(result.message === 'User with this email already exists'){
            console.log('Signup failed: User already exists');
            return result;
        }

        console.log('Signup Successful, Genrating Token...');
        
        //Generate JWT Token
        const token = this.generateToken({ sub: result.user.id, email: result.user.email });

        return {message: result.message, token}
    }
    
    // Handle login and Token Generation 
    async login(loginDto: loginUserDto) {
        console.log("Login Request Data:", loginDto);
    
        const result = await this.userService.login(loginDto);
    
        if (result.message === 'Invalid email or password') {
          console.log('Login failed: invalid email or password');
          return result;
        }
    
        console.log('Login successful: Generating Token...');
    
        const token = this.generateToken({ sub: result.userId, email: loginDto.email });
        return { message: result.message, token };
      }
}
    
